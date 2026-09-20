import React, { useEffect, useRef } from 'react';

export default function BackgroundEffects({ dimmed = false, warmGlow = false }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const sparklesRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100, lastX: -100, lastY: -100, moving: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Ambient floating golden stardust particles
    const count = Math.min(Math.floor((width * height) / 22000), 55);
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.4 + 0.15,
      baseAlpha: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.3 - 0.1, // gently rising
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? '#D4AF37' : '#E8A3B0',
    }));

    // Mouse & Touch tracking for interactive fairy dust
    const addSparkle = (x, y, count = 2) => {
      for (let i = 0; i < count; i++) {
        sparklesRef.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.02,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          color: Math.random() > 0.3 ? '#D4AF37' : '#FFB6C1',
        });
      }
      if (sparklesRef.current.length > 80) {
        sparklesRef.current.shift();
      }
    };

    const handlePointerMove = (e) => {
      const x = e.clientX || (e.touches && e.touches[0]?.clientX);
      const y = e.clientY || (e.touches && e.touches[0]?.clientY);
      if (x !== undefined && y !== undefined) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        addSparkle(x, y, 2);
      }
    };

    const handlePointerDown = (e) => {
      const x = e.clientX || (e.touches && e.touches[0]?.clientX);
      const y = e.clientY || (e.touches && e.touches[0]?.clientY);
      if (x !== undefined && y !== undefined) {
        addSparkle(x, y, 12); // celebratory burst on click
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw ambient floating stardust
      particlesRef.current.forEach((p) => {
        p.twinklePhase += p.twinkleSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.twinklePhase) * 0.2;
        const safeAlpha = Math.max(0.08, Math.min(currentAlpha, 0.7));

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#D4AF37' 
          ? `rgba(212, 175, 55, ${safeAlpha})` 
          : `rgba(232, 163, 176, ${safeAlpha})`;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      // 2. Draw interactive fairy dust / sparkle trail
      for (let i = sparklesRef.current.length - 1; i >= 0; i--) {
        const s = sparklesRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        s.rotation += s.rotationSpeed;

        if (s.alpha <= 0) {
          sparklesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.shadowColor = '#FFF5CC';
        ctx.shadowBlur = 8;

        // 4-point golden star shape
        const r = s.size;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Radiant Light Base Gradient (Porcelain Alabaster + Soft Champagne) */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: 'linear-gradient(145deg, #FBF9F5 0%, #FFF4F2 45%, #FAF2E6 100%)'
        }}
      />

      {/* Dreamy Soft Bokeh Orbs */}
      <div 
        className="absolute -top-[20%] -left-[15%] w-[60vw] h-[60vw] rounded-full blur-3xl opacity-40 transition-transform duration-1000 animate-pulse-subtle"
        style={{
          background: 'radial-gradient(circle, rgba(232, 163, 176, 0.45) 0%, rgba(255, 240, 242, 0) 70%)'
        }}
      />
      <div 
        className="absolute -bottom-[20%] -right-[15%] w-[65vw] h-[65vw] rounded-full blur-3xl opacity-35 transition-transform duration-1000 animate-pulse-subtle"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(253, 248, 238, 0) 70%)',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] rounded-full blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(255, 228, 210, 0.5) 0%, rgba(255, 255, 255, 0) 70%)'
        }}
      />

      {/* Dimmed Overlay on Candle Extinction (soft romantic evening candlelight hue) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          dimmed ? 'opacity-40' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(82, 50, 68, 0.25) 0%, rgba(45, 30, 50, 0.35) 100%)'
        }}
      />

      {/* Warm Golden Glow Layer */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          warmGlow ? 'opacity-30' : 'opacity-10'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.25) 0%, transparent 70%)'
        }}
      />

      {/* Interactive Fairy Dust & Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
