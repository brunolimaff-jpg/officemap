'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import IsoCanvas from './IsoCanvas';
import FurniSprite from './FurniSprite';
import HabboAvatar from './HabboAvatar';
import { CANVAS_W, CANVAS_H, tileToScreen } from '@/lib/isoEngine';
import type { Furniture, AvatarState } from '@/types';

interface RoomViewProps {
  map: number[][];
  furniture: Furniture[];
  avatars: AvatarState[];
  onTileClick: (x: number, y: number) => void;
  proximityTiles?: Array<{ x: number; y: number }>;
}

export default function RoomView({
  map, furniture, avatars, onTileClick, proximityTiles = [],
}: RoomViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Recalcula scale sempre que o container redimensiona
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // Escala baseada na largura disponível com um mínimo razoável para mobile
        const newScale = Math.max(0.18, width / CANVAS_W);
        setScale(newScale);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledW = Math.round(CANVAS_W * scale);
  const scaledH = Math.round(CANVAS_H * scale);

  return (
    // Container externo: ocupa toda a área disponível, scroll horizontal no mobile
    <div
      ref={containerRef}
      className="relative w-full overflow-x-auto overflow-y-hidden"
      style={{ height: scaledH, minHeight: 200 }}
    >
      {/* Camada escalada — canvas + sprites + avatares todos juntos */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
          width: CANVAS_W,
          height: CANVAS_H,
        }}
      >
        {/* Canvas isométrico */}
        <IsoCanvas
          map={map}
          onTileClick={onTileClick}
          scale={scale}
          proximityTiles={proximityTiles}
        />

        {/* Móveis */}
        {furniture.map((f) => {
          const { px, py } = tileToScreen(f.x, f.y);
          return (
            <FurniSprite
              key={f.id}
              type={f.type}
              pos={{ x: px, y: py }}
              color={f.color}
              direction={f.direction}
              tileX={f.x}
              tileY={f.y}
              zBonus={f.zBonus}
              label={f.label}
            />
          );
        })}

        {/* Avatares */}
        {avatars.map((av) => {
          const { px, py } = tileToScreen(av.x, av.y);
          return (
            <HabboAvatar
              key={av.id}
              avatarState={av}
              pos={{ x: px, y: py }}
            />
          );
        })}
      </div>
    </div>
  );
}
