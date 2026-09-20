import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';

export default function GiftScene({ onOpened }) {
  const [isOpening, setIsOpening] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (isOpening) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 12,
      rotateY: x * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleOpenGift = () => {
    if (isOpening || hasOpened) return;
    setIsOpening(true);

    audio.playGiftOpen();

    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 85,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#E8A3B0', '#FFFDF8', '#C49746', '#F5C6CB'],
        disableForReducedMotion: true,
        scalar: 0.95,
        ticks: 260,
        gravity: 0.6,
      });
    }, 400);

    setTimeout(() => {
      setHasOpened(true);
      onOpened();
    }, 1200);
  };

  return (
    <motion.div
      key="gift-scene"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 py-4 sm:py-8 text-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full max-w-[92vw] sm:max-w-md mx-auto flex flex-col items-center">
        {/* Texts Above Gift */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="space-y-1 mb-4 sm:mb-8"
        >
          <p className="text-xs sm:text-base text-[#6B544D] font-light tracking-wide">
            Okay, one last thing...
          </p>
          <h2 className="text-xl sm:text-3xl font-serif-luxury font-medium text-[#2A1D1A] tracking-wider">
            Open it.
          </h2>
        </motion.div>

        {/* 3D-STYLED LUXURY GIFT BOX */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY,
          }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative cursor-pointer group select-none py-2 sm:py-4 touch-manipulation"
          onClick={handleOpenGift}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Ambient Glow behind Gift Box */}
          <div 
            className={`absolute -inset-6 sm:-inset-8 rounded-full transition-all duration-700 pointer-events-none ${
              isOpening ? 'opacity-90 scale-125' : 'opacity-40 group-hover:opacity-70'
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, rgba(232, 163, 176, 0.25) 50%, transparent 70%)'
            }}
          />

          {/* Golden Divine Light Beam on Open */}
          {isOpening && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1.8 }}
              transition={{ duration: 0.7 }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-64 pointer-events-none z-30"
              style={{
                background: 'radial-gradient(ellipse at bottom, rgba(255, 245, 210, 0.95) 0%, rgba(212, 175, 55, 0.45) 40%, transparent 80%)',
                filter: 'blur(8px)',
              }}
            />
          )}

          {/* SVG GIFT BOX COMPONENT */}
          <div className="relative w-44 sm:w-56 h-44 sm:h-56 filter drop-shadow-[0_16px_35px_rgba(181,148,122,0.35)]">
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="boxBodyLightGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF"/>
                  <stop offset="60%" stopColor="#FAF5ED"/>
                  <stop offset="100%" stopColor="#EDE1CE"/>
                </linearGradient>

                <linearGradient id="boxLidLightGrad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF"/>
                  <stop offset="50%" stopColor="#FFFDF8"/>
                  <stop offset="100%" stopColor="#F5ECE0"/>
                </linearGradient>

                <linearGradient id="ribbonLightGrad" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#EAA3B0"/>
                  <stop offset="50%" stopColor="#D47587"/>
                  <stop offset="100%" stopColor="#B0495C"/>
                </linearGradient>

                <linearGradient id="ribbonGoldLightGrad" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#D4AF37"/>
                  <stop offset="50%" stopColor="#FFF8E0"/>
                  <stop offset="100%" stopColor="#D4AF37"/>
                </linearGradient>
              </defs>

              {/* BOX BASE CONTAINER */}
              <g transform="translate(0, 20)">
                <rect x="35" y="70" width="130" height="95" rx="6" fill="url(#boxBodyLightGrad)" stroke="#D4AF37" strokeWidth="0.8"/>
                <rect x="99" y="70" width="2" height="95" fill="rgba(0,0,0,0.04)"/>

                {/* Vertical Ribbon */}
                <rect x="88" y="70" width="24" height="95" fill="url(#ribbonLightGrad)"/>
                <line x1="88" y1="70" x2="88" y2="165" stroke="url(#ribbonGoldLightGrad)" strokeWidth="0.8"/>
                <line x1="112" y1="70" x2="112" y2="165" stroke="url(#ribbonGoldLightGrad)" strokeWidth="0.8"/>

                {/* Horizontal Ribbon */}
                <rect x="35" y="105" width="130" height="24" fill="url(#ribbonLightGrad)"/>
                <line x1="35" y1="105" x2="165" y2="105" stroke="url(#ribbonGoldLightGrad)" strokeWidth="0.8"/>
                <line x1="35" y1="129" x2="165" y2="129" stroke="url(#ribbonGoldLightGrad)" strokeWidth="0.8"/>
              </g>

              {/* BOX LID & BOW (Animated on Click) */}
              <motion.g
                animate={isOpening ? {
                  y: -65,
                  rotate: -14,
                  x: -15,
                  opacity: [1, 1, 0.3],
                } : {
                  y: 0,
                  rotate: 0,
                  x: 0,
                }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '30px 80px' }}
              >
                {/* Lid Rim */}
                <rect x="28" y="72" width="144" height="24" rx="4" fill="url(#boxLidLightGrad)" stroke="#D4AF37" strokeWidth="0.8" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))"/>
                
                {/* Lid Vertical Ribbon */}
                <rect x="88" y="72" width="24" height="24" fill="url(#ribbonLightGrad)"/>
                <line x1="88" y1="72" x2="88" y2="96" stroke="url(#ribbonGoldLightGrad)" strokeWidth="0.8"/>
                <line x1="112" y1="72" x2="112" y2="96" stroke="url(#ribbonGoldLightGrad)" strokeWidth="0.8"/>

                {/* SATIN BOW ATOP LID */}
                <g transform="translate(100, 72)">
                  <path d="M 0 -2 C -20 -28, -50 -18, -35 3 C -20 10, -5 0, 0 -2 Z" fill="url(#ribbonLightGrad)" stroke="url(#ribbonGoldLightGrad)" strokeWidth="0.75"/>
                  <path d="M 0 -2 C 20 -28, 50 -18, 35 3 C 20 10, 5 0, 0 -2 Z" fill="url(#ribbonLightGrad)" stroke="url(#ribbonGoldLightGrad)" strokeWidth="0.75"/>
                  <path d="M -4 2 Q -22 25, -28 36" stroke="url(#ribbonLightGrad)" strokeWidth="7" strokeLinecap="round"/>
                  <path d="M 4 2 Q 22 25, 28 36" stroke="url(#ribbonLightGrad)" strokeWidth="7" strokeLinecap="round"/>
                  <circle cx="0" cy="-2" r="8" fill="#B0495C" stroke="url(#ribbonGoldLightGrad)" strokeWidth="1"/>
                </g>
              </motion.g>
            </svg>
          </div>

          {/* Tap Hint */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#8F6517] font-medium"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span>Tap the box to unwrap</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
