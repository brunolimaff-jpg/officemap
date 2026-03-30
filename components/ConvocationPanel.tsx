import React, { useState } from 'react';
import DraggableWindow from './DraggableWindow';
import { Specialist } from '@/types';
import { specialists } from '@/data/specialists';

interface ConvocationPanelProps {
  onClose: () => void;
  onSummon: (selectedIds: string[]) => void;
}

export default function ConvocationPanel({ onClose, onSummon }: ConvocationPanelProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(sId => sId !== id)
        : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleSummon = () => {
    if (selected.length > 0) {
      onSummon(selected);
      onClose();
    }
  };

  return (
    <DraggableWindow title="Convocação de Especialistas" onClose={onClose} defaultX={150} defaultY={150} width={350} height={450}>
      <div className="w-full h-full flex flex-col bg-[#EBEBEB] p-2 font-sans text-sm">
        <div className="mb-2 text-black">
          Selecione até 5 especialistas para a Sala de Reuniões:
        </div>
        
        <div className="flex-1 overflow-y-auto border border-[#999] bg-white p-1">
          {specialists.map(specialist => (
            <div 
              key={specialist.id} 
              className={`p-2 border-b border-gray-200 cursor-pointer flex items-center justify-between ${selected.includes(specialist.id) ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
              onClick={() => toggleSelection(specialist.id)}
            >
              <div>
                <div className="font-bold text-black" style={{ color: specialist.color }}>{specialist.name}</div>
                <div className="text-xs text-gray-600">{specialist.role}</div>
              </div>
              <input 
                type="checkbox" 
                checked={selected.includes(specialist.id)} 
                readOnly
                className="w-4 h-4"
              />
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-600">{selected.length}/5 selecionados</span>
          <button 
            onClick={handleSummon}
            disabled={selected.length === 0}
            className={`px-4 py-2 text-white text-xs font-bold rounded border ${selected.length > 0 ? 'bg-[#4A90E2] border-[#2A60A2] hover:bg-[#3A80D2]' : 'bg-gray-400 border-gray-500 cursor-not-allowed'}`}
          >
            Convocar
          </button>
        </div>
      </div>
    </DraggableWindow>
  );
}
