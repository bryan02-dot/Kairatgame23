import React from 'react';
import { Volume2, VolumeX, Music, Smartphone, RotateCcw, X } from 'lucide-react';
import { GameSaveData } from '../types/game';
import { sound } from '../services/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveData: GameSaveData;
  onUpdateSave: (updater: (prev: GameSaveData) => GameSaveData) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  saveData,
  onUpdateSave,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const toggleSound = () => {
    const nextVal = !saveData.settings.soundEnabled;
    sound.setSettings(nextVal, saveData.settings.musicEnabled, saveData.settings.sfxVolume, saveData.settings.musicVolume);
    onUpdateSave((prev) => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: nextVal },
    }));
    if (nextVal) sound.playClick();
  };

  const toggleMusic = () => {
    const nextVal = !saveData.settings.musicEnabled;
    sound.setSettings(saveData.settings.soundEnabled, nextVal, saveData.settings.sfxVolume, saveData.settings.musicVolume);
    onUpdateSave((prev) => ({
      ...prev,
      settings: { ...prev.settings, musicEnabled: nextVal },
    }));
    sound.playClick();
  };

  const toggleVibration = () => {
    sound.playClick();
    const nextVal = !saveData.settings.vibrationEnabled;
    if (nextVal) sound.triggerVibration(100);
    onUpdateSave((prev) => ({
      ...prev,
      settings: { ...prev.settings, vibrationEnabled: nextVal },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-game text-white tracking-wide mb-6 flex items-center gap-2">
          ⚙️ НАСТРОЙКИ
        </h3>

        <div className="space-y-4">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-800">
            <div className="flex items-center gap-3">
              {saveData.settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-red-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-zinc-500" />
              )}
              <div>
                <p className="text-sm font-bold text-white">Звуковые эффекты</p>
                <p className="text-[11px] text-zinc-400">Звонки, клики, удары</p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                saveData.settings.soundEnabled ? 'bg-red-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  saveData.settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-800">
            <div className="flex items-center gap-3">
              <Music className={`w-5 h-5 ${saveData.settings.musicEnabled ? 'text-red-400' : 'text-zinc-500'}`} />
              <div>
                <p className="text-sm font-bold text-white">Фоновая музыка</p>
                <p className="text-[11px] text-zinc-400">Ретро чиптюн-бит</p>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                saveData.settings.musicEnabled ? 'bg-red-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  saveData.settings.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-800">
            <div className="flex items-center gap-3">
              <Smartphone className={`w-5 h-5 ${saveData.settings.vibrationEnabled ? 'text-red-400' : 'text-zinc-500'}`} />
              <div>
                <p className="text-sm font-bold text-white">Тактильная отдача</p>
                <p className="text-[11px] text-zinc-400">Вибрация при попаданиях</p>
              </div>
            </div>
            <button
              onClick={toggleVibration}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                saveData.settings.vibrationEnabled ? 'bg-red-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  saveData.settings.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset progress */}
        <div className="mt-8 pt-4 border-t border-zinc-800">
          <button
            onClick={() => {
              if (confirm('Сбросить весь прогресс и монеты?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 border border-red-900/40 text-red-400 text-xs font-semibold hover:bg-red-900/50 flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            СБРОСИТЬ ПРОГРЕСС
          </button>
        </div>
      </div>
    </div>
  );
};
