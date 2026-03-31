import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
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

// ─── Figure codes Habbo Imager por especialista ───────────────────────────────
const HABBO_FIGURE: Record<string, string> = {
  satya:      'hd-180-2.hr-100-61.ch-210-1341.lg-280-1341.sh-290-1341',
  uncle_bob:  'hd-180-1.hr-3163-8.ch-230-1408.lg-280-1408.sh-290-62',
  karpathy:   'hd-180-7.hr-890-45.ch-210-1342.lg-280-1342.sh-290-62',
  rogati:     'hd-180-10.hr-3049-45.ch-210-1057.lg-280-1057.sh-290-62',
  osmani:     'hd-180-2.hr-100-45.ch-210-1408.lg-280-82.sh-290-62',
  whittaker:  'hd-180-1.hr-3546-35.ch-210-1408.lg-280-1408.sh-290-62',
  dixon:      'hd-180-1.hr-100-45.ch-210-1057.lg-280-82.sh-290-62',
  dodds:      'hd-180-1.hr-3163-45.ch-210-1343.lg-280-1343.sh-290-62',
  rauch:      'hd-180-7.hr-100-45.ch-210-1408.lg-280-1408.sh-290-62',
  rodrigues:  'hd-180-3.hr-3163-45.ch-210-1057.lg-280-1057.sh-290-62',
  kozyrkov:   'hd-180-1.hr-3546-35.ch-210-1342.lg-280-1342.sh-290-62',
  cagan:      'hd-180-1.hr-3163-8.ch-210-1408.lg-280-82.sh-290-62',
  grove:      'hd-180-1.hr-3163-0.ch-210-82.lg-280-82.sh-290-62',
  '1':        'hd-180-3.hr-890-45.ch-210-66.lg-270-82.sh-290-91',
};

const getTileColors = (val: number, x: number, y: number) => {
  const isLight = (x + y) % 2 === 0;
  switch (val) {
    case 1: return isLight
      ? { top: '#B8C8D8', left: '#8098AE', right: '#6080A0', h: 8, accent: 'rgba(255,255,255,0.12)' }
      : { top: '#D0DCE6', left: '#A0B4C4', right: '#80A0B8', h: 8, accent: 'rgba(255,255,255,0.04)' };
    case 2: return isLight
      ? { top: '#7890A8', left: '#506878', right: '#384858', h: 8, accent: 'rgba(255,255,255,0.08)' }
      : { top: '#90A8C0', left: '#688098', right: '#507080', h: 8, accent: 'rgba(255,255,255,0.03)' };
    case 3: return isLight
      ? { top: '#2A5070', left: '#183850', right: '#102838', h: 8, accent: 'rgba(80,160,255,0.10)' }
      : { top: '#345A78', left: '#204260', right: '#143040', h: 8, accent: 'rgba(80,160,255,0.05)' };
    case 4: return { top: '#D8E0E8', left: '#98A8B8', right: '#788898', h: 48, accent: 'rgba(255,255,255,0.15)' };
    case 5: return { top: '#B8C8D8', left: '#8098AE', right: '#607888', h: 12, accent: 'rgba(255,255,255,0.08)' };
    case 6: return isLight
      ? { top: '#A09080', left: '#6E5E54', right: '#544840', h: 8, accent: 'rgba(255,200,150,0.12)' }
      : { top: '#BEB0A0', left: '#887868', right: '#6C5C54', h: 8, accent: 'rgba(255,200,150,0.05)' };
    case 7: return isLight
      ? { top: '#98B0C0', left: '#607888', right: '#486070', h: 8, accent: 'rgba(255,255,255,0.10)' }
      : { top: '#B0C4D0', left: '#788A9A', right: '#607080', h: 8, accent: 'rgba(255,255,255,0.04)' };
    case 8: return { top: '#E8EEF4', left: '#B0C4D4', right: '#90AABC', h: 80, accent: 'rgba(255,255,255,0.22)' };
    case 9: return { top: '#D8E4EE', left: '#88A8C0', right: '#6888A0', h: 80, accent: 'rgba(140,200,255,0.35)' };
    case 10: return { top: '#ECF0F6', left: '#B8CCD8', right: '#98B0C4', h: 96, accent: 'rgba(255,255,255,0.20)' };
    default: return null;
  }
};

