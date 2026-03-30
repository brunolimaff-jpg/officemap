import React from 'react';

/** Pixel-art-ish isometric placeholders when PNGs are missing (no Sulake assets required). */
export default function IsoFurnitureFallback({
  type,
  color = '#64748b',
  w,
  h,
  left,
  top,
  zIndex,
}: {
  type: string;
  color?: string;
  w: number;
  h: number;
  left: number;
  top: number;
  zIndex: number;
}) {
  const wood = '#8B6914';
  const woodDark = '#5c4409';
  const woodLight = '#c4a35a';

  const common = {
    className: 'absolute pointer-events-none overflow-visible',
    style: { left, top, zIndex, imageRendering: 'pixelated' as const },
  };

  switch (type) {
    case 'desk':
      return (
        <svg width={w} height={h} viewBox="0 0 64 56" {...common}>
          <ellipse cx="32" cy="50" rx="22" ry="5" fill="#000" opacity={0.18} />
          <polygon points="8,28 32,16 56,28 32,40" fill={woodLight} stroke={woodDark} strokeWidth={1} />
          <polygon points="8,28 8,38 32,50 32,40" fill={wood} stroke={woodDark} strokeWidth={0.8} />
          <polygon points="56,28 56,38 32,50 32,40" fill={woodDark} stroke={woodDark} strokeWidth={0.8} />
          <rect x="26" y="10" width="12" height="10" rx="1" fill="#1e293b" stroke="#334155" />
          <rect x="28" y="8" width="8" height="8" fill="#38bdf8" opacity={0.35} />
        </svg>
      );
    case 'chair':
      return (
        <svg width={w} height={h} viewBox="0 0 48 52" {...common}>
          <ellipse cx="24" cy="46" rx="14" ry="4" fill="#000" opacity={0.15} />
          <polygon points="10,30 24,22 38,30 24,38" fill="#cbd5e1" stroke="#64748b" strokeWidth={1} />
          <polygon points="10,30 10,36 24,44 24,38" fill="#94a3b8" />
          <polygon points="38,30 38,36 24,44 24,38" fill="#64748b" />
          <polygon points="14,18 24,12 34,18 24,26" fill={color} opacity={0.85} stroke={woodDark} strokeWidth={0.8} />
        </svg>
      );
    case 'table':
      return (
        <svg width={w} height={h} viewBox="0 0 80 64" {...common}>
          <ellipse cx="40" cy="56" rx="28" ry="6" fill="#000" opacity={0.16} />
          <polygon points="12,32 40,14 68,32 40,50" fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1.2} />
          <polygon points="12,32 12,40 40,58 40,50" fill="#cbd5e1" stroke="#94a3b8" strokeWidth={0.8} />
          <polygon points="68,32 68,40 40,58 40,50" fill="#94a3b8" stroke="#64748b" strokeWidth={0.8} />
        </svg>
      );
    case 'sofa':
      return (
        <svg width={w} height={h} viewBox="0 0 72 48" {...common}>
          <ellipse cx="36" cy="42" rx="26" ry="5" fill="#000" opacity={0.14} />
          <rect x="8" y="22" width="56" height="14" rx="3" fill="#475569" stroke="#334155" />
          <rect x="8" y="14" width="56" height="12" rx="3" fill="#64748b" stroke="#334155" />
          <rect x="10" y="16" width="16" height="10" rx="2" fill="#94a3b8" />
          <rect x="28" y="16" width="16" height="10" rx="2" fill="#94a3b8" />
          <rect x="46" y="16" width="16" height="10" rx="2" fill="#94a3b8" />
        </svg>
      );
    case 'whiteboard':
      return (
        <svg width={w} height={h} viewBox="0 0 48 72" {...common}>
          <ellipse cx="24" cy="66" rx="10" ry="3" fill="#000" opacity={0.12} />
          <rect x="10" y="8" width="28" height="36" rx="1" fill="#f8fafc" stroke="#334155" strokeWidth={2} />
          <line x1="14" y1="16" x2="34" y2="16" stroke="#cbd5e1" strokeWidth={1} />
          <line x1="14" y1="22" x2="30" y2="22" stroke="#e2e8f0" strokeWidth={1} />
          <rect x="20" y="44" width="8" height="18" fill={woodDark} />
        </svg>
      );
    case 'plant':
      return (
        <svg width={w} height={h} viewBox="0 0 48 56" {...common}>
          <ellipse cx="24" cy="50" rx="12" ry="4" fill="#000" opacity={0.12} />
          <path d="M16 48 L24 20 L32 48 Z" fill="#166534" />
          <path d="M12 44 L22 24 L28 44 Z" fill="#22c55e" />
          <path d="M20 46 L28 22 L36 46 Z" fill="#15803d" />
          <ellipse cx="24" cy="48" rx="10" ry="5" fill="#78350f" stroke="#451a03" />
        </svg>
      );
    default:
      return (
        <svg width={w} height={h} viewBox="0 0 64 64" {...common}>
          <ellipse cx="32" cy="58" rx="18" ry="5" fill="#000" opacity={0.15} />
          <polygon points="8,36 32,20 56,36 32,52" fill={color} stroke="#334155" strokeWidth={1} />
        </svg>
      );
  }
}
