import React, { useEffect, useRef, useState } from 'react';

interface TouchControlsProps {
  onMove?: (dx: number, dy: number) => void;
  onAction?: () => void;
  actionLabel?: string;
  onSpecial?: () => void;
  specialLabel?: string;
  className?: string;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onAction,
  actionLabel = 'ДЕЙСТВИЕ',
  onSpecial,
  specialLabel,
  className = '',
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const activeTouchId = useRef<number | null>(null);

  // Keyboard support for desktop testing
  useEffect(() => {
    const keysPressed: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.code] = true;
      if (e.code === 'Space' && onAction) {
        e.preventDefault();
        onAction();
      }
      if ((e.code === 'KeyE' || e.code === 'ShiftLeft') && onSpecial) {
        e.preventDefault();
        onSpecial();
      }
      updateMoveFromKeys();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.code] = false;
      updateMoveFromKeys();
    };

    const updateMoveFromKeys = () => {
      let dx = 0;
      let dy = 0;
      if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) dx -= 1;
      if (keysPressed['KeyD'] || keysPressed['ArrowRight']) dx += 1;
      if (keysPressed['KeyW'] || keysPressed['ArrowUp']) dy -= 1;
      if (keysPressed['KeyS'] || keysPressed['ArrowDown']) dy += 1;

      if (onMove) {
        onMove(dx, dy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onMove, onAction, onSpecial]);

  // Touch handlers for dynamic joystick
  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    activeTouchId.current = touch.identifier;
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging && activeTouchId.current === null) return;
    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === activeTouchId.current
    );
    if (!touch || !joystickBaseRef.current) return;

    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rawDx = touch.clientX - centerX;
    const rawDy = touch.clientY - centerY;
    const maxRadius = rect.width / 2;

    const distance = Math.hypot(rawDx, rawDy);
    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(rawDy, rawDx);

    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: clampedX, y: clampedY });

    if (onMove) {
      // Normalize to -1 to 1
      const normX = clampedX / maxRadius;
      const normY = clampedY / maxRadius;
      onMove(normX, normY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === activeTouchId.current
    );
    if (touch) {
      activeTouchId.current = null;
      setIsDragging(false);
      setKnobPos({ x: 0, y: 0 });
      if (onMove) onMove(0, 0);
    }
  };

  return (
    <div
      className={`pointer-events-none select-none flex items-end justify-between px-4 pb-4 pt-2 z-30 ${className}`}
    >
      {/* Dynamic Virtual Joystick on Left */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="pointer-events-auto relative w-28 h-28 rounded-full bg-zinc-900/80 border-2 border-red-500/40 backdrop-blur-md flex items-center justify-center shadow-lg active:border-red-500/80 transition-colors"
        style={{ touchAction: 'none' }}
      >
        {/* Direction guides */}
        <div className="absolute top-1.5 w-1 h-2 bg-red-500/30 rounded-full" />
        <div className="absolute bottom-1.5 w-1 h-2 bg-red-500/30 rounded-full" />
        <div className="absolute left-1.5 h-1 w-2 bg-red-500/30 rounded-full" />
        <div className="absolute right-1.5 h-1 w-2 bg-red-500/30 rounded-full" />

        {/* Joystick Thumb Knob */}
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-700 to-red-500 border border-red-300/40 shadow-md flex items-center justify-center pointer-events-none transition-transform"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            boxShadow: isDragging ? '0 0 15px rgba(239, 68, 68, 0.8)' : 'none',
          }}
        >
          <div className="w-4 h-4 rounded-full bg-red-300/80" />
        </div>
      </div>

      {/* Action Buttons on Right */}
      <div className="pointer-events-auto flex items-center gap-3">
        {onSpecial && specialLabel && (
          <button
            type="button"
            onTouchStart={(e) => {
              e.preventDefault();
              onSpecial();
            }}
            onClick={onSpecial}
            className="w-16 h-16 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 text-white font-game text-xs flex flex-col items-center justify-center border-2 border-amber-300/50 shadow-lg active:scale-95 active:brightness-125 transition-transform"
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-base leading-none">⚡</span>
            <span className="mt-0.5 text-[10px] leading-tight font-bold text-center px-1">
              {specialLabel}
            </span>
          </button>
        )}

        {onAction && (
          <button
            type="button"
            onTouchStart={(e) => {
              e.preventDefault();
              onAction();
            }}
            onClick={onAction}
            className="w-20 h-20 rounded-full bg-gradient-to-b from-red-500 to-red-700 text-white font-game text-sm flex flex-col items-center justify-center border-2 border-red-300/50 shadow-xl glow-red-sm active:scale-95 active:brightness-125 transition-transform"
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-xl leading-none">💥</span>
            <span className="mt-1 text-xs font-bold leading-none tracking-wide text-center px-1">
              {actionLabel}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