// ─── Z-ordering: fórmula isométrica precisa ───────────────────────────────────
// Multiplicar por 200 garante espaço para todos os layers por tile:
//   +0   = tile base
//   +10  = floor edge
//   +20  = furni (por zBonus 0-7, cada um +20)
//   +200 = avatar (sempre acima dos móveis do mesmo tile)
const tileZ    = (x: number, y: number) => (x + y) * 200;
const furniZ   = (x: number, y: number, bonus: number) => (x + y) * 200 + 20 + bonus * 20;
const avatarZ  = (x: number, y: number) => (x + y) * 200 + 180;

const FURNI_Z_BONUS: Record<string, number> = {
  rug: 0, chair: 1, trash: 1, divider: 1, locker: 1,
  desk: 2, sofa: 2, couch: 2, coffee_table: 2, pool_table: 2,
  plant: 3, lamp: 3, table: 3, cabinet: 3, fridge: 3,
  coffee_machine: 3, microwave: 3, ac_unit: 3,
  bookshelf: 4, whiteboard: 5, glass_wall: 5, sign: 5, tv_screen: 5,
  computer: 6, monitor_dual: 6, mug: 7,
};

// ─── Móveis com sombra projetada isométrica ───────────────────────────────────
// Tipos altos que projetam sombra no tile adjacente SE (sudeste)
const CASTS_SHADOW = new Set([
  'bookshelf', 'whiteboard', 'lamp', 'glass_wall', 'cabinet',
  'fridge', 'locker', 'tv_screen', 'monitor_dual',
]);

// ─── Cityscape — memoizado ────────────────────────────────────────────────────
const CityscapeSVG = memo(function CityscapeSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1400 320"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 1 }}
    >
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
      <ellipse cx="200" cy="60" rx="80" ry="18" fill="white" opacity="0.75" />
      <ellipse cx="240" cy="55" rx="60" ry="14" fill="white" opacity="0.6" />
      <ellipse cx="650" cy="45" rx="100" ry="20" fill="white" opacity="0.65" />
      <ellipse cx="700" cy="40" rx="70" ry="15" fill="white" opacity="0.5" />
      <ellipse cx="1100" cy="70" rx="90" ry="16" fill="white" opacity="0.6" />
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
      {[0,55,95,200,250,400,455,600,650,800,855,1000,1060,1200,1265,1340].map((bx, i) => (
        <g key={i}>
          <rect x={bx+6}  y={170+(i%3)*12} width={8} height={6} fill="#FCD34D" opacity="0.4" />
          <rect x={bx+18} y={175+(i%2)*14} width={8} height={6} fill="#FCD34D" opacity="0.3" />
          <rect x={bx+6}  y={195+(i%3)*10} width={8} height={6} fill="white" opacity="0.2" />
        </g>
      ))}
      <rect x="130"  y="175" width="75"  height="145" fill="url(#buildingMid)" />
      <rect x="330"  y="160" width="80"  height="160" fill="url(#buildingMid)" />
      <rect x="520"  y="165" width="90"  height="155" fill="url(#buildingMid)" />
      <rect x="720"  y="158" width="85"  height="162" fill="url(#buildingMid)" />
      <rect x="920"  y="163" width="80"  height="157" fill="url(#buildingMid)" />
      <rect x="1120" y="155" width="88"  height="165" fill="url(#buildingMid)" />
      <rect x="165"  y="190" width="60"  height="130" fill="url(#buildingNear)" />
      <rect x="370"  y="185" width="65"  height="135" fill="url(#buildingNear)" />
      <rect x="560"  y="188" width="58"  height="132" fill="url(#buildingNear)" />
      <rect x="760"  y="182" width="62"  height="138" fill="url(#buildingNear)" />
      <rect x="960"  y="187" width="60"  height="133" fill="url(#buildingNear)" />
      <rect x="0" y="316" width="1400" height="4" fill="#304050" opacity="0.4" />
    </svg>
  );
});

