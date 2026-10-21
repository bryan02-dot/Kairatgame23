import React, { useState } from 'react';
import { Volume2, Heart, Sparkles, X } from 'lucide-react';
import { MemeQuote } from '../types/game';
import { MEME_QUOTES } from '../services/storage';
import { sound } from '../services/sound';

interface MemesSoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemesSoundboardModal: React.FC<MemesSoundboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [quotes, setQuotes] = useState<MemeQuote[]>(MEME_QUOTES);
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlayQuote = (quote: MemeQuote) => {
    sound.playClick();
    setPlayingId(quote.id);

    // Audio SFX trigger
    if (quote.audioKey === 'ringtone') sound.playPhoneRing();
    else if (quote.audioKey === 'disconnect') sound.playHit();
    else if (quote.audioKey === 'boss_voice') sound.playBossLaser();
    else sound.playTelegramNotification();

    // Comical Russian speech synthesis quote recitation
    sound.speakQuote(quote.text);

    setTimeout(() => {
      setPlayingId(null);
    }, 2200);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCoin();
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm max-h-[88vh] rounded-3xl bg-zinc-900 border border-red-500/30 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <h3 className="text-lg font-game text-white tracking-wide leading-tight">
                МЕМЫ И ЦИТАТЫ
              </h3>
              <p className="text-[11px] text-zinc-400">
                Золотой фонд отмазок Кайрата
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

        {/* Quotes List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {quotes.map((quote) => {
            const isPlaying = playingId === quote.id;
            return (
              <div
                key={quote.id}
                onClick={() => handlePlayQuote(quote)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden active:scale-98 ${
                  isPlaying
                    ? 'bg-red-950/60 border-red-500 shadow-lg glow-red-sm scale-[1.02]'
                    : 'bg-zinc-800/60 border-zinc-700/60 hover:border-red-500/50'
                }`}
              >
                {isPlaying && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-amber-500 animate-pulse" />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white font-game tracking-wide leading-snug">
                      {quote.text}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1.5 italic">
                      {quote.context}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      className={`p-2 rounded-xl transition ${
                        isPlaying
                          ? 'bg-red-600 text-white animate-bounce'
                          : 'bg-zinc-700/70 text-zinc-300 hover:bg-zinc-600'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleLike(quote.id, e)}
                      className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-rose-400 transition"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{quote.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Нажимай на цитату, чтобы озвучить!</span>
        </div>
      </div>
    </div>
  );
};
