import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { User } from './HabboClient';
import { furniture } from '@/data/specialists';
import { Furniture } from '@/types';
import FurniSprite from './FurniSprite';

interface RoomViewProps {
  users: User[];
  map: number[][];
  onTileClick: (x: number, y: number) => void;
  cameraOffsetRef?: React.MutableRefObject<{ x: number; y: number }>;
}

const TILE_W = 64;
const TILE_H = 32;

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

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

const tileZ   = (x: number, y: number) => (x + y) * 200;
const furniZ  = (x: number, y: number, bonus: number) => (x + y) * 200 + 20 + bonus * 20;
const avatarZ = (x: number, y: number) => (x + y) * 200 + 180;

const FURNI_Z_BONUS: Record<string, number> = {
  rug: 0, chair: 1, trash: 1, divider: 1, locker: 1,
  desk: 2, sofa: 2, couch: 2, coffee_table: 2, pool_table: 2,
  plant: 3, lamp: 3, table: 3, cabinet: 3, fridge: 3,
  coffee_machine: 3, microwave: 3, ac_unit: 3,
  bookshelf: 4, whiteboard: 5, glass_wall: 5, sign: 5, tv_screen: 5,
  computer: 6, monitor_dual: 6, mug: 7,
};

const CASTS_SHADOW = new Set([
  'bookshelf', 'whiteboard', 'lamp', 'glass_wall', 'cabinet',
  'fridge', 'locker', 'tv_screen', 'monitor_dual',
]);

const CityscapeSVG = memo(function CityscapeSVG() {
  return (
    <svg
      width="100%" height="100%" viewBox="0 0 1400 320"
      preserveAspectRatio="xMidYMid slice" fill="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="60%" stopColor="#B8DFF0" />
          <stop offset="100%" stopColor="#D8EEF8" />
        </linearGradient>
        <linearGradient id="buildingFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8AA0B8" /><stop offset="100%" stopColor="#607080" />
        </linearGradient>
        <linearGradient id="buildingMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6A8098" /><stop offset="100%" stopColor="#485868" />
        </linearGradient>
        <linearGradient id="buildingNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#506070" /><stop offset="100%" stopColor="#303E4A" />
        </linearGradient>
      </defs>
      <rect width="1400" height="320" fill="url(#skyGrad)" />
      <ellipse cx="200" cy="60" rx="80" ry="18" fill="white" opacity="0.75" />
      <ellipse cx="240" cy="55" rx="60" ry="14" fill="white" opacity="0.6" />
      <ellipse cx="650" cy="45" rx="100" ry="20" fill="white" opacity="0.65" />
      <ellipse cx="700" cy="40" rx="70" ry="15" fill="white" opacity="0.5" />
      <ellipse cx="1100" cy="70" rx="90" ry="16" fill="white" opacity="0.6" />
      {([0,55,95,200,250,400,455,600,650,800,855,1000,1060,1200,1265,1340] as number[]).map((bx, i) => (
        <rect key={`bf-${i}`} x={bx} y={[160,140,170,130,155,120,145,135,110,150,125,140,115,130,155,145][i]} width={[60,45,70,55,80,60,45,55,70,60,50,65,55,70,50,60][i]} height={[160,180,150,190,165,200,175,185,210,170,195,180,205,190,165,175][i]} fill="url(#buildingFar)" />
      ))}
      {([0,55,95,200,250,400,455,600,650,800,855,1000,1060,1200,1265,1340] as number[]).map((bx, i) => (
        <g key={`bw-${i}`}>
          <rect x={bx+6}  y={170+(i%3)*12} width={8} height={6} fill="#FCD34D" opacity="0.4" />
          <rect x={bx+18} y={175+(i%2)*14} width={8} height={6} fill="#FCD34D" opacity="0.3" />
          <rect x={bx+6}  y={195+(i%3)*10} width={8} height={6} fill="white" opacity="0.2" />
        </g>
      ))}
      <rect x="130" y="175" width="75" height="145" fill="url(#buildingMid)" />
      <rect x="330" y="160" width="80" height="160" fill="url(#buildingMid)" />
      <rect x="520" y="165" width="90" height="155" fill="url(#buildingMid)" />
      <rect x="720" y="158" width="85" height="162" fill="url(#buildingMid)" />
      <rect x="920" y="163" width="80" height="157" fill="url(#buildingMid)" />
      <rect x="1120" y="155" width="88" height="165" fill="url(#buildingMid)" />
      <rect x="165" y="190" width="60" height="130" fill="url(#buildingNear)" />
      <rect x="370" y="185" width="65" height="135" fill="url(#buildingNear)" />
      <rect x="560" y="188" width="58" height="132" fill="url(#buildingNear)" />
      <rect x="760" y="182" width="62" height="138" fill="url(#buildingNear)" />
      <rect x="960" y="187" width="60" height="133" fill="url(#buildingNear)" />
      <rect x="0" y="316" width="1400" height="4" fill="#304050" opacity="0.4" />
    </svg>
  );
});

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

