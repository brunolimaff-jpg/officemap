// Top-Down RPG Engine — LimeZu Modern Office 32x32
// Spritesheet: public/assets/tiles/1_Room_Builder_Office/Room_Builder_Office_32x32.png
// Grid: 19 colunas x N linhas de tiles 32x32

export const TILE_SIZE = 32;
export const MAP_COLS = 30;
export const MAP_ROWS = 24;
export const CANVAS_W = MAP_COLS * TILE_SIZE; // 960
export const CANVAS_H = MAP_ROWS * TILE_SIZE; // 768

// Spritesheet tem 19 tiles por linha (608px / 32px = 19)
export const SHEET_COLS = 19;

// IDs de tile — 0 = vazio, baseado na posição na spritesheet (row * SHEET_COLS + col)
// Linha 0: pisos
// Linha 1: pisos variados / bordas
// Linha 2+: paredes, móveis, objetos
export const T = {
  // ── Vazios ──
  EMPTY: -1,

  // ── Pisos ──
  FLOOR_GRAY:    0,   // piso cinza (row 0, col 0)
  FLOOR_GRAY2:   1,   // piso cinza variante
  FLOOR_WOOD:   19,   // piso madeira (row 1, col 0)
  FLOOR_WOOD2:  20,   // piso madeira variante
  FLOOR_WHITE:  38,   // piso branco (row 2, col 0)
  FLOOR_CARPET: 57,   // carpete (row 3, col 1)

  // ── Paredes ──
  WALL_TOP:     76,   // parede topo
  WALL_LEFT:    77,   // parede lateral esquerda
  WALL_RIGHT:   78,   // parede lateral direita
  WALL_CORNER:  79,   // canto
  WALL_H:       95,   // parede horizontal
  WALL_V:       96,   // parede vertical

  // ── Porta ──
  DOOR_H:      114,   // porta horizontal
  DOOR_V:      115,   // porta vertical

  // ── Móveis — mesas ──
  DESK_TL:     133,   // mesa canto topo-esq
  DESK_TR:     134,   // mesa canto topo-dir
  DESK_BL:     152,   // mesa canto baixo-esq
  DESK_BR:     153,   // mesa canto baixo-dir

  // ── Monitor / computador ──
  MONITOR:     136,
  KEYBOARD:    155,

  // ── Cadeiras ──
  CHAIR_UP:    171,
  CHAIR_DOWN:  190,
  CHAIR_LEFT:  172,
  CHAIR_RIGHT: 173,

  // ── Plantas ──
  PLANT_SM:    209,
  PLANT_LG:    228,

  // ── Estante / arquivo ──
  SHELF_L:     247,
  SHELF_R:     248,

  // ── Máquina de café / água ──
  MACHINE:     266,

  // ── Quadro / moldura ──
  FRAME_L:     285,
  FRAME_R:     286,

  // ── Sofá ──
  SOFA_L:      304,
  SOFA_M:      305,
  SOFA_R:      306,

  // ── Mesa de reunião ──
  TABLE_TL:    323,
  TABLE_TR:    324,
  TABLE_BL:    342,
  TABLE_BR:    343,
} as const;

export type TileId = typeof T[keyof typeof T];

// Tiles que bloqueiam passagem (colisão)
export const SOLID_TILES = new Set<number>([
  T.WALL_TOP, T.WALL_LEFT, T.WALL_RIGHT, T.WALL_CORNER,
  T.WALL_H, T.WALL_V,
  T.DESK_TL, T.DESK_TR, T.DESK_BL, T.DESK_BR,
  T.MONITOR, T.KEYBOARD,
  T.SHELF_L, T.SHELF_R,
  T.MACHINE,
  T.SOFA_L, T.SOFA_M, T.SOFA_R,
  T.TABLE_TL, T.TABLE_TR, T.TABLE_BL, T.TABLE_BR,
  T.PLANT_LG,
]);

export function isSolid(map: number[][], x: number, y: number): boolean {
  if (y < 0 || y >= map.length || x < 0 || x >= (map[0]?.length ?? 0)) return true;
  return SOLID_TILES.has(map[y][x]);
}

// Converte tile ID para posição (sx, sy) na spritesheet
export function tileToSprite(id: number): { sx: number; sy: number } {
  const col = id % SHEET_COLS;
  const row = Math.floor(id / SHEET_COLS);
  return { sx: col * TILE_SIZE, sy: row * TILE_SIZE };
}
