import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User } from './HabboClient';
import { furniture } from '@/data/specialists';
import { Furniture } from '@/types';
import FurniSprite from './FurniSprite';

interface RoomViewProps {
  users: User[];
  map: number[][];
  onTileClick: (x: number, y: number) => void;
}

const TILE_W = 64;
const TILE_H = 32;

const getTileColors = (val: number, x: number, y: number) => {
  // Checker visível — contraste alto como na referência Habbo
  const isLight = (x + y) % 2 === 0;
  switch (val) {
    // Piso open space — cinza azulado, checker forte
    case 1: return isLight
      ? { top: '#B8C8D8', left: '#8098AE', right: '#6080A0', h: 8, accent: 'rgba(255,255,255,0.12)' }
      : { top: '#D0DCE6', left: '#A0B4C4', right: '#80A0B8', h: 8, accent: 'rgba(255,255,255,0.04)' };
    // Corredor — cinza azulado médio, checker forte
    case 2: return isLight
      ? { top: '#7890A8', left: '#506878', right: '#384858', h: 8, accent: 'rgba(255,255,255,0.08)' }
      : { top: '#90A8C0', left: '#688098', right: '#507080', h: 8, accent: 'rgba(255,255,255,0.03)' };
    // Meeting room — azul petróleo profundo, checker sutil
    case 3: return isLight
      ? { top: '#2A5070', left: '#183850', right: '#102838', h: 8, accent: 'rgba(80,160,255,0.10)' }
      : { top: '#345A78', left: '#204260', right: '#143040', h: 8, accent: 'rgba(80,160,255,0.05)' };
    // Divisória interna — parede real, alta
    case 4: return { top: '#D8E0E8', left: '#98A8B8', right: '#788898', h: 48, accent: 'rgba(255,255,255,0.15)' };
    // Divider baixo
    case 5: return { top: '#B8C8D8', left: '#8098AE', right: '#607888', h: 12, accent: 'rgba(255,255,255,0.08)' };
    // Lounge — tom quente madeira, checker visível
    case 6: return isLight
      ? { top: '#A09080', left: '#6E5E54', right: '#544840', h: 8, accent: 'rgba(255,200,150,0.12)' }
      : { top: '#BEB0A0', left: '#887868', right: '#6C5C54', h: 8, accent: 'rgba(255,200,150,0.05)' };
    // Copa — concreto claro diferenciado, checker
    case 7: return isLight
      ? { top: '#98B0C0', left: '#607888', right: '#486070', h: 8, accent: 'rgba(255,255,255,0.10)' }
      : { top: '#B0C4D0', left: '#788A9A', right: '#607080', h: 8, accent: 'rgba(255,255,255,0.04)' };
    // Parede externa — alta, branco sólido
    case 8: return { top: '#E8EEF4', left: '#B0C4D4', right: '#90AABC', h: 80, accent: 'rgba(255,255,255,0.22)' };
    // Janela — alta, vidro azul translúcido
    case 9: return { top: '#D8E4EE', left: '#88A8C0', right: '#6888A0', h: 80, accent: 'rgba(140,200,255,0.35)' };
    // Parede fundo — mais alta ainda
    case 10: return { top: '#ECF0F6', left: '#B8CCD8', right: '#98B0C4', h: 96, accent: 'rgba(255,255,255,0.20)' };
    default: return null;
  }
};

const FURNI_Z_BONUS: Record<string, number> = {
  rug: 0, chair: 1, trash: 1, divider: 1, locker: 1,
  desk: 2, sofa: 2, couch: 2, coffee_table: 2, pool_table: 2,
  plant: 3, lamp: 3, table: 3, cabinet: 3, fridge: 3,
  coffee_machine: 3, microwave: 3, ac_unit: 3,
  bookshelf: 4, whiteboard: 5, glass_wall: 5, sign: 5, tv_screen: 5,
  computer: 6, monitor_dual: 6, mug: 7,
};

