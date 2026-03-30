import React from 'react';

interface HabboCharacterProps {
  color: string;
  role?: string;
  isBruno?: boolean;
}

// Classic Habbo-style blocky character — front-facing, 52×80 viewbox
export function HabboCharacter({ color, role, isBruno = false }: HabboCharacterProps) {
  const skin = '#FECBA1';
  const hair = isBruno ? '#1E3A5F' : '#3B2F1E';
  const shirt = isBruno ? '#1E5B8A' : color;
  const pants = '#1E293B';
  const shoes = '#0F172A';

  const hasGlasses = role === 'CTO' || role === 'Arquiteta de IA' || role === 'Engenheiro de Dados';

  return (
    <svg width="52" height="80" viewBox="0 0 52 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="26" cy="77" rx="14" ry="4" fill="rgba(0,0,0,0.3)" />

      {/* Shoes */}
      <rect x="11" y="61" width="13" height="9" rx="3" fill={shoes} />
      <rect x="28" y="61" width="13" height="9" rx="3" fill={shoes} />
      {/* Shoe highlight */}
      <rect x="12" y="62" width="5" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
      <rect x="29" y="62" width="5" height="2" rx="1" fill="rgba(255,255,255,0.15)" />

      {/* Left leg */}
      <rect x="13" y="43" width="11" height="20" rx="1" fill={pants} />
      {/* Right leg */}
      <rect x="28" y="43" width="11" height="20" rx="1" fill={pants} />
      {/* Pants highlight */}
      <rect x="14" y="44" width="4" height="8" rx="1" fill="rgba(255,255,255,0.08)" />
      <rect x="29" y="44" width="4" height="8" rx="1" fill="rgba(255,255,255,0.08)" />

      {/* Body / Shirt */}
      <rect x="10" y="27" width="32" height="18" rx="2" fill={shirt} />
      {/* Shirt shading */}
      <rect x="10" y="27" width="32" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
      <rect x="10" y="38" width="32" height="7" rx="2" fill="rgba(0,0,0,0.1)" />

      {/* Left Arm */}
      <rect x="2"  y="29" width="9"  height="16" rx="3" fill={shirt} />
      <rect x="2"  y="43" width="9"  height="5"  rx="2" fill={skin} />
      {/* Right Arm */}
      <rect x="41" y="29" width="9"  height="16" rx="3" fill={shirt} />
      <rect x="41" y="43" width="9"  height="5"  rx="2" fill={skin} />

      {/* Collar / Neck */}
      <rect x="21" y="22" width="10" height="7" fill={skin} />

      {/* Head */}
      <rect x="10" y="6" width="32" height="20" rx="3" fill={skin} />
      {/* Head shading */}
      <rect x="10" y="6" width="32" height="5" rx="3" fill="rgba(255,255,255,0.12)" />
      <rect x="10" y="21" width="32" height="5" rx="3" fill="rgba(0,0,0,0.08)" />

      {/* Hair */}
      <rect x="8"  y="4" width="36" height="12" rx="3" fill={hair} />
      {/* Hair highlight */}
      <rect x="10" y="5" width="10" height="3" rx="1" fill="rgba(255,255,255,0.2)" />

      {/* Eyes */}
      <rect x="16" y="13" width="7" height="7" rx="1" fill="#1E293B" />
      <rect x="29" y="13" width="7" height="7" rx="1" fill="#1E293B" />
      {/* Eye whites / iris */}
      <rect x="17" y="14" width="3" height="3" rx="1" fill="white" />
      <rect x="30" y="14" width="3" height="3" rx="1" fill="white" />
      {/* Pupils */}
      <rect x="18" y="15" width="2" height="2" fill="#0F172A" />
      <rect x="31" y="15" width="2" height="2" fill="#0F172A" />

      {/* Smile */}
      <path d="M18 22 Q26 27 34 22" stroke="#C4956A" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Glasses */}
      {hasGlasses && (
        <>
          <rect x="14" y="12" width="11" height="9" rx="2" fill="none" stroke="#475569" strokeWidth="1.5" />
          <rect x="27" y="12" width="11" height="9" rx="2" fill="none" stroke="#475569" strokeWidth="1.5" />
          <line x1="25" y1="16" x2="27" y2="16" stroke="#475569" strokeWidth="1.5" />
          <line x1="12" y1="15" x2="14" y2="16" stroke="#475569" strokeWidth="1" />
          <line x1="40" y1="15" x2="38" y2="16" stroke="#475569" strokeWidth="1" />
        </>
      )}

      {/* Bruno crown/badge */}
      {isBruno && (
        <>
          <polygon points="20,4 26,0 32,4 30,8 22,8" fill="#F59E0B" />
          <rect x="22" y="2" width="3" height="4" fill="#FBBF24" />
          <rect x="27" y="2" width="3" height="4" fill="#FBBF24" />
        </>
      )}
    </svg>
  );
}