const AVATAR_TRAITS: Record<string, { hair: string; skin: string; shirt: string; pants: string; hairStyle: number }> = {
  satya:     { hair: '#1A1A2E', skin: '#C68642', shirt: '#0078D4', pants: '#1E293B', hairStyle: 0 },
  uncle_bob: { hair: '#D4D4D4', skin: '#F5C99A', shirt: '#DC2626', pants: '#1E293B', hairStyle: 1 },
  karpathy:  { hair: '#3B2506', skin: '#F5C99A', shirt: '#7C3AED', pants: '#334155', hairStyle: 0 },
  rogati:    { hair: '#2D1F14', skin: '#DEB887', shirt: '#059669', pants: '#1E293B', hairStyle: 2 },
  osmani:    { hair: '#1A1A2E', skin: '#C68642', shirt: '#F59E0B', pants: '#334155', hairStyle: 0 },
  whittaker: { hair: '#6B3A1F', skin: '#F5C99A', shirt: '#EF4444', pants: '#1E293B', hairStyle: 1 },
  dixon:     { hair: '#4A3728', skin: '#F5C99A', shirt: '#06B6D4', pants: '#334155', hairStyle: 0 },
  dodds:     { hair: '#3B2506', skin: '#F5C99A', shirt: '#EC4899', pants: '#1E293B', hairStyle: 0 },
  rauch:     { hair: '#1A1A2E', skin: '#DEB887', shirt: '#171717', pants: '#0F172A', hairStyle: 0 },
  rodrigues: { hair: '#1A1A2E', skin: '#DEB887', shirt: '#16A34A', pants: '#1E293B', hairStyle: 1 },
  kozyrkov:  { hair: '#6B3A1F', skin: '#F5C99A', shirt: '#8B5CF6', pants: '#334155', hairStyle: 2 },
  cagan:     { hair: '#8B8B8B', skin: '#F5C99A', shirt: '#F97316', pants: '#1E293B', hairStyle: 1 },
  grove:     { hair: '#C0C0C0', skin: '#F5C99A', shirt: '#64748B', pants: '#1E293B', hairStyle: 1 },
  '1':       { hair: '#3B2506', skin: '#DEB887', shirt: '#4A90E2', pants: '#1E293B', hairStyle: 0 },
};

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

