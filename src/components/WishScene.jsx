import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WishScene({ onContinue }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const birthdayMessage = "May this new year of your life bring you plenty of happiness, beautiful moments, unexpected adventures, and lots of reasons to smile.";

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 8,
      rotateY: x * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      key="wish-scene"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 py-4 sm:py-8 text-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full max-w-[92vw] sm:max-w-lg mx-auto flex flex-col items-center">
        {/* Luxury Stationery Card with 3D Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY,
          }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12
                     bg-white/85 border border-[#D4AF37]/35 shadow-[0_20px_50px_rgba(181,148,122,0.2)]
                     backdrop-blur-xl overflow-hidden"
        >
          {/* Subtle gold foil border filigree corners */}
          <div className="absolute top-3.5 left-3.5 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-sm" />
          <div className="absolute top-3.5 right-3.5 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-sm" />
          <div className="absolute bottom-3.5 left-3.5 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-sm" />
          <div className="absolute bottom-3.5 right-3.5 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-sm" />

          {/* Crown Emblem */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto flex items-center justify-center bg-[#FFF8EE] border border-[#D4AF37]/30 text-xl sm:text-2xl mb-3 sm:mb-4 select-none shadow-sm"
          >
            👑
          </motion.div>

          {/* Happy 37th Birthday, Queendetal! */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="space-y-0.5 sm:space-y-1 mb-4 sm:mb-6"
          >
            <h1 className="text-xl sm:text-3xl md:text-4xl font-serif-luxury font-light text-[#2A1D1A] tracking-wide leading-tight">
              Happy 37th Birthday,
            </h1>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-luxury font-medium gold-gradient-text tracking-wide leading-tight">
              Queendetal!
            </h2>
          </motion.div>

          {/* Delicate Gold Divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60px' }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent mx-auto mb-4 sm:mb-6"
          />

          {/* Personal Birthday Message */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.0 }}
            className="text-sm sm:text-base md:text-lg text-[#523E36] font-light leading-relaxed tracking-wide font-sans max-w-md mx-auto"
          >
            "{birthdayMessage}"
          </motion.p>
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          className="mt-5 sm:mt-8 flex flex-col items-center space-y-2.5 sm:space-y-3.5"
        >
          <p className="text-xs sm:text-base text-[#6B544D] font-light tracking-wider">
            There's one more thing...
          </p>

          <button
            onClick={onContinue}
            className="btn-luxury-light px-8 py-3 sm:px-9 sm:py-3.5 rounded-full text-sm sm:text-base font-medium tracking-wide flex items-center gap-2 group cursor-pointer shadow-md"
          >
            <span className="text-[#2A1D1A]">Continue</span>
            <span className="text-[#B58428] group-hover:translate-x-1.5 transition-transform">→</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
