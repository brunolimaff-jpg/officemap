'use client';
import { useEffect, useRef, useCallback } from 'react';
import {
  TILE_W, TILE_H, CANVAS_W, CANVAS_H,
  ORIGIN_X, ORIGIN_Y, TILE_COLORS,
  tileToScreen, screenToTile, isWalkable,
} from '@/lib/isoEngine';

interface IsoCanvasProps {
  map: number[][];
  onTileClick: (x: number, y: number) => void;
  scale: number;
  proximityTiles?: Array<{ x: number; y: number }>;
}

// ─── Background: céu com cityscape ao fundo das janelas ─────────────────────
function drawBackground(ctx: CanvasRenderingContext2D) {
  // Céu gradiente azul claro
  const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H * 0.4);
  skyGrad.addColorStop(0, '#B8D4F0');
  skyGrad.addColorStop(1, '#D8EAF8');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H * 0.4);

  // Prédios da cidade ao fundo (silhueta)
  ctx.fillStyle = '#C8D8E8';
  const buildings = [
    { x: 60, w: 40, h: 80 }, { x: 110, w: 30, h: 100 }, { x: 150, w: 50, h: 60 },
    { x: 210, w: 35, h: 90 }, { x: 255, w: 45, h: 70 }, { x: 310, w: 30, h: 110 },
    { x: 350, w: 55, h: 55 }, { x: 415, w: 40, h: 85 }, { x: 465, w: 35, h: 95 },
    { x: 510, w: 50, h: 65 }, { x: 570, w: 30, h: 105 }, { x: 610, w: 45, h: 75 },
    { x: 665, w: 40, h: 88 }, { x: 715, w: 35, h: 72 }, { x: 760, w: 55, h: 58 },
    { x: 825, w: 30, h: 98 }, { x: 865, w: 45, h: 68 }, { x: 920, w: 40, h: 82 },
    { x: 970, w: 35, h: 92 }, { x: 1015, w: 50, h: 62 },
    { x: 1075, w: 30, h: 108 }, { x: 1115, w: 45, h: 78 }, { x: 1170, w: 40, h: 86 },
    { x: 1220, w: 35, h: 94 }, { x: 1265, w: 55, h: 56 }, { x: 1330, w: 30, h: 102 },
    { x: 1370, w: 45, h: 66 }, { x: 1425, w: 40, h: 84 }, { x: 1475, w: 35, h: 96 },
    { x: 1520, w: 50, h: 60 }, { x: 1580, w: 30, h: 106 }, { x: 1620, w: 45, h: 74 },
    { x: 1675, w: 40, h: 88 }, { x: 1725, w: 35, h: 76 }, { x: 1770, w: 55, h: 54 },
    { x: 1835, w: 30, h: 100 }, { x: 1875, w: 45, h: 64 }, { x: 1930, w: 40, h: 80 },
    { x: 1980, w: 35, h: 90 }, { x: 2025, w: 50, h: 58 }, { x: 2085, w: 30, h: 104 },
    { x: 2125, w: 45, h: 70 },
  ];
  const baseY = CANVAS_H * 0.36;
  for (const b of buildings) {
    ctx.fillRect(b.x, baseY - b.h, b.w, b.h);
    // janelas nos prédios
    ctx.fillStyle = 'rgba(255,220,120,0.35)';
    for (let wy = 0; wy < Math.floor(b.h / 14); wy++) {
      for (let wx = 0; wx < Math.floor(b.w / 12); wx++) {
        if (Math.random() > 0.4) {
          ctx.fillRect(b.x + wx * 12 + 3, baseY - b.h + wy * 14 + 4, 5, 7);
        }
      }
    }
    ctx.fillStyle = '#C8D8E8';
  }
}

// ─── Piso claro com textura de carpete sutil ─────────────────────────────────
function drawTile(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  colors: { top: string; left: string; right: string; h: number; border?: string },
  highlight?: boolean,
) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const { top, left, right, border = 'rgba(255,255,255,0.20)' } = colors;
  const depth = 4;

  // Face esquerda (profundidade)
  ctx.beginPath();
  ctx.moveTo(px - hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px,      py + TILE_H + depth);
  ctx.lineTo(px - hw, py + hh    + depth);
  ctx.closePath();
  ctx.fillStyle = left;
  ctx.fill();

  // Face direita (profundidade)
  ctx.beginPath();
  ctx.moveTo(px,      py + TILE_H);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px + hw, py + hh    + depth);
  ctx.lineTo(px,      py + TILE_H + depth);
  ctx.closePath();
  ctx.fillStyle = right;
  ctx.fill();

  // Face superior (topo do tile)
  ctx.beginPath();
  ctx.moveTo(px,      py);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px - hw, py + hh);
  ctx.closePath();
  if (highlight) {
    const grad = ctx.createRadialGradient(px, py + hh, 2, px, py + hh, hw);
    grad.addColorStop(0, 'rgba(74,158,255,0.35)');
    grad.addColorStop(1, top);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = top;
  }
  ctx.fill();

  // Borda do tile
  ctx.strokeStyle = highlight ? 'rgba(74,158,255,0.55)' : border;
  ctx.lineWidth   = highlight ? 1.2 : 0.6;
  ctx.stroke();

  // Grid sutil de carpete (linhas muito finas)
  if (!highlight) {
    ctx.beginPath();
    ctx.moveTo(px, py); ctx.lineTo(px + hw, py + hh);
    ctx.moveTo(px, py); ctx.lineTo(px - hw, py + hh);
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }
}

