'use client';
import { useEffect, useRef, useState } from 'react';
import IsoCanvas from './IsoCanvas';
import HabboAvatar from './HabboAvatar';
import TileBackground from './TileBackground';
import { CANVAS_W, CANVAS_H, tileToScreen } from '@/lib/isoEngine';
import type { User } from '@/components/HabboClient';

interface RoomViewProps {
  map: number[][];
  users: User[];
  onTileClick: (x: number, y: number) => void;
  proximityTiles?: Array<{ x: number; y: number }>;
}

export default function RoomView({
  map, users, onTileClick, proximityTiles = [],
}: RoomViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
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
    <div
      ref={containerRef}
      className="relative w-full overflow-x-auto overflow-y-hidden"
      style={{ height: scaledH, minHeight: 200 }}
    >
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
        {/* Camada 0: tiles reais da spritesheet */}
        <TileBackground width={CANVAS_W} height={CANVAS_H} />

        {/* Camada 1: malha isométrica clicável */}
        <IsoCanvas
          map={map}
          onTileClick={onTileClick}
          scale={scale}
          proximityTiles={proximityTiles}
        />

        {/* Camada 2: avatares */}
        {users.map((user) => {
          const { px, py } = tileToScreen(user.x, user.y);
          return (
            <HabboAvatar
              key={user.id}
              avatarState={user}
              pos={{ x: px, y: py }}
            />
          );
        })}
      </div>
    </div>
  );
}
