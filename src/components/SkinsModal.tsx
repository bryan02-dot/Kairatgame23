import React from 'react';
import { Check, Lock, Sparkles, X } from 'lucide-react';
import { GameSaveData, Skin } from '../types/game';
import { SKINS } from '../services/storage';
import { sound } from '../services/sound';

interface SkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveData: GameSaveData;
  onUpdateSave: (updater: (prev: GameSaveData) => GameSaveData) => void;
}

export const SkinsModal: React.FC<SkinsModalProps> = ({
  isOpen,
  onClose,
  saveData,
  onUpdateSave,
}) => {
  if (!isOpen) return null;

  const handleSelectSkin = (skin: Skin) => {
    sound.playClick();
    onUpdateSave((prev) => ({
      ...prev,
      selectedSkin: skin.id,
    }));
  };

  const handleBuySkin = (skin: Skin) => {
    if (saveData.coins < skin.cost) {
      sound.playHit();
      alert(`Не хватает монет! Нужно: ${skin.cost} 🪙, у тебя: ${saveData.coins} 🪙`);
      return;
    }

    sound.playCoin();
    onUpdateSave((prev) => ({
      ...prev,
      coins: prev.coins - skin.cost,
      unlockedSkins: [...prev.unlockedSkins, skin.id],
      selectedSkin: skin.id,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm max-h-[88vh] rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧥</span>
            <div>
              <h3 className="text-lg font-game text-white tracking-wide leading-tight">
                ГАРДЕРОБ КАЙРАТА
              </h3>
              <p className="text-[11px] text-zinc-400">
                Стиль главного босса района
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

        {/* Balance badge */}
        <div className="px-5 py-2.5 bg-zinc-950/70 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-semibold">Баланс кошелька:</span>
          <span className="text-sm font-game text-amber-400 flex items-center gap-1">
            🪙 {saveData.coins}
          </span>
        </div>

        {/* Skins list */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {SKINS.map((skin) => {
            const isUnlocked = saveData.unlockedSkins.includes(skin.id);
            const isEquipped = saveData.selectedSkin === skin.id;

            return (
              <div
                key={skin.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isEquipped
                    ? 'bg-zinc-800/90 border-red-500 shadow-md glow-red-sm'
                    : isUnlocked
                    ? 'bg-zinc-800/50 border-zinc-700/60'
                    : 'bg-zinc-900/60 border-zinc-800 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border"
                    style={{
                      backgroundColor: skin.colors.hoodie,
                      borderColor: skin.colors.glow,
                    }}
                  >
                    {skin.emoji}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-game">
                        {skin.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300">
                        {skin.badge}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {skin.description}
                    </p>

                    <p className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {skin.perk}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-700/40">
                      {isEquipped ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Надето
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleSelectSkin(skin)}
                          className="px-4 py-1.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-game transition"
                        >
                          НАДЕТЬ
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuySkin(skin)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-game flex items-center gap-1.5 transition ${
                            saveData.coins >= skin.cost
                              ? 'bg-red-600 hover:bg-red-500 text-white shadow-md glow-red-sm'
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>КУПИТЬ ЗА {skin.cost} 🪙</span>
                        </button>
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