// ─── Parede sólida estilo Habbo Corp — bloco com espessura real ──────────────
function drawWall(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  colors: { top: string; left: string; right: string; h: number; border?: string },
  withWindow: boolean,
) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const h  = colors.h;
  const { top, left, right, border = 'rgba(0,0,0,0.12)' } = colors;

  // Sombra projetada no chão (embaixo da parede)
  ctx.beginPath();
  ctx.moveTo(px - hw, py + hh + h * 0.08);
  ctx.lineTo(px + hw, py + hh + h * 0.08);
  ctx.lineTo(px + hw + 4, py + hh + h * 0.08 + 4);
  ctx.lineTo(px - hw - 4, py + hh + h * 0.08 + 4);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  ctx.fill();

  // ── Face lateral esquerda ──
  ctx.beginPath();
  ctx.moveTo(px - hw, py + hh);
  ctx.lineTo(px,      py + TILE_H);
  ctx.lineTo(px,      py + TILE_H + h);
  ctx.lineTo(px - hw, py + hh    + h);
  ctx.closePath();
  ctx.fillStyle = left;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth   = 0.8;
  ctx.stroke();

  // ── Face lateral direita ──
  ctx.beginPath();
  ctx.moveTo(px,      py + TILE_H);
  ctx.lineTo(px + hw, py + hh);
  ctx.lineTo(px + hw, py + hh    + h);
  ctx.lineTo(px,      py + TILE_H + h);
  ctx.closePath();
  ctx.fillStyle = right;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth   = 0.8;
  ctx.stroke();

  // ── Topo do bloco (face superior) ──
  ctx.beginPath();
  ctx.moveTo(px,      py - h);
  ctx.lineTo(px + hw, py + hh - h);
  ctx.lineTo(px,      py + TILE_H - h);
  ctx.lineTo(px - hw, py + hh - h);
  ctx.closePath();
  ctx.fillStyle = top;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth   = 0.8;
  ctx.stroke();

  // ── Brilho no topo (realce de luz) ──
  ctx.beginPath();
  ctx.moveTo(px,      py - h);
  ctx.lineTo(px + hw, py + hh - h);
  ctx.lineTo(px + hw - 4, py + hh - h + 2);
  ctx.lineTo(px - 4,  py - h + 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fill();

  // ── Janela cityscape (tile 9) ──
  if (withWindow) {
    // Janela face esquerda
    const wL = {
      x1: px - hw + 5, y1: py + hh + h * 0.18,
      x2: px - 4,      y2: py + hh + h * 0.18,
      x3: px - 4,      y3: py + hh + h * 0.72,
      x4: px - hw + 5, y4: py + hh + h * 0.72,
    };
    // Fundo da janela — céu
    const skyL = ctx.createLinearGradient(wL.x1, wL.y1, wL.x4, wL.y4);
    skyL.addColorStop(0, '#A8C8E8');
    skyL.addColorStop(0.6, '#C8E0F0');
    skyL.addColorStop(1, '#D8EAF8');
    ctx.beginPath();
    ctx.moveTo(wL.x1, wL.y1); ctx.lineTo(wL.x2, wL.y2);
    ctx.lineTo(wL.x3, wL.y3); ctx.lineTo(wL.x4, wL.y4);
    ctx.closePath();
    ctx.fillStyle = skyL;
    ctx.fill();
    // Prédios na janela esquerda
    ctx.fillStyle = '#8AAAC0';
    const bldW = (wL.x2 - wL.x1);
    const bldH = (wL.y4 - wL.y1);
    for (let i = 0; i < 5; i++) {
      const bx = wL.x1 + i * (bldW / 5);
      const bh = bldH * (0.3 + (i % 3) * 0.12);
      ctx.fillRect(bx, wL.y4 - bh, bldW / 6, bh);
    }
    // Frame da janela
    ctx.strokeStyle = 'rgba(150,170,190,0.8)';
    ctx.lineWidth   = 1.0;
    ctx.strokeRect(wL.x1, wL.y1, wL.x2 - wL.x1, wL.y4 - wL.y1);
    // Cruz da janela
    const midXL = (wL.x1 + wL.x2) / 2;
    const midYL = (wL.y1 + wL.y4) / 2;
    ctx.beginPath();
    ctx.moveTo(wL.x1, midYL); ctx.lineTo(wL.x2, midYL);
    ctx.moveTo(midXL, wL.y1); ctx.lineTo(midXL, wL.y4);
    ctx.strokeStyle = 'rgba(180,200,220,0.7)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();

    // Janela face direita
    const wR = {
      x1: px + 4,      y1: py + hh + h * 0.18,
      x2: px + hw - 5, y2: py + hh + h * 0.18,
      x3: px + hw - 5, y3: py + hh + h * 0.72,
      x4: px + 4,      y4: py + hh + h * 0.72,
    };
    const skyR = ctx.createLinearGradient(wR.x1, wR.y1, wR.x4, wR.y4);
    skyR.addColorStop(0, '#A8C8E8');
    skyR.addColorStop(0.6, '#C8E0F0');
    skyR.addColorStop(1, '#D8EAF8');
    ctx.beginPath();
    ctx.moveTo(wR.x1, wR.y1); ctx.lineTo(wR.x2, wR.y2);
    ctx.lineTo(wR.x3, wR.y3); ctx.lineTo(wR.x4, wR.y4);
    ctx.closePath();
    ctx.fillStyle = skyR;
    ctx.fill();
    ctx.fillStyle = '#8AAAC0';
    const bldW2 = (wR.x2 - wR.x1);
    const bldH2 = (wR.y4 - wR.y1);
    for (let i = 0; i < 4; i++) {
      const bx = wR.x1 + i * (bldW2 / 4);
      const bh = bldH2 * (0.25 + (i % 3) * 0.15);
      ctx.fillRect(bx, wR.y4 - bh, bldW2 / 5, bh);
    }
    ctx.strokeStyle = 'rgba(150,170,190,0.8)';
    ctx.lineWidth   = 1.0;
    ctx.strokeRect(wR.x1, wR.y1, wR.x2 - wR.x1, wR.y4 - wR.y1);
    const midXR = (wR.x1 + wR.x2) / 2;
    const midYR = (wR.y1 + wR.y4) / 2;
    ctx.beginPath();
    ctx.moveTo(wR.x1, midYR); ctx.lineTo(wR.x2, midYR);
    ctx.moveTo(midXR, wR.y1); ctx.lineTo(midXR, wR.y4);
    ctx.strokeStyle = 'rgba(180,200,220,0.7)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();
  }

  // ── Divisória de vidro (tile 5 — meia parede translúcida) ──
  if (h <= 48 && !withWindow) {
    // Refaz a face frontal com vidro translúcido sobre o que foi desenhado
    ctx.beginPath();
    ctx.moveTo(px - hw, py + hh);
    ctx.lineTo(px,      py + TILE_H);
    ctx.lineTo(px,      py + TILE_H + h);
    ctx.lineTo(px - hw, py + hh    + h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(180,210,240,0.22)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(160,200,240,0.50)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(px,      py + TILE_H);
    ctx.lineTo(px + hw, py + hh);
    ctx.lineTo(px + hw, py + hh    + h);
    ctx.lineTo(px,      py + TILE_H + h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(180,210,240,0.16)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(160,200,240,0.40)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();

    // Reflexo de luz na divisória
    ctx.beginPath();
    ctx.moveTo(px - hw + 4, py + hh + 4);
    ctx.lineTo(px - 8, py + TILE_H + 4);
    ctx.strokeStyle = 'rgba(255,255,255,0.30)';
    ctx.lineWidth   = 2;
    ctx.stroke();
  }
}

const WALL_TILES = new Set([4, 5, 8, 9, 10]);

export default function IsoCanvas({ map, onTileClick, scale, proximityTiles = [] }: IsoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const proximitySet = new Set(proximityTiles.map(t => `${t.x},${t.y}`));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background completo
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawBackground(ctx);

    // Fundo do escritório (área do piso — gradiente leve)
    const floorGrad = ctx.createLinearGradient(0, CANVAS_H * 0.3, 0, CANVAS_H);
    floorGrad.addColorStop(0, 'rgba(240,246,252,0.0)');
    floorGrad.addColorStop(1, 'rgba(220,235,248,0.0)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Painter's algorithm — diagonal front-to-back
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
      const rawX = (e.clientX - rect.left) * (CANVAS_W / rect.width);
      const rawY = (e.clientY - rect.top)  * (CANVAS_H / rect.height);
      const { x, y } = screenToTile(rawX, rawY);
      if (isWalkable(map, x, y)) onTileClick(x, y);
    },
    [map, onTileClick]
  );

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      onClick={handleClick}
      className="absolute top-0 left-0 cursor-crosshair"
      style={{ width: CANVAS_W, height: CANVAS_H }}
    />
  );
}
