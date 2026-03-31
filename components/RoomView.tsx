import React from 'react';
import { User } from './HabboClient';

interface RoomViewProps {
  users: User[];
  map: number[][];
  onTileClick: (x: number, y: number) => void;
}

export default function RoomView({ users, map, onTileClick }: RoomViewProps) {
  // Keep params as-is to avoid touching parent contract.
  void map;
  void onTileClick;

  const projectToPercent = (x: number, y: number) => {
    // Calibrated for the generated reference office background.
    const left = 52 + (x - y) * 1.85;
    const top = 20 + (x + y) * 1.18;
    return {
      left: Math.max(3, Math.min(97, left)),
      top: Math.max(6, Math.min(95, top)),
      zIndex: Math.round((x + y) * 10) + 20,
    };
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center pointer-events-none" style={{ height: 32 }}>
        <div className="px-4 py-1 font-pixel text-[9px] text-white tracking-wider" style={{
          background: 'linear-gradient(180deg,rgba(10,20,40,0.92),rgba(5,15,35,0.88))',
          border: '1px solid rgba(74,158,255,0.4)',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          textShadow: '0 1px 2px rgba(0,0,0,0.9)',
        }}>
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
            const p = projectToPercent(user.x, user.y);
            const habboDir = user.direction % 8;
            const avatarSrc =
              `https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}` +
              `&direction=${habboDir}&head_direction=${habboDir}&gesture=std&size=m`;

            return (
              <div
                key={user.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  transform: 'translate(-50%, -100%)',
                  zIndex: p.zIndex,
                }}
              >
                <div className="mb-0.5 px-1.5 py-px font-pixel text-[8px] font-bold text-white whitespace-nowrap rounded-sm border border-blue-300/40"
                  style={{ background: 'rgba(10,30,70,0.8)' }}>
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
