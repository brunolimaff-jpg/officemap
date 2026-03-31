'use client';
import { useEffect, useRef } from 'react';
import { OFFICE_MAIN_MAP } from '@/data/maps/office_main';
import { TILE_SIZE, tileToSprite } from '@/lib/topDownEngine';

const MAP_COLS = OFFICE_MAIN_MAP[0]?.length ?? 30;
const MAP_ROWS = OFFICE_MAIN_MAP.length;

interface Props {
  width: number;
  height: number;
}

export default function TileBackground({ width, height }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = '/assets/tiles/Modern_Office_32x32.png';

    const draw = () => {
      // Calcula escala para cobrir o canvas isométrico inteiro
      const scaleX = width / (MAP_COLS * TILE_SIZE);
      const scaleY = height / (MAP_ROWS * TILE_SIZE);
      ctx.clearRect(0, 0, width, height);
      for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
          const id = OFFICE_MAIN_MAP[row]?.[col] ?? -1;
          if (id < 0) continue;
          const { sx, sy } = tileToSprite(id);
          ctx.drawImage(
            img,
            sx, sy, TILE_SIZE, TILE_SIZE,
            Math.round(col * TILE_SIZE * scaleX),
            Math.round(row * TILE_SIZE * scaleY),
            Math.round(TILE_SIZE * scaleX),
            Math.round(TILE_SIZE * scaleY),
          );
        }
      }
    };

    if (img.complete) draw();
    else img.onload = draw;
  }, [width, height]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        imageRendering: 'pixelated',
        zIndex: 0,
        opacity: 0.92,
      }}
    />
  );
}
