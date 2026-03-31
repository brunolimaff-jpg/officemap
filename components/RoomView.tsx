import React, { useRef, useCallback } from 'react';
import { User } from './HabboClient';
import type { AvatarStatus } from '@/types';

interface RoomViewProps {
  users: User[];
  map: number[][];
  onTileClick: (x: number, y: number) => void;
}

// ─── Calibração isométrica ─────────────────────────────────────────────────────
// Derivada por regressão linear sobre 6 avatares com posições conhecidas
// left% = OX + (x - y) * SX
// top%  = OY + (x + y) * SY
const OX = 56.8;   // origem horizontal (%)
const SX = 1.893;  // escala horizontal por tile
const OY = 31.4;   // origem vertical (%)
const SY = 0.887;  // escala vertical por tile

function projectToPercent(x: number, y: number) {
  const left = OX + (x - y) * SX;
  const top  = OY + (x + y) * SY;
  return {
    left: Math.max(2, Math.min(98, left)),
    top:  Math.max(4, Math.min(96, top)),
    zIndex: Math.round((x + y) * 10) + 20,
  };
}

// Fórmula inversa para converter clique (%) → tile (x, y)
function screenPercentToTile(leftPct: number, topPct: number): { x: number; y: number } {
  const diff = (leftPct - OX) / SX;  // x - y
  const sum  = (topPct  - OY) / SY;  // x + y
  return {
    x: Math.round((sum + diff) / 2),
    y: Math.round((sum - diff) / 2),
  };
}

// ─── Mapeia AvatarStatus → parâmetros Habbo API ───────────────────────────────
function getHabboGestureParams(status: AvatarStatus): string {
  switch (status) {
    case 'idle':     return '&action=sit&gesture=eyb';
    case 'speaking': return '&action=sit&gesture=spk';
    case 'summoned': return '&gesture=wav';
    case 'walking':
    default:         return '&gesture=std';
  }
}

// ─── Badge de status ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AvatarStatus }) {
  if (status === 'walking' || status === 'idle') return null;
  const config: Record<string, { label: string; color: string }> = {
    speaking: { label: '🗣', color: '#7C3AED' },
    summoned: { label: '📍', color: '#1D4ED8' },
  };
  const { label, color } = config[status] ?? { label: '', color: '#ccc' };
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 8,
        lineHeight: 1,
        padding: '2px 4px',
        borderRadius: 3,
        background: color,
        marginBottom: 2,
        fontWeight: 700,
        letterSpacing: '0.05em',
        boxShadow: `0 1px 4px ${color}80`,
      }}
    >
      {label}
    </span>
  );
}

export default function RoomView({ users, map, onTileClick }: RoomViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const leftPct = ((e.clientX - rect.left) / rect.width)  * 100;
      const topPct  = ((e.clientY - rect.top)  / rect.height) * 100;
      const { x, y } = screenPercentToTile(leftPct, topPct);
      const rows = map.length;
      const cols = map[0]?.length ?? 0;
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        onTileClick(x, y);
      }
    },
    [map, onTileClick]
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Bandeira topo */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center pointer-events-none"
        style={{ height: 32 }}
      >
        <div
          className="px-4 py-1 font-pixel text-[9px] text-white tracking-wider"
          style={{
            background: 'linear-gradient(180deg,rgba(10,20,40,0.92),rgba(5,15,35,0.88))',
            border: '1px solid rgba(74,158,255,0.4)',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            textShadow: '0 1px 2px rgba(0,0,0,0.9)',
          }}
        >
          🏢 BOARD ROOM — Senior Scout 360
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div
          ref={containerRef}
          className="relative h-full w-full max-w-[1365px] max-h-[768px] cursor-crosshair"
        >
          {/* Background */}
          <img
            src="/isometric-office-bg.png"
            alt="Office background"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
          />

          {/* Overlay clicável */}
          <div className="absolute inset-0 z-10" onClick={handleOverlayClick} />

          {/* Avatares */}
          {users.map((user) => {
            const p             = projectToPercent(user.x, user.y);
            const habboDir      = user.direction % 8;
            const gestureParams = getHabboGestureParams(user.avatarStatus);
            const isWalking     = user.avatarStatus === 'walking';
            const avatarSrc =
              `https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}` +
              `&direction=${habboDir}&head_direction=${habboDir}${gestureParams}&size=m`;

            return (
              <div
                key={user.id}
                className="absolute pointer-events-none flex flex-col items-center"
                style={{
                  left: `${p.left}%`,
                  top:  `${p.top}%`,
                  transform: 'translate(-50%, -100%)',
                  zIndex: p.zIndex + 10,
                  // Transition suaviza o deslizamento entre tiles durante caminhada
                  transition: isWalking
                    ? 'left 140ms linear, top 140ms linear'
                    : 'left 80ms ease-out, top 80ms ease-out',
                }}
              >
                <StatusBadge status={user.avatarStatus} />
                <div
                  className="mb-0.5 px-1.5 py-px font-pixel text-[8px] font-bold text-white whitespace-nowrap rounded-sm border border-blue-300/40"
                  style={{ background: 'rgba(10,30,70,0.8)' }}
                >
                  {user.name}
                </div>
                <img
                  src={avatarSrc}
                  alt={user.name}
                  className="h-[78px] w-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
