import React, { useEffect, useRef, useState } from 'react';
import { Flame, Heart, Shield, Sparkles, Volume2, Zap } from 'lucide-react';
import { TouchControls } from '../TouchControls';
import { sound } from '../../services/sound';

interface BossLevelProps {
  onComplete: (score: number, stars: number) => void;
  onFail: (score: number) => void;
}

interface BossProjectile {
  id: number;
  text: string;
  icon: string;
  x: number;
  y: number;
  speed: number;
  color: string;
}

interface PlayerBullet {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const Level6BossKairat: React.FC<BossLevelProps> = ({ onComplete, onFail }) => {
  const [bossHp, setBossHp] = useState(1000);
  const maxBossHp = 1000;
  const [playerHp, setPlayerHp] = useState(4);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 78 });
  const [bossX, setBossX] = useState(50);
  const [bossPhrase, setBossPhrase] = useState('ПОТОМ ОТВЕЧУ!');
  const [bossShield, setBossShield] = useState(false);
  const [bossStunned, setBossStunned] = useState(false);
  const [shake, setShake] = useState(false);
  const [projectiles, setProjectiles] = useState<BossProjectile[]>([]);
  const [playerBullets, setPlayerBullets] = useState<PlayerBullet[]>([]);
  const [score, setScore] = useState(0);

  const inputVelocity = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const nextId = useRef(1);

  // Attack phrase cycles
  const currentPhase = bossHp > 650 ? 1 : bossHp > 300 ? 2 : 3;

  // Player shoots a Reality Check projectile
  const handlePlayerAttack = () => {
    sound.playHit();
    sound.triggerVibration(40);
    const phrases = ['ТЫ ОБЕЩАЛ!', 'МЫ У ПАДИКА!', 'ЗВОНОК ОТ МАМЫ!', 'СКОЛЬКО МОЖНО?!'];
    const text = phrases[Math.floor(Math.random() * phrases.length)];

    setPlayerBullets((prev) => [
      ...prev,
      {
        id: nextId.current++,
        text,
        x: playerPos.x,
        y: playerPos.y - 8,
      },
    ]);
  };

  // Special Action: Truth Megaphone (Stun boss)
  const handleSpecialCall = () => {
    if (bossStunned) return;
    sound.playPhoneRing();
    sound.speakQuote('Абонент временно недоступен!');
    setBossStunned(true);
    setBossPhrase('ОЙ, СВЯЗЬ ПРОПАДАЕТ... ОГЛУШЕН!');
    setTimeout(() => {
      setBossStunned(false);
    }, 2000);
  };

  useEffect(() => {
    let lastTime = performance.now();
    let bossAttackTimer = 0;
    let bossMoveDir = 1;

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Player Movement
      setPlayerPos((prev) => {
        const speed = 70;
        let nx = prev.x + inputVelocity.current.x * speed * dt;
        let ny = prev.y + inputVelocity.current.y * speed * dt;
        nx = Math.max(6, Math.min(94, nx));
        ny = Math.max(45, Math.min(88, ny));
        return { x: nx, y: ny };
      });

      // Boss Sway Movement
      if (!bossStunned) {
        setBossX((prev) => {
          let nx = prev + bossMoveDir * (25 + currentPhase * 8) * dt;
          if (nx > 80) bossMoveDir = -1;
          if (nx < 20) bossMoveDir = 1;
          return nx;
        });
      }

      // Boss Attack Cycle
      bossAttackTimer += dt;
      const attackInterval = currentPhase === 3 ? 0.7 : currentPhase === 2 ? 1.0 : 1.4;

      if (!bossStunned && bossAttackTimer > attackInterval) {
        bossAttackTimer = 0;
        sound.playBossLaser();

        let phrase = '«Потом отвечу!»';
        if (currentPhase === 2) phrase = '«Я уже выхожу!»';
        if (currentPhase === 3) phrase = '«Брат, сейчас!»';

        setBossPhrase(phrase);
        if (Math.random() > 0.6) {
          sound.speakQuote(phrase);
        }

        // Emit projectile
        const newProj: BossProjectile = {
          id: nextId.current++,
          text: phrase,
          icon: currentPhase === 3 ? '⚡' : currentPhase === 2 ? '📵' : '💬',
          x: bossX,
          y: 22,
          speed: 35 + currentPhase * 10,
          color: currentPhase === 3 ? '#ef4444' : '#f59e0b',
        };
        setProjectiles((prev) => [...prev, newProj]);
      }

      // Move player bullets upwards & check boss collision
      setPlayerBullets((prev) => {
        const next: PlayerBullet[] = [];
        for (const bullet of prev) {
          const ny = bullet.y - 70 * dt;

          // Check hit on Boss
          const distToBoss = Math.hypot(bullet.x - bossX, ny - 18);
          if (distToBoss < 16) {
            sound.playHit();
            sound.triggerVibration(70);
            setScore((s) => s + 50);

            setBossHp((hp) => {
              const damage = 65;
              const nextHp = Math.max(0, hp - damage);
              if (nextHp <= 0) {
                // VICTORY OVER BOSS!
                setTimeout(() => {
                  onComplete(score + 1000, 3);
                }, 400);
              }
              return nextHp;
            });
            continue; // Bullet consumed
          }

          if (ny > 5) {
            next.push({ ...bullet, y: ny });
          }
        }
        return next;
      });

      // Move boss projectiles & player collision
      setProjectiles((prev) => {
        const next: BossProjectile[] = [];
        for (const p of prev) {
          const ny = p.y + p.speed * dt;

          const distToPlayer = Math.hypot(p.x - playerPos.x, ny - playerPos.y);
          if (distToPlayer < 9) {
            sound.playHit();
            sound.triggerVibration([100, 50, 100]);
            setShake(true);
            setTimeout(() => setShake(false), 300);

            setPlayerHp((hp) => {
              const updatedHp = hp - 1;
              if (updatedHp <= 0) {
                sound.playGameOver();
                onFail(score);
              }
              return updatedHp;
            });
            continue;
          }

          if (ny < 105) {
            next.push({ ...p, y: ny });
          } else {
            setScore((s) => s + 15);
          }
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playerPos, bossX, bossHp, playerHp, bossStunned, currentPhase, score]);

  return (
    <div
      className={`relative w-full h-[calc(100dvh-54px)] flex flex-col bg-zinc-950 overflow-hidden select-none ${
        shake ? 'animate-shake bg-red-950/40' : ''
      }`}
    >
      {/* Top HUD: Boss Health Bar */}
      <div className="px-4 py-2.5 bg-zinc-950/95 border-b border-red-500/40 z-20">
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base animate-pulse">👑</span>
            <span className="font-game text-white tracking-wider">
              БОСС КАЙРАТ [ФАЗА {currentPhase}/3]
            </span>
          </div>
          <span className="font-mono text-red-400 font-bold">
            {bossHp} / {maxBossHp} HP
          </span>
        </div>

        {/* Boss HP Bar */}
        <div className="w-full h-3.5 rounded-full bg-zinc-900 border border-red-500/50 p-0.5 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-150 glow-red"
            style={{ width: `${(bossHp / maxBossHp) * 100}%` }}
          />
        </div>

        {/* Player Lives HUD */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < playerHp
                    ? 'text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                    : 'text-zinc-700'
                }`}
              />
            ))}
          </div>

          <span className="font-game text-amber-400 font-mono">
            ОЧКИ: {score}
          </span>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="relative flex-1 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden">
        {/* Boss Kairat Avatar */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform"
          style={{ left: `${bossX}%`, top: '8%' }}
        >
          {/* Boss dialogue bubble */}
          <div className="px-3 py-1 rounded-2xl bg-red-600 text-white font-game text-xs shadow-xl glow-red whitespace-nowrap mb-2 animate-bounce border border-red-300">
            💬 {bossPhrase}
          </div>

          <div className="relative w-24 h-24 rounded-3xl bg-zinc-900 border-4 border-red-500 flex items-center justify-center text-5xl shadow-2xl glow-red overflow-hidden">
            <span className="scale-125 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]">
              {bossStunned ? '😵‍💫' : '😈'}
            </span>
            <div className="absolute top-1 left-2 text-xs font-game text-amber-400 font-extrabold">
              LVL.99
            </div>
          </div>
        </div>

        {/* Boss Projectiles */}
        {projectiles.map((p) => (
          <div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-2xl bg-zinc-900/95 border-2 text-white font-game text-xs flex items-center gap-1 shadow-xl glow-red-sm pointer-events-none whitespace-nowrap"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              borderColor: p.color,
            }}
          >
            <span>{p.icon}</span>
            <span className="tracking-wide">{p.text}</span>
          </div>
        ))}

        {/* Player Bullets (Reality checks) */}
        {playerBullets.map((b) => (
          <div
            key={b.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-game text-[11px] font-black shadow-lg glow-amber pointer-events-none whitespace-nowrap"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            ⚡ {b.text}
          </div>
        ))}

        {/* Player */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-transform duration-75"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-xl glow-amber">
            🤺
          </div>
          <span className="mt-1 px-1.5 py-0.5 rounded-md bg-zinc-900/90 text-[10px] font-game text-amber-300 border border-zinc-700">
            ТЫ
          </span>
        </div>
      </div>

      {/* Mobile Controls */}
      <TouchControls
        onMove={(dx, dy) => {
          inputVelocity.current = { x: dx, y: dy };
        }}
        onAction={handlePlayerAttack}
        actionLabel="ФАКТ В ЛИЦО"
        onSpecial={handleSpecialCall}
        specialLabel={bossStunned ? 'ОГЛУШЕН' : 'ЗВОНОК'}
      />
    </div>
  );
};
