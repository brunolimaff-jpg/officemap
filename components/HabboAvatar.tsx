'use client';
import type { AvatarStatus } from '@/types';
import type { User } from '@/components/HabboClient';

interface HabboAvatarProps {
  avatarState: User;
  pos: { x: number; y: number };
}

export default function HabboAvatar({ avatarState, pos }: HabboAvatarProps) {
  const hue = avatarState.id
    ? (avatarState.id.charCodeAt(0) * 37) % 360
    : 210;

  const isAnimated =
    avatarState.avatarStatus === 'speaking' ||
    avatarState.avatarStatus === 'walking';

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x - 16,
        top: pos.y - 48,
        zIndex: Math.round(pos.y),
        pointerEvents: 'none',
        transition: 'left 0.16s linear, top 0.16s linear',
      }}
    >
      <svg
        width="32"
        height="56"
        viewBox="0 0 32 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={isAnimated ? { animation: 'bounce 0.4s infinite alternate' } : undefined}
      >
        {/* Sombra */}
        <ellipse cx="16" cy="52" rx="9" ry="3" fill="black" fillOpacity="0.18" />
        {/* Corpo */}
        <rect
          x="9" y="28" width="14" height="18" rx="3"
          fill={`hsl(${hue},55%,45%)`}
        />
        {/* Cabeça */}
        <circle cx="16" cy="18" r="10" fill={`hsl(${(hue + 30) % 360},40%,72%)`} />
        {/* Olhos */}
        <circle cx="12" cy="17" r="1.5" fill="#1a202c" />
        <circle cx="20" cy="17" r="1.5" fill="#1a202c" />
        {/* Boca */}
        <path
          d="M13 22 Q16 24.5 19 22"
          stroke="#1a202c" strokeWidth="1"
          fill="none" strokeLinecap="round"
        />
        {/* Status: bolha de fala */}
        {avatarState.avatarStatus === 'speaking' && (
          <>
            <circle cx="26" cy="8" r="5" fill="white" fillOpacity="0.9" />
            <text x="26" y="11" textAnchor="middle" fontSize="6" fill="#1a202c">...</text>
          </>
        )}
        {/* Nome */}
        {avatarState.name && (
          <text
            x="16" y="-4"
            textAnchor="middle"
            fontSize="6"
            fill="white"
            fontFamily="monospace"
          >
            {avatarState.name.slice(0, 10)}
          </text>
        )}
      </svg>
    </div>
  );
}
