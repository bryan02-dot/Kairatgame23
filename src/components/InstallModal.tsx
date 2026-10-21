import React, { useState } from 'react';
import {
  Apple,
  Check,
  ChevronRight,
  Download,
  PlusSquare,
  Share,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { sound } from '../services/sound';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(
    isIOS ? 'ios' : 'android'
  );

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    sound.playClick();
    if (isInstallable) {
      await installApp();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm max-h-[92vh] rounded-3xl bg-zinc-900 border border-red-500/40 p-5 shadow-2xl glow-red flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white z-10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Icon & Header */}
        <div className="flex flex-col items-center text-center pt-1 mb-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500/60 glow-red mb-3">
            <img
              src="/app-icon.png"
              alt="КАЙРАТ: 404 Иконка"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-red-600 text-[9px] font-game text-white font-bold">
              HD
            </div>
          </div>

          <h3 className="text-lg font-game text-white tracking-wide leading-tight">
            УСТАНОВИТЬ НА СМАРТФОН
          </h3>
          <p className="text-[11px] text-zinc-400 mt-1">
            Игра работает как настоящее приложение без адресной строки!
          </p>
        </div>

        {/* Operating System Switcher Tabs */}
        <div className="flex p-1 rounded-2xl bg-zinc-950 border border-zinc-800 mb-4">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('ios');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-game text-xs flex items-center justify-center gap-1.5 transition ${
              activeTab === 'ios'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>ДЛЯ IPHONE (iOS)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('android');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-game text-xs flex items-center justify-center gap-1.5 transition ${
              activeTab === 'android'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>ДЛЯ ANDROID</span>
          </button>
        </div>

        {/* Content based on tab */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3 mb-4">
          {activeTab === 'ios' ? (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
                <div className="flex items-center gap-2 mb-2 text-white font-game">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Открой игру в Safari</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed pl-7">
                  На iPhone установка PWA поддерживается через браузер Safari.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
                <div className="flex items-center gap-2 mb-2 text-white font-game">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>Нажми кнопку «Поделиться»</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed pl-7 flex items-center gap-1.5 flex-wrap">
                  Квадратная иконка со стрелкой вверх{' '}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-700 text-sky-400 font-bold">
                    <Share className="w-3.5 h-3.5" /> Поделиться
                  </span>{' '}
                  на нижней панели Safari.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
                <div className="flex items-center gap-2 mb-2 text-white font-game">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span>Выбери «На экран "Домой"»</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed pl-7 flex items-center gap-1.5 flex-wrap">
                  Прокрути список вниз и нажми{' '}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-700 text-amber-400 font-bold">
                    <PlusSquare className="w-3.5 h-3.5" /> На экран «Домой»
                  </span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
                <div className="flex items-center gap-2 mb-2 text-white font-game">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                    4
                  </span>
                  <span>Нажми «Добавить» вверху</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed pl-7">
                  Готово! На рабочем столе твоего iPhone появится стильная иконка Кайрата. Игра будет открываться в полный экран без браузерных меню!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-game text-sm flex items-center justify-center gap-2 shadow-lg glow-red-sm active:scale-98 transition"
                >
                  <Download className="w-5 h-5" />
                  УСТАНОВИТЬ НА ANDROID
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300 space-y-2">
                  <p className="font-bold text-red-400 font-game">
                    Установка через Google Chrome:
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    1. Нажми на меню из трёх точек (⋮) в правом верхнем углу Chrome.<br />
                    2. Выбери пункт <strong className="text-white">«Установить приложение»</strong> или <strong className="text-white">«Добавить на главный экран»</strong>.<br />
                    3. Подтверди добавление.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  После установки игра сохраняет уровни, скины и монеты прямо на телефоне.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-game transition shrink-0"
        >
          ПОНЯТНО, ЗАКРЫТЬ
        </button>
      </div>
    </div>
  );
};
