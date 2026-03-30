import React from 'react';
import DraggableWindow from './DraggableWindow';
import { ChatSession } from '@/hooks/useChatHistory';

interface HistoryWindowProps {
  onClose: () => void;
  sessions: ChatSession[];
  onLoadSession: (id: string) => void;
  onNewSession: () => void;
}

export default function HistoryWindow({ onClose, sessions, onLoadSession, onNewSession }: HistoryWindowProps) {
  return (
    <DraggableWindow title="Histórico de Conversas" onClose={onClose} defaultX={100} defaultY={100} width={300} height={400}>
      <div className="w-full h-full flex flex-col bg-[#EBEBEB] p-2 font-sans text-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-black">Sessões Anteriores</h3>
          <button 
            onClick={onNewSession}
            className="px-2 py-1 bg-[#4A90E2] text-white text-xs rounded border border-[#2A60A2] hover:bg-[#3A80D2]"
          >
            Nova Sessão
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto border border-[#999] bg-white p-1">
          {sessions.length === 0 ? (
            <div className="text-gray-500 text-center mt-4">Nenhum histórico encontrado.</div>
          ) : (
            sessions.map(session => (
              <div 
                key={session.id} 
                className="p-2 border-b border-gray-200 hover:bg-blue-50 cursor-pointer"
                onClick={() => onLoadSession(session.id)}
              >
                <div className="font-bold text-black">{session.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(session.date).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {session.messages.length} mensagens
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DraggableWindow>
  );
}
