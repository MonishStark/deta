// Web Audio API generative music and sound effects engine
// No external assets required: zero latency, pristine quality, 100% reliable.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isPlayingMusic = false;
    this.isMuted = false;
    this.musicTimer = null;
    this.chordIndex = 0;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn("AudioContext not supported or blocked", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 0.8;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 0.8;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
  }

  // Plays a delicate bell / celesta note with harmonic shimmer
  playTone(freq, duration = 2.5, timeOffset = 0, gain = 0.15) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime + timeOffset;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 2, now);

    // Warm envelope
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(gain, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(gain * 0.4, now + 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    subOsc.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
  }

  // Play generative ambient chords (Fmaj9, Cmaj7, Dm9, Bbmaj7)
  startAmbientMusic() {
    if (this.isPlayingMusic) return;
    this.init();
    this.resume();
    this.isPlayingMusic = true;

    // Frequencies in Hz for warm, dreamy chords
    // Chords: 1: Fmaj9, 2: Am7, 3: Dm9, 4: Bbmaj9, 5: C6/9
    const chords = [
      [174.61, 261.63, 329.63, 392.00, 523.25], // F3, C4, E4, G4, C5
      [220.00, 261.63, 329.63, 392.00, 493.88], // A3, C4, E4, G4, B4
      [146.83, 220.00, 293.66, 349.23, 440.00], // D3, A3, D4, F4, A4
      [116.54, 233.08, 293.66, 349.23, 440.00], // Bb2, Bb3, D4, F4, A4
      [130.81, 196.00, 261.63, 329.63, 392.00], // C3, G3, C4, E4, G4
    ];

    const playCycle = () => {
      if (!this.isPlayingMusic) return;
      const currentChord = chords[this.chordIndex % chords.length];
      this.chordIndex++;

      // Arpeggiate notes gently
      currentChord.forEach((freq, i) => {
        this.playTone(freq, 4.0, i * 0.45, 0.12);
      });

      // Add a subtle high chime in second half
      if (Math.random() > 0.3) {
        const highNote = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
        this.playTone(highNote, 3.0, 2.0 + Math.random() * 0.8, 0.07);
      }

      this.musicTimer = setTimeout(playCycle, 4200);
    };

    playCycle();
  }

  stopAmbientMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // SFX: Golden magical chime
  playChime() {
    if (!this.ctx) this.init();
    this.resume();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.2);
    });
  }

  // SFX: Candle extinction with gentle breath and resolve
  playExtinguish() {
    if (!this.ctx) this.init();
    this.resume();
    const now = this.ctx.currentTime;

    // Breath puff (filtered white noise)
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(now);

    // Warm resolving bell chime
    setTimeout(() => {
      this.playTone(880, 2.5, 0, 0.18);
      this.playTone(1320, 2.0, 0.1, 0.12);
    }, 150);
  }

  // SFX: Gift opening shimmer
  playGiftOpen() {
    if (!this.ctx) this.init();
    this.resume();
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + i * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.4);
    });
  }
}

export const audio = new AudioEngine();
