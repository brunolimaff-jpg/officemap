'use client';
import { useEffect, useRef } from 'react';
import { TILE_SIZE, CANVAS_W, CANVAS_H, tileToSprite } from '@/lib/topDownEngine';

interface TopDownCanvasProps {
  map: number[][];
  spritesheetUrl: string;
}

export default function TopDownCanvas({ map, spritesheetUrl }: TopDownCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // desliga anti-aliasing para pixel art ficar nítido
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = spritesheetUrl;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < (map[row]?.length ?? 0); col++) {
          const tileId = map[row][col];
          if (tileId < 0) continue;

          const { sx, sy } = tileToSprite(tileId);
          const dx = col * TILE_SIZE;
          const dy = row * TILE_SIZE;

          ctx.drawImage(
            img,
            sx, sy, TILE_SIZE, TILE_SIZE,
            dx, dy, TILE_SIZE, TILE_SIZE,
          );
        }
      }
    };

    img.onload = draw;

    // fallback colorido caso o PNG não carregue
    img.onerror = () => {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < (map[row]?.length ?? 0); col++) {
          const id = map[row][col];
          if (id < 0) continue;
          const dx = col * TILE_SIZE;
          const dy = row * TILE_SIZE;
          const colors: Record<number, string> = {
            76: '#374151', 77: '#374151', 78: '#374151',
            95: '#374151', 96: '#374151', 79: '#374151',
          };
          ctx.fillStyle = colors[id] ?? (id === 0 ? '#4B5563' : '#6B7280');
          ctx.fillRect(dx + 1, dy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(dx, dy, TILE_SIZE, TILE_SIZE);
        }
      }
    };
  }, [map, spritesheetUrl]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        imageRendering: 'pixelated',
        display: 'block',
      }}
    />
  );
}
