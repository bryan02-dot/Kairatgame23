import React from 'react';
import { Trophy, CheckCircle, Gift, X } from 'lucide-react';
import { Achievement, GameSaveData } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../services/storage';
import { sound } from '../services/sound';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveData: GameSaveData;
  onClaimReward: (achId: string, reward: number) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  saveData,
  onClaimReward,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm max-h-[88vh] rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-game text-white tracking-wide leading-tight">
                ДОСТИЖЕНИЯ
              </h3>
              <p className="text-[11px] text-zinc-400">
                Подвиги во имя игнора
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            const saved = saveData.achievements[ach.id] || { unlocked: false, progress: 0 };
            const currentProgress = Math.min(saved.progress, ach.maxProgress);
            const isCompleted = saved.unlocked || currentProgress >= ach.maxProgress;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-amber-950/20 border-amber-500/50'
                    : 'bg-zinc-800/40 border-zinc-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl p-2 rounded-2xl bg-zinc-800 border border-zinc-700/50">
                    {ach.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-game">
                        {ach.title}
                      </h4>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                        +{ach.rewardCoins} 🪙
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1 leading-snug">
                      {ach.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-zinc-400 font-bold mb-1">
                        <span>Прогресс</span>
                        <span>
                          {currentProgress} / {ach.maxProgress}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted ? 'bg-amber-400' : 'bg-red-500'
                          }`}
                          style={{
                            width: `${(currentProgress / ach.maxProgress) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="mt-3 pt-2 border-t border-zinc-700/40 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Выполнено!
                        </span>

                        {!saved.unlocked && (
                          <button
                            onClick={() => {
                              sound.playCoin();
                              onClaimReward(ach.id, ach.rewardCoins);
                            }}
                            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-game flex items-center gap-1 shadow-md glow-amber transition"
                          >
                            <Gift className="w-3.5 h-3.5" /> Забрать награду
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
