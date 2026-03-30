'use client';

import { SpecialistId } from '@/types';
import { specialists } from '@/data/specialists';
import { Users } from 'lucide-react';

interface HabboChatBarProps {
  selectedIds: SpecialistId[];
  onGroupConvoke: () => void;
  onClearSelection: () => void;
  onMeetingRoom: () => void;
}

export function HabboChatBar({
  selectedIds,
  onGroupConvoke,
  onClearSelection,
  onMeetingRoom,
}: HabboChatBarProps) {
  const selectedSpecialists = selectedIds
    .map(id => specialists.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div
      className="flex items-center flex-shrink-0 px-3 gap-2"
      style={{
        height: 48,
        background: 'linear-gradient(180deg, #0D1B2A 0%, #091420 100%)',
        borderTop: '2px solid #1E3A5F',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Selected specialists display */}
      {selectedSpecialists.length > 0 && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex -space-x-1">
            {selectedSpecialists.map(s => (
              <div
                key={s!.id}
                title={s!.name}
                className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0"
                style={{ backgroundColor: s!.color }}
              >
                {s!.name[0]}
              </div>
            ))}
          </div>
          <span className="font-pixel text-[7px] text-slate-400">
            {selectedSpecialists.length === 1
              ? selectedSpecialists[0]!.name
              : `${selectedSpecialists.length} selecionados`}
          </span>
        </div>
      )}

      {/* Group convocar button */}
      {selectedIds.length > 1 && (
        <button
          onClick={onGroupConvoke}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded font-pixel text-[7px] transition-all active:scale-95 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            border: '1px solid #8B5CF6',
            color: '#E9D5FF',
            boxShadow: '0 1px 6px #7C3AED40',
          }}
        >
          <Users size={10} />
          Convocar Grupo
        </button>
      )}

      {/* Clear selection */}
      {selectedIds.length > 0 && (
        <button
          onClick={onClearSelection}
          className="font-pixel text-[7px] px-2 py-1 rounded transition-all active:scale-95 flex-shrink-0"
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#FCA5A5',
          }}
        >
          ✕ Limpar
        </button>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Shift+click hint */}
      <div className="font-pixel text-[6px] text-slate-600 hidden sm:block">
        Shift+Click para selecionar múltiplos
      </div>

      {/* Meeting room button */}
      <button
        onClick={onMeetingRoom}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded font-pixel text-[7px] transition-all active:scale-95 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #1E5B8A, #154A72)',
          border: '1px solid #3B82F6',
          color: '#BAE6FD',
          boxShadow: '0 1px 6px #1E5B8A40',
        }}
      >
        🤝 Sala de Reunião
      </button>
    </div>
  );
}
