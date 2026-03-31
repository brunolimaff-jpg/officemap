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
  grove: '#94A3B8', '1': '#4A90E2', system: '#475569',
};

const SPECIALIST_INITIALS: Record<string, string> = {
  satya: 'SN', uncle_bob: 'UB', karpathy: 'AK', rogati: 'MR',
  osmani: 'AO', whittaker: 'JW', dixon: 'MD', dodds: 'KD',
  rauch: 'GR', rodrigues: 'RR', kozyrkov: 'CK', cagan: 'MC',
  grove: 'AG', '1': 'BL',
};

function markdownToHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:#1e293b;color:#7dd3fc;padding:1px 4px;border-radius:2px;font-size:0.85em;font-family:monospace">$1</code>')
    .replace(/\n/g, '<br />');
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatLogWindow({ onClose, messages, users }: ChatLogWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll suave apenas se estiver perto do fundo
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom || messages.at(-1)?.userId === '1') {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <DraggableWindow
      title="🏢 Board Room"
      onClose={onClose}
      defaultX={typeof window !== 'undefined' ? window.innerWidth - 380 : 900}
      defaultY={60}
      width={360}
      height={500}
    >
      <div className="w-full h-full flex flex-col" style={{ background: '#0d1117', fontFamily: 'monospace' }}>

        {/* Contador de mensagens */}
        <div
          className="flex items-center justify-between px-3 py-1"
          style={{ background: '#161b22', borderBottom: '1px solid #30363d' }}
        >
          <span style={{ color: '#8b949e', fontSize: 10 }}>
            {messages.filter(m => m.userId !== 'system').length} mensagens
          </span>
          <span style={{ color: '#3fb950', fontSize: 10 }}>● ao vivo</span>
        </div>

        {/* Lista de mensagens */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-2 py-2 space-y-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#30363d #0d1117' }}
        >
          {messages.length === 0 ? (
            <div style={{ color: '#484f58', textAlign: 'center', marginTop: 32, fontSize: 11, fontStyle: 'italic' }}>
              Convoque um especialista e comece a conversa...
            </div>
          ) : (
            messages.map(msg => {
              const isSystem = msg.userId === 'system';
              const isBruno  = msg.userId === '1';
              const color    = SPECIALIST_COLORS[msg.userId] ?? '#8b949e';
              const initials = SPECIALIST_INITIALS[msg.userId] ?? '?';
              const user     = users.find(u => u.id === msg.userId);
              const name     = user?.name ?? msg.userId;

              if (isSystem) {
                return (
                  <div
                    key={msg.id}
                    style={{
                      textAlign: 'center',
                      fontSize: 10,
                      color: '#484f58',
                      fontStyle: 'italic',
                      padding: '4px 0',
                      borderTop: '1px solid #21262d',
                      borderBottom: '1px solid #21262d',
                      margin: '4px 0',
                    }}
                  >
                    {msg.text}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isBruno ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  {/* Avatar dot */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      minWidth: 28,
                      background: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 8,
                      fontWeight: 'bold',
                      color: '#fff',
                      border: '2px solid rgba(255,255,255,0.15)',
                      imageRendering: 'pixelated',
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>

                  {/* Balao */}
                  <div style={{ flex: 1, maxWidth: '82%' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 4,
                        flexDirection: isBruno ? 'row-reverse' : 'row',
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ color, fontSize: 10, fontWeight: 'bold' }}>{name}</span>
                      <span style={{ color: '#484f58', fontSize: 9 }}>{formatTime(msg.timestamp)}</span>
                      {msg.streaming && (
                        <span
                          style={{
                            color: '#3fb950',
                            fontSize: 10,
                            animation: 'pulse 1s infinite',
                          }}
                        >▮▮▮</span>
                      )}
                    </div>
                    <div
                      style={{
                        background: isBruno ? '#1c2d4a' : '#161b22',
                        border: `1px solid ${color}44`,
                        borderLeft: isBruno ? `1px solid ${color}44` : `3px solid ${color}`,
                        borderRight: isBruno ? `3px solid ${color}` : `1px solid ${color}44`,
                        padding: '6px 10px',
                        fontSize: 11,
                        color: '#e6edf3',
                        lineHeight: 1.55,
                        wordBreak: 'break-word',
                        boxShadow: `0 1px 6px ${color}18`,
                      }}
                      dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.text) }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DraggableWindow>
  );
}
