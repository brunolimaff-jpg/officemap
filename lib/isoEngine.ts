// ═══════════════════════════════════════════════════════════════════════════
// ISO ENGINE — Single source of truth para geometria isométrica
// Padrão Habbo: losango 64×32px, profundidade 3D 8px
// ═══════════════════════════════════════════════════════════════════════════

export const TILE_W  = 64;   // largura do losango
export const TILE_H  = 32;   // altura do losango
export const TILE_D  = 8;    // espessura 3D lateral
export const MAP_COLS = 32;
export const MAP_ROWS = 25;

// ORIGIN_Y elevado para 180 — garante que paredes h:96 na linha 1
// nunca saiam acima de y=0 (margem = 180 - 96 = 84px)
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

// ─── Paleta Habbo-style — azul marinho profundo, bordas suaves ───────────────
export const TILE_COLORS: Record<number, {
  top: string;
  left: string;
  right: string;
  h: number;
  border?: string;
}> = {
  1: { top: '#1a2e52', left: '#142244', right: '#0e1a35', h: 4,  border: 'rgba(74,158,255,0.12)' },
  2: { top: '#1e3460', left: '#172850', right: '#10203e', h: 4,  border: 'rgba(74,158,255,0.18)' },
  3: { top: '#0f1e3e', left: '#0a1530', right: '#060e20', h: 4,  border: 'rgba(30,100,200,0.20)' },
  4: { top: '#6b7e95', left: '#4a5a70', right: '#344258', h: 48, border: 'rgba(0,0,0,0.15)' },
  5: { top: '#556070', left: '#3d4d5e', right: '#2c3a4a', h: 16, border: 'rgba(0,0,0,0.12)' },
  6: { top: '#3d2a14', left: '#2c1e0e', right: '#1e1409', h: 4,  border: 'rgba(180,100,30,0.20)' },
  7: { top: '#2a3040', left: '#1e2535', right: '#141a28', h: 4,  border: 'rgba(74,130,200,0.15)' },
  8: { top: '#2d3748', left: '#1a2535', right: '#0f1825', h: 80, border: 'rgba(0,0,0,0.20)' },
  9: { top: '#1a3a6e', left: '#122c56', right: '#0b1e3e', h: 80, border: 'rgba(74,158,255,0.25)' },
  10:{ top: '#1a2535', left: '#0f1825', right: '#080f18', h: 96, border: 'rgba(0,0,0,0.25)' },
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
