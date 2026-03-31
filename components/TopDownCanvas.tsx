'use client';
import { useEffect, useRef } from 'react';
import { TILE_SIZE, CANVAS_W, CANVAS_H, tileToSprite } from '@/lib/topDownEngine';

interface Props {
  map: number[][];
  spritesheetUrl: string;
}

export default function TopDownCanvas({ map, spritesheetUrl }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = spritesheetUrl;

    const draw = () => {
      ctx.fillStyle = '#2d2d44';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < (map[row]?.length ?? 0); col++) {
          const id = map[row][col];
          if (id < 0) continue;
          const { sx, sy } = tileToSprite(id);
          ctx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    };

    img.onload = draw;
    img.onerror = () => {
      // fallback: piso e paredes coloridos
      ctx.fillStyle = '#3d3d5c';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < (map[row]?.length ?? 0); col++) {
          const id = map[row][col];
          if (id < 0) continue;
          const x = col * TILE_SIZE;
          const y = row * TILE_SIZE;
          ctx.fillStyle = id < 30 ? '#4a6fa5' : id < 100 ? '#c8a96e' : '#7a9e7e';
          ctx.fillRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        }
      }
    };
  }, [map, spritesheetUrl]);

  return (
    <canvas
      ref={ref}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    />
  );
}
