import React, { useState, useEffect } from 'react';
import { ChatMessage, User } from './HabboClient';

interface ChatBubblesProps {
  messages: ChatMessage[];
  users: User[];
}

interface ActiveBubble extends ChatMessage {
  yOffset: number;
  opacity: number;
}

// Cor de bubble única por userId — estilo Habbo
const BUBBLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '1':      { bg: '#FFFDE7', text: '#1A1A1A', border: '#F59E0B' }, // Bruno — amarelo
  carlos:   { bg: '#FEE2E2', text: '#1A1A1A', border: '#EF4444' },
  marcos:   { bg: '#E0F2FE', text: '#1A1A1A', border: '#06B6D4' },
  sophia:   { bg: '#EDE9FE', text: '#1A1A1A', border: '#8B5CF6' },
  andre:    { bg: '#DBEAFE', text: '#1A1A1A', border: '#3B82F6' },
  diego:    { bg: '#D1FAE5', text: '#1A1A1A', border: '#10B981' },
  raquel:   { bg: '#FEF3C7', text: '#1A1A1A', border: '#F59E0B' },
  helena:   { bg: '#FCE7F3', text: '#1A1A1A', border: '#EC4899' },
  victor:   { bg: '#FFEDD5', text: '#1A1A1A', border: '#F97316' },
  system:   { bg: '#1E293B', text: '#94A3B8', border: '#334155' },
};

const DEFAULT_BUBBLE = { bg: '#FFFFFF', text: '#1A1A1A', border: '#CBD5E1' };

const TILE_W = 64;
const TILE_H = 32;
const AVATAR_HEAD_OFFSET = 90; // px acima do tile para alcançar a cabeça

export default function ChatBubbles({ messages, users }: ChatBubblesProps) {
  const [activeBubbles, setActiveBubbles] = useState<ActiveBubble[]>([]);
  const [winW, setWinW] = useState(1024);
  const [winH, setWinH] = useState(768);

  useEffect(() => {
    setWinW(window.innerWidth);
    setWinH(window.innerHeight);
    const onResize = () => { setWinW(window.innerWidth); setWinH(window.innerHeight); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const latestMsg = messages[messages.length - 1];

    setActiveBubbles(prev => {
      const updated = prev
        .map(b => ({ ...b, yOffset: b.yOffset + 36, opacity: b.yOffset > 120 ? 0 : 1 }))
        .filter(b => b.opacity > 0);
      return [...updated, { ...latestMsg, yOffset: 0, opacity: 1 }];
    });

    const timer = setTimeout(() => {
      setActiveBubbles(prev => prev.filter(b => b.id !== latestMsg.id));
    }, 5000);
    return () => clearTimeout(timer);
  }, [messages]);

  // Calcula posição isométrica real do avatar
  const getAvatarScreenPos = (user: User) => {
    const mapHeight = 24; // linhas do officeMap
    const offsetX = winW / 2;
    const offsetY = winH / 2 - (mapHeight * TILE_H) / 2;
    return {
      x: offsetX + (user.x - user.y) * (TILE_W / 2),
      y: offsetY + (user.x + user.y) * (TILE_H / 2),
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {activeBubbles.map(bubble => {
        const user = users.find(u => u.id === bubble.userId);
        if (!user && bubble.userId !== 'system') return null;

        const colors = BUBBLE_COLORS[bubble.userId] ?? DEFAULT_BUBBLE;

        // Posição: se system, centraliza; senão, acima da cabeça do avatar
        let xPos = winW / 2;
        let yBase = winH - 200;
        if (user) {
          const screenPos = getAvatarScreenPos(user);
          xPos = screenPos.x;
          yBase = screenPos.y - AVATAR_HEAD_OFFSET - bubble.yOffset;
        }

        // Trunca texto longo em 80 chars
        const text = bubble.text.length > 80
          ? bubble.text.slice(0, 77) + '...'
          : bubble.text;

        return (
          <div
            key={bubble.id}
            className="absolute flex flex-col items-center transition-all duration-500 ease-out"
            style={{
              left: xPos,
              top: yBase,
              transform: 'translateX(-50%)',
              opacity: bubble.opacity,
            }}
          >
            {/* Bubble */}
            <div
              className="rounded-lg px-3 py-1.5 text-xs font-pixel whitespace-normal max-w-[200px] text-center shadow-md"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                border: `2px solid ${colors.border}`,
                lineHeight: '1.4',
              }}
            >
              {bubble.userId !== 'system' && (
                <span className="font-bold block" style={{ color: colors.border }}>
                  {user?.name}
                </span>
              )}
              <span>{text}</span>
            </div>
            {/* Seta para baixo */}
            {bubble.yOffset === 0 && (
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `6px solid ${colors.border}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
