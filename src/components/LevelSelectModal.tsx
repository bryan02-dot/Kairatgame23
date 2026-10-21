import React from 'react';
import { Lock, Play, Star, Trophy, X } from 'lucide-react';
import { GameSaveData, LevelInfo } from '../types/game';
import { INITIAL_LEVELS } from '../services/storage';
import { sound } from '../services/sound';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveData: GameSaveData;
  onSelectLevel: (levelId: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  saveData,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm max-h-[90vh] rounded-3xl bg-zinc-900 border border-red-500/30 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h3 className="text-lg font-game text-white tracking-wide leading-tight">
                ВЫБОР МИССИИ
              </h3>
              <p className="text-[11px] text-zinc-400">
                Пройди все уровни и дойди до Босса!
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

        {/* Level List */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {INITIAL_LEVELS.map((lvl) => {
            const savedLevel = saveData.levels[lvl.id] || {
              unlocked: lvl.id === 1,
              stars: 0,
              bestScore: 0,
            };
            const isUnlocked = savedLevel.unlocked || lvl.id === 1;

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    onSelectLevel(lvl.id);
                  } else {
                    sound.playHit();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-zinc-800/80 border-zinc-700 hover:border-red-500/80 cursor-pointer active:scale-98 shadow-md'
                    : 'bg-zinc-900/60 border-zinc-800/80 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-red-950 to-zinc-900 border-red-500/40 text-white'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-600'
                    }`}
                  >
                    {isUnlocked ? lvl.icon : <Lock className="w-6 h-6 text-zinc-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-white font-game truncate">
                        {lvl.title}
                      </h4>
                      {isUnlocked && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[1, 2, 3].map((starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3.5 h-3.5 ${
                                starIdx <= savedLevel.stars
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-zinc-600'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] font-semibold text-red-400 mt-0.5">
                      {lvl.subtitle}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {lvl.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-700/40 text-xs">
                      {isUnlocked ? (
                        <>
                          <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-semibold">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Рекорд: {savedLevel.bestScore}
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-game flex items-center gap-1">
                            <Play className="w-3 h-3 fill-current" /> ИГРАТЬ
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Пройди уровень {lvl.id - 1}
                        </span>
                      )}
                    </div>
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
