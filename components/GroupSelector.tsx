import { SpecialistId } from '@/types';
import { specialists } from '@/data/specialists';
import { Users, X } from 'lucide-react';

interface GroupSelectorProps {
  selectedIds: SpecialistId[];
  onConvoke: () => void;
  onClear: () => void;
}

export function GroupSelector({ selectedIds, onConvoke, onClear }: GroupSelectorProps) {
  if (selectedIds.length < 2) return null;

  const names = selectedIds.map((id) => specialists.find((s) => s.id === id)?.name).join(' + ');

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 habbo-window z-50 animate-in slide-in-from-bottom-10">
      <div className="habbo-header">
        <div className="flex items-center gap-2">
          <Users size={12} className="text-amber-400" />
          <span>Convocar Grupo</span>
        </div>
        <button onClick={onClear} className="hover:text-red-400">
          <X size={12} />
        </button>
      </div>
      
      <div className="p-3 flex items-center gap-6">
        <div className="flex items-center gap-3 text-black">
          <span className="font-pixel text-[10px] uppercase tracking-widest">
            Alvos: <span className="text-[#1E5B8A]">{names}</span>
          </span>
        </div>
        
        <button
          onClick={onConvoke}
          className="habbo-button"
        >
          Iniciar Sessão
        </button>
      </div>
    </div>
  );
}
