'use client';
import { useEffect, useRef, useCallback } from 'react';
import {
  TILE_W, TILE_H, TILE_D, CANVAS_W, CANVAS_H,
  ORIGIN_X, ORIGIN_Y, TILE_COLORS,
  tileToScreen, screenToTile, isWalkable,
} from '@/lib/isoEngine';

interface IsoCanvasProps {
  map: number[][];
  onTileClick: (x: number, y: number) => void;
  scale: number;
  proximityTiles?: Array<{ x: number; y: number }>;
}

// ─── Desenha um tile isométrico (losango + faces 3D) ──────────────────────────
function drawTile(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  colors: { top: string; left: string; right: string; h: number; border?: string },
  highlight?: boolean,
) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const { top, left, right, h, border = 'rgba(0,0,0,0.10)' } = colors;

  ctx.beginPath();
  ctx.moveTo(px,      py);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px - hw, py + hh);
  ctx.closePath();
  if (highlight) {
    const grad = ctx.createRadialGradient(px, py + hh, 2, px, py + hh, hw);
    grad.addColorStop(0, 'rgba(74,158,255,0.30)');
    grad.addColorStop(1, top);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = top;
  }
  ctx.fill();

  if (h > 4) {
    ctx.beginPath();
    ctx.moveTo(px - hw, py + hh);
    ctx.lineTo(px,      py + TILE_H);
    ctx.lineTo(px,      py + TILE_H + h);
    ctx.lineTo(px - hw, py + hh + h);
    ctx.closePath();
    ctx.fillStyle = left;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(px,      py + TILE_H);
    ctx.lineTo(px + hw, py + hh);
    ctx.lineTo(px + hw, py + hh + h);
    ctx.lineTo(px,      py + TILE_H + h);
    ctx.closePath();
    ctx.fillStyle = right;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(px - hw, py + hh);
    ctx.lineTo(px,      py + TILE_H);
    ctx.lineTo(px,      py + TILE_H + TILE_D);
    ctx.lineTo(px - hw, py + hh + TILE_D);
    ctx.closePath();
    ctx.fillStyle = left;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(px,      py + TILE_H);
    ctx.lineTo(px + hw, py + hh);
    ctx.lineTo(px + hw, py + hh + TILE_D);
    ctx.lineTo(px,      py + TILE_H + TILE_D);
    ctx.closePath();
    ctx.fillStyle = right;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.moveTo(px,      py);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px - hw, py + hh);
  ctx.closePath();
  ctx.strokeStyle = highlight ? 'rgba(74,158,255,0.45)' : border;
  ctx.lineWidth = highlight ? 1.0 : 0.5;
  ctx.stroke();
}

export default function IsoCanvas({ map, onTileClick, scale, proximityTiles = [] }: IsoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const proximitySet = new Set(proximityTiles.map(t => `${t.x},${t.y}`));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    for (let diag = 0; diag < map.length + (map[0]?.length ?? 0); diag++) {
      for (let y = 0; y < map.length; y++) {
        const x = diag - y;
        if (x < 0 || x >= (map[0]?.length ?? 0)) continue;
        const tileType = map[y][x];
        if (tileType === 0) continue;
        const colors = TILE_COLORS[tileType];
        if (!colors) continue;
        const { px, py } = tileToScreen(x, y);
        const highlight = proximitySet.has(`${x},${y}`);
        drawTile(ctx, px, py, colors, highlight);
      }
    }
  }, [map, proximitySet]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const rawX = (e.clientX - rect.left)  / scale;
      const rawY = (e.clientY - rect.top)   / scale;
      const { x, y } = screenToTile(rawX, rawY);
      if (isWalkable(map, x, y)) onTileClick(x, y);
    },
    [map, onTileClick, scale]
  );

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      onClick={handleClick}
      className="absolute top-0 left-0 cursor-crosshair"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        imageRendering: 'pixelated',
      }}
    />
  );
}
