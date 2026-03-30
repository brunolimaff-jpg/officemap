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

// Avatar fallback — terno escuro padrao, tamanho 24x52 como referencia
function AvatarFallback({ color, name }: { color: string; name: string }) {
  const initial = name.slice(0, 1).toUpperCase();
  return (
    <svg width="24" height="52" viewBox="0 0 24 52" fill="none" style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Sombra */}
      <ellipse cx="12" cy="51" rx="8" ry="2" fill="black" fillOpacity="0.28" />
      {/* Pernas — terno escuro */}
      <rect x="7"  y="38" width="4" height="10" rx="1" fill="#1E293B" />
      <rect x="13" y="38" width="4" height="10" rx="1" fill="#1E293B" />
      {/* Sapatos */}
      <rect x="6"  y="46" width="5" height="3" rx="1" fill="#111827" />
      <rect x="13" y="46" width="5" height="3" rx="1" fill="#111827" />
      {/* Corpo — terno */}
      <rect x="6" y="24" width="12" height="16" rx="1" fill={color} />
      {/* Camisa */}
      <rect x="10" y="25" width="4" height="9" fill="#F1F5F9" />
      {/* Gravata */}
      <polygon points="12,26 13.5,27.5 12,34 10.5,27.5" fill="#1E3A5F" />
      {/* Bracos */}
      <rect x="3"  y="25" width="4" height="11" rx="1" fill={color} />
      <rect x="17" y="25" width="4" height="11" rx="1" fill={color} />
      {/* Maos */}
      <ellipse cx="5"  cy="37" rx="2.5" ry="2" fill="#F5C99A" />
      <ellipse cx="19" cy="37" rx="2.5" ry="2" fill="#F5C99A" />
      {/* Pescoco */}
      <rect x="10" y="19" width="4" height="6" rx="1" fill="#F5C99A" />
      {/* Cabeca */}
      <rect x="7" y="8" width="10" height="12" rx="3" fill="#F5C99A" />
      {/* Cabelo */}
      <rect x="7" y="8" width="10" height="4" rx="2" fill="#2D1F14" />
      <rect x="7" y="10" width="3" height="3" rx="1" fill="#2D1F14" />
      {/* Olhos */}
      <rect x="9"  y="13" width="2" height="2" rx="0.5" fill="#1E293B" />
      <rect x="13" y="13" width="2" height="2" rx="0.5" fill="#1E293B" />
      {/* Inicial */}
      <text x="12" y="33" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="5" fontFamily="monospace" fontWeight="bold" opacity="0.9">{initial}</text>
    </svg>
  );
}

const AVATAR_COLORS: Record<string, string> = {
  carlos: '#EF4444', marcos: '#06B6D4', sophia: '#8B5CF6', andre: '#3B82F6',
  diego: '#10B981', raquel: '#F59E0B', helena: '#EC4899', victor: '#F97316',
  '1': '#4A90E2',
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
            {/* Face esquerda */}
            <div className="absolute w-[32px] left-0" style={{
              height: colors.h + 16,
              top: 16,
              clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))',
              backgroundColor: colors.left,
              position: 'absolute',
            }}>
              {isWindow && (
                <>
                  {/* Moldura janela esq */}
                  <div style={{ position:'absolute', left:2, top:'12%', width:12, height:colors.h*0.35, backgroundColor:'#334155', borderRadius:1, opacity:0.6 }} />
                  <div style={{ position:'absolute', left:2, top:'55%', width:12, height:colors.h*0.32, backgroundColor:'#334155', borderRadius:1, opacity:0.6 }} />
                  {/* Vidro azul esq */}
                  <div style={{ position:'absolute', left:3, top:'13%', width:10, height:colors.h*0.33, backgroundColor:'#BFDBFE', borderRadius:1, opacity:0.55 }} />
                  <div style={{ position:'absolute', left:3, top:'56%', width:10, height:colors.h*0.3, backgroundColor:'#BFDBFE', borderRadius:1, opacity:0.45 }} />
                  {/* Reflexo */}
                  <div style={{ position:'absolute', left:4, top:'14%', width:3, height:colors.h*0.1, backgroundColor:'white', borderRadius:1, opacity:0.3 }} />
                </>
              )}
            </div>
            {/* Face direita */}
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
                  <div style={{ position:'absolute', right:3, top:'13%', width:10, height:colors.h*0.33, backgroundColor:'#93C5FD', borderRadius:1, opacity:0.45 }} />
                  <div style={{ position:'absolute', right:3, top:'56%', width:10, height:colors.h*0.3, backgroundColor:'#93C5FD', borderRadius:1, opacity:0.35 }} />
                </>
              )}
            </div>
            {/* Sombra na base da parede */}
            <div className="absolute w-full" style={{
              bottom: 0,
              height: 6,
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.18))',
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

  return (
    <div className="absolute inset-0 overflow-hidden">
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
          const frame = walkFrames[user.id] ?? 0;
          const failed = habboFailed[user.id] ?? false;
          const avatarColor = AVATAR_COLORS[user.id] ?? '#334155';

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

              {/* Avatar */}
              {!failed ? (
                <img
                  src={`https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}&size=s&direction=${user.direction}&head_direction=${user.direction}&crr=0&gesture=sml&frame=${frame}`}
                  alt={user.name}
                  width={24}
                  height={52}
                  style={{ imageRendering: 'pixelated', display: 'block' }}
                  onError={() => setHabboFailed(prev => ({ ...prev, [user.id]: true }))}
                />
              ) : (
                <AvatarFallback color={avatarColor} name={user.name} />
              )}

              {/* Sombra no chao */}
              <div style={{
                width: 18,
                height: 6,
                marginTop: -2,
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.32) 0%, transparent 70%)',
                borderRadius: '100%',
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
