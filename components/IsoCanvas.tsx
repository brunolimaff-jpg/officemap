'use client';
import { useEffect, useRef, useCallback } from 'react';
import {
  TILE_W, TILE_H, TILE_D, CANVAS_W, CANVAS_H,
  ORIGIN_X, ORIGIN_Y, TILE_COLORS,
  tileToScreen, screenToTile, isWalkable,
} from '@/lib/isoEngine';
import type { Furniture } from '@/types';

interface IsoCanvasProps {
  map: number[][];
  furniture: Furniture[];
  onTileClick: (x: number, y: number) => void;
  /** escala CSS aplicada ao canvas — adapta ao container */
  scale: number;
}

// ─── Desenha um tile isométrico (losango + faces 3D) ──────────────────────────
function drawTile(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  colors: { top: string; left: string; right: string; h: number },
) {
  const hw = TILE_W / 2;  // 32
  const hh = TILE_H / 2;  // 16
  const { top, left, right, h } = colors;

  // Face superior (losango)
  ctx.beginPath();
  ctx.moveTo(px,      py);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px - hw, py + hh);
  ctx.closePath();
  ctx.fillStyle = top;
  ctx.fill();

  if (h > 4) {
    // Face esquerda
    ctx.beginPath();
    ctx.moveTo(px - hw, py + hh);
    ctx.lineTo(px,      py + TILE_H);
    ctx.lineTo(px,      py + TILE_H + h);
    ctx.lineTo(px - hw, py + hh + h);
    ctx.closePath();
    ctx.fillStyle = left;
    ctx.fill();

    // Face direita
    ctx.beginPath();
    ctx.moveTo(px,      py + TILE_H);
    ctx.lineTo(px + hw, py + hh);
    ctx.lineTo(px + hw, py + hh + h);
    ctx.lineTo(px,      py + TILE_H + h);
    ctx.closePath();
    ctx.fillStyle = right;
    ctx.fill();
  } else {
    // Piso fino: só linha de borda sutil
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

  // Borda sutil
  ctx.beginPath();
  ctx.moveTo(px,      py);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px - hw, py + hh);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

// ─── Desenha móvel como bloco colorido isométrico ─────────────────────────────
function drawFurniture(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  furniture: Furniture,
) {
  const hw  = TILE_W / 2;
  const hh  = TILE_H / 2;
  const color = furniture.color ?? '#64748B';

  // Altura visual por tipo
  const heights: Record<string, number> = {
    desk: 18, chair: 14, monitor_dual: 22, computer: 20,
    table: 16, sofa: 20, bookshelf: 36, cabinet: 28,
    whiteboard: 32, tv_screen: 28, lamp: 40, plant: 32,
    rug: 2, divider: 24, sign: 4, mug: 6,
    fridge: 32, coffee_machine: 24, microwave: 18,
    coffee_table: 10, pool_table: 14, trash: 12,
    ac_unit: 12, door: 40,
  };
  const fh = heights[furniture.type] ?? 16;

  // Paleta de cores derivada da cor principal
  const darken = (hex: string, amt: number) => {
    const n = parseInt(hex.replace('#',''), 16);
    const r = Math.max(0, ((n >> 16) & 0xff) - amt);
    const g = Math.max(0, ((n >>  8) & 0xff) - amt);
    const b = Math.max(0, ( n        & 0xff) - amt);
    return `rgb(${r},${g},${b})`;
  };

  const topColor   = color;
  const leftColor  = darken(color, 40);
  const rightColor = darken(color, 60);

  // Face superior
  ctx.beginPath();
  ctx.moveTo(px,      py - fh);
  ctx.lineTo(px + hw, py - fh + hh);
  ctx.lineTo(px,      py - fh + TILE_H);
  ctx.lineTo(px - hw, py - fh + hh);
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();

  // Face esquerda
  ctx.beginPath();
  ctx.moveTo(px - hw, py - fh + hh);
  ctx.lineTo(px,      py - fh + TILE_H);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px - hw, py + hh);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();

  // Face direita
  ctx.beginPath();
  ctx.moveTo(px,      py - fh + TILE_H);
  ctx.lineTo(px + hw, py - fh + hh);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.closePath();
  ctx.fillStyle = rightColor;
  ctx.fill();

  // Borda
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(px,      py - fh);
  ctx.lineTo(px + hw, py - fh + hh);
  ctx.lineTo(px,      py - fh + TILE_H);
  ctx.lineTo(px - hw, py - fh + hh);
  ctx.closePath();
  ctx.stroke();
}

export default function IsoCanvas({ map, furniture, onTileClick, scale }: IsoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ─── Renderiza mapa + móveis ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // 1. Tiles — varredura diagonal para z-order correto (painter's algorithm)
    for (let diag = 0; diag < map.length + (map[0]?.length ?? 0); diag++) {
      for (let y = 0; y < map.length; y++) {
        const x = diag - y;
        if (x < 0 || x >= (map[0]?.length ?? 0)) continue;
        const tileType = map[y][x];
        if (tileType === 0) continue;
        const colors = TILE_COLORS[tileType];
        if (!colors) continue;
        const { px, py } = tileToScreen(x, y);
        drawTile(ctx, px, py, colors);
      }
    }

    // 2. Móveis — também em ordem diagonal
    const furnitureSorted = [...furniture].sort(
      (a, b) => (a.x + a.y) - (b.x + b.y)
    );
    for (const f of furnitureSorted) {
      const { px, py } = tileToScreen(f.x, f.y);
      // py aponta para o centro-topo do tile; avatar senta no centro do tile
      drawFurniture(ctx, px, py + TILE_H, f);
    }
  }, [map, furniture]);

  // ─── Clique → tile ────────────────────────────────────────────────────────
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect  = canvas.getBoundingClientRect();
      // Ajusta para a escala CSS aplicada
      const rawX  = (e.clientX - rect.left)  / scale;
      const rawY  = (e.clientY - rect.top)   / scale;
      const { x, y } = screenToTile(rawX, rawY);
      if (isWalkable(map, x, y)) {
        onTileClick(x, y);
      }
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