const HabboAvatar = memo(function HabboAvatar({ id, direction, isMoving }: { id: string; direction: number; isMoving: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);

  const figure = HABBO_FIGURE[id] ?? HABBO_FIGURE['1'];
  const action = isMoving ? 'wlk' : 'std';
  const habboDir = direction % 8;
  const imagerUrl =
    `https://www.habbo.com/habbo-imaging/avatarimage` +
    `?figure=${figure}&direction=${habboDir}&head_direction=${habboDir}` +
    `&gesture=std&action=${action}&size=b&headonly=0`;

  const groundShadow = (
    <div style={{
      position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
      width: 28, height: 10,
      background: 'radial-gradient(ellipse, rgba(0,0,0,0.38) 0%, transparent 70%)',
      borderRadius: '100%', pointerEvents: 'none',
    }} />
  );

  const idleStyle: React.CSSProperties = !isMoving ? {
    animation: 'idleBob 3s ease-in-out infinite',
  } : {};

  if (!imgFailed) {
    return (
      <div style={{ position: 'relative' }}>
        {groundShadow}
        <img
          src={imagerUrl}
          alt={id}
          width={64}
          height={110}
          style={{ display: 'block', imageRendering: 'pixelated', ...idleStyle }}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {groundShadow}
      <div style={idleStyle}>
        <HabboAvatarSVGFallback id={id} direction={direction} />
      </div>
    </div>
  );
});

const ISO_CURSOR_KEYFRAMES = `
@keyframes iso-pulse {
  0%,100% { opacity: 0.85; transform: scaleX(1) scaleY(1); }
  50%     { opacity: 0.45; transform: scaleX(1.08) scaleY(1.08); }
}
@keyframes iso-ring {
  0%   { opacity: 0.6; transform: scaleX(1) scaleY(1); }
  100% { opacity: 0;   transform: scaleX(1.5) scaleY(1.5); }
}
@keyframes idleBob {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-2px); }
}
`;

// ─── IsoCursor imperativo — movido via DOM, zero re-render React ──────────────
const IsoCursorImperative = memo(function IsoCursorImperative(
  { elRef }: { elRef: React.RefObject<HTMLDivElement | null> }
) {
  return (
    <div
      ref={elRef}
      style={{
        position: 'absolute',
        display: 'none',
        width: TILE_W, height: TILE_H,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        clipPath: 'polygon(50% 2px, calc(100% - 2px) 50%, 50% calc(100% - 2px), 2px 50%)',
        backgroundColor: 'rgba(74,158,255,0.30)',
        animation: 'iso-pulse 1s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', inset: 1,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        backgroundColor: 'transparent',
        outline: '2px solid rgba(74,158,255,0.85)',
        outlineOffset: '-2px',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        border: '2px solid rgba(74,158,255,0.6)',
        animation: 'iso-ring 1s ease-out infinite',
      }} />
    </div>
  );
});

const _isWalkable = (v: number) => [1,2,3,6,7].includes(v);
const _isWall     = (v: number) => [4,5,8,9,10].includes(v);
const _isFloor    = (v: number) => [1,2,3,6,7].includes(v);

export default function RoomView({ users, map, onTileClick }: RoomViewProps) {
  const mapH = map.length;
  const mapW = map[0].length;

  // ─── PERF CORE: cameraOffset como ref — drag não dispara nenhum setState ─────
  const cameraOffsetRef = useRef({ x: 0, y: 0 });
  const sceneRef        = useRef<HTMLDivElement>(null);
  const cursorRef       = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef(false);
  const dragMovedRef  = useRef(false);
  const dragStart     = useRef({ x: 0, y: 0 });

  // Usado apenas para disparar re-render dos avatares ao soltar o drag
  const [, forceAvatarUpdate] = useState(0);

  const [movingUsers, setMovingUsers] = useState<Set<string>>(new Set());
  const prevPositions = useRef<Record<string, { x: number; y: number }>>({});
  const walkTimers    = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });

  useEffect(() => {
    const id = 'iso-cursor-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = ISO_CURSOR_KEYFRAMES;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    users.forEach(u => {
      const prev  = prevPositions.current[u.id];
      const moved = prev && (prev.x !== u.x || prev.y !== u.y);
      prevPositions.current[u.id] = { x: u.x, y: u.y };
      if (moved) {
        setMovingUsers(p => new Set(p).add(u.id));
        if (walkTimers.current[u.id]) clearTimeout(walkTimers.current[u.id]);
        walkTimers.current[u.id] = setTimeout(() => {
          setMovingUsers(p => { const n = new Set(p); n.delete(u.id); return n; });
          delete walkTimers.current[u.id];
        }, 800);
      }
    });
    return () => { Object.values(walkTimers.current).forEach(t => clearTimeout(t)); };
  }, [users]);

  const offsetX = windowSize.width  / 2;
  const offsetY = windowSize.height / 2 - (mapH * TILE_H) / 2;

  // ─── Aplica pan via DOM direto — zero React re-render durante drag ────────────
  const applySceneTransform = useCallback(() => {
    if (!sceneRef.current) return;
    const { x, y } = cameraOffsetRef.current;
    sceneRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  // getScreenPos lê do ref — estável, não depende de state
  const getScreenPos = useCallback((x: number, y: number) => ({
    x: offsetX + (x - y) * (TILE_W / 2) + cameraOffsetRef.current.x,
    y: offsetY + (x + y) * (TILE_H / 2) + cameraOffsetRef.current.y,
  }), [offsetX, offsetY]);

  // ─── Tiles: calculados sem cameraOffset — apenas posição base no mapa ─────────
  // A translação da câmera é aplicada no container pai (sceneRef) via transform.
  // Tiles só recalculam quando o mapa ou windowSize mudam.
  const tiles = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const val = map[y][x];
        if (val === 0) continue;
        const colors = getTileColors(val, x, y);
        if (!colors) continue;
        const px = offsetX + (x - y) * (TILE_W / 2);
        const py = offsetY + (x + y) * (TILE_H / 2);
        const walkable = _isWalkable(val);
        const wall     = _isWall(val);
        const baseZ    = tileZ(x, y);

        if (wall && val >= 8) {
          const isWindow   = val === 9;
          const hasWallUp  = [8,9,10].includes(map[y-1]?.[x] ?? 0);
          const hasWallDn  = [8,9,10].includes(map[y+1]?.[x] ?? 0);
          result.push(
            <div key={`t-${x}-${y}`} className="absolute pointer-events-none" style={{
              left: px - TILE_W/2, top: py - colors.h,
              width: TILE_W, height: TILE_H + colors.h, zIndex: baseZ - 1,
            }}>
              <div className="absolute w-full h-[32px] top-0 left-0" style={{
                clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
                backgroundColor: colors.top,
              }} />
              {!hasWallUp && (
                <div className="absolute w-[32px] left-0" style={{
                  height: colors.h+16, top: 16,
                  clipPath: 'polygon(0% 0%,100% 16px,100% 100%,0% calc(100% - 16px))',
                  backgroundColor: colors.left,
                }}>
                  {isWindow && (<>
                    <div style={{ position:'absolute',left:2,top:'12%',width:12,height:colors.h*0.35,backgroundColor:'#334155',borderRadius:1,opacity:0.6 }} />
                    <div style={{ position:'absolute',left:2,top:'55%',width:12,height:colors.h*0.32,backgroundColor:'#334155',borderRadius:1,opacity:0.6 }} />
                    <div style={{ position:'absolute',left:3,top:'13%',width:10,height:colors.h*0.33,background:'linear-gradient(135deg,#BFDBFE,#93C5FD)',borderRadius:1,opacity:0.6 }} />
                    <div style={{ position:'absolute',left:3,top:'56%',width:10,height:colors.h*0.3,background:'linear-gradient(135deg,#BFDBFE,#93C5FD)',borderRadius:1,opacity:0.5 }} />
                    <div style={{ position:'absolute',left:4,top:'14%',width:3,height:colors.h*0.08,backgroundColor:'white',borderRadius:1,opacity:0.5 }} />
                  </>)}
                  <div style={{ position:'absolute',bottom:0,left:0,width:'100%',height:6,backgroundColor:'rgba(0,0,0,0.2)' }} />
                </div>
              )}
              {!hasWallDn && (
                <div className="absolute w-[32px] left-[32px]" style={{
                  height: colors.h+16, top: 16,
                  clipPath: 'polygon(0% 16px,100% 0%,100% calc(100% - 16px),0% 100%)',
                  backgroundColor: colors.right,
                }}>
                  {isWindow && (<>
                    <div style={{ position:'absolute',right:2,top:'12%',width:12,height:colors.h*0.35,backgroundColor:'#334155',borderRadius:1,opacity:0.5 }} />
                    <div style={{ position:'absolute',right:2,top:'55%',width:12,height:colors.h*0.32,backgroundColor:'#334155',borderRadius:1,opacity:0.5 }} />
                    <div style={{ position:'absolute',right:3,top:'13%',width:10,height:colors.h*0.33,background:'linear-gradient(135deg,#93C5FD,#60A5FA)',borderRadius:1,opacity:0.5 }} />
                    <div style={{ position:'absolute',right:3,top:'56%',width:10,height:colors.h*0.3,background:'linear-gradient(135deg,#93C5FD,#60A5FA)',borderRadius:1,opacity:0.4 }} />
                  </>)}
                  <div style={{ position:'absolute',bottom:0,right:0,width:'100%',height:6,backgroundColor:'rgba(0,0,0,0.15)' }} />
                </div>
              )}
              <div className="absolute w-full" style={{ bottom:0,height:8,background:'linear-gradient(to bottom,transparent,rgba(0,0,0,0.22))',pointerEvents:'none' }} />
            </div>
          );
          continue;
        }

        result.push(
          <div
            key={`t-${x}-${y}`}
            data-tx={x} data-ty={y} data-walkable={walkable ? '1' : ''}
            className={`absolute ${walkable ? 'cursor-pointer' : ''} group`}
            style={{ left: px - TILE_W/2, top: py - colors.h, width: TILE_W, height: TILE_H + colors.h, zIndex: baseZ }}
          >
            <div className="absolute w-full h-[32px] top-0 left-0" style={{
              clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
              backgroundColor: colors.top,
            }}>
              <div className="absolute inset-0" style={{
                clipPath: 'polygon(50% 0%,75% 25%,50% 50%,25% 25%)',
                backgroundColor: colors.accent,
              }} />
            </div>
            {colors.h > 0 && (
              <div className="absolute w-[32px] left-0" style={{
                height: colors.h+16, top: 16,
                clipPath: 'polygon(0% 0%,100% 16px,100% 100%,0% calc(100% - 16px))',
                backgroundColor: colors.left,
              }} />
            )}
            {colors.h > 0 && (
              <div className="absolute w-[32px] left-[32px]" style={{
                height: colors.h+16, top: 16,
                clipPath: 'polygon(0% 16px,100% 0%,100% calc(100% - 16px),0% 100%)',
                backgroundColor: colors.right,
              }} />
            )}
            {val === 3 && (
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at 50% 50%,rgba(100,180,255,0.06) 0%,rgba(0,0,50,0.12) 100%)',
                clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
              }} />
            )}
          </div>
        );
      }
    }
    return result;
  }, [map, offsetX, offsetY, mapH, mapW]);

  const floorEdges = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const val = map[y][x];
        if (!_isFloor(val)) continue;
        const px = offsetX + (x - y) * (TILE_W/2);
        const py = offsetY + (x + y) * (TILE_H/2);
        const z  = tileZ(x, y) + 10;
        const rv = map[y]?.[x+1] ?? 0;
        if (!_isFloor(rv) && rv !== 4 && rv !== 5) {
          result.push(<div key={`er-${x}-${y}`} className="absolute pointer-events-none" style={{
            left: px + TILE_W/4 - 1, top: py - TILE_H/4,
            width: 3, height: TILE_H/2 + 10,
            backgroundColor: '#0F172A', transform: 'skewY(26.57deg)', zIndex: z,
          }} />);
        }
        const bv = map[y+1]?.[x] ?? 0;
        if (!_isFloor(bv) && bv !== 4 && bv !== 5) {
          result.push(<div key={`eb-${x}-${y}`} className="absolute pointer-events-none" style={{
            left: px - TILE_W/4 - 1, top: py - TILE_H/4,
            width: 3, height: TILE_H/2 + 10,
            backgroundColor: '#1E293B', transform: 'skewY(-26.57deg)', zIndex: z,
          }} />);
        }
      }
    }
    return result;
  }, [map, offsetX, offsetY, mapH, mapW]);

  // ─── furniNodes: pos removida — FurniSprite recebe apenas primitivos estáveis
  // cameraOffset não está mais nas deps → nunca recalcula durante drag
  const furniNodes = useMemo(() => {
    return furniture.map((f: Furniture) => {
      if (_isWall(map[f.y]?.[f.x] ?? 0)) return null;
      const bonus = FURNI_Z_BONUS[f.type] ?? 2;
      // px/py base sem cameraOffset — o container pai (sceneRef) carrega o offset
      const px = offsetX + (f.x - f.y) * (TILE_W/2);
      const py = offsetY + (f.x + f.y) * (TILE_H/2);
      return (
        <FurniSprite
          key={f.id}
          type={f.type}
          pos={{ x: px, y: py }}
          color={f.color}
          direction={f.direction}
          tileX={f.x}
          tileY={f.y}
          zBonus={bonus}
          label={f.label}
        />
      );
    });
  }, [map, offsetX, offsetY]);

  const furniShadows = useMemo(() => {
    return furniture
      .filter(f => CASTS_SHADOW.has(f.type) && !_isWall(map[f.y]?.[f.x] ?? 0))
      .map(f => {
        const sx = f.x + 1, sy = f.y + 1;
        if ((map[sy]?.[sx] ?? 0) === 0) return null;
        const px = offsetX + (sx - sy) * (TILE_W/2);
        const py = offsetY + (sx + sy) * (TILE_H/2);
        return (
          <div key={`sh-${f.id}`} className="absolute pointer-events-none" style={{
            left: px - TILE_W/2, top: py - TILE_H/2 - 4,
            width: TILE_W, height: TILE_H + 8,
            background: 'linear-gradient(135deg,rgba(0,0,0,0.22) 0%,rgba(0,0,0,0.08) 40%,transparent 70%)',
            clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
            zIndex: tileZ(sx, sy) + 5,
          }} />
        );
      });
  }, [map, offsetX, offsetY]);

  // ─── Drag handlers — escrevem no ref, chamam applySceneTransform via DOM ──────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragMovedRef.current  = false;
    dragStart.current = {
      x: e.clientX - cameraOffsetRef.current.x,
      y: e.clientY - cameraOffsetRef.current.y,
    };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragMovedRef.current  = false;
    dragStart.current = {
      x: e.touches[0].clientX - cameraOffsetRef.current.x,
      y: e.touches[0].clientY - cameraOffsetRef.current.y,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDraggingRef.current) return;
    dragMovedRef.current = true;
    cameraOffsetRef.current = {
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y,
    };
    applySceneTransform();
  }, [applySceneTransform]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    forceAvatarUpdate(n => n + 1);
  }, []);

  // ─── mousemove global — só durante drag, via ref, zero setState ───────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      dragMovedRef.current = true;
      cameraOffsetRef.current = {
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      };
      applySceneTransform();
    };
    const onUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      // Força update dos avatares uma única vez ao soltar
      forceAvatarUpdate(n => n + 1);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [applySceneTransform]);

  // ─── Hover via event delegation — cursor movido via DOM, zero setState ────────
  const handleContainerMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (IS_TOUCH || isDraggingRef.current) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }
    const el = (e.target as HTMLElement).closest('[data-tx]') as HTMLElement | null;
    if (!el || el.dataset.walkable !== '1') {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }
    const tx = Number(el.dataset.tx);
    const ty = Number(el.dataset.ty);
    const px = offsetX + (tx - ty) * (TILE_W / 2);
    const py = offsetY + (tx + ty) * (TILE_H / 2);
    if (cursorRef.current) {
      cursorRef.current.style.display = 'block';
      cursorRef.current.style.left = `${px - TILE_W / 2}px`;
      cursorRef.current.style.top  = `${py - TILE_H / 2}px`;
    }
  }, [offsetX, offsetY]);

  const handleContainerMouseLeave = useCallback(() => {
    if (cursorRef.current) cursorRef.current.style.display = 'none';
  }, []);

  const handleContainerMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragMovedRef.current) return;
    const el = (e.target as HTMLElement).closest('[data-tx]') as HTMLElement | null;
    if (!el) return;
    const tx = Number(el.dataset.tx);
    const ty = Number(el.dataset.ty);
    if (el.dataset.walkable === '1') onTileClick(tx, ty);
  }, [onTileClick]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-[99999] flex items-center justify-center pointer-events-none" style={{ height: 32 }}>
        <div className="px-4 py-1 font-pixel text-[9px] text-white tracking-wider" style={{
          background: 'linear-gradient(180deg,rgba(10,20,40,0.92),rgba(5,15,35,0.88))',
          border: '1px solid rgba(74,158,255,0.4)', borderTop: 'none',
          borderRadius: '0 0 6px 6px', boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          textShadow: '0 1px 2px rgba(0,0,0,0.9)',
        }}>🏢 BOARD ROOM — Senior Scout 360</div>
      </div>

      {/* Container de input — captura eventos, cursor visual */}
      <div
        className={`absolute inset-0 overflow-hidden ${isDraggingRef.current ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          backgroundColor: '#87CEEB',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        onMouseUp={handleContainerMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CityscapeSVG />

        <div className="absolute w-full pointer-events-none" style={{
          bottom: 0, height: '38%',
          background: 'linear-gradient(to bottom,transparent 0%,rgba(20,30,50,0.55) 100%)',
        }} />

        {/* ─── Scene: pan aplicado aqui via transform — único elemento que move ── */}
        <div
          ref={sceneRef}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            willChange: 'transform',
            transform: 'translate(0px, 0px)',
          }}
        >
          {tiles}
          {floorEdges}
          {furniShadows}
          {furniNodes}

          {/* Cursor iso — movido via DOM imperativo, dentro da scene */}
          <IsoCursorImperative elRef={cursorRef} />

          {users.map(user => {
            const pos = getScreenPos(user.x, user.y);
            const isMoving = movingUsers.has(user.id);
            return (
              <div
                key={user.id}
                className="absolute flex flex-col items-center pointer-events-none"
                style={{
                  left: pos.x, top: pos.y - 8,
                  transform: 'translate(-50%, -100%)',
                  zIndex: avatarZ(user.x, user.y),
                  transition: 'left 0.3s ease-out, top 0.3s ease-out',
                }}
              >
                <div className="mb-0.5 px-1.5 py-px font-pixel text-[8px] font-bold text-white whitespace-nowrap" style={{
                  background: 'linear-gradient(180deg,#1a4a8a,#0e2d5e)',
                  border: '1px solid #4a9eff', borderRadius: '2px',
                  boxShadow: '0 1px 0 #07193a', letterSpacing: '0.03em',
                  textShadow: '0 1px 1px rgba(0,0,0,0.9)',
                }}>{user.name}</div>
                <HabboAvatar id={user.id} direction={user.direction} isMoving={isMoving} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
