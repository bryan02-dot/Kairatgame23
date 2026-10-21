import React, { useEffect, useState } from 'react';
import {
  Download,
  Flame,
  Gamepad2,
  ListMusic,
  Map,
  Play,
  Settings,
  Shirt,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GameSaveData } from '../types/game';
import { sound } from '../services/sound';

interface MainMenuProps {
  saveData: GameSaveData;
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenMemes: () => void;
  onOpenSkins: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenInstall: () => void;
  onToggleSound: () => void;
}

const AMBIENT_SPEECH = [
  '📵 *Не замечает звонок*',
  '«Потом отвечу, ща занят»',
  '🔋 «0% зарядки, брат»',
  '«Я уже выхожу, честно!»',
  '💨 *Ускользнул в тумане*',
];

export const MainMenu: React.FC<MainMenuProps> = ({
  saveData,
  onStartGame,
  onOpenLevelSelect,
  onOpenMemes,
  onOpenSkins,
  onOpenAchievements,
  onOpenSettings,
  onOpenInstall,
  onToggleSound,
}) => {
  const [ambientPhrase, setAmbientPhrase] = useState(AMBIENT_SPEECH[0]);
  const [isPhoneVibrating, setIsPhoneVibrating] = useState(false);

  // Periodically cycle ambient comical reactions
  useEffect(() => {
    const interval = setInterval(() => {
      const phrase =
        AMBIENT_SPEECH[Math.floor(Math.random() * AMBIENT_SPEECH.length)];
      setAmbientPhrase(phrase);
      setIsPhoneVibrating(true);

      if (saveData.settings.soundEnabled) {
        sound.playTelegramNotification();
      }

      setTimeout(() => setIsPhoneVibrating(false), 800);
    }, 4500);

    return () => clearInterval(interval);
  }, [saveData.settings.soundEnabled]);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col justify-between bg-zinc-950 overflow-hidden select-none pb-6">
      {/* Background Neon District Gradients */}
      <div className="absolute inset-0 bg-radial from-red-950/30 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-red-600/10 to-transparent pointer-events-none" />

      {/* Top Mobile Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-3 pb-2">
        {/* App Icon mini preview + District label */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-red-500/40 glow-red-sm">
            <img
              src="/public/app-icon.png"
              alt="Icon"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[11px] font-game text-zinc-400 tracking-wider">
            РАЙОН 404
          </span>
        </div>

        {/* Currency & Quick Toggles */}
        <div className="flex items-center gap-2">
          <div
            onClick={onOpenSkins}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/40 text-amber-400 font-game text-xs cursor-pointer shadow-inner active:scale-95 transition"
          >
            <span>🪙</span>
            <span>{saveData.coins}</span>
          </div>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition"
          >
            {saveData.settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-red-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>
        </div>
      </div>

      {/* Center Character Artwork & Title */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4">
        {/* Neon Title */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-[10px] font-game text-red-400 tracking-widest mb-1 glow-red-sm">
            <span>🔥</span>
            <span>ЛЕГЕНДА РАЙОНА</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-game text-white tracking-wider text-glow-red uppercase">
            КАЙРАТ: 404
          </h1>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">
            «Был в сети вчера в 03:14»
          </p>
        </div>

        {/* Kairat Character Card */}
        <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-red-500/50 shadow-2xl glow-red group">
          <img
            src="/src/assets/images/kairat_character_art_1792590849736.jpg"
            alt="Кайрат"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPhoneVibrating ? 'scale-105 filter brightness-110' : 'scale-100'
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Floating funny speech bubble */}
          <div className="absolute top-2 left-2 right-2 px-2.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-red-500/40 text-[11px] font-game text-red-300 text-center shadow-lg animate-pulse">
            {ambientPhrase}
          </div>

          {/* Phone call vibration badge */}
          {isPhoneVibrating && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-red-600 text-white text-[9px] font-game font-bold flex items-center gap-1 animate-bounce">
              <span>📳</span> ВХОДЯЩИЙ...
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Menu */}
      <div className="relative z-20 px-5 space-y-2.5 max-w-sm w-full mx-auto">
        {/* Play Button */}
        <button
          onClick={() => {
            sound.playClick();
            onStartGame();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-game text-lg tracking-wide flex items-center justify-center gap-2.5 shadow-xl glow-red active:scale-98 transition"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>ИГРАТЬ</span>
        </button>

        {/* Grid Navigation */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenLevelSelect();
            }}
            className="py-3 px-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white font-game text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Map className="w-4 h-4 text-red-400" />
            <span>МИССИИ</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenMemes();
            }}
            className="py-3 px-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white font-game text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <ListMusic className="w-4 h-4 text-amber-400" />
            <span>МЕМЫ</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSkins();
            }}
            className="py-3 px-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white font-game text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Shirt className="w-4 h-4 text-emerald-400" />
            <span>ГАРДЕРОБ</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAchievements();
            }}
            className="py-3 px-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white font-game text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>ДОСТИЖЕНИЯ</span>
          </button>
        </div>

        {/* Secondary Bar: Settings & Install */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="flex-1 py-2.5 rounded-xl bg-zinc-900/70 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>НАСТРОЙКИ</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenInstall();
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-950/60 to-zinc-900 border border-red-500/40 hover:border-red-500 text-red-300 text-xs font-game flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>СКАЧАТЬ PWA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
