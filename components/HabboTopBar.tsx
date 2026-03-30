'use client';

import { RoomId } from '@/types';
import { rooms } from '@/data/specialists';

interface HabboTopBarProps {
  currentRoomId: RoomId;
}

export function HabboTopBar({ currentRoomId }: HabboTopBarProps) {
  const room = rooms.find(r => r.id === currentRoomId);

  return (
    <div
      className="flex items-center flex-shrink-0 px-4 gap-4"
      style={{
        height: 44,
        background: 'linear-gradient(180deg, #1E5B8A 0%, #154A72 60%, #0F3A5C 100%)',
        borderBottom: '2px solid #0A2840',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            border: '1px solid #92400E',
            color: '#1C1917',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          HH
        </div>
        <span
          className="font-pixel text-[9px] tracking-wider"
          style={{ color: '#FDE68A', textShadow: '0 0 10px #F59E0B60' }}
        >
          HABBO HOTEL
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-white/10" />

      {/* Current room */}
      <div className="flex items-center gap-2">
        <div
          className="px-2 py-0.5 rounded font-pixel text-[8px]"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#BAE6FD',
          }}
        >
          📍 {room?.name ?? 'Habbo Hotel'}
        </div>
      </div>

      {/* Right side: decorative status */}
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-pixel text-[7px] text-green-300">Online</span>
        </div>
        <div
          className="font-pixel text-[7px] px-2 py-0.5 rounded"
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#93C5FD',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          Bruno Lima
        </div>
      </div>
    </div>
  );
}
