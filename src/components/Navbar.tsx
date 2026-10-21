import React from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../services/sound';

interface NavbarProps {
  title: string;
  coins: number;
  score?: number;
  onBack: () => void;
  onRestart?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  coins,
  score,
  onBack,
  onRestart,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-3 py-2.5 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="leading-tight">
          <h2 className="text-xs font-game text-white truncate max-w-[140px] sm:max-w-[200px]">
            {title}
          </h2>
          {score !== undefined && (
            <p className="text-[10px] font-bold text-red-400 font-mono">
              ОЧКИ: {score}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Coins indicator */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 font-game text-xs shadow-inner">
          <span>🪙</span>
          <span>{coins}</span>
        </div>

        {/* Restart button */}
        {onRestart && (
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            title="Перезапустить уровень"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Sound toggle */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-red-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>
      </div>
    </header>
  );
};
