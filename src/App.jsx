import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import BackgroundEffects from './components/BackgroundEffects';
import MusicController from './components/MusicController';
import IntroScene from './components/IntroScene';
import CakeScene from './components/CakeScene';
import WishScene from './components/WishScene';
import GiftScene from './components/GiftScene';
import FinalScene from './components/FinalScene';

export default function App() {
  const [currentScene, setCurrentScene] = useState('intro'); // 'intro' | 'cake' | 'wish' | 'gift' | 'final'
  const [dimmed, setDimmed] = useState(false);
  const [warmGlow, setWarmGlow] = useState(false);
  const [musicActive, setMusicActive] = useState(false);

  const handleStart = () => {
    setMusicActive(true);
    setCurrentScene('cake');
  };

  const handleCakeContinue = () => {
    setDimmed(false);
    setWarmGlow(true);
    setCurrentScene('wish');
  };

  const handleWishContinue = () => {
    setWarmGlow(false);
    setCurrentScene('gift');
  };

  const handleGiftOpened = () => {
    setWarmGlow(true);
    setCurrentScene('final');
  };

  const handleReplay = () => {
    setDimmed(false);
    setWarmGlow(false);
    setCurrentScene('intro');
  };

  return (
    <div 
      className="relative w-full h-[100dvh] overflow-hidden bg-[#FAF8F5] text-[#2A1D1A] font-sans selection:bg-[#D4AF37]/20 selection:text-[#2A1D1A]"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Dynamic Stardust & Ambient Luminous Lighting */}
      <BackgroundEffects dimmed={dimmed} warmGlow={warmGlow} />

      {/* Discrete Music Controller in top right */}
      <MusicController visible={musicActive} />

      {/* Main Interactive Scene Flow */}
      <main className="relative w-full h-full flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentScene === 'intro' && (
            <IntroScene key="intro" onStart={handleStart} />
          )}

          {currentScene === 'cake' && (
            <CakeScene
              key="cake"
              onContinue={handleCakeContinue}
              setDimmed={setDimmed}
              setWarmGlow={setWarmGlow}
            />
          )}

          {currentScene === 'wish' && (
            <WishScene
              key="wish"
              onContinue={handleWishContinue}
            />
          )}

          {currentScene === 'gift' && (
            <GiftScene
              key="gift"
              onOpened={handleGiftOpened}
            />
          )}

          {currentScene === 'final' && (
            <FinalScene
              key="final"
              onReplay={handleReplay}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
