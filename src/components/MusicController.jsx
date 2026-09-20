import React, { useState } from 'react';
import { audio } from '../utils/audio';

export default function MusicController({ visible = false }) {
  const [isMuted, setIsMuted] = useState(false);

  if (!visible) return null;

  const handleToggle = () => {
    const nextMuted = audio.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div 
      className="fixed z-50 transition-opacity duration-700"
      style={{
        top: 'max(14px, env(safe-area-inset-top, 14px))',
        right: 'max(14px, env(safe-area-inset-right, 14px))',
      }}
    >
      <button
        onClick={handleToggle}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
        className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full 
                   bg-white/85 hover:bg-white active:scale-95
                   border border-[#D4AF37]/40 hover:border-[#D4AF37]/80
                   text-[#2A1D1A] shadow-md shadow-[#B5947A]/15 backdrop-blur-md
                   transition-all duration-300 cursor-pointer"
      >
        <span className="text-base sm:text-lg font-serif transition-transform duration-300 group-hover:scale-110">
          {isMuted ? '🔇' : '♪'}
        </span>

        {/* Minimal soundwave indicator */}
        {!isMuted && (
          <span className="absolute -bottom-0.5 flex space-x-0.5 items-end h-1.5 opacity-70 group-hover:opacity-100">
            <span className="w-0.5 h-1 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDuration: '0.6s' }}></span>
            <span className="w-0.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDuration: '0.9s' }}></span>
            <span className="w-0.5 h-0.5 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDuration: '0.7s' }}></span>
          </span>
        )}
      </button>
    </div>
  );
}
