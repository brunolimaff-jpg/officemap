import React from 'react';

interface AvatarSpriteProps {
  color: string;
  role?: string;
}

export function AvatarSprite({ color, role }: AvatarSpriteProps) {
  // A simple, professional isometric SVG avatar
  return (
    <svg width="64" height="110" viewBox="0 0 64 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="100" rx="16" ry="6" fill="black" fillOpacity="0.2" />
      
      {/* Body / Suit */}
      <path d="M20 60 L32 66 L44 60 L44 90 L32 96 L20 90 Z" fill={color} />
      <path d="M20 60 L32 66 L32 96 L20 90 Z" fill="black" fillOpacity="0.1" />
      <path d="M32 66 L44 60 L44 90 L32 96 Z" fill="white" fillOpacity="0.1" />
      
      {/* Shoulders */}
      <path d="M16 50 L32 58 L48 50 L44 60 L32 66 L20 60 Z" fill={color} />
      <path d="M16 50 L32 58 L32 66 L20 60 Z" fill="black" fillOpacity="0.1" />
      <path d="M32 58 L48 50 L44 60 L32 66 Z" fill="white" fillOpacity="0.1" />

      {/* Tie / Shirt */}
      <path d="M28 54 L32 56 L36 54 L32 66 Z" fill="#F8FAFC" />
      <path d="M31 56 L33 56 L32 64 Z" fill="#0F172A" />

      {/* Head */}
      <path d="M24 30 L32 34 L40 30 L40 46 L32 50 L24 46 Z" fill="#FCD34D" />
      <path d="M24 30 L32 34 L32 50 L24 46 Z" fill="black" fillOpacity="0.1" />
      <path d="M32 34 L40 30 L40 46 L32 50 Z" fill="white" fillOpacity="0.1" />
      
      {/* Hair */}
      <path d="M22 26 L32 31 L42 26 L42 34 L32 38 L22 34 Z" fill="#1E293B" />
      <path d="M22 26 L32 31 L32 38 L22 34 Z" fill="black" fillOpacity="0.2" />
      <path d="M32 31 L42 26 L42 34 L32 38 Z" fill="white" fillOpacity="0.1" />
      
      {/* Glasses (if Data or Tech) */}
      {(role === 'Arquiteta de IA' || role === 'Engenheiro de Dados' || role === 'CTO') && (
        <>
          <rect x="25" y="36" width="6" height="4" rx="1" fill="white" fillOpacity="0.8" stroke="#0F172A" strokeWidth="0.5" />
          <rect x="33" y="36" width="6" height="4" rx="1" fill="white" fillOpacity="0.8" stroke="#0F172A" strokeWidth="0.5" />
          <line x1="31" y1="38" x2="33" y2="38" stroke="#0F172A" strokeWidth="1" />
        </>
      )}
    </svg>
  );
}
