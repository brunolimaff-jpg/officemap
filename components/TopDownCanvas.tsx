'use client';
import { useEffect, useRef } from 'react';
import {
  TILE_SIZE, CANVAS_W, CANVAS_H, SHEET_COLS,
  tileToSprite,
} from '@/lib/topDownEngine';

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

    const img = new Image();
    img.src = spritesheetUrl;

    img.onload = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Fundo preto
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Renderiza cada tile da matriz
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          const tileId = map[row][col];
          if (tileId < 0) continue; // EMPTY

          const { sx, sy } = tileToSprite(tileId);
          const dx = col * TILE_SIZE;
          const dy = row * TILE_SIZE;

          ctx.drawImage(
            img,
            sx, sy, TILE_SIZE, TILE_SIZE,   // source
            dx, dy, TILE_SIZE, TILE_SIZE,   // destination
          );
        }
      }
    };

    img.onerror = () => {
      // Fallback: renderiza mapa com cores sólidas
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          const tileId = map[row][col];
          if (tileId < 0) continue;
          const dx = col * TILE_SIZE;
          const dy = row * TILE_SIZE;
          ctx.fillStyle = tileId === 0 ? '#4a5568' : tileId > 70 ? '#744210' : '#2b6cb0';
          ctx.fillRect(dx + 1, dy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        }
      }
    };
  }, [map, spritesheetUrl]);

  return (
    <div className="overflow-auto w-full h-full">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="block"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
