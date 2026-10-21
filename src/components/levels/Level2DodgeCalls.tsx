import React, { useEffect, useRef, useState } from 'react';
import { BatteryCharging, Heart, Shield, Zap } from 'lucide-react';
import { TouchControls } from '../TouchControls';
import { sound } from '../../services/sound';

interface Level2Props {
  onComplete: (score: number, stars: number) => void;
  onFail: (score: number) => void;
}

interface Obstacle {
  id: number;
  type: 'call' | 'msg' | 'voice' | 'angry';
  text: string;
  icon: string;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  speed: number;
  size: number;
}

interface Powerup {
  id: number;
  type: 'airplane' | 'hangup' | 'battery' | 'coin';
  icon: string;
  x: number;
  y: number;
  speed: number;
}

const OBSTACLE_TEXTS = [
  { text: 'МАМА ЗВОНИТ (99+)', icon: '📞', type: 'call' as const },
  { text: 'Ты где?! Мы ждём!', icon: '💬', type: 'msg' as const },
  { text: 'Голосовое (12:45 мин)', icon: '🎙️', type: 'voice' as const },
  { text: '«Я у твоего падика!»', icon: '🚨', type: 'msg' as const },
  { text: 'АЛЛО БРАТ ОТВЕТЬ', icon: '😡', type: 'angry' as const },
  { text: 'Срочный сбор в гаражах!', icon: '⚠️', type: 'msg' as const },
];

