import React, { useState } from 'react';
import { Sparkles, Zap, Smartphone, Volume2 } from 'lucide-react';
import { sound } from '../services/sound';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    if (isTapped) return;
    setIsTapped(true);

    // Audio & vibration trigger on mobile tap
    sound.playPowerup();
    sound.triggerVibration([80, 40, 120]);

    // Dramatic transition into main menu
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  return (
    <div
      onClick={handleTap}
      className={`relative w-full h-[100dvh] flex flex-col items-center justify-between p-6 bg-zinc-950 overflow-hidden cursor-pointer select-none transition-all duration-500 ${
        isTapped ? 'scale-105 brightness-125 filter bg-red-950/40' : ''
      }`}
    >
      {/* Neon Atmospheric Background */}
      <div className="absolute inset-0 bg-radial from-red-950/40 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute inset-0 arcade-grid opacity-30 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 pt-4 flex flex-col items-center text-center animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-xs font-game text-red-400 tracking-widest shadow-lg glow-red-sm mb-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>МОБИЛЬНАЯ РОФЕЛЬНАЯ ИГРА</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-game text-white tracking-widest text-glow-red uppercase">
          КАЙРАТ: 404
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-semibold">
          ЛЕГЕНДА РАЙОНА • НА СВЯЗИ В 2088 ГОДУ
        </p>
      </div>

      {/* Big Interactive Icon in Center */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        {/* Pulsing Lightning Ring Behind Icon */}
        <div className="absolute -inset-6 rounded-[34%] bg-gradient-to-tr from-red-600/30 via-red-500/10 to-amber-500/30 animate-pulse glow-red blur-sm pointer-events-none" />

        {/* The App Icon */}
        <div
          className={`relative w-60 h-60 sm:w-64 sm:h-64 rounded-[26%] overflow-hidden border-4 border-red-500/90 shadow-2xl glow-red transition-all duration-300 active:scale-95 group ${
            isTapped ? 'scale-90 rotate-2' : 'hover:scale-102 animate-pulse'
          }`}
        >
          <img
            src="/app-icon.png"
            alt="КАЙРАТ: 404"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* 404 glowing badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-red-600 text-white font-game text-xs font-extrabold shadow-lg glow-red-sm animate-bounce">
            404
          </div>

          {/* Overlay tap ripple on tap */}
          {isTapped && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-xs animate-ping" />
          )}
        </div>

        {/* Tap Prompt with arrow */}
        <div className="mt-8 flex flex-col items-center animate-bounce">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-game text-xs sm:text-sm tracking-wider shadow-xl glow-red-sm flex items-center gap-2 border border-red-300/40">
            <span>👆</span>
            <span>ТАПНИ ПО ИКОНКЕ ДЛЯ ВХОДА</span>
            <span>⚡</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">
            (Нажми в любое место экрана)
          </span>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 pb-4 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-zinc-400" /> iOS & Android
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-red-400" /> Со звуком лучше
        </span>
      </div>
    </div>
  );
};
