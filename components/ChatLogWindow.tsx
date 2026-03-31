import React, { useEffect, useRef } from 'react';
import DraggableWindow from './DraggableWindow';
import { ChatMessage, User } from './HabboClient';

interface ChatLogWindowProps {
  onClose: () => void;
  messages: ChatMessage[];
  users: User[];
}

const SPECIALIST_COLORS: Record<string, string> = {
  satya: '#0078D4', uncle_bob: '#DC2626', karpathy: '#7C3AED', rogati: '#059669',
  osmani: '#F59E0B', whittaker: '#EF4444', dixon: '#06B6D4', dodds: '#EC4899',
  rauch: '#60A5FA', rodrigues: '#16A34A', kozyrkov: '#8B5CF6', cagan: '#F97316',
  grove: '#94A3B8', '1': '#4A90E2',
};

// Converte markdown básico para HTML seguro (sem biblioteca externa)
// Suporta: **bold**, `code`, \n -> <br>, mas sanitiza < > para evitar XSS
function markdownToHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:#1e293b;color:#7dd3fc;padding:1px 4px;border-radius:3px;font-size:0.9em">$1</code>')
    .replace(/\n/g, '<br />');
}

export default function ChatLogWindow({ onClose, messages, users }: ChatLogWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <DraggableWindow
      title="Painel de Discussão"
      onClose={onClose}
      defaultX={typeof window !== 'undefined' ? window.innerWidth - 370 : 900}
      defaultY={80}
      width={350}
      height={460}
    >
      <div className="w-full h-full flex flex-col bg-[#0a0f1e] font-sans text-sm">
        <div
          className="flex-1 overflow-y-auto p-2 space-y-2"
          ref={scrollRef}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 #0a0f1e' }}
        >
          {messages.length === 0 ? (
            <div className="text-slate-500 text-center mt-6 text-xs italic">
              Convoque um especialista e comece a conversa...
            </div>
          ) : (
            messages.map(msg => {
              const isSystem  = msg.userId === 'system';
              const isBruno   = msg.userId === '1';
              const specColor = SPECIALIST_COLORS[msg.userId] ?? '#94A3B8';
              const user      = users.find(u => u.id === msg.userId);

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-xs text-slate-500 italic text-center py-1">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col gap-0.5 ${isBruno ? 'items-end' : 'items-start'}`}>
                  <span
                    className="text-[10px] font-bold px-1"
                    style={{ color: specColor }}
                  >
                    {user?.name ?? msg.userId}
                    {msg.streaming && (
                      <span className="ml-1 animate-pulse text-slate-400">...</span>
                    )}
                  </span>
                  <div
                    className="px-2 py-1.5 rounded text-xs text-slate-100 max-w-[88%] break-words leading-relaxed"
                    style={{
                      background: isBruno
                        ? 'linear-gradient(135deg, #1d4ed8, #1e40af)'
                        : 'linear-gradient(135deg, #1e293b, #0f172a)',
                      border: `1px solid ${specColor}33`,
                      boxShadow: isBruno ? 'none' : `0 0 8px ${specColor}18`,
                    }}
                    // Seguro: markdownToHtml sanitiza < > antes de injetar
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.text) }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </DraggableWindow>
  );
}
