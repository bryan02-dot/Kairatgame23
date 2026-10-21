import React, { useEffect, useState, useRef } from 'react';
import { Clock, Eye, Sparkles, Volume2 } from 'lucide-react';
import { sound } from '../../services/sound';

interface Level1Props {
  onComplete: (score: number, stars: number) => void;
  onFail: (score: number) => void;
}

interface DistrictSpot {
  id: string;
  name: string;
  icon: string;
  x: number; // percentage
  y: number; // percentage
}

const DISTRICT_SPOTS: DistrictSpot[] = [
  { id: 'shaurma', name: 'Шаурма «У Ашота»', icon: '🌯', x: 20, y: 22 },
  { id: 'entrance', name: 'Подъезд №3', icon: '🚪', x: 75, y: 20 },
  { id: 'bench', name: 'Лавочка у падика', icon: '🪑', x: 22, y: 50 },
  { id: 'garages', name: 'Ржавые гаражи', icon: '🏚️', x: 78, y: 48 },
  { id: 'hookah', name: 'Кальянная «Смоук»', icon: '💨', x: 18, y: 78 },
  { id: 'bus_stop', name: 'Остановка 404', icon: '🚌', x: 75, y: 76 },
];

const KAIRAT_QUOTES = [
  'Я тут, но меня нет!',
  'Ой, спалили!',
  'Ща в туалет отойду!',
  'Связь пропадает!',
  'Я уже уехал на такси!',
  'Не снимай на камеру!',
];

export const Level1FindKairat: React.FC<Level1Props> = ({ onComplete, onFail }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [puffSpot, setPuffSpot] = useState<string | null>(null);
  const [feedbackEffect, setFeedbackEffect] = useState<{ x: number; y: number; text: string } | null>(null);

  const timerRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);

  // Countdown timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(spawnTimerRef.current!);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [score]);

  // Kairat popping mechanics
  useEffect(() => {
    const spawnKairat = () => {
      const randomSpot = DISTRICT_SPOTS[Math.floor(Math.random() * DISTRICT_SPOTS.length)];
      const randomQuote = KAIRAT_QUOTES[Math.floor(Math.random() * KAIRAT_QUOTES.length)];

      setActiveSpotId(randomSpot.id);
      setCurrentQuote(randomQuote);
      sound.playTelegramNotification();

      // Disappear quickly if not caught
      const stayDuration = Math.max(900, 1600 - Math.floor(score / 50) * 80);
      spawnTimerRef.current = window.setTimeout(() => {
        setPuffSpot(randomSpot.id);
        setActiveSpotId(null);
        setCombo(1); // combo reset if missed
        setTimeout(() => setPuffSpot(null), 500);

        // Schedule next appearance
        setTimeout(spawnKairat, 600 + Math.random() * 800);
      }, stayDuration);
    };

    spawnKairat();

    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, []);

  const finishGame = () => {
    sound.stopMusic();
    if (score >= 500) {
      const stars = score >= 850 ? 3 : score >= 650 ? 2 : 1;
      onComplete(score, stars);
    } else {
      sound.playGameOver();
      onFail(score);
    }
  };

  const handleSpotClick = (spot: DistrictSpot, e: React.MouseEvent) => {
    const isKairatHere = activeSpotId === spot.id;

    if (isKairatHere) {
      sound.playCoin();
      sound.playHit();
      sound.triggerVibration(60);

      // Speak funny voice
      if (Math.random() > 0.4) {
        sound.speakQuote(currentQuote);
      }

      const points = 70 * combo;
      setScore((prev) => prev + points);
      setCombo((prev) => Math.min(prev + 1, 5));
      setActiveSpotId(null);
      setPuffSpot(spot.id);

      setFeedbackEffect({
        x: e.clientX || window.innerWidth / 2,
        y: e.clientY || window.innerHeight / 2,
        text: `+${points}! (x${combo})`,
      });

      setTimeout(() => setFeedbackEffect(null), 800);
      setTimeout(() => setPuffSpot(null), 400);

      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      setTimeout(() => {
        const nextSpot = DISTRICT_SPOTS[Math.floor(Math.random() * DISTRICT_SPOTS.length)];
        const nextQuote = KAIRAT_QUOTES[Math.floor(Math.random() * KAIRAT_QUOTES.length)];
        setActiveSpotId(nextSpot.id);
        setCurrentQuote(nextQuote);
        sound.playTelegramNotification();
      }, 400);
    } else {
      // Empty spot clicked
      sound.playClick();
      setCombo(1);
    }
  };

  return (
    <div className="relative w-full h-[calc(100dvh-54px)] flex flex-col bg-zinc-950 overflow-hidden select-none">
      {/* HUD Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 z-20">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-sm font-game text-white font-mono">{timeLeft}с</span>
        </div>

        <div className="flex items-center gap-2">
          {combo > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-game tracking-wider animate-bounce">
              x{combo} КОМБО!
            </span>
          )}
          <span className="text-sm font-game text-amber-400 font-mono">
            {score} / 500
          </span>
        </div>
      </div>

      {/* District Map Canvas */}
      <div className="relative flex-1 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden">
        {/* District street ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Spots grid */}
        {DISTRICT_SPOTS.map((spot) => {
          const isKairatHere = activeSpotId === spot.id;
          const isPuffing = puffSpot === spot.id;

          return (
            <div
              key={spot.id}
              onClick={(e) => handleSpotClick(spot, e)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center group touch-manipulation active:scale-95 transition-transform"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              {/* Comical popup message */}
              {isKairatHere && (
                <div className="absolute -top-12 z-30 px-2.5 py-1 rounded-xl bg-red-600 text-white text-[11px] font-game shadow-lg glow-red-sm whitespace-nowrap animate-bounce flex items-center gap-1 border border-red-300">
                  <span>💬</span>
                  <span>{currentQuote}</span>
                </div>
              )}

              {/* Spot Base */}
              <div
                className={`relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                  isKairatHere
                    ? 'bg-red-950/80 border-red-500 shadow-xl glow-red scale-110'
                    : 'bg-zinc-900/90 border-zinc-700/60 shadow-md'
                }`}
              >
                {isKairatHere ? (
                  <div className="relative flex flex-col items-center">
                    <span className="text-3xl animate-bounce">🧢</span>
                    <span className="text-xs font-game text-red-400 font-bold">
                      КАЙРАТ!
                    </span>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 absolute -top-1 -right-1 animate-ping" />
                  </div>
                ) : isPuffing ? (
                  <div className="flex flex-col items-center text-zinc-400 animate-spin">
                    <span className="text-3xl">💨</span>
                    <span className="text-[10px] font-bold text-zinc-500">Убежал!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl opacity-80">{spot.icon}</span>
                    <span className="text-[9px] font-medium text-zinc-400 text-center px-1 truncate max-w-[70px]">
                      {spot.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Floating feedback score popup */}
        {feedbackEffect && (
          <div
            className="fixed z-40 pointer-events-none text-base font-game text-amber-300 font-extrabold animate-bounce glow-amber"
            style={{
              left: feedbackEffect.x,
              top: feedbackEffect.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {feedbackEffect.text}
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="p-3 bg-zinc-900/95 border-t border-zinc-800 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
        <Eye className="w-4 h-4 text-red-400" />
        <span>Тапай по Кайрату, как только он высунет голову! Не дай ему свалить!</span>
      </div>
    </div>
  );
};