// ─── AVATAR_TRAITS (para fallback SVG) ───────────────────────────────────────
const AVATAR_TRAITS: Record<string, { hair: string; skin: string; shirt: string; pants: string; hairStyle: number }> = {
  satya:      { hair: '#1A1A2E', skin: '#C68642', shirt: '#0078D4', pants: '#1E293B', hairStyle: 0 },
  uncle_bob:  { hair: '#D4D4D4', skin: '#F5C99A', shirt: '#DC2626', pants: '#1E293B', hairStyle: 1 },
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

const HABBO_ISO_SPRITES = {
  front: [
    "........OOOOO........",
    "......OOHHHHHHOO.....",
    ".....OHHHHHHHHHHO....",
    "....OHHSHHSSHhHHO....",
    "...OHHSSSSSssssHO....",
    "...OHSESSSEBSSSHO....",
    "...OHSSSSSSsssSNO....",
    "...OHSSSSSSssssOO....",
    "....OSSSSSSssSO......",
    ".....OSSSSSSOO.......",
    "......OOssOOO........",
    "....OOOCOOCOOOO......",
    "...OCCCOOOCCCCCO.....",
    "..OOcCOOCCcCCCCOOO...",
    ".OCccCOOCCCCCCccCO...",
    ".OCccOCccCCCCcccCO...",
    ".OCccOcCcCcccCccCO...",
    ".OOOCOcCCcCccCcOOO...",
    "...OSSOCCOCCcCOSSO...",
    "...OOO OCCCCOOO O....",
    ".......OPPPPO........",
    "......OPPPPPPO.......",
    "......OPPPpPPO.......",
    "......OPpPpPPO.......",
    "......OPpPpPPO.......",
    ".....OPpP O pPO......",
    "...OOKKKK OKKKKOO....",
    "..OKkKKkK OOKkKkKO...",
    "..OKkKKkK OKkKKkKO...",
    "..OOOOOOO OOOOOOOO..."
  ],
  back: [
    "........OOOOO........",
    "......OOHHHHHHOO.....",
    ".....OHHHHHHHHHHO....",
    "....OHHHHHHHHHHHO....",
    "...OHHHHHHHHHHhhHO...",
    "...OHHHHHHHHHHhhOO...",
    "...OHHHHHHHHHHhhOO...",
    "...OHHHHHHHHHHhhOO...",
    "....OHhhhhhHhhhO.....",
    ".....OHhhhhhhOO......",
    "......OOsSSOO........",
    "....OOOcOOCOOOO......",
    "...OCCCCOOCCCCCO.....",
    "..OOCcCOOcCcCCCOOO...",
    ".OCccCOOCCCCCCccCO...",
    ".OCccOCcCcCCCcccCO...",
    ".OCccOcCcCcccCccCO...",
    ".OOOCOcCCcCccCcOOO...",
    "...OSSOCCOCCcCOSSO...",
    "...OOO OCCCCOOO O....",
    ".......OPPPPO........",
    "......OPPPPPPO.......",
    "......OPPPpPPO.......",
    "......OPpPpPPO.......",
    "......OPpPpPPO.......",
    ".....OPpP O pPO......",
    "...OOKKKK OKKKKOO....",
    "..OKkKKkK OOKkKkKO...",
    "..OKkKKkK OKkKKkKO...",
    "..OOOOOOO OOOOOOOO..."
  ]
};

function HabboAvatarSVGFallback({ id, direction }: { id: string; direction: number }) {
  const t = AVATAR_TRAITS[id] ?? AVATAR_TRAITS['1'];
  const facingLeft = direction >= 5 && direction <= 7;
  const facingBack = direction === 0 || direction === 1 || direction === 7;
  const P: Record<string, string> = {
    '.': 'transparent', ' ': 'transparent',
    'O': 'rgba(0,0,0,0.4)',
    'S': t.skin, 's': shadeColor(t.skin, -30), 'N': shadeColor(t.skin, -45),
    'H': t.hair, 'h': shadeColor(t.hair, -25),
    'C': t.shirt, 'c': shadeColor(t.shirt, -30),
    'P': t.pants, 'p': shadeColor(t.pants, -25),
    'K': '#1F2937', 'k': '#111827',
    'E': '#FFFFFF', 'B': '#111827'
  };
  const sprite = facingBack ? HABBO_ISO_SPRITES.back : HABBO_ISO_SPRITES.front;
  return (
    <div style={{ position: 'relative', width: 34, height: 60, transform: facingLeft ? 'scaleX(-1)' : undefined }}>
      <div style={{
        position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
        width: 18, height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', filter: 'blur(2px)'
      }} />
      <svg width="42" height="60" viewBox="0 0 21 30" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
        {sprite.map((row, ry) =>
          row.split('').map((char, rx) => {
            if (char === '.' || char === ' ') return null;
            return <rect key={`${rx}-${ry}`} x={rx} y={ry} width={1} height={1} fill={P[char] || '#FF00FF'} />;
          })
        )}
      </svg>
    </div>
  );
}

// ─── HabboAvatar — Imager + idle breathing + fallback ────────────────────────
function HabboAvatar({ id, direction, isMoving }: { id: string; direction: number; isMoving: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [idleBob, setIdleBob] = useState(0);

  useEffect(() => {
    if (isMoving) return;
    const interval = setInterval(() => setIdleBob(prev => (prev === 0 ? -2 : 0)), 1500);
    return () => clearInterval(interval);
  }, [isMoving]);

  useEffect(() => { if (isMoving) setIdleBob(0); }, [isMoving]);

  const figure = HABBO_FIGURE[id] ?? HABBO_FIGURE['1'];
  const action = isMoving ? 'wlk' : 'std';
  const habboDir = direction % 8;
  const imagerUrl =
    `https://www.habbo.com/habbo-imaging/avatarimage` +
    `?figure=${figure}&direction=${habboDir}&head_direction=${habboDir}` +
    `&gesture=std&action=${action}&size=b&headonly=0`;

  const bobStyle: React.CSSProperties = {
    transform: `translateY(${idleBob}px)`,
    transition: 'transform 0.7s ease-in-out',
    display: 'block',
  };

  // ─── Sombra radial no chão (presente em ambos os caminhos) ────────────────
  const groundShadow = (
    <div style={{
      position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
      width: 28, height: 10,
      background: 'radial-gradient(ellipse, rgba(0,0,0,0.38) 0%, transparent 70%)',
      borderRadius: '100%',
      pointerEvents: 'none',
    }} />
  );

  if (!imgFailed) {
    return (
      <div style={{ position: 'relative' }}>
        {groundShadow}
        <img
          src={imagerUrl}
          alt={id}
          width={64}
          height={110}
          style={{ ...bobStyle, imageRendering: 'pixelated' }}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div style={{ bobStyle, position: 'relative' } as React.CSSProperties}>
      {groundShadow}
      <div style={bobStyle}>
        <HabboAvatarSVGFallback id={id} direction={direction} />
      </div>
    </div>
  );
}

// ─── Cursor isométrico de destino — losango pulsante ─────────────────────────
// Injetado uma única vez no <head> via useEffect no RoomView
const ISO_CURSOR_KEYFRAMES = `
@keyframes iso-pulse {
  0%   { opacity: 0.85; transform: scaleX(1)   scaleY(1);   }
  50%  { opacity: 0.45; transform: scaleX(1.08) scaleY(1.08); }
  100% { opacity: 0.85; transform: scaleX(1)   scaleY(1);   }
}
@keyframes iso-ring {
  0%   { opacity: 0.6; transform: scaleX(1)    scaleY(1);    }
  50%  { opacity: 0.1; transform: scaleX(1.3)  scaleY(1.3);  }
  100% { opacity: 0;   transform: scaleX(1.5)  scaleY(1.5);  }
}
`;

function IsoCursor({ pos }: { pos: { x: number; y: number } }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x - TILE_W / 2,
        top: pos.y - TILE_H / 2,
        width: TILE_W,
        height: TILE_H,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      {/* Losango preenchido pulsante */}
      <div style={{
        position: 'absolute',
        inset: 0,
        clipPath: 'polygon(50% 2px, calc(100% - 2px) 50%, 50% calc(100% - 2px), 2px 50%)',
        backgroundColor: 'rgba(74,158,255,0.30)',
        animation: 'iso-pulse 1s ease-in-out infinite',
      }} />
      {/* Borda do losango */}
      <div style={{
        position: 'absolute',
        inset: 1,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        backgroundColor: 'transparent',
        outline: '2px solid rgba(74,158,255,0.85)',
        outlineOffset: '-2px',
      }} />
      {/* Anel expansivo — ondulação que some */}
      <div style={{
        position: 'absolute',
        inset: 0,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        border: '2px solid rgba(74,158,255,0.6)',
        animation: 'iso-ring 1s ease-out infinite',
      }} />
    </div>
  );
}

export default function RoomView({ users, map, onTileClick }: RoomViewProps) {
  const width = map[0].length;
  const height = map.length;

  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // ─── Hover tile para cursor isométrico ────────────────────────────────────
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);

  // ─── Walk animation ───────────────────────────────────────────────────────
  const [movingUsers, setMovingUsers] = useState<Set<string>>(new Set());
  const prevPositions = useRef<Record<string, { x: number; y: number }>>({});
  const walkTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });

  // Injeta keyframes do cursor uma única vez
  useEffect(() => {
    const id = 'iso-cursor-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = ISO_CURSOR_KEYFRAMES;
      document.head.appendChild(style);
    }
  }, []);

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
        setMovingUsers(prev => new Set(prev).add(u.id));
        if (walkTimers.current[u.id]) clearTimeout(walkTimers.current[u.id]);
        walkTimers.current[u.id] = setTimeout(() => {
          setMovingUsers(prev => { const n = new Set(prev); n.delete(u.id); return n; });
          delete walkTimers.current[u.id];
        }, 800);
      }
    });
    return () => { Object.values(walkTimers.current).forEach(t => clearTimeout(t)); };
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
    e.preventDefault();
    if (!isDragging) return;
    setDragMoved(true);
    setCameraOffset({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
  };
  const handleTouchEnd = () => setIsDragging(false);
  const handleTileClick = (x: number, y: number) => { if (!dragMoved) onTileClick(x, y); };

  const isWalkable = (val: number) => [1, 2, 3, 6, 7].includes(val);
  const isWall     = (val: number) => [4, 5, 8, 9, 10].includes(val);
  const isFloor    = (v: number)   => [1, 2, 3, 6, 7].includes(v);

  // ─── Render tiles ─────────────────────────────────────────────────────────
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
      const baseZ = tileZ(x, y);

      if (wall && val >= 8) {
        const isWindow = val === 9;
        const hasWallUp   = [8,9,10].includes(map[y-1]?.[x] ?? 0);
        const hasWallDown = [8,9,10].includes(map[y+1]?.[x] ?? 0);
        tiles.push(
          <div key={`tile-${x}-${y}`} className="absolute pointer-events-none" style={{
            left: pos.x - TILE_W / 2, top: pos.y - colors.h,
            width: TILE_W, height: TILE_H + colors.h,
            zIndex: baseZ - 1,
          }}>
            <div className="absolute w-full h-[32px] top-0 left-0" style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              backgroundColor: colors.top,
            }} />
            {!hasWallUp && (
              <div className="absolute w-[32px] left-0" style={{
                height: colors.h + 16, top: 16,
                clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))',
                backgroundColor: colors.left, position: 'absolute',
              }}>
                {isWindow && (<>
                  <div style={{ position:'absolute', left:2, top:'12%', width:12, height:colors.h*0.35, backgroundColor:'#334155', borderRadius:1, opacity:0.6 }} />
                  <div style={{ position:'absolute', left:2, top:'55%', width:12, height:colors.h*0.32, backgroundColor:'#334155', borderRadius:1, opacity:0.6 }} />
                  <div style={{ position:'absolute', left:3, top:'13%', width:10, height:colors.h*0.33, background:'linear-gradient(135deg, #BFDBFE 0%, #93C5FD 100%)', borderRadius:1, opacity:0.6 }} />
                  <div style={{ position:'absolute', left:3, top:'56%', width:10, height:colors.h*0.3, background:'linear-gradient(135deg, #BFDBFE 0%, #93C5FD 100%)', borderRadius:1, opacity:0.5 }} />
                  <div style={{ position:'absolute', left:4, top:'14%', width:3, height:colors.h*0.08, backgroundColor:'white', borderRadius:1, opacity:0.5 }} />
                </>)}
                <div style={{ position:'absolute', bottom:0, left:0, width:'100%', height:6, backgroundColor:'rgba(0,0,0,0.2)' }} />
              </div>
            )}
            {!hasWallDown && (
              <div className="absolute w-[32px] left-[32px]" style={{
                height: colors.h + 16, top: 16,
                clipPath: 'polygon(0% 16px, 100% 0%, 100% calc(100% - 16px), 0% 100%)',
                backgroundColor: colors.right,
              }}>
                {isWindow && (<>
                  <div style={{ position:'absolute', right:2, top:'12%', width:12, height:colors.h*0.35, backgroundColor:'#334155', borderRadius:1, opacity:0.5 }} />
                  <div style={{ position:'absolute', right:2, top:'55%', width:12, height:colors.h*0.32, backgroundColor:'#334155', borderRadius:1, opacity:0.5 }} />
                  <div style={{ position:'absolute', right:3, top:'13%', width:10, height:colors.h*0.33, background:'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)', borderRadius:1, opacity:0.5 }} />
                  <div style={{ position:'absolute', right:3, top:'56%', width:10, height:colors.h*0.3, background:'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)', borderRadius:1, opacity:0.4 }} />
                </>)}
                <div style={{ position:'absolute', bottom:0, right:0, width:'100%', height:6, backgroundColor:'rgba(0,0,0,0.15)' }} />
              </div>
            )}
            <div className="absolute w-full" style={{ bottom:0, height:8, background:'linear-gradient(to bottom, transparent, rgba(0,0,0,0.22))', pointerEvents:'none' }} />
          </div>
        );
        continue;
      }

      tiles.push(
        <div
          key={`tile-${x}-${y}`}
          onMouseUp={() => walkable && handleTileClick(x, y)}
          onMouseEnter={() => walkable && setHoverTile({ x, y })}
          onMouseLeave={() => setHoverTile(null)}
          className={`absolute ${walkable && !isDragging ? 'cursor-pointer' : ''} group`}
          style={{ left: pos.x - TILE_W / 2, top: pos.y - colors.h, width: TILE_W, height: TILE_H + colors.h, zIndex: baseZ }}
        >
          <div className="absolute w-full h-[32px] top-0 left-0" style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            backgroundColor: colors.top,
          }}>
            <div className="absolute inset-0" style={{
              clipPath: 'polygon(50% 0%, 75% 25%, 50% 50%, 25% 25%)',
              backgroundColor: colors.accent,
            }} />
          </div>
          {colors.h > 0 && (
            <div className="absolute w-[32px] left-0" style={{
              height: colors.h + 16, top: 16,
              clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))',
              backgroundColor: colors.left,
            }} />
          )}
          {colors.h > 0 && (
            <div className="absolute w-[32px] left-[32px]" style={{
              height: colors.h + 16, top: 16,
              clipPath: 'polygon(0% 16px, 100% 0%, 100% calc(100% - 16px), 0% 100%)',
              backgroundColor: colors.right,
            }} />
          )}
          {val === 3 && (
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(100,180,255,0.06) 0%, rgba(0,0,50,0.12) 100%)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />
          )}
        </div>
      );
    }
  }

  // ─── Floor edges ──────────────────────────────────────────────────────────
  const floorEdges: React.ReactNode[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = map[y][x];
      if (!isFloor(val)) continue;
      const pos = getScreenPos(x, y);
      const z = tileZ(x, y) + 10;
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

  // ─── Cursor de destino ────────────────────────────────────────────────────
  const cursorNode = hoverTile && !isDragging
    ? <IsoCursor key={`cursor-${hoverTile.x}-${hoverTile.y}`} pos={getScreenPos(hoverTile.x, hoverTile.y)} />
    : null;

  // ─── Sombras projetadas de móveis altos ───────────────────────────────────
  // Projetada no tile adjacente SE — a luz vem do NW no padrão isométrico Habbo
  const furniShadows: React.ReactNode[] = furniture
    .filter(f => CASTS_SHADOW.has(f.type) && !isWall(map[f.y]?.[f.x] ?? 0))
    .map(f => {
      // Tile sombra = f.x + 1, f.y + 1 (diagonal SE)
      const sx = f.x + 1;
      const sy = f.y + 1;
      if ((map[sy]?.[sx] ?? 0) === 0) return null;
      const pos = getScreenPos(sx, sy);
      return (
        <div
          key={`shadow-${f.id}`}
          className="absolute pointer-events-none"
          style={{
            left: pos.x - TILE_W / 2,
            top: pos.y - TILE_H / 2 - 4,
            width: TILE_W,
            height: TILE_H + 8,
            // Gradiente diagonal que simula projeção isométrica NW → SE
            background: 'linear-gradient(135deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 40%, transparent 70%)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            zIndex: tileZ(sx, sy) + 5,
          }}
        />
      );
    });

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-[99999] flex items-center justify-center pointer-events-none" style={{ height: 32 }}>
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
        style={{ backgroundColor: '#87CEEB', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CityscapeSVG />

        <div className="absolute w-full pointer-events-none" style={{
          bottom: 0, height: '38%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(20,30,50,0.55) 100%)',
        }} />

        {tiles}
        {floorEdges}
        {furniShadows}

        {furniture.map((f: Furniture) => {
          if (isWall(map[f.y]?.[f.x] ?? 0)) return null;
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
          const isMoving = movingUsers.has(user.id);
          return (
            <div
              key={user.id}
              className="absolute flex flex-col items-center pointer-events-none"
              style={{
                left: pos.x,
                top: pos.y - 8,
                transform: 'translate(-50%, -100%)',
                zIndex: avatarZ(user.x, user.y),
                transition: 'left 0.3s ease-out, top 0.3s ease-out',
              }}
            >
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
              <HabboAvatar id={user.id} direction={user.direction} isMoving={isMoving} />
            </div>
          );
        })}

        {/* Cursor losango — renderizado por cima de tudo */}
        {cursorNode}
      </div>
    </div>
  );
}
