import os

ROOT = r"C:\Users\bruno.ferreira\Desktop\NOVO APP\officemap"
path = os.path.join(ROOT, "components", "RoomView.tsx")

ROOM_VIEW = r"""import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User } from './HabboClient';
import { furniture } from '@/data/specialists';
import { Furniture } from '@/types';
import FurniSprite from './FurniSprite';
import { ISO_LAYER, isoZIndex, layerForFurnitureType } from '@/lib/isoDepth';

interface RoomViewProps {
  users: User[];
  map: number[][];
  onTileClick: (x: number, y: number) => void;
}

const TILE_W = 64;
const TILE_H = 32;
const WALL_H = 130; // Altura clássica da parede Habbo

type SortItem =
  | { kind: 'furni'; z: number; id: string; f: Furniture }
  | { kind: 'avatar'; z: number; id: string; u: User };

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
  const offsetY = windowSize.height / 2 - (height * TILE_H) / 2 + 50;

  // Posição na tela SEM cameraOffset (a câmera move o wrapper inteiro = 60fps hardware accelerated)
  const getScreenPos = (x: number, y: number) => ({
    x: offsetX + (x - y) * (TILE_W / 2),
    y: offsetY + (x + y) * (TILE_H / 2),
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
  
  const handleTileClick = (x: number, y: number) => {
    if (!dragMoved) onTileClick(x, y);
  };

  const sortedEntities = useMemo(() => {
    const list: SortItem[] = furniture.map((f) => ({
      kind: 'furni',
      z: isoZIndex(f.x, f.y, layerForFurnitureType(f.type)),
      id: f.id,
      f,
    }));
    users.forEach((u) => {
      list.push({
        kind: 'avatar',
        z: isoZIndex(u.x, u.y, ISO_LAYER.avatar),
        id: u.id,
        u,
      });
    });
    list.sort((a, b) => a.z - b.z);
    return list;
  }, [users]);

  // Renderização do cenário estático (Paredes e Chão) em um único SVG performático
  const mapPaths = useMemo(() => {
    const elements = [];
    for (let sum = 0; sum < width + height; sum++) {
      for (let y = 0; y <= sum; y++) {
        const x = sum - y;
        if (y >= height || x >= width) continue;

        const val = map[y][x];
        if (val === 0) continue;

        const pos = getScreenPos(x, y);
        const isLight = (x + y) % 2 === 0;

        if (val === 1) {
          // CHÃO CONTÍNUO (Sem borda css bugada, desenhado perfeitamente com profundidade)
          const fill = isLight ? '#9CA3AF' : '#8B92A0';
          const edge1 = '#6B7280';
          const edge2 = '#4B5563';
          elements.push(
            <g 
              key={`floor-${x}-${y}`} 
              transform={`translate(${pos.x - 32}, ${pos.y})`}
              style={{ pointerEvents: 'auto' }}
              className="cursor-pointer hover:brightness-110 transition-all duration-75"
              onMouseUp={(e) => {
                e.stopPropagation();
                handleTileClick(x, y);
              }}
            >
              <path d="M32 0 L64 16 L32 32 L0 16 Z" fill={fill} />
              <path d="M64 16 L32 32 L32 35 L64 19 Z" fill={edge1} />
              <path d="M32 32 L0 16 L0 19 L32 35 Z" fill={edge2} />
            </g>
          );
        } else if (val === 4) {
          // PAREDES FINAS
          const isLeftWall = x + 1 < width && map[y][x+1] === 1;
          const isRightWall = y + 1 < height && map[y+1][x] === 1;
          const isCorner = x + 1 < width && y + 1 < height && map[y+1][x+1] === 1 && !isLeftWall && !isRightWall;

          if (isLeftWall) {
            elements.push(
              <g key={`wall-L-${x}-${y}`} transform={`translate(${pos.x - 32}, ${pos.y})`}>
                <path d={`M32 32 L64 16 L64 ${16 - WALL_H} L32 ${32 - WALL_H} Z`} fill="#90A4AE" stroke="#607D8B" strokeWidth="0.5" />
                <path d={`M32 ${32 - WALL_H} L64 ${16 - WALL_H} L56 ${12 - WALL_H} L24 ${28 - WALL_H} Z`} fill="#CFD8DC" />
                <path d={`M32 32 L32 ${32 - WALL_H} L24 ${28 - WALL_H} L24 28 Z`} fill="#607D8B" />
              </g>
            );
          } else if (isRightWall) {
            elements.push(
              <g key={`wall-R-${x}-${y}`} transform={`translate(${pos.x - 32}, ${pos.y})`}>
                <path d={`M0 16 L32 32 L32 ${32 - WALL_H} L0 ${16 - WALL_H} Z`} fill="#78909C" stroke="#546E7A" strokeWidth="0.5" />
                <path d={`M0 ${16 - WALL_H} L32 ${32 - WALL_H} L40 ${28 - WALL_H} L8 ${12 - WALL_H} Z`} fill="#CFD8DC" />
                <path d={`M32 32 L32 ${32 - WALL_H} L40 ${28 - WALL_H} L40 28 Z`} fill="#546E7A" />
              </g>
            );
          } else if (isCorner) {
            elements.push(
              <g key={`wall-C-${x}-${y}`} transform={`translate(${pos.x - 32}, ${pos.y})`}>
                <path d={`M32 32 L64 16 L64 ${16 - WALL_H} L32 ${32 - WALL_H} Z`} fill="#90A4AE" />
                <path d={`M0 16 L32 32 L32 ${32 - WALL_H} L0 ${16 - WALL_H} Z`} fill="#78909C" />
                <path d={`M32 32 L32 ${32 - WALL_H}`} stroke="#546E7A" strokeWidth="1" />
                <path d={`M0 ${16 - WALL_H} L32 ${32 - WALL_H} L64 ${16 - WALL_H} L32 ${0 - WALL_H} Z`} fill="#CFD8DC" />
              </g>
            );
          }
        }
      }
    }
    return elements;
  }, [map, offsetX, offsetY]);

  return (
    <div
      className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] to-[#020617] overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute inset-0 origin-center" 
        style={{ transform: `translate(${cameraOffset.x}px, ${cameraOffset.y}px)` }}
      >
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
          {mapPaths}
        </svg>

        {sortedEntities.map((item) => {
          if (item.kind === 'furni') {
            const f = item.f;
            const pos = getScreenPos(f.x, f.y);
            return (
              <FurniSprite
                key={item.id}
                type={f.type}
                pos={pos}
                color={f.color}
                direction={f.direction}
                tileX={f.x}
                tileY={f.y}
                zIndex={item.z}
              />
            );
          }
          const u = item.u;
          const pos = getScreenPos(u.x, u.y);
          return (
            <div
              key={item.id}
              className="absolute flex flex-col items-center pointer-events-none"
              style={{
                left: pos.x,
                top: pos.y - 16,
                transform: 'translate(-50%, -100%)',
                zIndex: item.z,
              }}
            >
              <div className="bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded mb-1 font-pixel tracking-wide">
                {u.name}
              </div>
              <img
                src={`https://www.habbo.com/habbo-imaging/avatarimage?figure=${u.figure}&size=m&direction=${u.direction}&head_direction=${u.direction}&crr=0&gesture=sml&frame=1`}
                alt={u.name}
                className="drop-shadow-lg"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="w-8 h-3 bg-black/20 rounded-[100%] absolute bottom-0 -z-10" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(ROOM_VIEW)

print("done")
