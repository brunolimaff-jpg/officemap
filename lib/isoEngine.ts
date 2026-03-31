// ═══════════════════════════════════════════════════════════════════════════
// ISO ENGINE — Single source of truth para geometria isométrica
// Padrão Habbo Corp: losango 64×32px, paredes sólidas brancas, piso claro
// ═══════════════════════════════════════════════════════════════════════════

export const TILE_W  = 64;
export const TILE_H  = 32;
export const TILE_D  = 8;
export const MAP_COLS = 32;
export const MAP_ROWS = 25;

export const ORIGIN_X = (MAP_COLS * TILE_W) / 2;   // 1024
export const ORIGIN_Y = 180;

// ─── Projeção: tile (x,y) → pixel (px, py) do centro-topo do losango ────────
export function tileToScreen(x: number, y: number): { px: number; py: number } {
  return {
    px: ORIGIN_X + (x - y) * (TILE_W / 2),
    py: ORIGIN_Y + (x + y) * (TILE_H / 2),
  };
}

// ─── Inversa: pixel (px,py) → tile (x,y) ────────────────────────────────────
export function screenToTile(px: number, py: number): { x: number; y: number } {
  const dx = px - ORIGIN_X;
  const dy = py - ORIGIN_Y;
  return {
    x: Math.round((dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2),
    y: Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2),
  };
}

// ─── Z-order: valor crescente conforme distância da câmera ───────────────────
export function zOrder(x: number, y: number): number {
  return (x + y) * 100;
}

// ─── Dimensão total do canvas em pixels ──────────────────────────────────────
export const CANVAS_W = MAP_COLS * TILE_W + 200;           // 2248
export const CANVAS_H = (MAP_ROWS + MAP_COLS) * (TILE_H / 2) + ORIGIN_Y + 200;

// ─── Paleta Habbo Corp ────────────────────────────────────────────────────────
// Baseada no escritório modelo: piso azul-acinzentado claro, paredes brancas
// sólidas, divisórias vidro translúcido, corredor cinza médio.
//
// tile 1  = piso principal (carpete azul-acinzentado claro)
// tile 2  = piso boardroom (carpete azul royal ligeiramente mais escuro)
// tile 3  = corredor (cinza claro)
// tile 4  = parede sólida alta (bloco branco opaco, h=96)
// tile 5  = meia-parede / divisória baixa (h=48)
// tile 6  = piso lounge / madeira clara
// tile 7  = piso alternativo (carpete cinza)
// tile 8  = parede interna (bloco cinza médio, h=80)
// tile 9  = parede de janela (bloco branco com janela cityscape, h=80)
// tile 10 = coluna / pilar (bloco escuro alto, h=96)
export const TILE_COLORS: Record<number, {
  top: string;
  left: string;
  right: string;
  h: number;
  border?: string;
}> = {
  // ── Pisos ─────────────────────────────────────────────────────────────────
  1: { top: '#7B9EB8', left: '#5A7E9E', right: '#4A6E8E', h: 4,  border: 'rgba(255,255,255,0.18)' },
  2: { top: '#6B8FAA', left: '#4A6E8E', right: '#3A5E7E', h: 4,  border: 'rgba(255,255,255,0.14)' },
  3: { top: '#9BABB8', left: '#7A8E9E', right: '#6A7E8E', h: 4,  border: 'rgba(255,255,255,0.20)' },
  6: { top: '#C4A882', left: '#A08060', right: '#8A6A48', h: 4,  border: 'rgba(255,255,255,0.15)' },
  7: { top: '#8A9EAA', left: '#6A7E8E', right: '#5A6E7E', h: 4,  border: 'rgba(255,255,255,0.16)' },
  // ── Paredes e divisórias ──────────────────────────────────────────────────
  4: { top: '#E8E8E8', left: '#B8B8B8', right: '#D0D0D0', h: 96, border: 'rgba(0,0,0,0.12)' },
  5: { top: '#D8DCE0', left: '#A8B0B8', right: '#C0C8D0', h: 48, border: 'rgba(0,0,0,0.10)' },
  8: { top: '#CCCCCC', left: '#A0A0A0', right: '#B8B8B8', h: 80, border: 'rgba(0,0,0,0.12)' },
  9: { top: '#E0E4E8', left: '#B0B8C0', right: '#C8D0D8', h: 80, border: 'rgba(0,0,0,0.10)' },
  10:{ top: '#C8C8C8', left: '#909090', right: '#A8A8A8', h: 96, border: 'rgba(0,0,0,0.15)' },
};

// ─── Tiles onde avatar pode caminhar ─────────────────────────────────────────
const WALKABLE_TILES = new Set([1, 2, 3, 6, 7]);

export function bfs(
  map: number[][],
  sx: number, sy: number,
  tx: number, ty: number,
): Array<{ x: number; y: number }> {
  if (sx === tx && sy === ty) return [];
  const rows = map.length;
  const cols = map[0]?.length ?? 0;
  const key  = (x: number, y: number) => `${x},${y}`;
  const visited = new Set<string>([key(sx, sy)]);
  const queue: Array<{ x: number; y: number; path: Array<{ x: number; y: number }> }> = [
    { x: sx, y: sy, path: [] },
  ];
  const dirs = [
    { dx:  1, dy:  0 }, { dx: -1, dy:  0 },
    { dx:  0, dy:  1 }, { dx:  0, dy: -1 },
    { dx:  1, dy:  1 }, { dx:  1, dy: -1 },
    { dx: -1, dy:  1 }, { dx: -1, dy: -1 },
  ];
  while (queue.length > 0) {
    const { x, y, path } = queue.shift()!;
    for (const { dx, dy } of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      if (!WALKABLE_TILES.has(map[ny]?.[nx])) continue;
      if (visited.has(key(nx, ny))) continue;
      const newPath = [...path, { x: nx, y: ny }];
      if (nx === tx && ny === ty) return newPath;
      visited.add(key(nx, ny));
      queue.push({ x: nx, y: ny, path: newPath });
    }
  }
  return [];
}

export function isWalkable(map: number[][], x: number, y: number): boolean {
  return WALKABLE_TILES.has(map[y]?.[x]);
}

// ─── Direção Habbo (0-7) entre dois tiles adjacentes ─────────────────────────
export function directionBetween(fx: number, fy: number, tx: number, ty: number): number {
  const dx = tx - fx;
  const dy = ty - fy;
  if (dx ===  1 && dy ===  0) return 2;
  if (dx === -1 && dy ===  0) return 6;
  if (dx ===  0 && dy ===  1) return 4;
  if (dx ===  0 && dy === -1) return 0;
  if (dx ===  1 && dy ===  1) return 3;
  if (dx ===  1 && dy === -1) return 1;
  if (dx === -1 && dy ===  1) return 5;
  if (dx === -1 && dy === -1) return 7;
  return 4;
}
