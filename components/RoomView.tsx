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
  const isLight = (x + y) % 2 === 0;
  switch (val) {
    case 1: return isLight
      ? { top: '#C8D4E0', left: '#8FA3B5', right: '#6E8BA0', h: 8, accent: 'rgba(255,255,255,0.12)' }
      : { top: '#D8E4EE', left: '#9FB3C5', right: '#7E9BB0', h: 8, accent: 'rgba(255,255,255,0.06)' };
    case 2: return isLight
      ? { top: '#9BAEBE', left: '#6B8090', right: '#4E6878', h: 8, accent: 'rgba(255,255,255,0.08)' }
      : { top: '#A8BAC8', left: '#7A8FA0', right: '#5E7888', h: 8, accent: 'rgba(255,255,255,0.04)' };
    case 3: return isLight
      ? { top: '#1A3550', left: '#102440', right: '#081830', h: 8, accent: 'rgba(74,158,255,0.1)' }
      : { top: '#1E3D5A', left: '#142A48', right: '#0C1E38', h: 8, accent: 'rgba(74,158,255,0.06)' };
    case 4: return { top: '#2D3A4A', left: '#1A2535', right: '#0F1825', h: 72, accent: 'rgba(255,255,255,0.03)' };
    case 5: return { top: '#3D4E60', left: '#2A3A4C', right: '#1A2835', h: 40, accent: 'rgba(255,255,255,0.05)' };
    case 6: return isLight
      ? { top: '#B8A898', left: '#7A6E64', right: '#5E5450', h: 8, accent: 'rgba(255,220,180,0.1)' }
      : { top: '#C4B4A4', left: '#887870', right: '#6A5E58', h: 8, accent: 'rgba(255,220,180,0.06)' };
    case 7: return isLight
      ? { top: '#A0AEB8', left: '#6A7A84', right: '#50626C', h: 8, accent: 'rgba(255,255,255,0.1)' }
      : { top: '#ACBAC4', left: '#788490', right: '#5E7078', h: 8, accent: 'rgba(255,255,255,0.05)' };
    // Parede externa — alta, cor de concreto branco
    case 8: return { top: '#E8EDF2', left: '#B0C0CC', right: '#8AA0B0', h: 96, accent: 'rgba(255,255,255,0.15)' };
    // Janela — parede com vidro azulado
    case 9: return { top: '#C8D8E8', left: '#7090A8', right: '#506880', h: 96, accent: 'rgba(100,180,255,0.2)' };
    // Parede de fundo (topo) — mais alta
    case 10: return { top: '#D8E4EE', left: '#90A8BC', right: '#708898', h: 112, accent: 'rgba(255,255,255,0.1)' };
    default: return null;
  }
};

const FURNI_Z_BONUS: Record<string, number> = {
  rug:            0,
  chair:          1,
  trash:          1,
  divider:        1,
  locker:         1,
  desk:           2,
  sofa:           2,
  couch:          2,
  coffee_table:   2,
  pool_table:     2,
  plant:          3,
  lamp:           3,
  table:          3,
  cabinet:        3,
  fridge:         3,
  coffee_machine: 3,
  microwave:      3,
  ac_unit:        3,
  bookshelf:      4,
  whiteboard:     5,
  glass_wall:     5,
  sign:           5,
  tv_screen:      5,
  computer:       6,
  monitor_dual:   6,
  mug:            7,
};

const WALK_FRAMES = [0, 1, 2, 3];

