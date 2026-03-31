// IsoCanvas — renderiza officeMap + furniture em canvas isométrico programático
// Substitui o /isometric-office-bg.png estático
import { useEffect, useRef, useCallback } from 'react';
import {
  TILE_W, TILE_H, TILE_D, WALL_H, HALF_W, HALF_H,
  TILE_STYLES,
  tileToScreen,
  computeOrigin,
} from '@/lib/isoEngine';
import { furniture } from '@/data/specialists';
import type { Furniture } from '@/types';

interface IsoCanvasProps {
  map: number[][];
  width: number;
  height: number;
}

// ─── Paleta de móveis ───────────────────────────────────────────────────────────────
interface FurnitureStyle {
  topColor:   string;
  leftColor:  string;
  rightColor: string;
  w: number;   // largura em tiles (0..1)
  h: number;   // profundidade em tiles (0..1)
  height: number; // altura 3D em px
}

const FW: Record<string, FurnitureStyle> = {
  desk:           { topColor:'#4A5568', leftColor:'#2D3748', rightColor:'#374151', w:1,   h:0.5, height:20 },
  chair:          { topColor:'#718096', leftColor:'#4A5568', rightColor:'#556075', w:0.5, h:0.5, height:14 },
  table:          { topColor:'#553C2B', leftColor:'#3B2A1E', rightColor:'#422F22', w:1.5, h:1,   height:16 },
  sofa:           { topColor:'#2B4C8C', leftColor:'#1A3166', rightColor:'#1E3A77', w:1.5, h:0.7, height:18 },
  coffee_table:   { topColor:'#2C3E50', leftColor:'#1A2535', rightColor:'#202D3D', w:0.8, h:0.8, height:10 },
  bookshelf:      { topColor:'#5D4037', leftColor:'#3E2723', rightColor:'#4A2E25', w:0.5, h:1,   height:40 },
  cabinet:        { topColor:'#455A64', leftColor:'#263238', rightColor:'#2E3F47', w:0.5, h:1,   height:32 },
  whiteboard:     { topColor:'#ECEFF1', leftColor:'#B0BEC5', rightColor:'#CFD8DC', w:0.2, h:1.5, height:48 },
  tv_screen:      { topColor:'#1A202C', leftColor:'#0D1117', rightColor:'#111827', w:0.2, h:1.5, height:40 },
  plant:          { topColor:'#2D6A4F', leftColor:'#1B4332', rightColor:'#236040', w:0.4, h:0.4, height:32 },
  lamp:           { topColor:'#F6E05E', leftColor:'#D69E2E', rightColor:'#ECC94B', w:0.2, h:0.2, height:40 },
  rug:            { topColor:'#2C5282', leftColor:'#2A4365', rightColor:'#2B4C8C', w:1.5, h:1.5, height:1  },
  monitor_dual:   { topColor:'#1A202C', leftColor:'#0D1117', rightColor:'#111827', w:0.8, h:0.3, height:20 },
  computer:       { topColor:'#2D3748', leftColor:'#1A202C', rightColor:'#232B38', w:0.5, h:0.4, height:16 },
  mug:            { topColor:'#CBD5E0', leftColor:'#A0AEC0', rightColor:'#B2BFCE', w:0.2, h:0.2, height:8  },
  fridge:         { topColor:'#A0AEC0', leftColor:'#718096', rightColor:'#8A9BB0', w:0.6, h:0.8, height:48 },
  coffee_machine: { topColor:'#2D3748', leftColor:'#1A202C', rightColor:'#232B38', w:0.5, h:0.5, height:28 },
  microwave:      { topColor:'#4A5568', leftColor:'#2D3748', rightColor:'#374151', w:0.8, h:0.5, height:20 },
  trash:          { topColor:'#4A5568', leftColor:'#2D3748', rightColor:'#374151', w:0.3, h:0.3, height:14 },
  divider:        { topColor:'#718096', leftColor:'#4A5568', rightColor:'#556075', w:0.1, h:1,   height:36 },
  pool_table:     { topColor:'#276749', leftColor:'#1C4532', rightColor:'#22553D', w:1.5, h:1,   height:20 },
  ac_unit:        { topColor:'#CBD5E0', leftColor:'#A0AEC0', rightColor:'#B2BFCE', w:1,   h:0.3, height:12 },
  sign:           { topColor:'#2B6CB0', leftColor:'#1A3F73', rightColor:'#1E4D8C', w:0.1, h:0.8, height:24 },
  locker:         { topColor:'#4A5568', leftColor:'#2D3748', rightColor:'#374151', w:0.5, h:0.5, height:40 },
};

