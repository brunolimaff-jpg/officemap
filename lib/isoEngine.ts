// ═══════════════════════════════════════════════════════════════════════════
// ISO ENGINE — Single source of truth para geometria isométrica
// Padrão Habbo: losango 64×32px, profundidade 3D 8px
// ═══════════════════════════════════════════════════════════════════════════

export const TILE_W  = 64;   // largura do losango
export const TILE_H  = 32;   // altura do losango
export const TILE_D  = 8;    // espessura 3D lateral
export const MAP_COLS = 32;
export const MAP_ROWS = 25;

// Origem do canvas em pixels — centraliza o mapa
// O tile (0,0) fica no topo do diamante
export const ORIGIN_X = (MAP_COLS * TILE_W) / 2;   // 1024
export const ORIGIN_Y = 80;                          // margem topo

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
export const CANVAS_H = (MAP_ROWS + MAP_COLS) * (TILE_H / 2) + ORIGIN_Y + 120; // ~1036

// ─── Paleta de cores por tipo de tile ────────────────────────────────────────
export const TILE_COLORS: Record<number, {
  top: string;
  left: string;
  right: string;
  h: number;   // altura 3D em px
}> = {
  // 0 = void — não renderiza
  1: { top: '#3B5EA6', left: '#2A4580', right: '#1E3566', h: 4  },  // piso open space
  2: { top: '#4A6FA5', left: '#385A8A', right: '#2C4A72', h: 4  },  // corredor
  3: { top: '#1E3A6E', left: '#162D56', right: '#0E2040', h: 4  },  // boardroom
  4: { top: '#8B9EB5', left: '#6B7E95', right: '#4F6075', h: 48 },  // meia-parede
  5: { top: '#6B7E95', left: '#4F6075', right: '#3A4F62', h: 16 },  // divider baixo
  6: { top: '#6B4E2A', left: '#503B20', right: '#3A2B17', h: 4  },  // lounge madeira
  7: { top: '#8A9BAA', left: '#6B7E8F', right: '#526070', h: 4  },  // copa concreto
  8: { top: '#4A5568', left: '#2D3748', right: '#1A202C', h: 80 },  // parede externa
  9: { top: '#4A90D9', left: '#2D6FAA', right: '#1A4F80', h: 80 },  // parede janelas
  10:{ top: '#3A4A5A', left: '#252F3A', right: '#161E26', h: 96 },  // parede fundo
};

// ─── BFS 8 direções ──────────────────────────────────────────────────────────
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