// Avatar SVG fallback — proporção Habbo: ~40px wide x 72px tall, pixel-art corporativo
function AvatarFallback({ color, name }: { color: string; name: string }) {
  const initial = name.slice(0, 1).toUpperCase();
  // Cores calculadas a partir da cor do especialista
  const suitDark = color;
  const skinTone = '#F5C99A';
  const hairColor = '#3D2B1F';
  return (
    <svg
      width="40"
      height="72"
      viewBox="0 0 40 72"
      fill="none"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Sombra no chão */}
      <ellipse cx="20" cy="70" rx="12" ry="3" fill="black" fillOpacity="0.25" />
      {/* Pernas */}
      <rect x="12" y="52" width="6" height="14" rx="1" fill={suitDark} />
      <rect x="22" y="52" width="6" height="14" rx="1" fill={suitDark} />
      {/* Sapatos */}
      <rect x="11" y="63" width="8" height="4" rx="1" fill="#1E293B" />
      <rect x="21" y="63" width="8" height="4" rx="1" fill="#1E293B" />
      {/* Corpo / terno */}
      <rect x="10" y="32" width="20" height="22" rx="2" fill={suitDark} />
      {/* Camisa branca */}
      <rect x="17" y="33" width="6" height="14" fill="#F1F5F9" />
      {/* Gravata */}
      <polygon points="20,35 22,37 20,47 18,37" fill="#EF4444" />
      {/* Lapela */}
      <polygon points="10,32 17,38 17,33" fill={suitDark} opacity="0.8" />
      <polygon points="30,32 23,38 23,33" fill={suitDark} opacity="0.8" />
      {/* Braços */}
      <rect x="4" y="33" width="7" height="16" rx="2" fill={suitDark} />
      <rect x="29" y="33" width="7" height="16" rx="2" fill={suitDark} />
      {/* Mãos */}
      <ellipse cx="7" cy="50" rx="3.5" ry="3" fill={skinTone} />
      <ellipse cx="33" cy="50" rx="3.5" ry="3" fill={skinTone} />
      {/* Pescoço */}
      <rect x="17" y="26" width="6" height="7" rx="1" fill={skinTone} />
      {/* Cabeça */}
      <rect x="11" y="10" width="18" height="18" rx="4" fill={skinTone} />
      {/* Cabelo */}
      <rect x="11" y="10" width="18" height="6" rx="3" fill={hairColor} />
      <rect x="11" y="13" width="4" height="5" rx="1" fill={hairColor} />
      {/* Olhos */}
      <rect x="14" y="19" width="3" height="3" rx="1" fill="#1E293B" />
      <rect x="23" y="19" width="3" height="3" rx="1" fill="#1E293B" />
      {/* Reflexo dos olhos */}
      <rect x="15" y="19" width="1" height="1" fill="white" opacity="0.8" />
      <rect x="24" y="19" width="1" height="1" fill="white" opacity="0.8" />
      {/* Sorriso */}
      <path d="M15 24 Q20 27 25 24" stroke="#7C3A3A" strokeWidth="1.2" fill="none" />
      {/* Inicial no peito — identifica o especialista */}
      <text x="20" y="46" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold" opacity="0.9">{initial}</text>
    </svg>
  );
}

