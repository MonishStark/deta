import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';

export default function CakeScene({ onContinue, setDimmed, setWarmGlow }) {
  // Array of 3 candles: true = lit, false = extinguished
  const [candles, setCandles] = useState([true, true, true]);
  const [isBlowingAll, setIsBlowingAll] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micDeniedOrFailed, setMicDeniedOrFailed] = useState(false);
  const [extinctionStage, setExtinctionStage] = useState(0); // 0: none, 1: wish made?, 2: good, 3: continue
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const [airVolume, setAirVolume] = useState(0);

  const audioContextRef = useRef(null);
  const micStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const celebrationTriggeredRef = useRef(false);
  const timersRef = useRef([]);

  const allCandlesOut = candles.every((c) => !c);

  // Proactively show fallback button after 3.5s so user never gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallbackButton(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // When all candles are extinguished, trigger the celebratory sequence
  useEffect(() => {
    if (allCandlesOut && !celebrationTriggeredRef.current) {
      celebrationTriggeredRef.current = true;
      stopMic();
      audio.playExtinguish();
      setDimmed(true);
      setWarmGlow(true);

      // Delicate pastel & gold petal confetti
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#E8A3B0', '#FDF8EE', '#C49746', '#F5C6CB'],
        disableForReducedMotion: true,
        scalar: 0.95,
        ticks: 240,
        gravity: 0.65,
      });

      // Text sequence without premature cancellation
      timersRef.current.push(setTimeout(() => setExtinctionStage(1), 700));
      timersRef.current.push(setTimeout(() => setExtinctionStage(2), 2000));
      timersRef.current.push(setTimeout(() => setExtinctionStage(3), 3200));
    }
  }, [allCandlesOut, setDimmed, setWarmGlow]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      stopMic();
    };
  }, []);

  const stopMic = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    setIsListeningMic(false);
  };

  const extinguishAllCandles = () => {
    if (allCandlesOut) return;
    setIsBlowingAll(true);
    stopMic();

    setTimeout(() => {
      setCandles([false, false, false]);
      setIsBlowingAll(false);
    }, 550);
  };

  const handleTapCandle = (index) => {
    if (!candles[index]) return;
    setCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    audio.playExtinguish();
  };

  const handleStartMic = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicDeniedOrFailed(true);
        setShowFallbackButton(true);
        return;
      }

      setIsListeningMic(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      let blowCounter = 0;

      const checkAudio = () => {
        analyser.getByteFrequencyData(buffer);

        let lowFreqSum = 0;
        const lowBins = Math.floor(buffer.length * 0.25);
        for (let i = 1; i < lowBins; i++) {
          lowFreqSum += buffer[i];
        }
        const lowFreqAvg = lowFreqSum / lowBins;

        let totalSum = 0;
        for (let i = 0; i < buffer.length; i++) {
          totalSum += buffer[i];
        }
        const totalAvg = totalSum / buffer.length;

        const normalizedVol = Math.min(1, Math.max(0, (totalAvg - 20) / 70));
        setAirVolume(normalizedVol);

        if (lowFreqAvg > 50 || totalAvg > 60) {
          blowCounter++;
          if (blowCounter > 3) {
            extinguishAllCandles();
            return;
          }
        } else {
          blowCounter = Math.max(0, blowCounter - 1);
        }

        animFrameRef.current = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      console.warn("Microphone access unavailable or denied:", err);
      setMicDeniedOrFailed(true);
      setShowFallbackButton(true);
      setIsListeningMic(false);
    }
  };

  // 3 Candle positions anchored directly onto the top tier surface (x: 90..230, y: 90)
  const candleConfigs = [
    { cx: 136, baseCy: 90, bodyW: 7, bodyH: 30, bodyTop: 60, wickTop: 53, flameW: 11, flameH: 22 },
    { cx: 160, baseCy: 94, bodyW: 8, bodyH: 38, bodyTop: 56, wickTop: 48, flameW: 13, flameH: 26 },
    { cx: 184, baseCy: 90, bodyW: 7, bodyH: 30, bodyTop: 60, wickTop: 53, flameW: 11, flameH: 22 },
  ];

  return (
    <motion.div
      key="cake-scene"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-3 py-4 sm:py-8 text-center"
    >
      {/* Narrative Headline */}
      <div className="max-w-md mx-auto mb-2 sm:mb-4">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[11px] sm:text-sm uppercase tracking-[0.25em] text-[#B58428] font-medium mb-1"
        >
          Well well well...
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury text-[#2A1D1A] font-light mb-1 leading-tight"
        >
          Someone is turning <span className="gold-gradient-text font-normal font-serif">37</span> today. 👑
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xs sm:text-base text-[#6B544D] font-light"
        >
          Make a wish first.
        </motion.p>
      </div>

      {/* ARTISAN PATISSERIE CAKE & EMBEDDED CANDLES */}
      <div className="relative my-1 sm:my-2 flex flex-col items-center select-none">
        {/* Ambient Warm Cake Glow */}
        <div 
          className={`absolute -inset-6 sm:-inset-10 rounded-full transition-opacity duration-1000 pointer-events-none ${
            allCandlesOut ? 'opacity-80' : 'opacity-35'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, rgba(232, 163, 176, 0.15) 50%, transparent 70%)'
          }}
        />

        {/* COHESIVE SVG CAKE WITH PROPORTIONATELY EMBEDDED CANDLES */}
        <div className="relative w-56 sm:w-72 md:w-80 h-auto z-10 filter drop-shadow-[0_12px_28px_rgba(181,148,122,0.32)]">
          <svg viewBox="0 10 320 215" className="w-full h-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldPlateGrad" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C49746"/>
                <stop offset="25%" stopColor="#FFF2D6"/>
                <stop offset="50%" stopColor="#D4AF37"/>
                <stop offset="75%" stopColor="#FFF2D6"/>
                <stop offset="100%" stopColor="#C49746"/>
              </linearGradient>

              <linearGradient id="ivoryCreamGrad" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF"/>
                <stop offset="75%" stopColor="#FBF7F0"/>
                <stop offset="100%" stopColor="#EFE5D8"/>
              </linearGradient>

              <linearGradient id="softBlushGrad" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#FFF0F2"/>
                <stop offset="100%" stopColor="#F4D2D7"/>
              </linearGradient>

              <linearGradient id="roseRibbonLightGrad" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C47B89"/>
                <stop offset="50%" stopColor="#E8A3B0"/>
                <stop offset="100%" stopColor="#C47B89"/>
              </linearGradient>

              <linearGradient id="goldMedallionLightGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF8E7"/>
                <stop offset="50%" stopColor="#D4AF37"/>
                <stop offset="100%" stopColor="#A87A1E"/>
              </linearGradient>

              <linearGradient id="candleBodyGrad" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF"/>
                <stop offset="45%" stopColor="#FAF2E6"/>
                <stop offset="100%" stopColor="#D4AF37"/>
              </linearGradient>

              <radialGradient id="flameGlowAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFB347" stopOpacity="0.6"/>
                <stop offset="50%" stopColor="#FF8A00" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#FF4500" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="flameColorGrad" cx="50%" cy="80%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF"/>
                <stop offset="30%" stopColor="#FFE066"/>
                <stop offset="70%" stopColor="#FF7A00"/>
                <stop offset="100%" stopColor="#FF3300"/>
              </radialGradient>
            </defs>

            {/* GOLDEN SERVING STAND */}
            <ellipse cx="160" cy="202" rx="145" ry="14" fill="url(#goldPlateGrad)" stroke="#B58428" strokeWidth="1"/>
            <path d="M 25 202 Q 160 215 295 202 Q 295 208 160 216 Q 25 208 25 202 Z" fill="#996E1D"/>

            {/* BOTTOM TIER (Ivory Buttercream with Gold Pearl Trim) */}
            <path d="M 50 145 C 50 145, 50 190, 50 190 C 50 205, 270 205, 270 190 L 270 145 Z" fill="url(#ivoryCreamGrad)"/>
            <ellipse cx="160" cy="145" rx="110" ry="18" fill="#FFFFFF" stroke="#EAE0D5" strokeWidth="1"/>

            {/* Bottom tier rose ribbon trim */}
            <path d="M 50 185 C 80 196, 240 196, 270 185 L 270 192 C 240 203, 80 203, 50 192 Z" fill="url(#roseRibbonLightGrad)"/>

            {/* Golden Pearl Beads around base */}
            {[65, 90, 115, 140, 160, 180, 205, 230, 255].map((bx, i) => (
              <circle key={`bp-${i}`} cx={bx} cy={187 + Math.sin((bx - 50) / 220 * Math.PI) * 10} r="2.2" fill="#D4AF37" stroke="#FFF5DC" strokeWidth="0.5"/>
            ))}

            {/* TOP TIER (Blush Buttercream with Scalloped White Glaze) */}
            <path d="M 90 90 C 90 90, 90 135, 90 135 C 90 148, 230 148, 230 135 L 230 90 Z" fill="url(#softBlushGrad)"/>
            
            {/* Top tier top surface (ellipse from x=90 to x=230) */}
            <ellipse cx="160" cy="90" rx="70" ry="13" fill="#FFFFFF" stroke="#EAE0D5" strokeWidth="1"/>

            {/* Top tier rose ribbon trim */}
            <path d="M 90 128 C 110 137, 210 137, 230 128 L 230 133 C 210 142, 110 142, 90 133 Z" fill="url(#roseRibbonLightGrad)"/>

            {/* Delicate White Chocolate Ganache Drips */}
            <path d="M 90 92 
                     Q 100 106, 110 94 
                     Q 125 109, 140 94 
                     Q 150 110, 160 94 
                     Q 175 111, 185 94 
                     Q 200 108, 210 94 
                     Q 220 106, 230 92" 
                  fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>

            {/* ROYAL GOLD CREST: "37" */}
            <g transform="translate(160, 116)">
              <circle cx="0" cy="0" r="22" fill="#FAF5ED" stroke="url(#goldMedallionLightGrad)" strokeWidth="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
              <circle cx="0" cy="0" r="19" fill="#FFFBF5" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="2,2"/>
              <path d="M -7 -10 L -4 -7 L 0 -11 L 4 -7 L 7 -10 L 5 -5 L -5 -5 Z" fill="#D4AF37"/>
              <text 
                x="0" 
                y="8" 
                textAnchor="middle" 
                fill="url(#goldMedallionLightGrad)" 
                fontSize="18" 
                fontFamily="Cormorant Garamond, serif" 
                fontWeight="700"
                letterSpacing="1"
              >
                37
              </text>
            </g>

            {/* 3 TAPERED CANDLES EMBEDDED DIRECTLY ON THE TOP SURFACE */}
            {candleConfigs.map((cfg, index) => {
              const isLit = candles[index];
              const { cx, baseCy, bodyW, bodyH, bodyTop, wickTop, flameW, flameH } = cfg;

              return (
                <g 
                  key={`candle-svg-${index}`}
                  onClick={() => handleTapCandle(index)}
                  className="cursor-pointer group"
                  style={{ pointerEvents: 'all' }}
                >
                  {/* Generous touch / click hit box */}
                  <rect 
                    x={cx - 18} 
                    y={12} 
                    width={36} 
                    height={85} 
                    fill="transparent" 
                  />

                  {/* Candle Base Socket in Frosting */}
                  <ellipse cx={cx} cy={baseCy} rx={bodyW * 0.7} ry="2" fill="#EAE0D5" />

                  {/* Candle Body */}
                  <rect
                    x={cx - bodyW / 2}
                    y={bodyTop}
                    width={bodyW}
                    height={bodyH}
                    rx="1.5"
                    fill="url(#candleBodyGrad)"
                    stroke="#D4AF37"
                    strokeWidth="0.6"
                    filter={isLit ? "drop-shadow(0 0 5px rgba(255, 195, 100, 0.55))" : "none"}
                  />

                  {/* Candle Wick */}
                  <line 
                    x1={cx} 
                    y1={bodyTop} 
                    x2={cx} 
                    y2={wickTop} 
                    stroke="#4A3228" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                  />

                  {/* Flame / Extinction Smoke */}
                  <AnimatePresence>
                    {isLit && !isBlowingAll && (
                      <motion.g
                        key={`flame-g-${index}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: isListeningMic ? 1 + airVolume * 0.35 : [1, 1.06, 0.95, 1],
                          skewX: isListeningMic && airVolume > 0.15 ? -18 : [0, -1.8, 1.4, 0],
                          opacity: 1,
                        }}
                        exit={{ 
                          scaleX: 1.6,
                          scaleY: 0.15,
                          skewX: -45,
                          opacity: 0,
                          transition: { duration: 0.3 }
                        }}
                        transition={{
                          repeat: isListeningMic ? 0 : Infinity,
                          duration: 0.45 + index * 0.1,
                          ease: 'easeInOut'
                        }}
                        style={{ transformOrigin: `${cx}px ${wickTop}px` }}
                      >
                        {/* Ambient flame halo */}
                        <circle cx={cx} cy={wickTop - flameH * 0.5} r={flameW * 1.3} fill="url(#flameGlowAura)" />

                        {/* Outer warm flame */}
                        <path
                          d={`M ${cx} ${wickTop} 
                             C ${cx - flameW / 2} ${wickTop - flameH * 0.3}, ${cx - flameW / 2} ${wickTop - flameH * 0.75}, ${cx} ${wickTop - flameH} 
                             C ${cx + flameW / 2} ${wickTop - flameH * 0.75}, ${cx + flameW / 2} ${wickTop - flameH * 0.3}, ${cx} ${wickTop} Z`}
                          fill="url(#flameColorGrad)"
                          filter="drop-shadow(0 0 3px rgba(255, 150, 50, 0.8))"
                        />

                        {/* Inner white-hot core */}
                        <ellipse 
                          cx={cx} 
                          cy={wickTop - flameH * 0.35} 
                          rx={flameW * 0.22} 
                          ry={flameH * 0.25} 
                          fill="#FFFFFF" 
                          opacity={0.92} 
                        />
                      </motion.g>
                    )}

                    {isBlowingAll && isLit && (
                      <motion.g
                        key={`blowing-g-${index}`}
                        animate={{
                          scaleX: [1, 1.8, 0],
                          scaleY: [1, 0.3, 0],
                          skewX: [-10, -45, -65],
                          x: [0, 8, 18],
                          opacity: [1, 0.7, 0],
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{ transformOrigin: `${cx}px ${wickTop}px` }}
                      >
                        <path
                          d={`M ${cx} ${wickTop} 
                             C ${cx - flameW / 2} ${wickTop - flameH * 0.3}, ${cx - flameW / 2} ${wickTop - flameH * 0.75}, ${cx} ${wickTop - flameH} 
                             C ${cx + flameW / 2} ${wickTop - flameH * 0.75}, ${cx + flameW / 2} ${wickTop - flameH * 0.3}, ${cx} ${wickTop} Z`}
                          fill="url(#flameColorGrad)"
                        />
                      </motion.g>
                    )}

                    {!isLit && (
                      <motion.g
                        key={`smoke-g-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.circle
                          cx={cx}
                          cy={wickTop}
                          r={2}
                          fill="rgba(160, 150, 165, 0.7)"
                          animate={{ 
                            y: [-2, -18, -35], 
                            x: [0, 4, -6], 
                            scale: [1, 2.2, 3.5], 
                            opacity: [0.8, 0.4, 0] 
                          }}
                          transition={{ duration: 1.6, ease: 'easeOut' }}
                        />
                        <motion.circle
                          cx={cx}
                          cy={wickTop}
                          r={1.6}
                          fill="rgba(180, 170, 185, 0.5)"
                          animate={{ 
                            y: [-4, -22, -45], 
                            x: [0, -3, 5], 
                            scale: [1, 2.5, 4], 
                            opacity: [0.6, 0.3, 0] 
                          }}
                          transition={{ duration: 2.0, delay: 0.25, ease: 'easeOut' }}
                        />
                      </motion.g>
                    )}
                  </AnimatePresence>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS & STORY PROGRESSION */}
      <div className="w-full max-w-md mx-auto mt-2 sm:mt-3 min-h-[95px] sm:min-h-[120px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!allCandlesOut ? (
            <motion.div
              key="prompt-burning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center space-y-2 sm:space-y-3"
            >
              <p className="text-sm sm:text-lg text-[#2A1D1A] font-serif-luxury tracking-wide font-normal">
                Make a wish... then blow out the candles.
              </p>

              {/* Primary Blow button (Microphone or Instant) */}
              {!isListeningMic ? (
                <button
                  onClick={handleStartMic}
                  className="btn-luxury-light px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-base font-medium flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span className="text-base sm:text-lg">🎤</span>
                  <span>Blow out the candles</span>
                </button>
              ) : (
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/50 text-xs sm:text-sm text-[#2A1D1A] shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Listening for your breath... 🌬️</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#6B544D]">Blow toward your phone / mic or tap them</p>
                </div>
              )}

              {/* Fallback button (always accessible or shown if mic denied/delayed) */}
              {(showFallbackButton || micDeniedOrFailed || isListeningMic) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center pt-0.5"
                >
                  <button
                    onClick={extinguishAllCandles}
                    className="text-[11px] sm:text-sm text-[#8F6517] hover:text-[#2A1D1A] underline underline-offset-4 decoration-[#D4AF37]/50 hover:decoration-[#D4AF37] transition-all flex items-center gap-1.5 py-0.5 cursor-pointer"
                  >
                    <span>No worries 😌 — tap here to blow them out</span>
                    <span>💨</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="post-extinction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center space-y-2 sm:space-y-3"
            >
              {extinctionStage >= 1 && (
                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-xl sm:text-3xl font-serif-luxury text-[#2A1D1A] font-light"
                >
                  Wish made?
                </motion.h3>
              )}

              {extinctionStage >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-sm sm:text-lg text-[#6B544D] font-light"
                >
                  Good. Don't tell me what it was. 😌
                </motion.p>
              )}

              {extinctionStage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <button
                    onClick={onContinue}
                    className="btn-luxury-light px-8 py-3 sm:px-9 sm:py-3.5 rounded-full text-sm sm:text-base font-medium tracking-wide flex items-center gap-2 group cursor-pointer shadow-md"
                  >
                    <span className="text-[#2A1D1A]">Continue</span>
                    <span className="text-[#B58428] group-hover:translate-x-1.5 transition-transform">→</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
