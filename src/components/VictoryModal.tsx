import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw, Star, Trophy, X } from 'lucide-react';
import { sound } from '../services/sound';

interface VictoryModalProps {
  isOpen: boolean;
  isBossLevel?: boolean;
  score: number;
  stars: number;
  rewardCoins: number;
  onNextLevel?: () => void;
  onRestart: () => void;
  onCloseToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  isBossLevel = false,
  score,
  stars,
  rewardCoins,
  onNextLevel,
  onRestart,
  onCloseToMenu,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playVictoryFanfare();
      sound.triggerVibration([100, 50, 100, 50, 200]);

      // Fire confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f59e0b', '#ffffff', '#3b82f6'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border-2 border-red-500/50 p-6 shadow-2xl glow-red text-center">
        {/* Top badge */}
        <div className="w-16 h-16 mx-auto -mt-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 border-2 border-white shadow-xl flex items-center justify-center text-3xl">
          {isBossLevel ? '👑' : '🏆'}
        </div>

        {isBossLevel ? (
          <>
            <h2 className="text-xl font-game text-white mt-4 text-glow-red tracking-wide">
              ПОЗДРАВЛЯЕМ!
            </h2>
            <div className="my-3 p-3.5 rounded-2xl bg-red-950/50 border border-red-500/40">
              <p className="text-sm font-bold text-red-300 font-game leading-relaxed">
                «Ты победил Кайрата. Но он всё ещё не ответил».
              </p>
              <p className="text-xs text-zinc-400 mt-1 italic">
                Статус: «Был в сети только что. Прочитано в 04:20».
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-game text-white mt-4 tracking-wide">
              МИССИЯ ВЫПОЛНЕНА!
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Кайрат снова улизнул, но ты получил награду!
            </p>
          </>
        )}

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-9 h-9 transition-transform ${
                starIdx <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] scale-110'
                  : 'text-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Stats card */}
        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 gap-2 mb-6">
          <div className="text-center">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Набрано очков
            </span>
            <span className="text-lg font-game text-white font-mono">{score}</span>
          </div>
          <div className="text-center border-l border-zinc-800">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Награда
            </span>
            <span className="text-lg font-game text-amber-400">+{rewardCoins} 🪙</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2.5">
          {onNextLevel && (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-game text-sm flex items-center justify-center gap-2 shadow-lg glow-red-sm active:scale-98 transition"
            >
              <span>СЛЕДУЮЩИЙ УРОВЕНЬ</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-game flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ЕЩЁ РАЗ</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onCloseToMenu();
              }}
              className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-game flex items-center justify-center gap-1.5 transition"
            >
              <span>В МЕНЮ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