const WALK_FRAMES = [0, 1, 2, 3];

// Cityscape SVG — silhueta de predios vista pelas janelas
function CityscapeSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1400 320"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 1 }}
    >
      {/* Ceu degradê */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="60%" stopColor="#B8DFF0" />
          <stop offset="100%" stopColor="#D8EEF8" />
        </linearGradient>
        <linearGradient id="buildingFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8AA0B8" />
          <stop offset="100%" stopColor="#607080" />
        </linearGradient>
        <linearGradient id="buildingMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6A8098" />
          <stop offset="100%" stopColor="#485868" />
        </linearGradient>
        <linearGradient id="buildingNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#506070" />
          <stop offset="100%" stopColor="#303E4A" />
        </linearGradient>
      </defs>
      <rect width="1400" height="320" fill="url(#skyGrad)" />
      {/* Nuvens */}
      <ellipse cx="200" cy="60" rx="80" ry="18" fill="white" opacity="0.75" />
      <ellipse cx="240" cy="55" rx="60" ry="14" fill="white" opacity="0.6" />
      <ellipse cx="650" cy="45" rx="100" ry="20" fill="white" opacity="0.65" />
      <ellipse cx="700" cy="40" rx="70" ry="15" fill="white" opacity="0.5" />
      <ellipse cx="1100" cy="70" rx="90" ry="16" fill="white" opacity="0.6" />
      {/* Predios distantes — cinza claro */}
      <rect x="0"    y="160" width="60"  height="160" fill="url(#buildingFar)" />
      <rect x="55"   y="140" width="45"  height="180" fill="url(#buildingFar)" />
      <rect x="95"   y="170" width="70"  height="150" fill="url(#buildingFar)" />
      <rect x="200"  y="130" width="55"  height="190" fill="url(#buildingFar)" />
      <rect x="250"  y="155" width="80"  height="165" fill="url(#buildingFar)" />
      <rect x="400"  y="120" width="60"  height="200" fill="url(#buildingFar)" />
      <rect x="455"  y="145" width="45"  height="175" fill="url(#buildingFar)" />
      <rect x="600"  y="135" width="55"  height="185" fill="url(#buildingFar)" />
      <rect x="650"  y="110" width="70"  height="210" fill="url(#buildingFar)" />
      <rect x="800"  y="150" width="60"  height="170" fill="url(#buildingFar)" />
      <rect x="855"  y="125" width="50"  height="195" fill="url(#buildingFar)" />
      <rect x="1000" y="140" width="65"  height="180" fill="url(#buildingFar)" />
      <rect x="1060" y="115" width="55"  height="205" fill="url(#buildingFar)" />
      <rect x="1200" y="130" width="70"  height="190" fill="url(#buildingFar)" />
      <rect x="1265" y="155" width="50"  height="165" fill="url(#buildingFar)" />
      <rect x="1340" y="145" width="60"  height="175" fill="url(#buildingFar)" />
      {/* Janelas nos predios distantes */}
      {[0,55,95,200,250,400,455,600,650,800,855,1000,1060,1200,1265,1340].map((bx, i) => (
        <g key={i}>
          <rect x={bx+6}  y={170+(i%3)*12} width={8} height={6} fill="#FCD34D" opacity="0.4" />
          <rect x={bx+18} y={175+(i%2)*14} width={8} height={6} fill="#FCD34D" opacity="0.3" />
          <rect x={bx+6}  y={195+(i%3)*10} width={8} height={6} fill="white" opacity="0.2" />
        </g>
      ))}
      {/* Predios medios */}
      <rect x="130"  y="175" width="75"  height="145" fill="url(#buildingMid)" />
      <rect x="330"  y="160" width="80"  height="160" fill="url(#buildingMid)" />
      <rect x="520"  y="165" width="90"  height="155" fill="url(#buildingMid)" />
      <rect x="720"  y="158" width="85"  height="162" fill="url(#buildingMid)" />
      <rect x="920"  y="163" width="80"  height="157" fill="url(#buildingMid)" />
      <rect x="1120" y="155" width="88"  height="165" fill="url(#buildingMid)" />
      {/* Predios proximos — mais escuros */}
      <rect x="165"  y="190" width="60"  height="130" fill="url(#buildingNear)" />
      <rect x="370"  y="185" width="65"  height="135" fill="url(#buildingNear)" />
      <rect x="560"  y="188" width="58"  height="132" fill="url(#buildingNear)" />
      <rect x="760"  y="182" width="62"  height="138" fill="url(#buildingNear)" />
      <rect x="960"  y="187" width="60"  height="133" fill="url(#buildingNear)" />
      {/* Linha do horizonte */}
      <rect x="0" y="316" width="1400" height="4" fill="#304050" opacity="0.4" />
    </svg>
  );
}

