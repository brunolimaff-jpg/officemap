import React, { useEffect, useRef } from 'react';
import DraggableWindow from './DraggableWindow';
import { ChatMessage, User } from './HabboClient';

interface ChatLogWindowProps {
  onClose: () => void;
  messages: ChatMessage[];
  users: User[];
}

export default function ChatLogWindow({ onClose, messages, users }: ChatLogWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <DraggableWindow title="Painel de Discussão" onClose={onClose} defaultX={window.innerWidth - 350} defaultY={100} width={320} height={400}>
      <div className="w-full h-full flex flex-col bg-[#EBEBEB] p-2 font-sans text-sm">
        <div className="flex-1 overflow-y-auto border border-[#999] bg-white p-2 space-y-2" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center mt-4 italic">Nenhuma mensagem ainda...</div>
          ) : (
            messages.map(msg => {
              const user = users.find(u => u.id === msg.userId);
              const isSystem = msg.userId === 'system';
              
              if (isSystem) {
                return (
                  <div key={msg.id} className="text-xs text-gray-500 italic text-center my-2">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col">
                  <span className="font-bold text-xs" style={{ color: user?.id === '1' ? '#4A90E2' : '#333' }}>
                    {user?.name || 'Desconhecido'}:
                  </span>
                  <span className="text-gray-800 bg-gray-100 p-1.5 rounded inline-block w-fit max-w-[90%] break-words">
                    {msg.text}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DraggableWindow>
  );
}
