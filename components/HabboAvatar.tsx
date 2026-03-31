'use client';
import type { User } from '@/components/HabboClient';

// Cores fixas por especialista — consistência visual
const SPECIALIST_COLORS: Record<string, { body: string; head: string }> = {
  satya:     { body: '#0078D4', head: '#4AA4E8' },
  uncle_bob: { body: '#DC2626', head: '#F87171' },
  karpathy:  { body: '#7C3AED', head: '#A78BFA' },
  rogati:    { body: '#059669', head: '#34D399' },
  osmani:    { body: '#D97706', head: '#FCD34D' },
  whittaker: { body: '#EF4444', head: '#FCA5A5' },
  dixon:     { body: '#0891B2', head: '#22D3EE' },
  dodds:     { body: '#DB2777', head: '#F472B6' },
  rauch:     { body: '#2563EB', head: '#60A5FA' },
  rodrigues: { body: '#16A34A', head: '#4ADE80' },
  kozyrkov:  { body: '#7C3AED', head: '#C4B5FD' },
  cagan:     { body: '#EA580C', head: '#FB923C' },
  grove:     { body: '#475569', head: '#94A3B8' },
  '1':       { body: '#1D4ED8', head: '#93C5FD' },
};

interface HabboAvatarProps {
  avatarState: User;
  pos: { x: number; y: number };
}

export default function HabboAvatar({ avatarState, pos }: HabboAvatarProps) {
  const colors = SPECIALIST_COLORS[avatarState.id] ?? {
    body: `hsl(${(avatarState.id.charCodeAt(0) * 37) % 360},55%,45%)`,
    head: `hsl(${(avatarState.id.charCodeAt(0) * 37 + 30) % 360},40%,72%)`,
  };

  const isWalking  = avatarState.avatarStatus === 'walking';
  const isSpeaking = avatarState.avatarStatus === 'speaking';
  const isIdle     = !isWalking && !isSpeaking;

  // Walkcycle: alterna pernas a cada render com base no tempo
  const walkFrame = isWalking ? Math.floor(Date.now() / 150) % 2 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x - 18,
        top: pos.y - 52,
        zIndex: Math.round(pos.y),
        pointerEvents: 'none',
        transition: 'left 0.18s linear, top 0.18s linear',
        willChange: 'left, top',
      }}
    >
      <svg
        width="36"
        height="60"
        viewBox="0 0 36 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Sombra eliptica no chao */}
        <ellipse cx="18" cy="57" rx="10" ry="3"
          fill="rgba(0,0,0,0.22)"
          style={isWalking ? { animation: 'shadowPulse 0.3s infinite alternate' } : undefined}
        />

        {/* Pernas */}
        {isWalking ? (
          <>
            <rect x={walkFrame === 0 ? 11 : 13} y="40" width="5" height="12" rx="2"
              fill={colors.body} opacity="0.9" />
            <rect x={walkFrame === 0 ? 18 : 16} y="40" width="5" height="12" rx="2"
              fill={colors.body} opacity="0.9" />
          </>
        ) : (
          <>
            <rect x="11" y="40" width="5" height="12" rx="2" fill={colors.body} opacity="0.9" />
            <rect x="18" y="40" width="5" height="12" rx="2" fill={colors.body} opacity="0.9" />
          </>
        )}

        {/* Corpo */}
        <rect x="10" y="26" width="16" height="16" rx="3" fill={colors.body} />
        {/* Detalhe camisa — colarinho */}
        <rect x="14" y="26" width="8" height="3" rx="1" fill="rgba(255,255,255,0.3)" />

        {/* Cabeca */}
        <rect x="10" y="10" width="16" height="16" rx="4" fill={colors.head} />
        {/* Cabelo — topo */}
        <rect x="10" y="9" width="16" height="4" rx="2" fill={colors.body} />

        {/* Olhos */}
        <rect x="13" y="17" width="3" height="3" rx="1" fill="#0f172a" />
        <rect x="20" y="17" width="3" height="3" rx="1" fill="#0f172a" />
        {/* Brilho olhos */}
        <rect x="14" y="17" width="1" height="1" fill="rgba(255,255,255,0.7)" />
        <rect x="21" y="17" width="1" height="1" fill="rgba(255,255,255,0.7)" />

        {/* Boca */}
        {isSpeaking ? (
          <rect x="14" y="22" width="8" height="3" rx="1" fill="#0f172a" />
        ) : (
          <path d="M14 22 Q18 25 22 22" stroke="#0f172a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        )}

        {/* Balao de fala */}
        {isSpeaking && (
          <>
            <rect x="24" y="2" width="11" height="8" rx="2" fill="white" fillOpacity="0.95" />
            <polygon points="24,8 20,12 26,8" fill="white" fillOpacity="0.95" />
            <circle cx="27" cy="6" r="1" fill="#0f172a" />
            <circle cx="30" cy="6" r="1" fill="#0f172a" />
            <circle cx="33" cy="6" r="1" fill="#0f172a" />
          </>
        )}

        {/* Badge idle — indicador de disponivel */}
        {isIdle && (
          <circle cx="28" cy="12" r="3" fill="#22c55e" stroke="#0f172a" strokeWidth="1" />
        )}

        {/* Nome tag — abaixo do avatar */}
        <text
          x="18" y="58"
          textAnchor="middle"
          fontSize="5"
          fill="rgba(255,255,255,0.85)"
          fontFamily="monospace"
          fontWeight="bold"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
        >
          {avatarState.name?.slice(0, 10) ?? ''}
        </text>
      </svg>
    </div>
  );
}