// ═══ HABBO AVATAR — Pixel-grid system, autêntico Habbo ═══════════════════════
const AVATAR_TRAITS: Record<string, { hair: string; skin: string; shirt: string; pants: string; hairStyle: number }> = {
  satya:      { hair: '#1A1A2E', skin: '#C68642', shirt: '#0078D4', pants: '#1E293B', hairStyle: 0 },
  uncle_bob:  { hair: '#8B8B8B', skin: '#F5C99A', shirt: '#DC2626', pants: '#1E293B', hairStyle: 1 },
  karpathy:   { hair: '#3B2506', skin: '#F5C99A', shirt: '#7C3AED', pants: '#334155', hairStyle: 0 },
  rogati:     { hair: '#2D1F14', skin: '#DEB887', shirt: '#059669', pants: '#1E293B', hairStyle: 2 },
  osmani:     { hair: '#1A1A2E', skin: '#C68642', shirt: '#F59E0B', pants: '#334155', hairStyle: 0 },
  whittaker:  { hair: '#6B3A1F', skin: '#F5C99A', shirt: '#EF4444', pants: '#1E293B', hairStyle: 1 },
  dixon:      { hair: '#4A3728', skin: '#F5C99A', shirt: '#06B6D4', pants: '#334155', hairStyle: 0 },
  dodds:      { hair: '#3B2506', skin: '#F5C99A', shirt: '#EC4899', pants: '#1E293B', hairStyle: 0 },
  rauch:      { hair: '#1A1A2E', skin: '#DEB887', shirt: '#171717', pants: '#0F172A', hairStyle: 0 },
  rodrigues:  { hair: '#1A1A2E', skin: '#DEB887', shirt: '#16A34A', pants: '#1E293B', hairStyle: 1 },
  kozyrkov:   { hair: '#6B3A1F', skin: '#F5C99A', shirt: '#8B5CF6', pants: '#334155', hairStyle: 2 },
  cagan:      { hair: '#8B8B8B', skin: '#F5C99A', shirt: '#F97316', pants: '#1E293B', hairStyle: 1 },
  grove:      { hair: '#C0C0C0', skin: '#F5C99A', shirt: '#64748B', pants: '#1E293B', hairStyle: 1 },
  '1':        { hair: '#3B2506', skin: '#DEB887', shirt: '#4A90E2', pants: '#1E293B', hairStyle: 0 },
};

function shadeColor(hex: string, amount: number): string {
  try {
    const h = hex.replace('#', '');
    const num = parseInt(h, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  } catch { return hex; }
}

// ─── Pixel-grid sprite definitions ──────────────────────────────────────────
// 16 cols × 25 rows, each cell = 2px → 32×50 SVG
// Color codes: 0=transparent, 1=hair, 2=hairDark, 3=skin, 4=skinDark,
//   5=shirt, 6=shirtDark, 7=shirtLight(collar), 8=pants, 9=pantsDark,
//  10=shoes, 11=shoeHighlight, 12=eyes, 13=eyeWhite, 14=mouth

// Hair rows (top 5 rows) per style — they replace rows 0-4 of the base grid
const HAIR_ROWS: Record<number, number[][]> = {
  0: [ // Full modern hair
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,2,3,3,3,3,3,3,2,1,0,0,0],
    [0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0],
  ],
  1: [ // Short / receding
    [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
  ],
  2: [ // Long hair — shoulder-length
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,1,3,3,3,3,3,3,3,3,1,1,0,0],
    [0,0,1,1,3,3,3,3,3,3,3,3,1,1,0,0],
  ],
};

