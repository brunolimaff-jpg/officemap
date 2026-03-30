import React, { useState, useRef, useEffect } from 'react';
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

// Retorna cores e altura por tipo de tile
const getTileColors = (val: number, x: number, y: number) => {
  const isLight = (x + y) % 2 === 0;
  switch (val) {
    // Piso padrão — alas de trabalho
    case 1: return isLight
      ? { top: '#E2E8F0', left: '#CBD5E1', right: '#94A3B8', h: 8 }
      : { top: '#F1F5F9', left: '#E2E8F0', right: '#CBD5E1', h: 8 };
    // Corredor / tapete — tom mais frio e escuro
    case 2: return isLight
      ? { top: '#B8C4D4', left: '#9AABB8', right: '#7A8FA0', h: 8 }
      : { top: '#C7D2E2', left: '#B0BED0', right: '#8898AE', h: 8 };
    // Meeting Room — azul escuro premium
    case 3: return isLight
      ? { top: '#1E3A5F', left: '#162D4A', right: '#0E2035', h: 8 }
      : { top: '#243D63', left: '#1A2F4E', right: '#102238', h: 8 };
    // Parede externa
    case 4: return { top: '#334155', left: '#1E293B', right: '#0F172A', h: 72 };
    // Meia-parede interna — separa zonas
    case 5: return { top: '#475569', left: '#334155', right: '#1E293B', h: 40 };
    default: return null;
  }
};

// Altura bonus por tipo de furni para z-order correto
const FURNI_Z_BONUS: Record<string, number> = {
  desk: 2, chair: 1, table: 3, sofa: 2, whiteboard: 5, plant: 3, divider: 1,
};

export default function RoomView({ users, map, onTileClick }: RoomViewProps) {
  const width = map[0].length;
  const height = map.length;

  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  // Rastreia qual usuário está andando para animação de frame
  const [walkingUsers, setWalkingUsers] = useState<Set<string>>(new Set());
  const prevPositions = useRef<Record<string, { x: number; y: number }>>({});

  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detecta movimento de usuários para ativar frame de caminhada
  useEffect(() => {
    const newWalking = new Set<string>();
    users.forEach(u => {
      const prev = prevPositions.current[u.id];
      if (prev && (prev.x !== u.x || prev.y !== u.y)) {
        newWalking.add(u.id);
      }
      prevPositions.current[u.id] = { x: u.x, y: u.y };
    });
    if (newWalking.size > 0) {
      setWalkingUsers(newWalking);
      const timer = setTimeout(() => setWalkingUsers(new Set()), 400);
      return () => clearTimeout(timer);
    }
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

  const getScreenPos = (x: number, y: number) => ({
    x: offsetX + (x - y) * (TILE_W / 2) + cameraOffset.x,
    y: offsetY + (x + y) * (TILE_H / 2) + cameraOffset.y,
  });

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

  // Tiles walkable: 1, 2, 3
  const isWalkable = (val: number) => val === 1 || val === 2 || val === 3;

  // ── Tiles ──────────────────────────────────────────────────────────────────
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
          className={`absolute ${walkable && !isDragging ? 'cursor-pointer hover:brightness-110' : ''} transition-all duration-75`}
          style={{
            left: pos.x - TILE_W / 2,
            top: pos.y - colors.h,
            width: TILE_W,
            height: TILE_H + colors.h,
            zIndex: (x + y) * 10,
          }}
        >
          {/* Face superior */}
          <div
            className="absolute w-full h-[32px] top-0 left-0"
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              backgroundColor: colors.top,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
          {/* Face esquerda */}
          {colors.h > 0 && (
            <div
              className="absolute w-[32px] left-0"
              style={{
                height: colors.h + 16,
                top: 16,
                clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))',
                backgroundColor: colors.left,
              }}
            />
          )}
          {/* Face direita */}
          {colors.h > 0 && (
            <div
              className="absolute w-[32px] left-[32px]"
              style={{
                height: colors.h + 16,
                top: 16,
                clipPath: 'polygon(0% 16px, 100% 0%, 100% calc(100% - 16px), 0% 100%)',
                backgroundColor: colors.right,
              }}
            />
          )}
        </div>
      );
    }
  }

  return (
    // Moldura externa — separa "mundo" do HUD
    <div className="absolute inset-0 border-b-2 border-[#111] overflow-hidden">
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a2744_0%,#020617_100%)] overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Estrelas de fundo — atmosfera Habbo */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 70% 20%, white, transparent), radial-gradient(1px 1px at 45% 60%, white, transparent), radial-gradient(1px 1px at 85% 45%, white, transparent), radial-gradient(1px 1px at 10% 70%, white, transparent)',
        }} />

        {/* Tiles do chão */}
        {tiles}

        {/* Móveis SVG isométricos — z-order com bonus por altura */}
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
            />
          );
        })}

        {/* Avatares — z sempre acima do furni no mesmo tile */}
        {users.map(user => {
          const pos = getScreenPos(user.x, user.y);
          const isWalking = walkingUsers.has(user.id);
          const walkFrame = isWalking ? '&frame=1' : '&frame=0';
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
              {/* Nametag — sempre legível */}
              <div className="bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded mb-1 font-pixel tracking-wide whitespace-nowrap">
                {user.name}
              </div>
              {/* Avatar Habbo com fallback SVG inline */}
              <img
                src={`https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}&size=m&direction=${user.direction}&head_direction=${user.direction}&crr=0&gesture=sml${walkFrame}`}
                alt={user.name}
                className="drop-shadow-lg"
                style={{ imageRendering: 'pixelated' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
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
              {/* Sombra no chão */}
              <div className="w-10 h-3 bg-black/25 rounded-[100%] -mt-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
