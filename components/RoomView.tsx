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
    // Piso de lounge — tom quente
    case 6: return isLight
      ? { top: '#B8A898', left: '#7A6E64', right: '#5E5450', h: 8, accent: 'rgba(255,220,180,0.1)' }
      : { top: '#C4B4A4', left: '#887870', right: '#6A5E58', h: 8, accent: 'rgba(255,220,180,0.06)' };
    // Piso de copa — concreto claro
    case 7: return isLight
      ? { top: '#A0AEB8', left: '#6A7A84', right: '#50626C', h: 8, accent: 'rgba(255,255,255,0.1)' }
      : { top: '#ACBAC4', left: '#788490', right: '#5E7078', h: 8, accent: 'rgba(255,255,255,0.05)' };
    default: return null;
  }
};

// z-order hierárquico completo — todos os 33 tipos mapeados
// Camada 0 — chão:        rug
// Camada 1 — base:        chair, trash, divider, locker
// Camada 2 — superfície:  desk, sofa, couch, coffee_table, pool_table
// Camada 3 — objetos:     plant, lamp, table, cabinet, fridge, coffee_machine, microwave, ac_unit
// Camada 4 — estantes:    bookshelf
// Camada 5 — paredes:     whiteboard, glass_wall, sign, tv_screen
// Camada 6 — sobre mesa:  computer, monitor_dual
// Camada 7 — props topo:  mug
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

  const isWalkable = (val: number) => val === 1 || val === 2 || val === 3 || val === 6 || val === 7;

  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = map[y][x];
      if (val === 0) continue;
      const colors = getTileColors(val, x, y);
      if (!colors) continue;
      const pos = getScreenPos(x, y);
      const walkable = isWalkable(val);

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
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a2744 0%, #0a0f1e 60%, #020617 100%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: [
            'radial-gradient(1.5px 1.5px at 15% 25%, rgba(255,255,255,0.8), transparent)',
            'radial-gradient(1px 1px at 65% 15%, rgba(255,255,255,0.6), transparent)',
            'radial-gradient(2px 2px at 40% 55%, rgba(255,255,255,0.5), transparent)',
            'radial-gradient(1px 1px at 80% 40%, rgba(255,255,255,0.7), transparent)',
            'radial-gradient(1.5px 1.5px at 8% 65%, rgba(255,255,255,0.6), transparent)',
            'radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,0.4), transparent)',
            'radial-gradient(2px 2px at 55% 80%, rgba(255,255,255,0.3), transparent)',
            'radial-gradient(1px 1px at 30% 90%, rgba(255,255,255,0.5), transparent)',
          ].join(', '),
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

              <img
                src={`https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}&size=m&direction=${user.direction}&head_direction=${user.direction}&crr=0&gesture=sml&frame=${frame}`}
                alt={user.name}
                style={{ imageRendering: 'pixelated', display: 'block' }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent && !parent.querySelector('.avatar-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'avatar-fallback';
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', '40');
                    svg.setAttribute('height', '64');
                    svg.setAttribute('viewBox', '0 0 64 110');
                    svg.innerHTML = '<ellipse cx="32" cy="100" rx="16" ry="6" fill="black" fill-opacity="0.2"/><path d="M20 60 L32 66 L44 60 L44 90 L32 96 L20 90 Z" fill="#4A90E2"/><path d="M16 50 L32 58 L48 50 L44 60 L32 66 L20 60 Z" fill="#4A90E2"/><path d="M24 30 L32 34 L40 30 L40 46 L32 50 L24 46 Z" fill="#FCD34D"/><path d="M22 26 L32 31 L42 26 L42 34 L32 38 L22 34 Z" fill="#1E293B"/>';
                    fallback.appendChild(svg);
                    parent.appendChild(fallback);
                  }
                }}
              />

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
