// Spritesheet: Modern_Office_32x32.png — 16 colunas x 53+ linhas
// ID = row * SPRITESHEET_COLS + col

export const TILE_SIZE = 32;
export const SPRITESHEET_COLS = 16;
export const MAP_COLS = 30;
export const MAP_ROWS = 20;
export const CANVAS_W = MAP_COLS * TILE_SIZE; // 960
export const CANVAS_H = MAP_ROWS * TILE_SIZE; // 640

export function tileToSprite(id: number): { sx: number; sy: number } {
  return {
    sx: (id % SPRITESHEET_COLS) * TILE_SIZE,
    sy: Math.floor(id / SPRITESHEET_COLS) * TILE_SIZE,
  };
}

// Tiles onde avatar pode caminhar (piso livre, sem mobilia ou paredes)
// Baseado nos IDs mapeados visualmente na spritesheet 32x32
export const WALKABLE_TILE_IDS = new Set([
  3,   // FLOOR_BEIGE
  7,   // FLOOR_LIGHT
  11,  // FLOOR_DARK
]);

export function isTileWalkable(id: number): boolean {
  return WALKABLE_TILE_IDS.has(id);
}

export const T = {
  FLOOR_BEIGE:   3,
  FLOOR_LIGHT:   7,
  FLOOR_DARK:    11,

  WALL_TOP_L:    16,
  WALL_TOP:      17,
  WALL_TOP_R:    18,
  WALL_LEFT:     20,
  WALL_RIGHT:    22,
  WALL_BOT_L:    24,
  WALL_BOT:      25,
  WALL_BOT_R:    26,

  CHAIR_BLACK_TL: 48,
  CHAIR_BLACK_TR: 49,
  CHAIR_BLACK_BL: 64,
  CHAIR_BLACK_BR: 65,

  CHAIR_BROWN_TL: 80,
  CHAIR_BROWN_TR: 81,
  CHAIR_BROWN_BL: 96,
  CHAIR_BROWN_BR: 97,

  DESK_TL: 128,
  DESK_TR: 129,
  DESK_ML: 144,
  DESK_MR: 145,

  CONF_TL: 160,
  CONF_TM: 161,
  CONF_TR: 162,
  CONF_ML: 176,
  CONF_MM: 177,
  CONF_MR: 178,
  CONF_BL: 192,
  CONF_BM: 193,
  CONF_BR: 194,

  SOFA_TL: 208,
  SOFA_TR: 209,
  SOFA_BL: 224,
  SOFA_BR: 225,

  MONITOR_L: 100,
  MONITOR_R: 101,

  PLANT:    134,

  SHELF_L:  112,
  SHELF_R:  113,

  EMPTY:    -1,
} as const;
