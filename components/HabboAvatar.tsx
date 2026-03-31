'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { User } from '@/components/HabboClient';

// Sprite PNG do tileset Modern Office Singles 32x32
// Caminho base: /assets/tiles/4_Modern_Office_singles/32x32/
const BASE = '/assets/tiles/4_Modern_Office_singles/32x32/Modern_Office_Singles_32x32_';

// Cada especialista tem um sprite único. Fallback = sprite 120 (base neutra).
const SPECIALIST_SPRITE: Record<string, number> = {
  satya:     107,
  uncle_bob: 108,
  karpathy:  109,
  rogati:    110,
  osmani:    111,
  whittaker: 112,
  dixon:     113,
  dodds:     114,
  rauch:     115,
  rodrigues: 116,
  kozyrkov:  117,
  cagan:     118,
  grove:     119,
  '1':       120, // Bruno
};

// Cores de fallback SVG mantidas para garantia
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
  const [spriteError, setSpriteError] = useState(false);

  const spriteNum = SPECIALIST_SPRITE[avatarState.id] ?? 120;
  const spriteSrc = `${BASE}${spriteNum}.png`;

  const colors = SPECIALIST_COLORS[avatarState.id] ?? {
    body: `hsl(${(avatarState.id.charCodeAt(0) * 37) % 360},55%,45%)`,
    head: `hsl(${(avatarState.id.charCodeAt(0) * 37 + 30) % 360},40%,72%)`,
  };

  const isWalking  = avatarState.avatarStatus === 'walking';
  const isSpeaking = avatarState.avatarStatus === 'speaking';
  const isIdle     = !isWalking && !isSpeaking;

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
      {/* Sprite PNG — renderizado se não houver erro de carregamento */}
      {!spriteError ? (
        <div style={{ position: 'relative', width: 36, height: 60 }}>
          {/* Sombra */}
          <div style={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 20,
            height: 6,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.22)',
          }} />

          {/* Sprite principal */}
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: '50%',
              transform: `translateX(-50%) ${
                isWalking
                  ? (walkFrame === 0 ? 'translateX(-1px)' : 'translateX(1px)')
                  : ''
              }`,
              imageRendering: 'pixelated',
              animation: isWalking ? 'avatarWalk 0.3s steps(1) infinite' : undefined,
            }}
          >
            <Image
              src={spriteSrc}
              alt={avatarState.name ?? avatarState.id}
              width={32}
              height={32}
              style={{ imageRendering: 'pixelated' }}
              onError={() => setSpriteError(true)}
              unoptimized
            />
          </div>

          {/* Badge idle — ponto verde */}
          {isIdle && (
            <div style={{
              position: 'absolute',
              top: 2,
              right: 0,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              border: '1.5px solid #0f172a',
            }} />
          )}

          {/* Badge speaking — balão pulsante */}
          {isSpeaking && (
            <div style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: 'white',
              borderRadius: 4,
              padding: '1px 4px',
              fontSize: 9,
              fontWeight: 'bold',
              color: '#0f172a',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              animation: 'speakPulse 0.6s ease-in-out infinite alternate',
              whiteSpace: 'nowrap',
            }}>
              💬
            </div>
          )}

          {/* Nome tag */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 8,
            fontFamily: 'monospace',
            fontWeight: 'bold',
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 1px 2px rgba(0,0,0,0.9)',
            whiteSpace: 'nowrap',
          }}>
            {avatarState.name?.slice(0, 10) ?? ''}
          </div>
        </div>
      ) : (
        /* Fallback SVG original — renderizado se imagem falhar */
        <svg
          width="36"
          height="60"
          viewBox="0 0 36 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: 'pixelated' }}
        >
          <ellipse cx="18" cy="57" rx="10" ry="3" fill="rgba(0,0,0,0.22)" />
          <rect x="11" y="40" width="5" height="12" rx="2" fill={colors.body} opacity="0.9" />
          <rect x={isWalking && walkFrame === 1 ? 19 : 18} y="40" width="5" height="12" rx="2" fill={colors.body} opacity="0.9" />
          <rect x="10" y="26" width="16" height="16" rx="3" fill={colors.body} />
          <rect x="14" y="26" width="8" height="3" rx="1" fill="rgba(255,255,255,0.3)" />
          <rect x="10" y="10" width="16" height="16" rx="4" fill={colors.head} />
          <rect x="10" y="9" width="16" height="4" rx="2" fill={colors.body} />
          <rect x="13" y="17" width="3" height="3" rx="1" fill="#0f172a" />
          <rect x="20" y="17" width="3" height="3" rx="1" fill="#0f172a" />
          <rect x="14" y="17" width="1" height="1" fill="rgba(255,255,255,0.7)" />
          <rect x="21" y="17" width="1" height="1" fill="rgba(255,255,255,0.7)" />
          {isSpeaking ? (
            <rect x="14" y="22" width="8" height="3" rx="1" fill="#0f172a" />
          ) : (
            <path d="M14 22 Q18 25 22 22" stroke="#0f172a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          )}
          {isSpeaking && (
            <>
              <rect x="24" y="2" width="11" height="8" rx="2" fill="white" fillOpacity="0.95" />
              <polygon points="24,8 20,12 26,8" fill="white" fillOpacity="0.95" />
              <circle cx="27" cy="6" r="1" fill="#0f172a" />
              <circle cx="30" cy="6" r="1" fill="#0f172a" />
              <circle cx="33" cy="6" r="1" fill="#0f172a" />
            </>
          )}
          {isIdle && (
            <circle cx="28" cy="12" r="3" fill="#22c55e" stroke="#0f172a" strokeWidth="1" />
          )}
          <text x="18" y="58" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.85)" fontFamily="monospace" fontWeight="bold">
            {avatarState.name?.slice(0, 10) ?? ''}
          </text>
        </svg>
      )}

      {/* Keyframes injetados inline — sem dependência de CSS global */}
      <style>{`
        @keyframes avatarWalk {
          0%   { transform: translateX(-50%) translateX(-1px); }
          50%  { transform: translateX(-50%) translateX(1px); }
          100% { transform: translateX(-50%) translateX(-1px); }
        }
        @keyframes speakPulse {
          from { transform: scale(1); }
          to   { transform: scale(1.15); }
        }
        @keyframes shadowPulse {
          from { opacity: 0.22; }
          to   { opacity: 0.12; }
        }
      `}</style>
    </div>
  );
}
