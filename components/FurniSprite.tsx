import React, { useState } from 'react';
import { FurnitureType } from '@/types';

interface FurniSpriteProps {
  type: FurnitureType | string;
  pos: { x: number; y: number };
  color?: string;
  direction?: number;
  tileX: number;
  tileY: number;
  zBonus?: number;
  label?: string;
}

const SIZE: Record<string, { w: number; h: number }> = {
  desk:           { w: 64,  h: 72  },
  chair:          { w: 48,  h: 56  },
  table:          { w: 96,  h: 80  },
  sofa:           { w: 72,  h: 64  },
  whiteboard:     { w: 48,  h: 80  },
  plant:          { w: 40,  h: 64  },
  divider:        { w: 64,  h: 40  },
  lamp:           { w: 32,  h: 72  },
  rug:            { w: 96,  h: 48  },
  bookshelf:      { w: 48,  h: 80  },
  trash:          { w: 24,  h: 32  },
  computer:       { w: 48,  h: 56  },
  couch:          { w: 80,  h: 72  },
  coffee_table:   { w: 64,  h: 40  },
  cabinet:        { w: 40,  h: 72  },
  mug:            { w: 20,  h: 24  },
  glass_wall:     { w: 64,  h: 96  },
  sign:           { w: 72,  h: 56  },
  monitor_dual:   { w: 64,  h: 56  },
  fridge:         { w: 40,  h: 88  },
  coffee_machine: { w: 36,  h: 64  },
  microwave:      { w: 40,  h: 48  },
  pool_table:     { w: 96,  h: 80  },
  ac_unit:        { w: 48,  h: 40  },
  locker:         { w: 40,  h: 80  },
  tv_screen:      { w: 56,  h: 72  },
};

