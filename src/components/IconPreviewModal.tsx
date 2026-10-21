import React from 'react';
import { Download, Sparkles, Smartphone, X } from 'lucide-react';
import { sound } from '../services/sound';

interface IconPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IconPreviewModal: React.FC<IconPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    sound.playCoin();
    const link = document.createElement('a');
    link.href = '/app-icon.png';
    link.download = 'kairat-404-app-icon.png';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border-2 border-red-500/50 p-6 shadow-2xl glow-red flex flex-col items-center text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-[10px] font-game text-red-400 tracking-widest mb-2">
          <Sparkles className="w-3 h-3" />
          <span>ОФИЦИАЛЬНАЯ ИКОНКА</span>
        </div>
        <h3 className="text-xl font-game text-white tracking-wide">
          КАЙРАТ: 404
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5 mb-4">
          Адаптирована под Android и iOS (iPhone / iPad)
        </p>

        {/* Big HD Icon Card with squircle border */}
        <div className="relative w-56 h-56 rounded-[28%] overflow-hidden shadow-2xl border-4 border-red-500/80 glow-red my-1 group">
          <img
            src="/app-icon.png"
            alt="Официальная иконка игры Кайрат: 404"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-red-600 text-[10px] font-game text-white font-bold shadow-md">
            404
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-left text-xs text-zinc-300 w-full space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold">✓</span>
            <span>Мультяшный Кайрат с хитрой ухмылкой и кепкой «K»</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold">✓</span>
            <span>Неоновое кольцо с молниями и значок отключённого телефона</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold">✓</span>
            <span>Закруглённый squircle-формат для экрана смартфона</span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-2 mt-4">
          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-game text-xs flex items-center justify-center gap-2 shadow-lg glow-red-sm active:scale-98 transition"
          >
            <Download className="w-4 h-4" />
            <span>СКАЧАТЬ ИКОНКУ (PNG)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
          >
            ЗАКРЫТЬ
          </button>
        </div>
      </div>
    </div>
  );
};
