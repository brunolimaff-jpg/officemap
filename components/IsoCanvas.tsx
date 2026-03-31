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

// ─── Tile de piso (losango + faces finas) ───────────────────────────────────
function drawTile(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  colors: { top: string; left: string; right: string; h: number; border?: string },
  highlight?: boolean,
) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const { top, left, right, h, border = 'rgba(0,0,0,0.10)' } = colors;
  const depth = Math.min(h, TILE_D);

  // Face esquerda
  ctx.beginPath();
  ctx.moveTo(px - hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px,      py + TILE_H + depth);
  ctx.lineTo(px - hw, py + hh    + depth);
  ctx.closePath();
  ctx.fillStyle = left;
  ctx.fill();

  // Face direita
  ctx.beginPath();
  ctx.moveTo(px,      py + TILE_H);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px + hw, py + hh    + depth);
  ctx.lineTo(px,      py + TILE_H + depth);
  ctx.closePath();
  ctx.fillStyle = right;
  ctx.fill();

  // Topo (losango)
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
  ctx.strokeStyle = highlight ? 'rgba(74,158,255,0.45)' : border;
  ctx.lineWidth   = highlight ? 1.0 : 0.5;
  ctx.stroke();
}

// ─── Parede isômétrica alta (tiles 8 / 9 / 10) ────────────────────────────
// Habbo-style: face frontal esquerda grande + topo fino + janelas opcionais
function drawWall(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  colors: { top: string; left: string; right: string; h: number; border?: string },
  withWindow: boolean,
) {
  const hw   = TILE_W / 2;     // 32
  const hh   = TILE_H / 2;     // 16
  const h    = colors.h;
  const { top, left, right, border = 'rgba(0,0,0,0.15)' } = colors;

  // ─ Face esquerda (parede frontal visivel da esquerda) ─────────────────
  ctx.beginPath();
  ctx.moveTo(px - hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px,      py + TILE_H + h);
  ctx.lineTo(px - hw, py + hh    + h);
  ctx.closePath();
  ctx.fillStyle = left;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth   = 0.5;
  ctx.stroke();

  // ─ Face direita (parede frontal visível da direita) ─────────────────
  ctx.beginPath();
  ctx.moveTo(px,      py + TILE_H);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px + hw, py + hh    + h);
  ctx.lineTo(px,      py + TILE_H + h);
  ctx.closePath();
  ctx.fillStyle = right;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth   = 0.5;
  ctx.stroke();

  // ─ Topo (losango fino do topo da parede) ──────────────────────────
  ctx.beginPath();
  ctx.moveTo(px,      py - h);
  ctx.lineTo(px + hw, py + hh - h);
  ctx.lineTo(px,      py + TILE_H - h);
  ctx.lineTo(px - hw, py + hh - h);
  ctx.closePath();
  ctx.fillStyle = top;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth   = 0.5;
  ctx.stroke();

  // ─ Janelas (tile 9) ──────────────────────────────────────────────
if (withWindow) {
    // Janela na face esquerda
    const wL = { x1: px - hw + 6, y1: py + hh + h * 0.20,
                 x2: px - 4,      y2: py + hh + h * 0.20,
                 x3: px - 4,      y3: py + hh + h * 0.70,
                 x4: px - hw + 6, y4: py + hh + h * 0.70 };
    ctx.beginPath();
    ctx.moveTo(wL.x1, wL.y1); ctx.lineTo(wL.x2, wL.y2);
    ctx.lineTo(wL.x3, wL.y3); ctx.lineTo(wL.x4, wL.y4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(147,197,253,0.18)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(147,197,253,0.55)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();
    // Cruz da janela esq
    const midXL = (wL.x1 + wL.x2) / 2;
    const midYL = (wL.y1 + wL.y4) / 2;
    ctx.beginPath();
    ctx.moveTo(wL.x1, midYL); ctx.lineTo(wL.x2, midYL);
    ctx.moveTo(midXL, wL.y1); ctx.lineTo(midXL, wL.y4);
    ctx.strokeStyle = 'rgba(147,197,253,0.35)';
    ctx.lineWidth   = 0.6;
    ctx.stroke();

    // Janela na face direita
    const wR = { x1: px + 4,      y1: py + hh + h * 0.20,
                 x2: px + hw - 6,  y2: py + hh + h * 0.20,
                 x3: px + hw - 6,  y3: py + hh + h * 0.70,
                 x4: px + 4,       y4: py + hh + h * 0.70 };
    ctx.beginPath();
    ctx.moveTo(wR.x1, wR.y1); ctx.lineTo(wR.x2, wR.y2);
    ctx.lineTo(wR.x3, wR.y3); ctx.lineTo(wR.x4, wR.y4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(147,197,253,0.14)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(147,197,253,0.45)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();
    // Cruz da janela dir
    const midXR = (wR.x1 + wR.x2) / 2;
    const midYR = (wR.y1 + wR.y4) / 2;
    ctx.beginPath();
    ctx.moveTo(wR.x1, midYR); ctx.lineTo(wR.x2, midYR);
    ctx.moveTo(midXR, wR.y1); ctx.lineTo(midXR, wR.y4);
    ctx.strokeStyle = 'rgba(147,197,253,0.28)';
    ctx.lineWidth   = 0.6;
    ctx.stroke();

    // Glow suave atrás da janela
    const glow = ctx.createLinearGradient(px - hw, py + hh + h * 0.20, px + hw, py + hh + h * 0.70);
    glow.addColorStop(0, 'rgba(59,130,246,0.07)');
    glow.addColorStop(0.5, 'rgba(147,197,253,0.10)');
    glow.addColorStop(1, 'rgba(59,130,246,0.05)');
    ctx.beginPath();
    ctx.moveTo(px - hw, py + hh + h * 0.15);
    ctx.lineTo(px + hw, py + hh + h * 0.15);
    ctx.lineTo(px + hw, py + hh + h * 0.75);
    ctx.lineTo(px - hw, py + hh + h * 0.75);
    ctx.closePath();
    ctx.fillStyle = glow;
    ctx.fill();
  }
}

// Quais tiles são paredes altas
const WALL_TILES = new Set([8, 9, 10]);

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

        if (WALL_TILES.has(tileType)) {
          drawWall(ctx, px, py, colors, tileType === 9);
        } else {
          drawTile(ctx, px, py, colors, highlight);
        }
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