function drawIsoBox(
  ctx: CanvasRenderingContext2D,
  sx: number, sy: number,
  w: number, h: number,
  height: number,
  topColor: string, leftColor: string, rightColor: string,
) {
  const hw = w * HALF_W;
  const hh = h * HALF_H;
  const lw = w * HALF_W;
  const lh = w * HALF_H;
  const rw = h * HALF_W;
  const rh = h * HALF_H;

  // face superior (losango)
  ctx.beginPath();
  ctx.moveTo(sx,       sy);
  ctx.lineTo(sx + hw,  sy - hh);
  ctx.lineTo(sx + hw + rw, sy - hh + rh);
  ctx.lineTo(sx + rw,  sy + rh);
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();

  // face esquerda
  ctx.beginPath();
  ctx.moveTo(sx,       sy);
  ctx.lineTo(sx + rw,  sy + rh);
  ctx.lineTo(sx + rw,  sy + rh + height);
  ctx.lineTo(sx,       sy + height);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();

  // face direita
  ctx.beginPath();
  ctx.moveTo(sx + rw,       sy + rh);
  ctx.lineTo(sx + hw + rw,  sy - hh + rh);
  ctx.lineTo(sx + hw + rw,  sy - hh + rh + height);
  ctx.lineTo(sx + rw,       sy + rh + height);
  ctx.closePath();
  ctx.fillStyle = rightColor;
  ctx.fill();
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  sx: number, sy: number,
  tileType: number,
) {
  const style = TILE_STYLES[tileType];
  if (!style) return;

  const h = style.height;

  // face superior (losango plano)
  ctx.beginPath();
  ctx.moveTo(sx,            sy);
  ctx.lineTo(sx + HALF_W,   sy - HALF_H);
  ctx.lineTo(sx + TILE_W,   sy);
  ctx.lineTo(sx + HALF_W,   sy + HALF_H);
  ctx.closePath();
  ctx.fillStyle = style.top;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  if (h > TILE_D) {
    // face esquerda (baixo-esquerda)
    ctx.beginPath();
    ctx.moveTo(sx,           sy);
    ctx.lineTo(sx + HALF_W,  sy + HALF_H);
    ctx.lineTo(sx + HALF_W,  sy + HALF_H + h);
    ctx.lineTo(sx,           sy + h);
    ctx.closePath();
    ctx.fillStyle = style.left;
    ctx.fill();

    // face direita (baixo-direita)
    ctx.beginPath();
    ctx.moveTo(sx + HALF_W,  sy + HALF_H);
    ctx.lineTo(sx + TILE_W,  sy);
    ctx.lineTo(sx + TILE_W,  sy + h);
    ctx.lineTo(sx + HALF_W,  sy + HALF_H + h);
    ctx.closePath();
    ctx.fillStyle = style.right;
    ctx.fill();
  } else {
    // tile plano: apenas sombra mínima embaixo
    ctx.beginPath();
    ctx.moveTo(sx,           sy);
    ctx.lineTo(sx + HALF_W,  sy + HALF_H);
    ctx.lineTo(sx + HALF_W,  sy + HALF_H + h);
    ctx.lineTo(sx,           sy + h);
    ctx.closePath();
    ctx.fillStyle = style.left;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sx + HALF_W,  sy + HALF_H);
    ctx.lineTo(sx + TILE_W,  sy);
    ctx.lineTo(sx + TILE_W,  sy + h);
    ctx.lineTo(sx + HALF_W,  sy + HALF_H + h);
    ctx.closePath();
    ctx.fillStyle = style.right;
    ctx.fill();
  }
}

function drawFurnitureItem(
  ctx: CanvasRenderingContext2D,
  item: Furniture,
  originX: number,
  originY: number,
  overrideColor?: string,
) {
  const style = FW[item.type];
  if (!style) return;

  const { sx, sy } = tileToScreen(item.x, item.y, originX, originY);
  // Mobília fica sobre o tile: ancoramos pelo canto esquerdo do losango
  const top   = overrideColor ?? style.topColor;
  const left  = overrideColor
    ? shadeColor(overrideColor, -30)
    : style.leftColor;
  const right = overrideColor
    ? shadeColor(overrideColor, -15)
    : style.rightColor;

  drawIsoBox(ctx, sx, sy, style.w, style.h, style.height, top, left, right);
}

// Escurece/ilumina cor hex
function shadeColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

export default function IsoCanvas({ map, width, height }: IsoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rows = map.length;
    const cols = map[0]?.length ?? 0;
    const { originX, originY } = computeOrigin(width, height, cols, rows);

    ctx.clearRect(0, 0, width, height);

    // Fundo escuro
    ctx.fillStyle = '#0A0F1A';
    ctx.fillRect(0, 0, width, height);

    // Renderiza tiles em painter's order (y crescente, depois x crescente)
    for (let ty = 0; ty < rows; ty++) {
      for (let tx = 0; tx < cols; tx++) {
        const tileType = map[ty][tx];
        if (tileType === 0) continue; // void
        const { sx, sy } = tileToScreen(tx, ty, originX, originY);
        drawTile(ctx, sx, sy, tileType);
      }
    }

    // Renderiza mobília sobre os tiles (mesma ordem painter)
    // Agrupa por y+x para respeitar z-order
    const sortedFurniture = [...furniture].sort(
      (a, b) => (a.x + a.y) - (b.x + b.y)
    );
    for (const item of sortedFurniture) {
      drawFurnitureItem(ctx, item, originX, originY, item.color);
    }
  }, [map, width, height]);

  useEffect(() => { render(); }, [render]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

// Exporta computeOrigin para uso no RoomView (posicionamento de avatares)
export { computeOrigin as getCanvasOrigin };
