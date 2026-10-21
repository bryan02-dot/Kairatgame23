import React, { useEffect, useRef, useState } from 'react';
import { Eye, Key, Shield, Sparkles } from 'lucide-react';
import { TouchControls } from '../TouchControls';
import { sound } from '../../services/sound';

interface Level4Props {
  onComplete: (score: number, stars: number) => void;
  onFail: (score: number) => void;
}

interface SecretItem {
  id: number;
  name: string;
  icon: string;
  x: number;
  y: number;
  collected: boolean;
}

interface PatrolAuntie {
  id: number;
  x: number;
  y: number;
  radius: number;
  direction: number;
  speed: number;
}

export const Level4SecretMission: React.FC<Level4Props> = ({ onComplete, onFail }) => {
  const [playerPos, setPlayerPos] = useState({ x: 15, y: 80 });
  const [isHiding, setIsHiding] = useState(false);
  const [score, setScore] = useState(0);
  const [alertLevel, setAlertLevel] = useState(0); // 0 to 100
  const [collectedCount, setCollectedCount] = useState(0);

  const inputVelocity = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  const [items, setItems] = useState<SecretItem[]>([
    { id: 1, name: 'Секретная шаурма', icon: '🌯', x: 25, y: 35, collected: false },
    { id: 2, name: 'Флешка с секретами', icon: '💾', x: 80, y: 25, collected: false },
    { id: 3, name: 'Ключ от всех падиков', icon: '🔑', x: 75, y: 70, collected: false },
    { id: 4, name: 'Секретные чипсы', icon: '🥔', x: 45, y: 55, collected: false },
  ]);

  const [patrols, setPatrols] = useState<PatrolAuntie[]>([
    { id: 1, x: 50, y: 30, radius: 18, direction: 1, speed: 22 },
    { id: 2, x: 50, y: 70, radius: 18, direction: -1, speed: 26 },
  ]);

  const handleCrouch = () => {
    sound.playClick();
    setIsHiding((prev) => !prev);
  };

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Move player if not hiding
      if (!isHiding) {
        setPlayerPos((prev) => {
          const speed = 55;
          let newX = prev.x + inputVelocity.current.x * speed * dt;
          let newY = prev.y + inputVelocity.current.y * speed * dt;
          newX = Math.max(8, Math.min(92, newX));
          newY = Math.max(12, Math.min(88, newY));
          return { x: newX, y: newY };
        });
      }

      // Move patrol spotlights
      setPatrols((prev) =>
        prev.map((p) => {
          let newX = p.x + p.direction * p.speed * dt;
          let newDir = p.direction;
          if (newX > 85) {
            newX = 85;
            newDir = -1;
          } else if (newX < 15) {
            newX = 15;
            newDir = 1;
          }
          return { ...p, x: newX, direction: newDir };
        })
      );

      // Check detection by spotlights
      if (!isHiding) {
        for (const p of patrols) {
          const dist = Math.hypot(p.x - playerPos.x, p.y - playerPos.y);
          if (dist < p.radius) {
            // In spotlight!
            sound.triggerVibration(40);
            setAlertLevel((a) => {
              const nextAlert = a + dt * 45;
              if (nextAlert >= 100) {
                sound.playGameOver();
                sound.speakQuote('Кайрат, стой! Ты куда пошел ночью?!');
                onFail(score);
              }
              return Math.min(100, nextAlert);
            });
            break;
          }
        }
      } else {
        // Cooldown alert when hiding
        setAlertLevel((a) => Math.max(0, a - dt * 25));
      }

      // Item pickup
      setItems((prev) => {
        let changed = false;
        const next = prev.map((item) => {
          if (!item.collected) {
            const dist = Math.hypot(item.x - playerPos.x, item.y - playerPos.y);
            if (dist < 8) {
              changed = true;
              sound.playCoin();
              sound.triggerVibration(60);
              setScore((s) => s + 125);
              setCollectedCount((c) => {
                const updated = c + 1;
                if (updated === 4) {
                  // Collected all 4 items!
                  setTimeout(() => {
                    sound.playVictoryFanfare();
                    onComplete(500 + Math.floor((100 - alertLevel) * 2), 3);
                  }, 400);
                }
                return updated;
              });
              return { ...item, collected: true };
            }
          }
          return item;
        });
        return changed ? next : prev;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playerPos, isHiding, patrols, score, alertLevel]);

  return (
    <div className="relative w-full h-[calc(100dvh-54px)] flex flex-col bg-zinc-950 overflow-hidden select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 z-20">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">
            Тревога соседей
          </span>
          <div className="w-28 h-2.5 rounded-full bg-zinc-800 overflow-hidden mt-0.5">
            <div
              className={`h-full transition-all duration-200 ${
                alertLevel > 60 ? 'bg-red-500 animate-pulse' : 'bg-amber-400'
              }`}
              style={{ width: `${alertLevel}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-game text-white">
            ПРЕДМЕТЫ: {collectedCount}/4
          </span>
          <span className="text-sm font-game text-amber-400 font-mono">
            {score}
          </span>
        </div>
      </div>

      {/* District Night Canvas */}
      <div className="relative flex-1 bg-zinc-950 overflow-hidden">
        {/* Dark street fog */}
        <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Patrol Spotlights (Neighbor flashlights) */}
        {patrols.map((p) => (
          <div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-transform"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.radius * 2.2}vw`,
              height: `${p.radius * 2.2}vw`,
              maxWidth: '140px',
              maxHeight: '140px',
              background:
                'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.05) 70%, transparent 100%)',
              boxShadow: '0 0 35px rgba(239, 68, 68, 0.35)',
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm opacity-80 animate-spin">
              🔦
            </div>
          </div>
        ))}

        {/* Collectible Secret Items */}
        {items.map((item) => {
          if (item.collected) return null;
          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border-2 border-amber-400/80 flex items-center justify-center text-xl shadow-lg glow-amber">
                {item.icon}
              </div>
              <span className="text-[9px] font-game text-amber-300 font-bold mt-1 px-1 rounded bg-black/80 whitespace-nowrap">
                {item.name}
              </span>
            </div>
          );
        })}

        {/* Player: Kairat in stealth */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-transform duration-75"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          {isHiding ? (
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border-2 border-emerald-400 flex items-center justify-center text-2xl shadow-xl glow-emerald">
              📦
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border-2 border-red-500 flex items-center justify-center text-2xl shadow-xl glow-red-sm">
              🕶️
            </div>
          )}
          <span className="mt-1 px-1.5 py-0.5 rounded-md bg-zinc-900/90 text-[9px] font-game text-zinc-300 border border-zinc-700">
            {isHiding ? 'СПРЯТАЛСЯ В КОРОБКУ' : 'КАЙРАТ'}
          </span>
        </div>
      </div>

      {/* Touch Controls */}
      <TouchControls
        onMove={(dx, dy) => {
          inputVelocity.current = { x: dx, y: dy };
        }}
        onAction={handleCrouch}
        actionLabel={isHiding ? 'ВЫЛЕЗТИ' : 'СПРЯТАТЬСЯ'}
      />
    </div>
  );
};