// Mapa de cores dos avatares fallback
const AVATAR_COLORS: Record<string, string> = {
  carlos:  '#EF4444',
  marcos:  '#06B6D4',
  sophia:  '#8B5CF6',
  andre:   '#3B82F6',
  diego:   '#10B981',
  raquel:  '#F59E0B',
  helena:  '#EC4899',
  victor:  '#F97316',
  '1':     '#4A90E2',
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
  // Controla quais avatares usam a API Habbo e quais usam SVG fallback
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

  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = map[y][x];
      if (val === 0) continue;
      const colors = getTileColors(val, x, y);
      if (!colors) continue;
      const pos = getScreenPos(x, y);
      const walkable = isWalkable(val);
      const wall = isWall(val);

      // Tiles de parede (8,9,10) recebem tratamento visual de parede alta
      if (wall && val >= 8) {
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
            <div
              className="absolute w-full h-[32px] top-0 left-0"
              style={{
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                backgroundColor: colors.top,
              }}
            />
            {/* Face esquerda */}
            <div
              className="absolute w-[32px] left-0"
              style={{
                height: colors.h + 16,
                top: 16,
                clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))',
                backgroundColor: colors.left,
              }}
            >
              {/* Janelas na face esquerda para tile tipo 9 */}
              {val === 9 && (
                <>
                  <div style={{ position: 'absolute', left: 3, top: '18%', width: 10, height: 20, backgroundColor: '#BFDBFE', opacity: 0.5, borderRadius: 1 }} />
                  <div style={{ position: 'absolute', left: 3, top: '55%', width: 10, height: 20, backgroundColor: '#BFDBFE', opacity: 0.4, borderRadius: 1 }} />
                </>
              )}
            </div>
            {/* Face direita */}
            <div
              className="absolute w-[32px] left-[32px]"
              style={{
                height: colors.h + 16,
                top: 16,
                clipPath: 'polygon(0% 16px, 100% 0%, 100% calc(100% - 16px), 0% 100%)',
                backgroundColor: colors.right,
              }}
            >
              {/* Janelas na face direita para tile tipo 9 */}
              {val === 9 && (
                <>
                  <div style={{ position: 'absolute', right: 3, top: '18%', width: 10, height: 20, backgroundColor: '#93C5FD', opacity: 0.5, borderRadius: 1 }} />
                  <div style={{ position: 'absolute', right: 3, top: '55%', width: 10, height: 20, backgroundColor: '#93C5FD', opacity: 0.4, borderRadius: 1 }} />
                </>
              )}
            </div>
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
          <div
            className="absolute w-full h-[32px] top-0 left-0"
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              backgroundColor: colors.top,
              boxShadow: walkable ? 'inset 0 0 0 1px rgba(0,0,0,0.15)' : undefined,
            }}
          >
            <div className="absolute inset-0" style={{
              clipPath: 'polygon(50% 0%, 75% 25%, 50% 50%, 25% 25%)',
              backgroundColor: colors.accent,
            }} />
            {walkable && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-75" style={{
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                backgroundColor: 'rgba(255,255,255,0.18)',
              }} />
            )}
          </div>
          {colors.h > 0 && (
            <div
              className="absolute w-[32px] left-0"
              style={{
                height: colors.h + 16,
                top: 16,
                clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))',
                backgroundColor: colors.left,
                borderLeft: '1px solid rgba(0,0,0,0.2)',
              }}
            />
          )}
          {colors.h > 0 && (
            <div
              className="absolute w-[32px] left-[32px]"
              style={{
                height: colors.h + 16,
                top: 16,
                clipPath: 'polygon(0% 16px, 100% 0%, 100% calc(100% - 16px), 0% 100%)',
                backgroundColor: colors.right,
                borderRight: '1px solid rgba(0,0,0,0.2)',
              }}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className="absolute inset-0 border-b-2 border-[#111] overflow-hidden">
      <div
        className={`absolute inset-0 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #B0D8F0 30%, #E8F4FB 55%, #D4E8F5 60%, #C8DCEC 65%, #1a2744 66%, #0a0f1e 100%)'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Nuvens decorativas no fundo */}
        <div className="absolute pointer-events-none" style={{ top: '8%', left: '10%', opacity: 0.7 }}>
          <div style={{ width: 80, height: 20, background: 'white', borderRadius: 10, filter: 'blur(4px)' }} />
        </div>
        <div className="absolute pointer-events-none" style={{ top: '12%', left: '60%', opacity: 0.5 }}>
          <div style={{ width: 120, height: 24, background: 'white', borderRadius: 12, filter: 'blur(5px)' }} />
        </div>
        <div className="absolute pointer-events-none" style={{ top: '6%', left: '35%', opacity: 0.6 }}>
          <div style={{ width: 60, height: 16, background: 'white', borderRadius: 8, filter: 'blur(3px)' }} />
        </div>

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
          const avatarColor = AVATAR_COLORS[user.id] ?? '#4A90E2';

          return (
            <div
              key={user.id}
              className="absolute flex flex-col items-center pointer-events-none"
              style={{
                left: pos.x,
                top: pos.y - 16,
                transform: 'translate(-50%, -100%)',
                zIndex: (user.x + user.y) * 10 + 6,
              }}
            >
              {/* Nameplate */}
              <div
                className="mb-1 px-2 py-0.5 font-pixel text-[9px] font-bold text-white whitespace-nowrap"
                style={{
                  background: 'linear-gradient(180deg, #1a4a8a 0%, #0e2d5e 100%)',
                  border: '1px solid #4a9eff',
                  borderRadius: '3px',
                  boxShadow: '0 1px 0 #07193a, 0 0 6px rgba(74,158,255,0.3)',
                  letterSpacing: '0.04em',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                {user.name}
              </div>

              {/* Avatar: API Habbo com fallback proporcional */}
              {!failed ? (
                <img
                  src={`https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}&size=m&direction=${user.direction}&head_direction=${user.direction}&crr=0&gesture=sml&frame=${frame}`}
                  alt={user.name}
                  style={{ imageRendering: 'pixelated', display: 'block', width: 40, height: 72 }}
                  onError={() => setHabboFailed(prev => ({ ...prev, [user.id]: true }))}
                />
              ) : (
                <AvatarFallback color={avatarColor} name={user.name} />
              )}

              {/* Sombra no chão */}
              <div className="w-8 h-2.5 -mt-0.5" style={{
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
