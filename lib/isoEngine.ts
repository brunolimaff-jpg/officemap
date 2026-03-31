// ═══════════════════════════════════════════════════════════════════════════════
// ISO ENGINE — fonte única de toda geometria isométrica do Board Room
// Usado por IsoCanvas (render), RoomView (posição avatares) e HabboClient (BFS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Dimensões do tile (padrão Habbo) ────────────────────────────────────────
export const TILE_W  = 64;   // largura do losango em px
export const TILE_H  = 32;   // altura do losango em px
export const TILE_D  = 8;    // profundidade 3D lateral em px
export const WALL_H  = 64;   // altura de parede (tiles 8,9,10)
export const HALF_W  = TILE_W / 2;
export const HALF_H  = TILE_H / 2;

// ─── Projeção cartesiana → isométrica (px, relativo ao canvas origin) ────────
// origin = ponto do tile (0,0) no canvas — ajustado para centralizar o mapa
export function tileToScreen(
  tx: number,
  ty: number,
  originX: number,
  originY: number,
): { sx: number; sy: number } {
  return {
    sx: originX + (tx - ty) * HALF_W,
    sy: originY + (tx + ty) * HALF_H,
  };
}

// ─── Projeção inversa: pixel canvas → tile (x, y) ────────────────────────────
export function screenToTile(
  px: number,
  py: number,
  originX: number,
  originY: number,
): { tx: number; ty: number } {
  const relX = px - originX;
  const relY = py - originY;
  // resolve sistema:  relX = (tx-ty)*HW,  relY = (tx+ty)*HH
  const sum  = relY / HALF_H;
  const diff = relX / HALF_W;
  return {
    tx: Math.round((sum + diff) / 2),
    ty: Math.round((sum - diff) / 2),
  };
}

// ─── Origem do canvas para centralizar o mapa ─────────────────────────────────
// cols e rows são as dimensões do officeMap
export function computeOrigin(
  canvasW: number,
  canvasH: number,
  cols: number,
  rows: number,
): { originX: number; originY: number } {
  // O tile (0,0) fica no pico do diamante superior
  // Para centralizar horizontalmente: metade do canvas menos metade do span total
  const spanX = (cols + rows) * HALF_W;
  const spanY = (cols + rows) * HALF_H + WALL_H;
  return {
    originX: Math.round((canvasW - spanX) / 2) + rows * HALF_W,
    originY: Math.round((canvasH - spanY) / 2) + TILE_D + 16,
  };
}

// ─── Z-index de um tile (garante renderização painter's algorithm) ─────────────
export function tileZIndex(tx: number, ty: number): number {
  return (tx + ty) * 100;
}

// ─── Paleta de tiles ──────────────────────────────────────────────────────────
export interface TileStyle {
  top:   string;   // face superior
  left:  string;   // face esquerda (lateral)
  right: string;   // face direita (lateral)
  height: number;  // altura 3D (TILE_D * multiplicador)
  walkable: boolean;
}

const T = (top: string, left: string, right: string, h = TILE_D, walkable = true): TileStyle =>
  ({ top, left, right, height: h, walkable });

export const TILE_STYLES: Record<number, TileStyle> = {
  // 0 = void — não renderiza
  1: T('#3B5170', '#1E2D42', '#243452', TILE_D,    true),   // piso open space
  2: T('#2E3F58', '#182233', '#1C2A40', TILE_D,    true),   // corredor
  3: T('#1A2E4A', '#0D1A2E', '#112236', TILE_D,    true),   // meeting room
  4: T('#4A5568', '#2D3748', '#374151', TILE_D * 5, false),  // meia-parede
  5: T('#4A5568', '#2D3748', '#374151', TILE_D * 2, false),  // divider
  6: T('#4A3728', '#2D2118', '#352618', TILE_D,    true),   // lounge (madeira)
  7: T('#5A6472', '#38424C', '#404E58', TILE_D,    true),   // copa (concreto)
  8: T('#1A202C', '#0D1117', '#111827', TILE_D * 9, false),  // parede externa
  9: T('#1E3A5F', '#0F1E35', '#132540', TILE_D * 9, false),  // parede janelas
  10: T('#111827', '#0A0F1A', '#0D1320', TILE_D * 11, false), // parede fundo
};

export const WALKABLE_TILES = new Set([1, 2, 3, 6, 7]);

// ─── BFS 8 direções ───────────────────────────────────────────────────────────
export function bfs(
  map: number[][],
  sx: number, sy: number,
  tx: number, ty: number,
): Array<{ x: number; y: number }> {
  if (sx === tx && sy === ty) return [];
  const rows = map.length;
  const cols = map[0]?.length ?? 0;
  const key  = (x: number, y: number) => y * 1000 + x;
  const visited = new Set<number>([key(sx, sy)]);
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
      if (!WALKABLE_TILES.has(map[ny][nx])) continue;
      if (visited.has(key(nx, ny))) continue;
      const newPath = [...path, { x: nx, y: ny }];
      if (nx === tx && ny === ty) return newPath;
      visited.add(key(nx, ny));
      queue.push({ x: nx, y: ny, path: newPath });
    }
  }
  return [];
}

// ─── Direção Habbo entre dois tiles adjacentes ────────────────────────────────
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