// Base front sprite (rows 5-24, shared across all hair styles)
const FRONT_BODY: number[][] = [
  [0,0,0,0,3,13,12,3,3,13,12,3,0,0,0,0], // 5  — eyes
  [0,0,0,0,3,3,3,14,14,3,3,3,0,0,0,0],   // 6  — nose
  [0,0,0,0,3,3,3,4,4,3,3,3,0,0,0,0],     // 7  — mouth
  [0,0,0,0,0,3,4,3,3,4,3,0,0,0,0,0],     // 8  — chin
  [0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0],     // 9  — neck
  [0,0,0,0,5,5,5,7,7,5,5,5,0,0,0,0],     // 10 — collar
  [0,0,0,5,5,5,5,7,7,5,5,5,5,0,0,0],     // 11 — shoulders
  [0,0,3,5,5,5,5,5,5,5,5,5,5,3,0,0],     // 12 — upper arms + torso
  [0,0,3,5,5,5,5,5,5,5,5,5,5,3,0,0],     // 13 — mid torso
  [0,0,3,6,5,5,5,5,5,5,5,5,6,3,0,0],     // 14 — lower arms
  [0,0,4,6,6,5,5,5,5,5,5,6,6,4,0,0],     // 15 — hands + belt
  [0,0,0,0,6,6,6,6,6,6,6,6,0,0,0,0],     // 16 — belt
  [0,0,0,0,8,8,8,8,8,8,8,8,0,0,0,0],     // 17 — pants top
  [0,0,0,0,8,8,8,0,0,8,8,8,0,0,0,0],     // 18 — legs split
  [0,0,0,0,8,8,8,0,0,8,8,8,0,0,0,0],     // 19 — legs
  [0,0,0,0,8,8,9,0,0,9,8,8,0,0,0,0],     // 20 — lower legs
  [0,0,0,0,9,9,9,0,0,9,9,9,0,0,0,0],     // 21 — ankles
  [0,0,0,10,10,10,10,0,0,10,10,10,10,0,0,0],// 22 — shoes
  [0,0,0,10,11,10,10,0,0,10,10,11,10,0,0,0],// 23 — soles
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],      // 24 — padding
];

// Back sprite body (no face details)
const BACK_BODY: number[][] = [
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],     // 5  — back of head
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],     // 6
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],     // 7
  [0,0,0,0,0,3,4,3,3,4,3,0,0,0,0,0],     // 8  — neck base
  [0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0],     // 9
  [0,0,0,0,6,6,5,5,5,5,6,6,0,0,0,0],     // 10 — back collar
  [0,0,0,6,6,5,5,5,5,5,5,6,6,0,0,0],     // 11
  [0,0,3,6,5,5,5,5,5,5,5,5,6,3,0,0],     // 12
  [0,0,3,6,5,5,5,5,5,5,5,5,6,3,0,0],     // 13
  [0,0,3,6,5,5,5,5,5,5,5,5,6,3,0,0],     // 14
  [0,0,4,6,6,5,5,5,5,5,5,6,6,4,0,0],     // 15
  [0,0,0,0,6,6,6,6,6,6,6,6,0,0,0,0],     // 16
  [0,0,0,0,8,8,8,8,8,8,8,8,0,0,0,0],     // 17
  [0,0,0,0,8,8,8,0,0,8,8,8,0,0,0,0],     // 18
  [0,0,0,0,8,8,8,0,0,8,8,8,0,0,0,0],     // 19
  [0,0,0,0,8,8,9,0,0,9,8,8,0,0,0,0],     // 20
  [0,0,0,0,9,9,9,0,0,9,9,9,0,0,0,0],     // 21
  [0,0,0,10,10,10,10,0,0,10,10,10,10,0,0,0],// 22
  [0,0,0,10,11,10,10,0,0,10,10,11,10,0,0,0],// 23
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],      // 24
];

