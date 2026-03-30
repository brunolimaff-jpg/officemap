'use client';

import { RoomId } from '@/types';
import { rooms, specialists } from '@/data/specialists';

interface HabboNavigatorProps {
  currentRoom: RoomId;
  onRoomChange: (id: RoomId) => void;
}

const roomIcons: Record<RoomId, string> = {
  director:    '👑',
  meeting:     '🤝',
  strategy:    '📈',
  data:        '🤖',
  product:     '🎨',
  engineering: '⚙️',
};

export function HabboNavigator({ currentRoom, onRoomChange }: HabboNavigatorProps) {
  const allRooms = rooms;

  function getOccupants(roomId: RoomId): string[] {
    if (roomId === 'director') return ['Bruno'];
    if (roomId === 'meeting') return specialists.map(s => s.name);
    return specialists.filter(s => s.homeRoomId === roomId).map(s => s.name);
  }

  return (
    <div
      className="flex flex-col w-[180px] flex-shrink-0 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #0D1B2A 0%, #0A1520 100%)',
        borderRight: '2px solid #1E3A5F',
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 font-pixel text-[8px] text-center tracking-widest uppercase"
        style={{
          background: '#1E3A5F',
          borderBottom: '2px solid #0F2840',
          color: '#93C5FD',
          textShadow: '0 0 8px #3B82F680',
        }}
      >
        Navigator
      </div>

      {/* Room list */}
      <div className="flex flex-col gap-0.5 p-2">
        {allRooms.map(room => {
          const isActive = currentRoom === room.id;
          const occupants = getOccupants(room.id);
          const icon = roomIcons[room.id];

          return (
            <button
              key={room.id}
              onClick={() => onRoomChange(room.id)}
              className="w-full text-left rounded transition-all duration-150 group"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #1E5B8A, #1E3A5F)'
                  : 'rgba(255,255,255,0.03)',
                border: isActive ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: isActive ? '0 0 8px #3B82F640, inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span className="text-sm flex-shrink-0">{icon}</span>
                <div className="min-w-0">
                  <div
                    className="font-pixel text-[7px] truncate leading-tight"
                    style={{ color: isActive ? '#BFDBFE' : '#64748B' }}
                  >
                    {room.name}
                  </div>
                  <div className="text-[6px] mt-0.5 truncate" style={{ color: isActive ? '#6B8EAA' : '#334155' }}>
                    {occupants.slice(0, 3).join(', ')}
                    {occupants.length > 3 ? ` +${occupants.length - 3}` : ''}
                  </div>
                </div>
              </div>
              {/* Active indicator */}
              {isActive && (
                <div
                  className="h-0.5 w-full"
                  style={{ background: 'linear-gradient(90deg, #3B82F6, transparent)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Meeting room CTA */}
      <div className="mt-auto p-2">
        <button
          onClick={() => onRoomChange('meeting')}
          className="w-full font-pixel text-[7px] py-2 rounded transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            border: '1px solid #8B5CF6',
            color: '#E9D5FF',
            boxShadow: '0 2px 8px #7C3AED40',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          🤝 Reunião Geral
        </button>
      </div>
    </div>
  );
}
