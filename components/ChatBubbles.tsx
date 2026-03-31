import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from './HabboClient';

interface ChatBubblesProps {
  messages: ChatMessage[];
  users: User[];
  cameraOffsetRef?: React.RefObject<{ x: number; y: number }>;
}

interface ActiveBubble extends ChatMessage {
  yOffset: number;
  opacity: number;
}

const BUBBLE_COLORS: Record<string, { bg: string; text: string; border: string; nameColor: string }> = {
  '1':      { bg: '#FFFDE7', text: '#1A1A1A', border: '#F59E0B', nameColor: '#B45309' },
  carlos:   { bg: '#FEE2E2', text: '#1A1A1A', border: '#EF4444', nameColor: '#B91C1C' },
  marcos:   { bg: '#E0F2FE', text: '#1A1A1A', border: '#06B6D4', nameColor: '#0E7490' },
  sophia:   { bg: '#EDE9FE', text: '#1A1A1A', border: '#8B5CF6', nameColor: '#6D28D9' },
  andre:    { bg: '#DBEAFE', text: '#1A1A1A', border: '#3B82F6', nameColor: '#1D4ED8' },
  diego:    { bg: '#D1FAE5', text: '#1A1A1A', border: '#10B981', nameColor: '#047857' },
  raquel:   { bg: '#FEF3C7', text: '#1A1A1A', border: '#F59E0B', nameColor: '#B45309' },
  helena:   { bg: '#FCE7F3', text: '#1A1A1A', border: '#EC4899', nameColor: '#BE185D' },
  victor:   { bg: '#FFEDD5', text: '#1A1A1A', border: '#F97316', nameColor: '#C2410C' },
  system:   { bg: '#1E293B', text: '#94A3B8', border: '#334155', nameColor: '#64748B' },
};

const DEFAULT_BUBBLE = { bg: '#FFFFFF', text: '#1A1A1A', border: '#CBD5E1', nameColor: '#64748B' };

const TILE_W = 64;
const TILE_H = 32;
const AVATAR_HEAD_OFFSET = 95;

export default function ChatBubbles({ messages, users, cameraOffsetRef }: ChatBubblesProps) {
  const [activeBubbles, setActiveBubbles] = useState<ActiveBubble[]>([]);
  // Dimensões via ref para evitar re-render no resize
  const winSizeRef = useRef({ w: typeof window !== 'undefined' ? window.innerWidth : 1024, h: typeof window !== 'undefined' ? window.innerHeight : 768 });
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => {
      winSizeRef.current = { w: window.innerWidth, h: window.innerHeight };
      forceUpdate(n => n + 1);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const latestMsg = messages[messages.length - 1];

    setActiveBubbles(prev => {
      const updated = prev
        .map(b => ({ ...b, yOffset: b.yOffset + 38, opacity: b.yOffset > 130 ? 0 : b.yOffset > 90 ? 0.5 : 1 }))
        .filter(b => b.opacity > 0);
      return [...updated, { ...latestMsg, yOffset: 0, opacity: 1 }];
    });

    const timer = setTimeout(() => {
      setActiveBubbles(prev => prev.filter(b => b.id !== latestMsg.id));
    }, 5500);
    return () => clearTimeout(timer);
  }, [messages]);

  const getAvatarScreenPos = (user: User) => {
    const mapHeight = 24;
    const { w: winW, h: winH } = winSizeRef.current;
    const camX = cameraOffsetRef?.current?.x ?? 0;
    const camY = cameraOffsetRef?.current?.y ?? 0;
    const offsetX = winW / 2;
    const offsetY = winH / 2 - (mapHeight * TILE_H) / 2;
    return {
      x: offsetX + (user.x - user.y) * (TILE_W / 2) + camX,
      y: offsetY + (user.x + user.y) * (TILE_H / 2) + camY,
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {activeBubbles.map(bubble => {
        const user = users.find(u => u.id === bubble.userId);
        if (!user && bubble.userId !== 'system') return null;

        const colors = BUBBLE_COLORS[bubble.userId] ?? DEFAULT_BUBBLE;

        let xPos = winSizeRef.current.w / 2;
        let yBase = winSizeRef.current.h - 200;
        if (user) {
          const screenPos = getAvatarScreenPos(user);
          xPos = screenPos.x;
          yBase = screenPos.y - AVATAR_HEAD_OFFSET - bubble.yOffset;
        }

        const text = bubble.text.length > 85
          ? bubble.text.slice(0, 82) + '...'
          : bubble.text;

        return (
          <div
            key={bubble.id}
            className="absolute flex flex-col items-center"
            style={{
              left: xPos,
              top: yBase,
              transform: 'translateX(-50%)',
              opacity: bubble.opacity,
              transition: 'top 0.4s ease-out, opacity 0.4s ease-out',
            }}
          >
            <div
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                border: `2px solid ${colors.border}`,
                borderRadius: '8px',
                padding: '5px 10px 5px 10px',
                maxWidth: '200px',
                textAlign: 'center',
                fontSize: '11px',
                lineHeight: '1.4',
                fontFamily: 'var(--font-pixel, monospace)',
                boxShadow: `0 2px 0 rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)`,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              {bubble.userId !== 'system' && (
                <span
                  className="block font-bold mb-0.5"
                  style={{ color: colors.nameColor, fontSize: '10px', letterSpacing: '0.02em' }}
                >
                  {user?.name}
                </span>
              )}
              <span>{text}</span>
            </div>
            <div
              style={{
                width: 0, height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `7px solid ${colors.border}`,
                marginTop: '-1px',
              }}
            />
            <div
              style={{
                width: 0, height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `5px solid ${colors.bg}`,
                marginTop: '-11px',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