// Back hair rows — hair covers back of head more
const BACK_HAIR: Record<number, number[][]> = {
  0: [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  ],
  1: [
    [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
  ],
  2: [
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  ],
};

function HabboAvatar({ id, direction }: { id: string; direction: number }) {
  const t = AVATAR_TRAITS[id] ?? AVATAR_TRAITS['1'];
  const facingLeft = direction >= 5 && direction <= 7;
  const facingBack = direction === 0 || direction === 1 || direction === 7;

  // Build color palette from traits
  const P: Record<number, string> = {
    1: t.hair, 2: shadeColor(t.hair, -20),
    3: t.skin, 4: shadeColor(t.skin, -30),
    5: t.shirt, 6: shadeColor(t.shirt, -35), 7: shadeColor(t.shirt, 45),
    8: t.pants, 9: shadeColor(t.pants, -25),
    10: '#111827', 11: '#2D3748',
    12: '#1E293B', 13: '#E8E8E8', 14: shadeColor(t.skin, -15),
  };

  // Assemble full grid: hair rows (0-4) + body rows (5-24) = 25 rows total
  const hairRows = facingBack
    ? (BACK_HAIR[t.hairStyle] ?? BACK_HAIR[0])
    : (HAIR_ROWS[t.hairStyle] ?? HAIR_ROWS[0]);
  const bodyRows = facingBack ? BACK_BODY : FRONT_BODY;
  const grid = [...hairRows, ...bodyRows];

  return (
    <svg width="32" height="50" viewBox="0 0 32 50" fill="none"
      style={{ imageRendering: 'pixelated', display: 'block', transform: facingLeft ? 'scaleX(-1)' : undefined }}
    >
      {grid.map((row, ry) =>
        row.map((cell, rx) => {
          if (cell === 0) return null;
          return <rect key={`${rx}-${ry}`} x={rx*2} y={ry*2} width={2} height={2} fill={P[cell] ?? '#FF00FF'} />;
        })
      )}
    </svg>
  );
}

const AVATAR_COLORS: Record<string, string> = {
  satya: '#0078D4', uncle_bob: '#DC2626', karpathy: '#7C3AED', rogati: '#059669',
  osmani: '#F59E0B', whittaker: '#EF4444', dixon: '#06B6D4', dodds: '#EC4899',
  rauch: '#171717', rodrigues: '#16A34A', kozyrkov: '#8B5CF6', cagan: '#F97316',
  grove: '#64748B', '1': '#4A90E2',
};

export default function RoomView({ users, map, onTileClick }: RoomViewProps) {
  const width = map[0].length;
  const height = map.length;

  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [walkFrames, setWalkFrames] = useState<Record<string, number>>({});
  const walkTimers = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const prevPositions = useRef<Record<string, { x: number; y: number }>>({});
  const [habboFailed, setHabboFailed] = useState<Record<string, boolean>>({});

  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    users.forEach(u => {
      const prev = prevPositions.current[u.id];
      const moved = prev && (prev.x !== u.x || prev.y !== u.y);
      prevPositions.current[u.id] = { x: u.x, y: u.y };
      if (moved) {
        if (!walkTimers.current[u.id]) {
          let frame = 0;
          walkTimers.current[u.id] = setInterval(() => {
            frame = (frame + 1) % WALK_FRAMES.length;
            setWalkFrames(prev => ({ ...prev, [u.id]: WALK_FRAMES[frame] }));
          }, 160);
        }
        setTimeout(() => {
          if (walkTimers.current[u.id]) {
            clearInterval(walkTimers.current[u.id]);
            delete walkTimers.current[u.id];
            setWalkFrames(prev => ({ ...prev, [u.id]: 0 }));
          }
        }, 640);
      }
    });
  }, [users]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setDragMoved(true);
      setCameraOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    };
    const handleGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const offsetX = windowSize.width / 2;
  const offsetY = windowSize.height / 2 - (height * TILE_H) / 2;

  const getScreenPos = useCallback((x: number, y: number) => ({
    x: offsetX + (x - y) * (TILE_W / 2) + cameraOffset.x,
    y: offsetY + (x + y) * (TILE_H / 2) + cameraOffset.y,
  }), [offsetX, offsetY, cameraOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragMoved(false);
    dragStart.current = { x: e.clientX - cameraOffset.x, y: e.clientY - cameraOffset.y };
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragMoved(false);
    dragStart.current = { x: e.touches[0].clientX - cameraOffset.x, y: e.touches[0].clientY - cameraOffset.y };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragMoved(true);
    setCameraOffset({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
  };
  const handleTouchEnd = () => setIsDragging(false);
  const handleTileClick = (x: number, y: number) => { if (!dragMoved) onTileClick(x, y); };

  const isWalkable = (val: number) => [1, 2, 3, 6, 7].includes(val);
  const isWall = (val: number) => [4, 5, 8, 9, 10].includes(val);

  const tiles: React.ReactNode[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = map[y][x];
      if (val === 0) continue;
      const colors = getTileColors(val, x, y);
      if (!colors) continue;
      const pos = getScreenPos(x, y);
      const walkable = isWalkable(val);
      const wall = isWall(val);

      if (wall && val >= 8) {
        const isWindow = val === 9;
        // Detect wall neighbors for continuous rendering
        const hasWallLeft  = [8,9,10].includes(map[y]?.[x-1] ?? 0);
        const hasWallRight = [8,9,10].includes(map[y]?.[x+1] ?? 0);
        const hasWallUp    = [8,9,10].includes(map[y-1]?.[x] ?? 0);
        const hasWallDown  = [8,9,10].includes(map[y+1]?.[x] ?? 0);

        tiles.push(
          <div
            key={`tile-${x}-${y}`}
            className="absolute pointer-events-none"
            style={{
              left: pos.x - TILE_W / 2,
              top: pos.y - colors.h,
              width: TILE_W,
              height: TILE_H + colors.h,
              zIndex: (x + y) * 10 - 1,
            }}
          >
            {/* Face topo */}
            <div className="absolute w-full h-[32px] top-0 left-0" style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              backgroundColor: colors.top,
            }} />
            {/* Face esquerda — oculta se vizinho à esquerda é parede (mesma linha) */}
            {!hasWallUp && (
              <div className="absolute w-[32px] left-0" style={{
                height: colors.h + 16,
                top: 16,
                clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))',
                backgroundColor: colors.left,
                position: 'absolute',
              }}>
                {isWindow && (
                  <>
                    <div style={{ position:'absolute', left:2, top:'12%', width:12, height:colors.h*0.35, backgroundColor:'#334155', borderRadius:1, opacity:0.6 }} />
                    <div style={{ position:'absolute', left:2, top:'55%', width:12, height:colors.h*0.32, backgroundColor:'#334155', borderRadius:1, opacity:0.6 }} />
                    <div style={{ position:'absolute', left:3, top:'13%', width:10, height:colors.h*0.33, background:'linear-gradient(135deg, #BFDBFE 0%, #93C5FD 100%)', borderRadius:1, opacity:0.6 }} />
                    <div style={{ position:'absolute', left:3, top:'56%', width:10, height:colors.h*0.3, background:'linear-gradient(135deg, #BFDBFE 0%, #93C5FD 100%)', borderRadius:1, opacity:0.5 }} />
                    <div style={{ position:'absolute', left:4, top:'14%', width:3, height:colors.h*0.08, backgroundColor:'white', borderRadius:1, opacity:0.5 }} />
                  </>
                )}
                {/* Rodapé esquerdo */}
                <div style={{ position:'absolute', bottom:0, left:0, width:'100%', height:6, backgroundColor:'rgba(0,0,0,0.2)' }} />
              </div>
            )}
            {/* Face direita — oculta se vizinho abaixo é parede (continuidade vertical) */}
            {!hasWallDown && (
              <div className="absolute w-[32px] left-[32px]" style={{
                height: colors.h + 16,
                top: 16,
                clipPath: 'polygon(0% 16px, 100% 0%, 100% calc(100% - 16px), 0% 100%)',
                backgroundColor: colors.right,
              }}>
                {isWindow && (
                  <>
                    <div style={{ position:'absolute', right:2, top:'12%', width:12, height:colors.h*0.35, backgroundColor:'#334155', borderRadius:1, opacity:0.5 }} />
                    <div style={{ position:'absolute', right:2, top:'55%', width:12, height:colors.h*0.32, backgroundColor:'#334155', borderRadius:1, opacity:0.5 }} />
                    <div style={{ position:'absolute', right:3, top:'13%', width:10, height:colors.h*0.33, background:'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)', borderRadius:1, opacity:0.5 }} />
                    <div style={{ position:'absolute', right:3, top:'56%', width:10, height:colors.h*0.3, background:'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)', borderRadius:1, opacity:0.4 }} />
                  </>
                )}
                {/* Rodapé direito */}
                <div style={{ position:'absolute', bottom:0, right:0, width:'100%', height:6, backgroundColor:'rgba(0,0,0,0.15)' }} />
              </div>
            )}
            {/* Sombra sutil na base da parede */}
            <div className="absolute w-full" style={{
              bottom: 0,
              height: 8,
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.22))',
              pointerEvents: 'none',
            }} />
          </div>
        );
        continue;
      }

      tiles.push(
        <div
          key={`tile-${x}-${y}`}
          onMouseUp={() => walkable && handleTileClick(x, y)}
          className={`absolute ${walkable && !isDragging ? 'cursor-pointer' : ''} group`}
          style={{
            left: pos.x - TILE_W / 2,
            top: pos.y - colors.h,
            width: TILE_W,
            height: TILE_H + colors.h,
            zIndex: (x + y) * 10,
          }}
        >
          <div className="absolute w-full h-[32px] top-0 left-0" style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            backgroundColor: colors.top,
          }}>
            <div className="absolute inset-0" style={{
              clipPath: 'polygon(50% 0%, 75% 25%, 50% 50%, 25% 25%)',
              backgroundColor: colors.accent,
            }} />
            {walkable && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-75" style={{
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                backgroundColor: 'rgba(255,255,255,0.14)',
              }} />
            )}
          </div>
          {colors.h > 0 && (
            <div className="absolute w-[32px] left-0" style={{
              height: colors.h + 16,
              top: 16,
              clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))',
              backgroundColor: colors.left,
            }} />
          )}
          {colors.h > 0 && (
            <div className="absolute w-[32px] left-[32px]" style={{
              height: colors.h + 16,
              top: 16,
              clipPath: 'polygon(0% 16px, 100% 0%, 100% calc(100% - 16px), 0% 100%)',
              backgroundColor: colors.right,
            }} />
          )}
          {/* Sombra sutil nas bordas de sala — simula iluminacao de teto */}
          {(val === 3) && (
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(100,180,255,0.06) 0%, rgba(0,0,50,0.12) 100%)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />
          )}
        </div>
      );
    }
  }

  // ═══ BORDA DO PISO — detectar edges e desenhar contorno ═══════════════════
  const floorEdges: React.ReactNode[] = [];
  const isFloor = (v: number) => [1,2,3,6,7].includes(v);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = map[y][x];
      if (!isFloor(val)) continue;
      const pos = getScreenPos(x, y);
      const z = (x + y) * 10 + 1;
      // Borda direita-baixo (tile à direita é void ou parede)
      const rightVal = map[y]?.[x+1] ?? 0;
      if (!isFloor(rightVal) && rightVal !== 4 && rightVal !== 5) {
        floorEdges.push(
          <div key={`edge-r-${x}-${y}`} className="absolute pointer-events-none" style={{
            left: pos.x + TILE_W/4 - 1, top: pos.y - TILE_H/4,
            width: 3, height: TILE_H/2 + 10,
            backgroundColor: '#0F172A',
            transform: 'skewY(26.57deg)',
            zIndex: z,
          }} />
        );
      }
      // Borda esquerda-baixo (tile abaixo é void ou parede)
      const bottomVal = map[y+1]?.[x] ?? 0;
      if (!isFloor(bottomVal) && bottomVal !== 4 && bottomVal !== 5) {
        floorEdges.push(
          <div key={`edge-b-${x}-${y}`} className="absolute pointer-events-none" style={{
            left: pos.x - TILE_W/4 - 1, top: pos.y - TILE_H/4,
            width: 3, height: TILE_H/2 + 10,
            backgroundColor: '#1E293B',
            transform: 'skewY(-26.57deg)',
            zIndex: z,
          }} />
        );
      }
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ═══ BARRA SUPERIOR — nome do quarto estilo Habbo ═══ */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none" style={{ height: 32 }}>
        <div className="px-4 py-1 font-pixel text-[9px] text-white tracking-wider" style={{
          background: 'linear-gradient(180deg, rgba(10,20,40,0.92) 0%, rgba(5,15,35,0.88) 100%)',
          border: '1px solid rgba(74,158,255,0.4)',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          textShadow: '0 1px 2px rgba(0,0,0,0.9)',
        }}>
          🏢 BOARD ROOM — Senior Scout 360
        </div>
      </div>

      <div
        className={`absolute inset-0 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ backgroundColor: '#87CEEB' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cityscape de fundo */}
        <CityscapeSVG />

        {/* Linha do horizonte / chao externo */}
        <div className="absolute w-full pointer-events-none" style={{
          bottom: 0,
          height: '38%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(20,30,50,0.55) 100%)',
        }} />

        {tiles}
        {floorEdges}

        {furniture.map((f: Furniture) => {
          const pos = getScreenPos(f.x, f.y);
          const bonus = FURNI_Z_BONUS[f.type] ?? 2;
          return (
            <FurniSprite
              key={f.id}
              type={f.type}
              pos={pos}
              color={f.color}
              direction={f.direction}
              tileX={f.x}
              tileY={f.y}
              zBonus={bonus}
              label={f.label}
            />
          );
        })}

        {users.map(user => {
          const pos = getScreenPos(user.x, user.y);

          return (
            <div
              key={user.id}
              className="absolute flex flex-col items-center pointer-events-none"
              style={{
                left: pos.x,
                top: pos.y - 8,
                transform: 'translate(-50%, -100%)',
                zIndex: (user.x + user.y) * 10 + 8,
              }}
            >
              {/* Nameplate estilo Habbo */}
              <div
                className="mb-0.5 px-1.5 py-px font-pixel text-[8px] font-bold text-white whitespace-nowrap"
                style={{
                  background: 'linear-gradient(180deg, #1a4a8a 0%, #0e2d5e 100%)',
                  border: '1px solid #4a9eff',
                  borderRadius: '2px',
                  boxShadow: '0 1px 0 #07193a',
                  letterSpacing: '0.03em',
                  textShadow: '0 1px 1px rgba(0,0,0,0.9)',
                }}
              >
                {user.name}
              </div>

              {/* Avatar pixel art local */}
              <HabboAvatar id={user.id} direction={user.direction} />

              {/* Sombra no chao */}
              <div style={{
                width: 20,
                height: 7,
                marginTop: -3,
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)',
                borderRadius: '100%',
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