export const Level2DodgeCalls: React.FC<Level2Props> = ({ onComplete, onFail }) => {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 75 });
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [slowActive, setSlowActive] = useState(false);
  const [isHitAnim, setIsHitAnim] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerups, setPowerups] = useState<Powerup[]>([]);

  const inputVelocity = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const nextId = useRef(1);

  // Dash action
  const handleDash = () => {
    sound.playJump();
    setPlayerPos((prev) => ({
      ...prev,
      y: Math.max(10, prev.y - 20),
    }));
  };

  // Main game physics loop
  useEffect(() => {
    let lastTime = performance.now();
    let spawnTimer = 0;
    let powerupTimer = 0;

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update player pos from touch input
      setPlayerPos((prev) => {
        const speed = 65; // % per second
        let newX = prev.x + inputVelocity.current.x * speed * dt;
        let newY = prev.y + inputVelocity.current.y * speed * dt;

        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(10, Math.min(85, newY));
        return { x: newX, y: newY };
      });

      // Spawn obstacles
      spawnTimer += dt;
      const spawnInterval = slowActive ? 1.4 : Math.max(0.45, 0.9 - score / 1000);
      if (spawnTimer > spawnInterval) {
        spawnTimer = 0;
        const item = OBSTACLE_TEXTS[Math.floor(Math.random() * OBSTACLE_TEXTS.length)];
        const newObs: Obstacle = {
          id: nextId.current++,
          type: item.type,
          text: item.text,
          icon: item.icon,
          x: 10 + Math.random() * 80,
          y: -5,
          speed: (slowActive ? 18 : 32) + Math.random() * 15,
          size: 40,
        };
        setObstacles((prev) => [...prev, newObs]);
      }

      // Spawn powerups
      powerupTimer += dt;
      if (powerupTimer > 4.5) {
        powerupTimer = 0;
        const pTypes: Array<Powerup['type']> = ['airplane', 'hangup', 'battery', 'coin'];
        const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
        const icons = { airplane: '✈️', hangup: '📵', battery: '🔋', coin: '🪙' };

        const newP: Powerup = {
          id: nextId.current++,
          type: pType,
          icon: icons[pType],
          x: 15 + Math.random() * 70,
          y: -5,
          speed: 25,
        };
        setPowerups((prev) => [...prev, newP]);
      }

      // Move obstacles & collision
      setObstacles((prev) => {
        const next: Obstacle[] = [];
        for (const obs of prev) {
          const updatedY = obs.y + obs.speed * dt;

          // Check collision with player
          const dist = Math.hypot(obs.x - playerPos.x, updatedY - playerPos.y);
          if (dist < 8) {
            if (shieldActive) {
              sound.playHit();
              // Shield absorbed
            } else {
              sound.playHit();
              sound.triggerVibration(150);
              setIsHitAnim(true);
              setTimeout(() => setIsHitAnim(false), 300);

              setLives((l) => {
                const updatedLives = l - 1;
                if (updatedLives <= 0) {
                  sound.playGameOver();
                  onFail(score);
                }
                return updatedLives;
              });
            }
            continue; // Destroy on hit
          }

          if (updatedY < 105) {
            next.push({ ...obs, y: updatedY });
          } else {
            // Dodged successfully!
            setScore((s) => s + 10);
          }
        }
        return next;
      });

      // Move powerups & collision
      setPowerups((prev) => {
        const next: Powerup[] = [];
        for (const p of prev) {
          const updatedY = p.y + p.speed * dt;
          const dist = Math.hypot(p.x - playerPos.x, updatedY - playerPos.y);

          if (dist < 8) {
            sound.playCoin();
            sound.triggerVibration(50);

            if (p.type === 'airplane') {
              sound.playPowerup();
              setShieldActive(true);
              setTimeout(() => setShieldActive(false), 5000);
            } else if (p.type === 'hangup') {
              sound.playPowerup();
              // Clear current screen of obstacles!
              setObstacles([]);
              setScore((s) => s + 60);
            } else if (p.type === 'battery') {
              setLives((l) => Math.min(3, l + 1));
            } else if (p.type === 'coin') {
              setScore((s) => s + 50);
            }
            continue;
          }

          if (updatedY < 105) {
            next.push({ ...p, y: updatedY });
          }
        }
        return next;
      });

      // Win condition
      if (score >= 450) {
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
  }, [playerPos, shieldActive, slowActive, lives, score]);

  return (
    <div
      className={`relative w-full h-[calc(100dvh-54px)] flex flex-col bg-zinc-950 overflow-hidden select-none ${
        isHitAnim ? 'animate-shake bg-red-950/30' : ''
      }`}
    >
      {/* Top HUD */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 z-20">
        <div className="flex items-center gap-1">
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
          {shieldActive && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-game flex items-center gap-1 animate-pulse">
              <Shield className="w-3 h-3" /> АВИАРЕЖИМ
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-bold">ЦЕЛЬ: 450</span>
          <span className="text-sm font-game text-amber-400 font-mono">
            {score}
          </span>
        </div>
      </div>

      {/* Dodge Playground */}
      <div className="relative flex-1 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] overflow-hidden">
        {/* Falling Obstacles */}
        {obstacles.map((obs) => (
          <div
            key={obs.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-zinc-900/95 border border-red-500/60 shadow-lg text-white flex items-center gap-1.5 whitespace-nowrap glow-red-sm pointer-events-none"
            style={{ left: `${obs.x}%`, top: `${obs.y}%` }}
          >
            <span className="text-sm">{obs.icon}</span>
            <span className="text-[11px] font-game text-red-300 font-bold tracking-wide">
              {obs.text}
            </span>
          </div>
        ))}

        {/* Falling Powerups */}
        {powerups.map((p) => (
          <div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-amber-500/20 border-2 border-amber-400 text-xl flex items-center justify-center glow-amber shadow-lg pointer-events-none animate-bounce"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {p.icon}
          </div>
        ))}

        {/* Player: Kairat Dodging */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-transform duration-75"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          {shieldActive && (
            <div className="absolute -inset-3 rounded-full border-2 border-cyan-400 bg-cyan-500/20 animate-pulse glow-cyan" />
          )}

          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border-2 border-red-500 flex items-center justify-center text-2xl shadow-xl glow-red-sm">
            🧢
          </div>
          <span className="mt-1 px-1.5 py-0.5 rounded-md bg-zinc-900/90 text-[10px] font-game text-white border border-zinc-700">
            КАЙРАТ
          </span>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <TouchControls
        onMove={(dx, dy) => {
          inputVelocity.current = { x: dx, y: dy };
        }}
        onAction={handleDash}
        actionLabel="РЫВОК"
      />
    </div>
  );
};
