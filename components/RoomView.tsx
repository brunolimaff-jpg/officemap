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

const getTileColors = (val: number, x: number, y: number) => {
  const isLight = (x + y) % 2 === 0;
  switch (val) {
    case 1: return isLight
      ? { top: '#E2E8F0', left: '#CBD5E1', right: '#94A3B8', h: 8 }
      : { top: '#F1F5F9', left: '#E2E8F0', right: '#CBD5E1', h: 8 };
    case 4: return { top: '#334155', left: '#1E293B', right: '#0F172A', h: 120 };
    default: return null;
  }
};

export default function RoomView({ users, map, onTileClick }: RoomViewProps) {
  const width = map[0].length;
  const height = map.length;

  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // ── Tiles ──────────────────────────────────────────────────────────────────
  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = map[y][x];
      if (val === 0) continue;
      const colors = getTileColors(val, x, y);
      if (!colors) continue;
      const pos = getScreenPos(x, y);
      const isWalkable = val === 1;
      tiles.push(
        <div
          key={`tile-${x}-${y}`}
          onMouseUp={() => isWalkable && handleTileClick(x, y)}
          className={`absolute ${isWalkable && !isDragging ? 'cursor-pointer hover:brightness-125' : ''} transition-all duration-75`}
          style={{
            left: pos.x - TILE_W / 2,
            top: pos.y - colors.h,
            width: TILE_W,
            height: TILE_H + colors.h,
            zIndex: (x + y) * 10,
          }}
        >
          {/* Face superior */}
          <div className="absolute w-full h-[32px] top-0 left-0" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', backgroundColor: colors.top, border: '1px solid rgba(255,255,255,0.08)' }} />
          {/* Face esquerda */}
          {colors.h > 0 && <div className="absolute w-[32px] left-0" style={{ height: colors.h + 16, top: 16, clipPath: 'polygon(0% 0%, 100% 16px, 100% 100%, 0% calc(100% - 16px))', backgroundColor: colors.left }} />}
          {/* Face direita */}
          {colors.h > 0 && <div className="absolute w-[32px] left-[32px]" style={{ height: colors.h + 16, top: 16, clipPath: 'polygon(0% 16px, 100% 0%, 100% calc(100% - 16px), 0% 100%)', backgroundColor: colors.right }} />}
        </div>
      );
    }
  }

  return (
    <div
      className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] to-[#020617] overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Tiles do chão */}
      {tiles}

      {/* Móveis SVG isométricos */}
      {furniture.map((f: Furniture) => {
        const pos = getScreenPos(f.x, f.y);
        return (
          <FurniSprite
            key={f.id}
            type={f.type}
            pos={pos}
            color={f.color}
            direction={f.direction}
            tileX={f.x}
            tileY={f.y}
          />
        );
      })}

      {/* Avatares */}
      {users.map(user => {
        const pos = getScreenPos(user.x, user.y);
        return (
          <div
            key={user.id}
            className="absolute flex flex-col items-center pointer-events-none"
            style={{
              left: pos.x,
              top: pos.y - 16,
              transform: 'translate(-50%, -100%)',
              zIndex: (user.x + user.y) * 10 + 5,
            }}
          >
            <div className="bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded mb-1 font-pixel tracking-wide">
              {user.name}
            </div>
            <img
              src={`https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}&size=m&direction=${user.direction}&head_direction=${user.direction}&crr=0&gesture=sml&frame=1`}
              alt={user.name}
              className="drop-shadow-lg"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="w-8 h-3 bg-black/20 rounded-[100%] absolute bottom-0 -z-10" />
          </div>
        );
      })}
    </div>
  );
}
