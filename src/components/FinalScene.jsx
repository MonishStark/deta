import React from 'react';
import { motion } from 'framer-motion';

export default function FinalScene({ onReplay }) {
  return (
    <motion.div
      key="final-scene"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 py-6 sm:py-10 text-center"
    >
      <div className="w-full max-w-[92vw] sm:max-w-lg mx-auto flex flex-col items-center p-6 sm:p-12 rounded-2xl sm:rounded-3xl glass-panel-light shadow-[0_20px_60px_rgba(181,148,122,0.22)]">
        {/* Soft Golden Starburst Emblem */}
        <motion.div
          initial={{ scale: 0, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-[#FFF8EE] border border-[#D4AF37]/35 shadow-sm text-2xl sm:text-3xl mb-4 sm:mb-6 select-none"
        >
          ✨
        </motion.div>

        {/* 37 suits you. ✨ */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif-luxury font-light text-[#2A1D1A] mb-3 sm:mb-4 tracking-wide leading-tight"
        >
          <span className="gold-gradient-text font-normal font-serif">37</span> suits you. ✨
        </motion.h1>

        {/* Here's to another year of being unapologetically you. */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-xl text-[#523E36] font-light tracking-wide max-w-md mx-auto mb-4 sm:mb-8 leading-relaxed font-sans"
        >
          Here's to another year of being unapologetically you.
        </motion.p>

        {/* Delicate divider */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '70px', opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent mx-auto mb-4 sm:mb-8"
        />

        {/* Happy Birthday, Queen. 👑 */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-4xl md:text-5xl font-serif-luxury font-medium gold-gradient-text tracking-wider mb-4 sm:mb-6 leading-tight"
        >
          Happy Birthday, Queen. 👑
        </motion.h2>

        {/* Subtle Date Badge: 22 · 09 · 2026 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.0, delay: 1.5 }}
          className="inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/90 border border-[#D4AF37]/35 text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] text-[#8F6517] font-medium mb-5 sm:mb-8 shadow-sm"
        >
          22 · 09 · 2026
        </motion.div>

        {/* Now go enjoy your cake. 🎂 */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 1.0, delay: 1.9 }}
          className="text-sm sm:text-lg text-[#6B544D] font-light tracking-wide font-sans mb-6 sm:mb-8"
        >
          Now go enjoy your cake. 🎂
        </motion.p>

        {/* Replay Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 2.4 }}
        >
          <button
            onClick={onReplay}
            className="text-xs tracking-widest uppercase text-[#8F6517] hover:text-[#2A1D1A] hover:underline underline-offset-4 decoration-[#D4AF37]/50 flex items-center gap-1.5 transition-all cursor-pointer font-medium p-2"
          >
            <span>↺</span>
            <span>Replay surprise</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
