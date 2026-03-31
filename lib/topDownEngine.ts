// Spritesheet: Modern_Office_32x32.png — 16 colunas x 53 linhas
// ID = row * 16 + col

export const TILE_SIZE = 32;
export const MAP_COLS = 30;
export const MAP_ROWS = 20;
export const CANVAS_W = MAP_COLS * TILE_SIZE; // 960
export const CANVAS_H = MAP_ROWS * TILE_SIZE; // 640

export function tileToSprite(id: number): { sx: number; sy: number } {
  const cols = 16;
  return {
    sx: (id % cols) * TILE_SIZE,
    sy: Math.floor(id / cols) * TILE_SIZE,
  };
}

// Mapa de tiles identificados visualmente na spritesheet
export const T = {
  // Piso (linha 0 da sheet)
  FLOOR_BEIGE:   3,   // piso bege xadrez (tile principal)
  FLOOR_LIGHT:   7,   // piso claro
  FLOOR_DARK:    11,  // piso escuro

  // Paredes (linha 1)
  WALL_TOP_L:    16,  // canto topo esq
  WALL_TOP:      17,  // parede topo
  WALL_TOP_R:    18,  // canto topo dir
  WALL_LEFT:     20,  // parede lateral esq
  WALL_RIGHT:    22,  // parede lateral dir
  WALL_BOT_L:    24,  // canto baixo esq
  WALL_BOT:      25,  // parede baixo
  WALL_BOT_R:    26,  // canto baixo dir

  // Cadeiras (linha 3–4 da sheet)
  CHAIR_BLACK_TL: 48,
  CHAIR_BLACK_TR: 49,
  CHAIR_BLACK_BL: 64,
  CHAIR_BLACK_BR: 65,

  // Cadeiras marrons (linha 5-6)
  CHAIR_BROWN_TL: 80,
  CHAIR_BROWN_TR: 81,
  CHAIR_BROWN_BL: 96,
  CHAIR_BROWN_BR: 97,

  // Mesa de trabalho individual (L-shape, linha 7-8)
  DESK_TL: 128,
  DESK_TR: 129,
  DESK_ML: 144,
  DESK_MR: 145,

  // Mesa longa de reuniao (linha 9)
  CONF_TL: 160,
  CONF_TM: 161,
  CONF_TR: 162,
  CONF_ML: 176,
  CONF_MM: 177,
  CONF_MR: 178,
  CONF_BL: 192,
  CONF_BM: 193,
  CONF_BR: 194,

  // Sofa (linha 10)
  SOFA_TL: 208,
  SOFA_TR: 209,
  SOFA_BL: 224,
  SOFA_BR: 225,

  // Monitor / computador (linha 6 col 4-6)
  MONITOR_L: 100,
  MONITOR_R: 101,

  // Planta (linha 8 col 6)
  PLANT:    134,

  // Estante (linha 7 col 0-1)
  SHELF_L:  112,
  SHELF_R:  113,

  // Vazio (branco)
  EMPTY:    -1,
} as const;