function shadeHex(hex: string, amount: number): string {
  try {
    const h = hex.replace('#', '');
    const num = parseInt(h, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  } catch { return hex; }
}

// ─── SVGs existentes ──────────────────────────────────────────────────────────

function DeskSVG({ color = '#64748B', flip }: { color: string; flip: boolean }) {
  const dark = shadeHex(color, -40);
  const light = shadeHex(color, 30);
  const mid = shadeHex(color, -15);
  return (
    <svg width="64" height="72" viewBox="0 0 64 72" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      <line x1="8" y1="38" x2="6" y2="62" stroke={dark} strokeWidth="3" strokeLinecap="round" />
      <line x1="56" y1="38" x2="56" y2="62" stroke={dark} strokeWidth="3" strokeLinecap="round" />
      <polygon points="4,24 32,40 32,52 4,36" fill={dark} />
      <polygon points="60,24 32,40 32,52 60,36" fill={mid} />
      <polygon points="32,8 60,24 32,40 4,24" fill={light} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <polygon points="18,14 32,20 32,32 18,26" fill="#0F172A" />
      <polygon points="46,14 32,20 32,32 46,26" fill="#1E293B" />
      <polygon points="32,8 46,14 32,20 18,14" fill="#3B82F6" opacity="0.9" />
      <polygon points="32,9 40,13 36,15 28,11" fill="white" opacity="0.15" />
      <line x1="32" y1="32" x2="32" y2="38" stroke={dark} strokeWidth="2" />
      <ellipse cx="32" cy="68" rx="14" ry="4" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function ChairSVG({ color = '#475569', flip }: { color: string; flip: boolean }) {
  const dark = shadeHex(color, -40);
  const light = shadeHex(color, 20);
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      <line x1="8" y1="32" x2="6" y2="50" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="32" x2="40" y2="50" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <polygon points="4,24 24,32 24,40 4,32" fill={dark} />
      <polygon points="44,24 24,32 24,40 44,32" fill={color} />
      <polygon points="24,16 44,24 24,32 4,24" fill={light} />
      <polygon points="4,10 24,18 24,24 4,16" fill={dark} />
      <polygon points="44,10 24,18 24,24 44,16" fill={color} />
      <polygon points="24,4 44,10 24,18 4,10" fill={light} />
      <ellipse cx="24" cy="52" rx="10" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function TableSVG() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" style={{ imageRendering: 'pixelated' }}>
      <line x1="10" y1="44" x2="8" y2="68" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <line x1="86" y1="44" x2="86" y2="68" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <polygon points="4,32 48,56 48,66 4,42" fill="#1E293B" />
      <polygon points="92,32 48,56 48,66 92,42" fill="#263448" />
      <polygon points="48,8 92,32 48,56 4,32" fill="#334155" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <polygon points="48,12 72,24 56,30 32,18" fill="white" fillOpacity="0.04" />
      <polygon points="48,8 92,32 88,34 48,12" fill="white" fillOpacity="0.05" />
      <ellipse cx="64" cy="36" rx="5" ry="3" fill="#7C3AED" opacity="0.7" />
      <ellipse cx="64" cy="34" rx="4" ry="2" fill="#4C1D95" opacity="0.8" />
      <polygon points="30,28 44,34 40,36 26,30" fill="#F1F5F9" opacity="0.6" />
      <ellipse cx="48" cy="74" rx="20" ry="5" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function SofaSVG({ color = '#475569', flip }: { color: string; flip: boolean }) {
  const dark = shadeHex(color, -50);
  const light = shadeHex(color, 25);
  const mid = shadeHex(color, -20);
  return (
    <svg width="72" height="64" viewBox="0 0 72 64" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      <polygon points="4,38 36,52 36,60 4,46" fill={dark} />
      <polygon points="68,38 36,52 36,60 68,46" fill={mid} />
      <polygon points="36,24 68,38 36,52 4,38" fill={color} />
      <polygon points="4,20 36,8 36,24 4,36" fill={dark} />
      <polygon points="68,20 36,8 36,24 68,36" fill={mid} />
      <polygon points="36,4 68,18 68,20 36,8 4,20 4,18" fill={light} />
      <polygon points="4,20 16,14 16,26 4,32" fill={dark} />
      <polygon points="4,18 16,12 16,14 4,20" fill={light} opacity="0.6" />
      <polygon points="68,20 56,14 56,26 68,32" fill={mid} />
      <polygon points="68,18 56,12 56,14 68,20" fill={light} opacity="0.4" />
      <polygon points="36,26 54,34 36,42 18,34" fill={light} opacity="0.3" />
      <line x1="36" y1="26" x2="36" y2="52" stroke={dark} strokeWidth="1" strokeOpacity="0.4" />
      <ellipse cx="36" cy="62" rx="18" ry="4" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function WhiteboardSVG() {
  return (
    <svg width="48" height="80" viewBox="0 0 48 80" fill="none" style={{ imageRendering: 'pixelated' }}>
      <line x1="16" y1="60" x2="14" y2="76" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="52" x2="32" y2="68" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <polygon points="2,36 24,48 24,62 2,50" fill="#374151" />
      <polygon points="46,28 24,40 24,54 46,42" fill="#4B5563" />
      <polygon points="24,12 46,24 24,36 2,24" fill="#F8FAFC" />
      <line x1="14" y1="20" x2="34" y2="26" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.5" />
      <line x1="14" y1="24" x2="34" y2="30" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.5" />
      <line x1="14" y1="22" x2="34" y2="28" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7" />
      <line x1="14" y1="26" x2="28" y2="31" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="30" x2="32" y2="35" stroke="#EF4444" strokeWidth="1" opacity="0.5" />
      <polygon points="24,36 46,24 46,28 24,40" fill="#D1D5DB" />
      <ellipse cx="24" cy="76" rx="12" ry="3" fill="black" fillOpacity="0.12" />
    </svg>
  );
}

function PlantSVG() {
  return (
    <svg width="40" height="64" viewBox="0 0 40 64" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="4,46 20,52 20,60 4,54" fill="#92400E" />
      <polygon points="36,46 20,52 20,60 36,54" fill="#B45309" />
      <polygon points="20,40 36,46 20,52 4,46" fill="#D97706" />
      <line x1="20" y1="40" x2="20" y2="28" stroke="#78350F" strokeWidth="3" />
      <polygon points="20,14 32,22 20,30 8,22" fill="#16A34A" />
      <polygon points="20,10 28,16 20,22 12,16" fill="#22C55E" />
      <polygon points="20,6 26,12 20,18 14,12" fill="#4ADE80" />
      <polygon points="20,18 10,14 8,22" fill="#15803D" />
      <polygon points="20,18 30,14 32,22" fill="#16A34A" opacity="0.8" />
      <circle cx="20" cy="5" r="3" fill="#FCD34D" opacity="0.8" />
      <ellipse cx="20" cy="62" rx="10" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function DividerSVG() {
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="4,18 32,28 32,36 4,26" fill="#1E293B" />
      <polygon points="60,18 32,28 32,36 60,26" fill="#263448" />
      <polygon points="32,8 60,18 32,28 4,18" fill="#334155" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <polygon points="32,8 60,18 58,19 32,9" fill="rgba(251,191,36,0.25)" />
      <polygon points="32,28 60,18 60,20 32,30" fill="rgba(0,0,0,0.2)" />
    </svg>
  );
}

function LampSVG() {
  return (
    <svg width="32" height="72" viewBox="0 0 32 72" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="4,60 16,66 16,70 4,64" fill="#1E293B" />
      <polygon points="28,60 16,66 16,70 28,64" fill="#263448" />
      <polygon points="16,56 28,60 16,66 4,60" fill="#334155" />
      <line x1="16" y1="56" x2="16" y2="30" stroke="#475569" strokeWidth="2" />
      <polygon points="4,22 16,28 16,38 4,32" fill="#F59E0B" opacity="0.9" />
      <polygon points="28,22 16,28 16,38 28,32" fill="#D97706" opacity="0.9" />
      <polygon points="16,14 28,20 16,26 4,20" fill="#FCD34D" />
      <ellipse cx="16" cy="42" rx="12" ry="5" fill="#FCD34D" fillOpacity="0.12" />
      <ellipse cx="16" cy="70" rx="8" ry="2" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function RugSVG({ color = '#7C3AED' }: { color: string }) {
  const dark = shadeHex(color, -40);
  const light = shadeHex(color, 20);
  return (
    <svg width="96" height="48" viewBox="0 0 96 48" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="48,4 92,26 48,44 4,22" fill={color} />
      <polygon points="48,8 86,27 48,40 10,23" fill={light} fillOpacity="0.15" stroke={dark} strokeWidth="1" />
      <polygon points="48,14 68,23 48,32 28,23" fill={dark} fillOpacity="0.3" />
      <polygon points="48,17 62,23 48,29 34,23" fill="white" fillOpacity="0.1" />
    </svg>
  );
}

function BookshelfSVG() {
  return (
    <svg width="48" height="80" viewBox="0 0 48 80" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,36 24,48 24,74 2,62" fill="#1E293B" />
      <polygon points="46,28 24,40 24,66 46,54" fill="#263448" />
      <polygon points="24,16 46,28 24,40 2,28" fill="#334155" />
      <polygon points="4,46 22,54 22,58 4,50" fill="#EF4444" />
      <polygon points="42,38 22,46 22,50 42,42" fill="#EF4444" opacity="0.7" />
      <polygon points="8,46 22,52 22,56 8,50" fill="#3B82F6" />
      <polygon points="38,38 22,44 22,48 38,42" fill="#3B82F6" opacity="0.7" />
      <polygon points="12,46 22,50 22,54 12,50" fill="#22C55E" />
      <polygon points="4,58 22,66 22,70 4,62" fill="#F59E0B" />
      <polygon points="42,50 22,58 22,62 42,54" fill="#F59E0B" opacity="0.7" />
      <polygon points="8,58 22,64 22,68 8,62" fill="#8B5CF6" />
      <line x1="2" y1="54" x2="24" y2="62" stroke="#0F172A" strokeWidth="1" />
      <line x1="46" y1="46" x2="24" y2="54" stroke="#0F172A" strokeWidth="1" />
      <ellipse cx="24" cy="76" rx="12" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function TrashSVG() {
  return (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,16 12,20 12,28 2,24" fill="#374151" />
      <polygon points="22,16 12,20 12,28 22,24" fill="#4B5563" />
      <polygon points="12,12 22,16 12,20 2,16" fill="#6B7280" />
      <polygon points="12,8 22,12 12,14 2,10" fill="#9CA3AF" />
      <line x1="12" y1="8" x2="12" y2="6" stroke="#6B7280" strokeWidth="1.5" />
      <ellipse cx="12" cy="30" rx="6" ry="2" fill="black" fillOpacity="0.12" />
    </svg>
  );
}

function ComputerSVG({ flip }: { flip: boolean }) {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      <polygon points="4,22 24,32 24,44 4,34" fill="#1E293B" />
      <polygon points="44,14 24,24 24,36 44,26" fill="#0F172A" />
      <polygon points="24,8 44,16 24,26 4,18" fill="#334155" />
      <polygon points="8,20 22,26 22,38 8,32" fill="#0EA5E9" opacity="0.85" />
      <polygon points="40,14 22,22 22,34 40,26" fill="#0284C7" opacity="0.85" />
      <polygon points="24,10 40,16 22,24 6,18" fill="#38BDF8" opacity="0.9" />
      <polygon points="24,10 34,14 28,18 18,14" fill="white" fillOpacity="0.12" />
      <line x1="10" y1="24" x2="20" y2="28" stroke="#7DD3FC" strokeWidth="1" opacity="0.7" />
      <line x1="10" y1="27" x2="16" y2="29" stroke="#22D3EE" strokeWidth="1" opacity="0.6" />
      <line x1="10" y1="30" x2="19" y2="33" stroke="#7DD3FC" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="44" x2="24" y2="50" stroke="#334155" strokeWidth="3" />
      <polygon points="16,48 24,52 32,48 32,50 24,54 16,50" fill="#475569" />
      <ellipse cx="24" cy="54" rx="10" ry="2.5" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function CouchSVG({ color = '#1D4ED8', flip }: { color: string; flip: boolean }) {
  const dark = shadeHex(color, -55);
  const light = shadeHex(color, 30);
  const mid = shadeHex(color, -25);
  return (
    <svg width="80" height="72" viewBox="0 0 80 72" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      <polygon points="4,44 40,60 40,68 4,52" fill={dark} />
      <polygon points="76,36 40,52 40,60 76,44" fill={mid} />
      <polygon points="40,28 76,40 40,56 4,44" fill={color} />
      <polygon points="4,28 40,14 40,28 4,42" fill={dark} />
      <polygon points="76,20 40,8 40,22 76,34" fill={mid} />
      <polygon points="40,4 76,18 40,10 4,24" fill={light} />
      <polygon points="4,28 14,22 14,36 4,42" fill={dark} />
      <polygon points="76,20 66,14 66,28 76,34" fill={mid} />
      <polygon points="4,24 14,18 14,22 4,28" fill={light} opacity="0.5" />
      <polygon points="76,16 66,10 66,14 76,20" fill={light} opacity="0.4" />
      <polygon points="40,30 58,38 40,46 22,38" fill={light} fillOpacity="0.2" />
      <line x1="40" y1="28" x2="40" y2="56" stroke={dark} strokeWidth="1" strokeOpacity="0.35" />
      <ellipse cx="40" cy="70" rx="22" ry="4" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function CoffeeTableSVG({ color = '#334155' }: { color: string }) {
  const dark = shadeHex(color, -30);
  const light = shadeHex(color, 25);
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none" style={{ imageRendering: 'pixelated' }}>
      <line x1="10" y1="26" x2="8" y2="36" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="20" x2="54" y2="30" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="30" x2="16" y2="36" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <line x1="46" y1="24" x2="46" y2="30" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <polygon points="4,16 32,28 32,34 4,22" fill={dark} />
      <polygon points="60,10 32,22 32,28 60,16" fill={color} />
      <polygon points="32,4 60,14 32,26 4,16" fill={light} />
      <polygon points="14,14 22,17 20,19 12,16" fill="#F1F5F9" opacity="0.7" />
      <ellipse cx="44" cy="15" rx="4" ry="2.5" fill="#F59E0B" opacity="0.8" />
      <ellipse cx="44" cy="13.5" rx="3" ry="1.5" fill="#D97706" opacity="0.9" />
      <ellipse cx="32" cy="36" rx="14" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function CabinetSVG({ color = '#334155' }: { color: string }) {
  const dark = shadeHex(color, -40);
  const light = shadeHex(color, 20);
  return (
    <svg width="40" height="72" viewBox="0 0 40 72" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,30 20,40 20,68 2,58" fill={dark} />
      <polygon points="38,22 20,32 20,60 38,50" fill={color} />
      <polygon points="20,14 38,24 20,34 2,24" fill={light} />
      <line x1="2" y1="44" x2="20" y2="52" stroke={dark} strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="38" y1="36" x2="20" y2="44" stroke={dark} strokeWidth="1.5" strokeOpacity="0.4" />
      <ellipse cx="11" cy="40" rx="2.5" ry="1.5" fill={light} opacity="0.8" />
      <ellipse cx="29" cy="35" rx="2.5" ry="1.5" fill={light} opacity="0.6" />
      <ellipse cx="11" cy="54" rx="2.5" ry="1.5" fill={light} opacity="0.8" />
      <ellipse cx="29" cy="49" rx="2.5" ry="1.5" fill={light} opacity="0.6" />
      <polygon points="20,14 38,22 36,24 18,14" fill="white" fillOpacity="0.07" />
      <ellipse cx="20" cy="68" rx="10" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function MugSVG({ color = '#F59E0B' }: { color: string }) {
  const dark = shadeHex(color, -40);
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,10 10,14 10,20 2,16" fill={dark} />
      <polygon points="18,8 10,12 10,18 18,14" fill={color} />
      <polygon points="10,4 18,8 10,12 2,8" fill="#FDE68A" />
      <path d="M7 4 Q8 2 7 0" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
      <path d="M11 3 Q12 1 11 -1" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
      <path d="M18 9 Q22 11 18 14" stroke={dark} strokeWidth="1.5" fill="none" />
      <ellipse cx="10" cy="21" rx="5" ry="1.5" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

// ─── NOVOS SVGs ───────────────────────────────────────────────────────────────

function GlassWallSVG({ flip }: { flip: boolean }) {
  return (
    <svg width="64" height="96" viewBox="0 0 64 96" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      <polygon points="2,48 8,50 8,90 2,88" fill="#334155" />
      <polygon points="62,36 56,38 56,78 62,76" fill="#1E293B" />
      <polygon points="2,48 32,32 62,36 32,52" fill="#475569" />
      <polygon points="8,52 32,40 32,80 8,90" fill="#BFDBFE" fillOpacity="0.22" stroke="#93C5FD" strokeWidth="0.5" />
      <polygon points="56,40 32,40 32,80 56,78" fill="#BFDBFE" fillOpacity="0.14" stroke="#93C5FD" strokeWidth="0.5" />
      <line x1="12" y1="54" x2="28" y2="46" stroke="white" strokeWidth="1.5" strokeOpacity="0.18" />
      <line x1="12" y1="62" x2="22" y2="57" stroke="white" strokeWidth="1" strokeOpacity="0.12" />
      <line x1="38" y1="44" x2="50" y2="48" stroke="white" strokeWidth="1.5" strokeOpacity="0.12" />
      <polygon points="2,88 32,76 62,76 32,88" fill="#475569" />
      <ellipse cx="32" cy="93" rx="18" ry="3" fill="black" fillOpacity="0.12" />
    </svg>
  );
}

function SignSVG({ label = 'SCOUT 360' }: { label: string }) {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" style={{ imageRendering: 'pixelated' }}>
      <line x1="20" y1="46" x2="18" y2="54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="38" x2="52" y2="46" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="2,28 36,44 36,52 2,36" fill="#1D4ED8" />
      <polygon points="70,20 36,36 36,44 70,28" fill="#1E40AF" />
      <polygon points="36,12 70,20 36,36 2,28" fill="#2563EB" />
      <polygon points="36,12 70,20 70,22 36,14" fill="#60A5FA" fillOpacity="0.4" />
      <text
        x="36" y="28"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="0.5"
        opacity="0.95"
        transform="skewX(-8) translate(0, -2)"
      >{label}</text>
      <polygon points="36,12 52,16 46,20 30,16" fill="white" fillOpacity="0.1" />
      <ellipse cx="36" cy="54" rx="16" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function MonitorDualSVG({ flip }: { flip: boolean }) {
  return (
    <svg width="64" height="56" viewBox="0 0 64 56" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      <polygon points="2,24 18,30 18,42 2,36" fill="#1E293B" />
      <polygon points="32,18 18,24 18,36 32,30" fill="#0F172A" />
      <polygon points="18,12 32,18 18,24 2,18" fill="#334155" />
      <polygon points="4,22 16,27 16,38 4,33" fill="#052E16" opacity="0.95" />
      <polygon points="30,18 16,23 16,34 30,29" fill="#14532D" opacity="0.95" />
      <polygon points="18,13 30,18 16,23 4,18" fill="#16A34A" opacity="0.9" />
      <line x1="6" y1="24" x2="14" y2="27" stroke="#4ADE80" strokeWidth="0.8" opacity="0.7" />
      <line x1="6" y1="27" x2="12" y2="29" stroke="#4ADE80" strokeWidth="0.8" opacity="0.5" />
      <line x1="6" y1="30" x2="14" y2="33" stroke="#4ADE80" strokeWidth="0.8" opacity="0.6" />
      <line x1="6" y1="33" x2="10" y2="34" stroke="#4ADE80" strokeWidth="0.8" opacity="0.4" />
      <polygon points="32,18 48,24 48,36 32,30" fill="#1E293B" />
      <polygon points="62,12 48,18 48,30 62,24" fill="#0F172A" />
      <polygon points="48,6 62,12 48,18 32,12" fill="#334155" />
      <polygon points="34,18 46,23 46,33 34,28" fill="#0C1A3A" opacity="0.95" />
      <polygon points="60,13 46,18 46,28 60,23" fill="#0F2051" opacity="0.95" />
      <polygon points="48,8 60,13 46,18 34,13" fill="#1D4ED8" opacity="0.9" />
      <polygon points="48,8 56,11 52,14 44,11" fill="white" fillOpacity="0.1" />
      <rect x="36" y="26" width="2" height="5" fill="#3B82F6" opacity="0.9" transform="skewY(-14)" />
      <rect x="40" y="24" width="2" height="7" fill="#60A5FA" opacity="0.8" transform="skewY(-14)" />
      <rect x="44" y="25" width="2" height="6" fill="#93C5FD" opacity="0.7" transform="skewY(-14)" />
      <line x1="32" y1="42" x2="32" y2="48" stroke="#334155" strokeWidth="2.5" />
      <polygon points="24,47 32,50 40,47 40,49 32,52 24,49" fill="#475569" />
      <ellipse cx="32" cy="52" rx="12" ry="2.5" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function FridgeSVG() {
  return (
    <svg width="40" height="88" viewBox="0 0 40 88" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,36 20,46 20,84 2,74" fill="#475569" />
      <polygon points="38,28 20,38 20,76 38,66" fill="#64748B" />
      <polygon points="20,20 38,30 20,40 2,30" fill="#94A3B8" />
      <line x1="2" y1="52" x2="20" y2="59" stroke="#334155" strokeWidth="2" />
      <line x1="38" y1="44" x2="20" y2="51" stroke="#334155" strokeWidth="2" />
      <line x1="5" y1="42" x2="5" y2="50" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="34" x2="35" y2="42" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="60" x2="5" y2="70" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="52" x2="35" y2="62" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <polygon points="22,38 28,40 28,74 22,70" fill="white" fillOpacity="0.06" />
      <polygon points="20,20 38,30 36,31 18,21" fill="white" fillOpacity="0.12" />
      <ellipse cx="20" cy="84" rx="12" ry="3" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function CoffeeMachineSVG() {
  return (
    <svg width="36" height="64" viewBox="0 0 36 64" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,46 18,54 18,60 2,52" fill="#1E293B" />
      <polygon points="34,40 18,48 18,54 34,46" fill="#263448" />
      <polygon points="18,36 34,42 18,50 2,44" fill="#334155" />
      <polygon points="4,24 18,30 18,44 4,38" fill="#374151" />
      <polygon points="32,18 18,24 18,38 32,32" fill="#4B5563" />
      <polygon points="18,14 32,20 18,26 4,20" fill="#6B7280" />
      <polygon points="8,22 16,25 16,31 8,28" fill="#111827" />
      <ellipse cx="10" cy="25" rx="1.5" ry="1" fill="#22C55E" opacity="0.9" />
      <ellipse cx="13" cy="26.5" rx="1.5" ry="1" fill="#EF4444" opacity="0.7" />
      <line x1="14" y1="32" x2="14" y2="38" stroke="#4B5563" strokeWidth="2" />
      <polygon points="10,36 14,38 18,36 18,38 14,40 10,38" fill="#374151" />
      <polygon points="18,4 28,8 18,12 8,8" fill="#1E3A5F" opacity="0.9" />
      <polygon points="18,4 28,8 28,14 18,10" fill="#1E40AF" opacity="0.7" />
      <polygon points="8,8 18,4 18,10 8,14" fill="#1D4ED8" opacity="0.6" />
      <polygon points="18,14 32,20 30,21 16,15" fill="white" fillOpacity="0.08" />
      <ellipse cx="18" cy="60" rx="10" ry="3" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function MicrowaveSVG() {
  return (
    <svg width="40" height="48" viewBox="0 0 40 48" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,24 20,32 20,44 2,36" fill="#374151" />
      <polygon points="38,18 20,26 20,38 38,30" fill="#4B5563" />
      <polygon points="20,14 38,20 20,28 2,22" fill="#6B7280" />
      <polygon points="4,24 14,28 14,38 4,34" fill="#111827" />
      <polygon points="14,24 4,20 4,24 14,28" fill="#1F2937" />
      <polygon points="6,24 10,26 10,28 6,26" fill="#22D3EE" fillOpacity="0.2" />
      <polygon points="30,20 36,22 36,32 30,30" fill="#1F2937" />
      <ellipse cx="32" cy="24" rx="1.5" ry="1" fill="#22C55E" opacity="0.9" />
      <ellipse cx="32" cy="27" rx="1.5" ry="1" fill="#F59E0B" opacity="0.8" />
      <ellipse cx="32" cy="30" rx="1.5" ry="1" fill="#EF4444" opacity="0.6" />
      <line x1="14" y1="27" x2="14" y2="35" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="20,14 38,20 36,21 18,15" fill="white" fillOpacity="0.1" />
      <ellipse cx="20" cy="44" rx="12" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function PoolTableSVG() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" style={{ imageRendering: 'pixelated' }}>
      <line x1="10" y1="50" x2="8" y2="70" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" />
      <line x1="86" y1="42" x2="86" y2="62" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="56" x2="18" y2="72" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" />
      <line x1="76" y1="48" x2="76" y2="64" stroke="#3D2B1F" strokeWidth="3" strokeLinecap="round" />
      <polygon points="4,36 48,58 48,68 4,46" fill="#3D2B1F" />
      <polygon points="92,28 48,50 48,60 92,38" fill="#2D1F16" />
      <polygon points="48,14 88,32 48,54 8,36" fill="#166534" />
      <polygon points="48,18 84,34 48,50 12,34" fill="#15803D" />
      <line x1="48" y1="18" x2="48" y2="50" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" />
      <ellipse cx="48" cy="34" rx="8" ry="4" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.25" />
      <ellipse cx="14" cy="36" rx="2.5" ry="1.5" fill="#052E16" />
      <ellipse cx="82" cy="32" rx="2.5" ry="1.5" fill="#052E16" />
      <ellipse cx="48" cy="54" rx="2.5" ry="1.5" fill="#052E16" />
      <ellipse cx="48" cy="18" rx="2.5" ry="1.5" fill="#052E16" />
      <ellipse cx="40" cy="38" rx="3" ry="2" fill="#F8FAFC" />
      <ellipse cx="56" cy="30" rx="3" ry="2" fill="#EF4444" />
      <polygon points="8,36 48,14 88,32 48,18" fill="#4A3728" />
      <ellipse cx="48" cy="72" rx="24" ry="5" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function AcUnitSVG() {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,20 24,28 24,36 2,28" fill="#334155" />
      <polygon points="46,14 24,22 24,30 46,22" fill="#475569" />
      <polygon points="24,8 46,16 24,24 2,16" fill="#94A3B8" />
      <line x1="4" y1="22" x2="22" y2="27" stroke="#1E293B" strokeWidth="1" />
      <line x1="4" y1="25" x2="22" y2="30" stroke="#1E293B" strokeWidth="1" />
      <line x1="4" y1="28" x2="22" y2="33" stroke="#1E293B" strokeWidth="1" />
      <line x1="26" y1="22" x2="44" y2="16" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="26" y1="25" x2="44" y2="19" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.5" />
      <ellipse cx="42" cy="17" rx="2" ry="1.2" fill="#22D3EE" opacity="0.9" />
      <line x1="4" y1="18" x2="0" y2="20" stroke="#BFDBFE" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="4" y1="20" x2="0" y2="23" stroke="#BFDBFE" strokeWidth="1" strokeOpacity="0.3" />
      <polygon points="24,8 46,16 44,17 22,9" fill="white" fillOpacity="0.12" />
    </svg>
  );
}

function LockerSVG() {
  return (
    <svg width="40" height="80" viewBox="0 0 40 80" fill="none" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,34 20,44 20,76 2,66" fill="#1E3A5F" />
      <polygon points="38,26 20,36 20,68 38,58" fill="#1E40AF" />
      <polygon points="20,18 38,28 20,38 2,28" fill="#2563EB" />
      <line x1="2" y1="50" x2="20" y2="57" stroke="#1D4ED8" strokeWidth="1.5" />
      <line x1="38" y1="42" x2="20" y2="49" stroke="#1D4ED8" strokeWidth="1.5" />
      <ellipse cx="7" cy="40" rx="1.5" ry="1" fill="#93C5FD" opacity="0.9" />
      <ellipse cx="33" cy="32" rx="1.5" ry="1" fill="#93C5FD" opacity="0.7" />
      <line x1="10" y1="36" x2="16" y2="38" stroke="#1D4ED8" strokeWidth="0.8" />
      <line x1="10" y1="38" x2="16" y2="40" stroke="#1D4ED8" strokeWidth="0.8" />
      <ellipse cx="7" cy="58" rx="1.5" ry="1" fill="#93C5FD" opacity="0.9" />
      <ellipse cx="33" cy="50" rx="1.5" ry="1" fill="#93C5FD" opacity="0.7" />
      <line x1="10" y1="60" x2="16" y2="62" stroke="#1D4ED8" strokeWidth="0.8" />
      <line x1="10" y1="62" x2="16" y2="64" stroke="#1D4ED8" strokeWidth="0.8" />
      <polygon points="20,18 38,28 36,29 18,19" fill="white" fillOpacity="0.1" />
      <ellipse cx="20" cy="76" rx="12" ry="3" fill="black" fillOpacity="0.18" />
    </svg>
  );
}

function TvScreenSVG({ label = '' }: { label: string }) {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" style={{ imageRendering: 'pixelated' }}>
      <line x1="20" y1="56" x2="18" y2="68" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="50" x2="36" y2="62" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="12,66 28,72 44,66 44,68 28,74 12,68" fill="#4B5563" />
      <polygon points="2,32 28,44 28,56 2,44" fill="#1E293B" />
      <polygon points="54,24 28,36 28,48 54,36" fill="#111827" />
      <polygon points="28,14 54,24 28,36 2,24" fill="#374151" />
      <polygon points="4,30 26,40 26,52 4,42" fill="#0C1A3A" />
      <polygon points="52,24 26,34 26,46 52,36" fill="#0F2051" />
      <polygon points="28,16 52,25 26,35 4,26" fill="#1E3A8A" />
      <rect x="7" y="38" width="3" height="9" fill="#3B82F6" opacity="0.9" transform="skewY(-20)" />
      <rect x="12" y="36" width="3" height="11" fill="#60A5FA" opacity="0.8" transform="skewY(-20)" />
      <rect x="17" y="37" width="3" height="10" fill="#93C5FD" opacity="0.7" transform="skewY(-20)" />
      <rect x="22" y="35" width="3" height="12" fill="#2563EB" opacity="0.9" transform="skewY(-20)" />
      <polyline points="8,43 13,41 18,42 23,40" stroke="#FCD34D" strokeWidth="1" fill="none" opacity="0.8" />
      <polygon points="28,16 40,20 34,24 22,20" fill="white" fillOpacity="0.07" />
      <polygon points="28,14 54,24 52,25 26,15" fill="white" fillOpacity="0.08" />
      {label ? (
        <text x="28" y="54" textAnchor="middle" dominantBaseline="middle" fill="#93C5FD" fontSize="5" fontFamily="monospace" opacity="0.8" transform="skewX(-10)">{label}</text>
      ) : null}
      <ellipse cx="28" cy="70" rx="14" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FurniSprite({ type, pos, color = '#64748B', direction = 2, tileX, tileY, zBonus = 2, label = '' }: FurniSpriteProps) {
  const [usePng, setUsePng] = useState(false);

  // FIX A: zIndex sincronizado com fórmula do RoomView: (x+y)*200 + 20 + bonus*20
  const zIndex = (tileX + tileY) * 200 + 20 + zBonus * 20;

  const size = SIZE[type] ?? { w: 64, h: 64 };
  const { w, h } = size;
  const flip = direction === 0 || direction === 6;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: pos.x - w / 2,
    top: pos.y - h,
    zIndex,
    pointerEvents: 'none',
  };

  const FURNI_MAP: Record<string, string> = {
    desk:       'hc_exe_wrkdesk',
    chair:      'hc_exe_chair',
    table:      'hc_exe_table',
    sofa:       'hc_exe_sofa',
    whiteboard: 'hc_exe_whiteboard',
    plant:      'hh_fur_plant_cactus',
  };

  const pngName = FURNI_MAP[type];

  if (pngName && usePng) {
    return (
      <img
        src={`/furni/${pngName}.png`}
        alt={type}
        width={w}
        height={h}
        style={{
          ...style,
          imageRendering: 'pixelated',
          transform: flip ? 'scaleX(-1)' : undefined,
          filter: color && type === 'desk'
            ? `sepia(1) saturate(3) hue-rotate(${hueFromHex(color)}deg) brightness(0.9)`
            : undefined,
        }}
        onError={() => setUsePng(false)}
      />
    );
  }

  const svgStyle = { ...style };
  switch (type) {
    case 'desk':           return <div style={svgStyle}><DeskSVG color={color} flip={flip} /></div>;
    case 'chair':          return <div style={svgStyle}><ChairSVG color={color} flip={flip} /></div>;
    case 'table':          return <div style={svgStyle}><TableSVG /></div>;
    case 'sofa':           return <div style={svgStyle}><SofaSVG color={color} flip={flip} /></div>;
    case 'whiteboard':     return <div style={svgStyle}><WhiteboardSVG /></div>;
    case 'plant':          return <div style={svgStyle}><PlantSVG /></div>;
    case 'divider':        return <div style={svgStyle}><DividerSVG /></div>;
    case 'lamp':           return <div style={svgStyle}><LampSVG /></div>;
    case 'rug':            return <div style={svgStyle}><RugSVG color={color} /></div>;
    case 'bookshelf':      return <div style={svgStyle}><BookshelfSVG /></div>;
    case 'trash':          return <div style={svgStyle}><TrashSVG /></div>;
    case 'computer':       return <div style={svgStyle}><ComputerSVG flip={flip} /></div>;
    case 'couch':          return <div style={svgStyle}><CouchSVG color={color} flip={flip} /></div>;
    case 'coffee_table':   return <div style={svgStyle}><CoffeeTableSVG color={color} /></div>;
    case 'cabinet':        return <div style={svgStyle}><CabinetSVG color={color} /></div>;
    case 'mug':            return <div style={svgStyle}><MugSVG color={color} /></div>;
    case 'glass_wall':     return <div style={svgStyle}><GlassWallSVG flip={flip} /></div>;
    case 'sign':           return <div style={svgStyle}><SignSVG label={label || 'SCOUT 360'} /></div>;
    case 'monitor_dual':   return <div style={svgStyle}><MonitorDualSVG flip={flip} /></div>;
    case 'fridge':         return <div style={svgStyle}><FridgeSVG /></div>;
    case 'coffee_machine': return <div style={svgStyle}><CoffeeMachineSVG /></div>;
    case 'microwave':      return <div style={svgStyle}><MicrowaveSVG /></div>;
    case 'pool_table':     return <div style={svgStyle}><PoolTableSVG /></div>;
    case 'ac_unit':        return <div style={svgStyle}><AcUnitSVG /></div>;
    case 'locker':         return <div style={svgStyle}><LockerSVG /></div>;
    case 'tv_screen':      return <div style={svgStyle}><TvScreenSVG label={label} /></div>;
    default:
      return (
        <div style={svgStyle}>
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            <polygon points={`${w*0.5},4 ${w-4},${h*0.5} ${w*0.5},${h-4} 4,${h*0.5}`} fill="#475569" />
            <text x={w/2} y={h/2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontFamily="monospace">{String(type)[0].toUpperCase()}</text>
          </svg>
        </div>
      );
  }
}

function hueFromHex(hex: string): number {
  try {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0,2), 16) / 255;
    const g = parseInt(h.slice(2,4), 16) / 255;
    const b = parseInt(h.slice(4,6), 16) / 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let hue = 0;
    if (max !== min) {
      const d = max - min;
      if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) hue = ((b - r) / d + 2) / 6;
      else hue = ((r - g) / d + 4) / 6;
    }
    return Math.round(hue * 360);
  } catch { return 0; }
}
