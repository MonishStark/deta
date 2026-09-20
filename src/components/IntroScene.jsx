import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { audio } from '../utils/audio';

export default function IntroScene({ onStart }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    // Disable 3D tilt on touch screens to avoid weird sticky angles
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 10,
      rotateY: x * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleOpenSurprise = () => {
    audio.playChime();
    audio.startAmbientMusic();
    onStart();
  };

  return (
    <motion.div
      key="intro-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 sm:px-6 py-6 text-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="w-full max-w-[92vw] sm:max-w-xl mx-auto flex flex-col items-center p-6 sm:p-12 rounded-2xl sm:rounded-3xl glass-panel-light shadow-xl"
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Luminous Royal Crown / Star Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#FFF3E0] to-[#FFE8ED] border border-[#D4AF37]/30 shadow-md shadow-[#D4AF37]/15 text-xl sm:text-2xl mb-4 sm:mb-6 select-none"
        >
          👑
        </motion.div>

        {/* Hey, Queendetal... */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif-luxury font-light tracking-wide text-[#2A1D1A] mb-3 sm:mb-4 leading-tight"
        >
          Hey, <span className="gold-gradient-text font-normal font-serif">Queendetal</span>...
        </motion.h1>

        {/* Someone left a little surprise for you. 👀 */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-xl text-[#6B544D] font-light tracking-wide mb-6 sm:mb-10 max-w-md leading-relaxed"
        >
          Someone left a little surprise for you. 👀
        </motion.p>

        {/* Open Your Surprise Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="w-full sm:w-auto"
        >
          <button
            onClick={handleOpenSurprise}
            className="btn-luxury-light group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 rounded-full
                       text-base sm:text-lg font-medium tracking-wider cursor-pointer"
          >
            <span className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3">
              <span className="font-sans text-[#2A1D1A]">Open Your Surprise</span>
              <span className="text-[#B58428] text-base group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </span>

            {/* Radiant light sweep hover highlight */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
