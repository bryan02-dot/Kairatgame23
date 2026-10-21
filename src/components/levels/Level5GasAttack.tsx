import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, Wind, Zap } from 'lucide-react';
import { TouchControls } from '../TouchControls';
import { sound } from '../../services/sound';

interface Level5Props {
  onComplete: (score: number, stars: number) => void;
  onFail: (score: number) => void;
}

interface GasCloud {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  phrase: string;
}

interface Freshener {
  id: number;
  x: number;
  y: number;
  type: 'tree' | 'fan' | 'mask';
  icon: string;
}

const GAS_PHRASES = [
  'Вчерашний доширак!',
  'Слишком много перца!',
  'Откройте окно!',
  'Газовая тревога!',
  'Не дышите!',
];

export const Level5GasAttack: React.FC<Level5Props> = ({ onComplete, onFail }) => {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 75 });
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [hasMask, setHasMask] = useState(false);
  const [clouds, setClouds] = useState<GasCloud[]>([]);
  const [items, setItems] = useState<Freshener[]>([]);
  const [shakeScreen, setShakeScreen] = useState(false);

  const inputVelocity = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const nextId = useRef(1);

  // Jump / Fan blow action
  const handleFanBlow = () => {
    sound.playJump();
    // Repel nearest clouds
    setClouds((prev) =>
      prev.map((c) => {
        const dx = c.x - playerPos.x;
        const dy = c.y - playerPos.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 25) {
          return {
            ...c,
            speedX: (dx / (dist || 1)) * 40,
            speedY: (dy / (dist || 1)) * 40,
          };
        }
        return c;
      })
    );
  };

  useEffect(() => {
    let lastTime = performance.now();
    let cloudTimer = 0;
    let itemTimer = 0;

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update player position
      setPlayerPos((prev) => {
        const speed = 65;
        let nx = prev.x + inputVelocity.current.x * speed * dt;
        let ny = prev.y + inputVelocity.current.y * speed * dt;
        nx = Math.max(6, Math.min(94, nx));
        ny = Math.max(10, Math.min(85, ny));
        return { x: nx, y: ny };
      });

      // Spawn clouds
      cloudTimer += dt;
      if (cloudTimer > 1.2) {
        cloudTimer = 0;
        sound.playGasPuff();
        const newCloud: GasCloud = {
          id: nextId.current++,
          x: 10 + Math.random() * 80,
          y: -10,
          size: 45 + Math.random() * 20,
          speedX: (Math.random() - 0.5) * 15,
          speedY: 20 + Math.random() * 15,
          phrase: GAS_PHRASES[Math.floor(Math.random() * GAS_PHRASES.length)],
        };
        setClouds((prev) => [...prev, newCloud]);
      }

      // Spawn fresheners
      itemTimer += dt;
      if (itemTimer > 3.8) {
        itemTimer = 0;
        const types: Array<Freshener['type']> = ['tree', 'fan', 'mask'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        const icons = { tree: '🌲', fan: '🌀', mask: '🤿' };

        const newItem: Freshener = {
          id: nextId.current++,
          x: 15 + Math.random() * 70,
          y: -5,
          type: chosen,
          icon: icons[chosen],
        };
        setItems((prev) => [...prev, newItem]);
      }

      // Move clouds & collision
      setClouds((prev) => {
        const next: GasCloud[] = [];
        for (const c of prev) {
          const nx = c.x + c.speedX * dt;
          const ny = c.y + c.speedY * dt;

          const dist = Math.hypot(nx - playerPos.x, ny - playerPos.y);
          if (dist < 10) {
            if (hasMask) {
              sound.playHit();
              setHasMask(false);
            } else {
              sound.playHit();
              sound.playGasPuff();
              sound.triggerVibration(120);
              setShakeScreen(true);
              setTimeout(() => setShakeScreen(false), 250);

              setLives((l) => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  sound.playGameOver();
                  onFail(score);
                }
                return nextLives;
              });
            }
            continue;
          }

          if (ny < 110) {
            next.push({ ...c, x: nx, y: ny });
          } else {
            setScore((s) => s + 15);
          }
        }
        return next;
      });

      // Move items & collision
      setItems((prev) => {
        const next: Freshener[] = [];
        for (const item of prev) {
          const ny = item.y + 22 * dt;
          const dist = Math.hypot(item.x - playerPos.x, ny - playerPos.y);

          if (dist < 8) {
            sound.playCoin();
            sound.triggerVibration(40);
            if (item.type === 'mask') {
              setHasMask(true);
            } else if (item.type === 'fan') {
              // Clear clouds
              setClouds([]);
              setScore((s) => s + 80);
            } else {
              setScore((s) => s + 50);
            }
            continue;
          }

          if (ny < 110) {
            next.push({ ...item, y: ny });
          }
        }
        return next;
      });

      // Win threshold
      if (score >= 550) {
        const stars = lives === 3 ? 3 : lives === 2 ? 2 : 1;
        onComplete(score, stars);
        return;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playerPos, lives, score, hasMask]);

  return (
    <div
      className={`relative w-full h-[calc(100dvh-54px)] flex flex-col bg-zinc-950 overflow-hidden select-none ${
        shakeScreen ? 'animate-shake bg-emerald-950/40' : ''
      }`}
    >
      {/* Top HUD */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 z-20">
        <div className="flex items-center gap-1.5">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 ${
                i < lives
                  ? 'text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                  : 'text-zinc-700'
              }`}
            />
          ))}
          {hasMask && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-game flex items-center gap-1">
              🤿 ПРОТИВОГАЗ
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-bold">ЦЕЛЬ: 550</span>
          <span className="text-sm font-game text-amber-400 font-mono">
            {score}
          </span>
        </div>
      </div>

      {/* Play Area */}
      <div className="relative flex-1 bg-[radial-gradient(#14532d_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden">
        {/* Cartoon Toxic Clouds */}
        {clouds.map((c) => (
          <div
            key={c.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-transform"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <div className="px-2 py-0.5 rounded-full bg-emerald-900/90 border border-emerald-400 text-emerald-200 text-[9px] font-game shadow-md whitespace-nowrap mb-1">
              {c.phrase}
            </div>
            <div className="text-4xl filter drop-shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse">
              ☁️🤢
            </div>
          </div>
        ))}

        {/* Falling Collectibles */}
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-xl flex items-center justify-center glow-cyan pointer-events-none animate-bounce"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.icon}
          </div>
        ))}

        {/* Player */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-transform duration-75"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center text-2xl shadow-xl glow-cyan">
            {hasMask ? '🤿' : '🏃‍♂️'}
          </div>
          <span className="mt-1 px-1.5 py-0.5 rounded-md bg-zinc-900/90 text-[10px] font-game text-white border border-zinc-700">
            КАЙРАТ
          </span>
        </div>
      </div>

      {/* Mobile Controls */}
      <TouchControls
        onMove={(dx, dy) => {
          inputVelocity.current = { x: dx, y: dy };
        }}
        onAction={handleFanBlow}
        actionLabel="ВЕТЕРОК"
      />
    </div>
  );
};
