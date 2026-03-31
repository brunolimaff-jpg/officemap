import React from 'react';
import { User } from './HabboClient';
import type { AvatarStatus } from '@/types';

interface RoomViewProps {
  users: User[];
  map: number[][];
  onTileClick: (x: number, y: number) => void;
}

// Mapeia AvatarStatus → parâmetros Habbo API
// idle      → sentado olhando tela   (action=sit, gesture=eyb)
// speaking  → respondendo ativamente (action=sit, gesture=spk)
// summoned  → na sala de reunião     (gesture=wav)
// walking   → Bruno andando          (gesture=std)
function getHabboGestureParams(status: AvatarStatus): string {
  switch (status) {
    case 'idle':
      return '&action=sit&gesture=eyb';
    case 'speaking':
      return '&action=sit&gesture=spk';
    case 'summoned':
      return '&gesture=wav';
    case 'walking':
    default:
      return '&gesture=std';
  }
}

// Badge de status — aparece só quando relevante (speaking ou summoned)
function StatusBadge({ status }: { status: AvatarStatus }) {
  if (status === 'walking' || status === 'idle') return null;
  const config: Record<string, { label: string; color: string }> = {
    speaking:  { label: '🗣', color: '#7C3AED' },
    summoned:  { label: '📍', color: '#1D4ED8' },
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
  void map;
  void onTileClick;

  const projectToPercent = (x: number, y: number) => {
    const left = 52 + (x - y) * 1.85;
    const top  = 20 + (x + y) * 1.18;
    return {
      left: Math.max(3, Math.min(97, left)),
      top:  Math.max(6, Math.min(95, top)),
      zIndex: Math.round((x + y) * 10) + 20,
    };
  };

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
        <div className="relative h-full w-full max-w-[1365px] max-h-[768px]">
          <img
            src="/isometric-office-bg.png"
            alt="Office reference background"
            className="absolute inset-0 h-full w-full object-contain"
          />

          {users.map((user) => {
            const p            = projectToPercent(user.x, user.y);
            const habboDir     = user.direction % 8;
            const gestureParams = getHabboGestureParams(user.avatarStatus);

            const avatarSrc =
              `https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}` +
              `&direction=${habboDir}&head_direction=${habboDir}${gestureParams}&size=m`;

            return (
              <div
                key={user.id}
                className="absolute pointer-events-none flex flex-col items-center"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  transform: 'translate(-50%, -100%)',
                  zIndex: p.zIndex,
                }}
              >
                {/* Badge de status (só speaking e summoned) */}
                <StatusBadge status={user.avatarStatus} />

                {/* Nome */}
                <div
                  className="mb-0.5 px-1.5 py-px font-pixel text-[8px] font-bold text-white whitespace-nowrap rounded-sm border border-blue-300/40"
                  style={{ background: 'rgba(10,30,70,0.8)' }}
                >
                  {user.name}
                </div>

                {/* Avatar */}
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
