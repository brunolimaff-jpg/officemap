import { T } from '@/lib/topDownEngine';

const _ = T.FLOOR_GRAY;
const W = T.WALL_H;
const w = T.WALL_V;
const F = T.FLOOR_WOOD;
const C = T.FLOOR_CARPET;
const E = T.EMPTY;

// 30 colunas x 24 linhas
export const OFFICE_MAIN_MAP: number[][] = [
  // Linha 0 — parede superior externa
  [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
  // Linha 1 — sala principal (escritório)
  [w,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,w],
  // Linha 2 — estantes e plants no topo
  [w,T.SHELF_L,T.SHELF_R,_,_,T.PLANT_LG,_,_,_,_,_,_,_,_,_,T.PLANT_LG,_,_,_,_,T.SHELF_L,T.SHELF_R,_,_,_,T.PLANT_SM,_,_,_,w],
  // Linha 3 — mesas de trabalho fila 1
  [w,_,_,_,T.DESK_TL,T.DESK_TR,_,T.DESK_TL,T.DESK_TR,_,_,_,_,_,_,_,T.DESK_TL,T.DESK_TR,_,T.DESK_TL,T.DESK_TR,_,_,_,_,_,_,_,_,w],
  // Linha 4 — monitors
  [w,_,_,_,T.MONITOR,T.MONITOR,_,T.MONITOR,T.MONITOR,_,_,_,_,_,_,_,T.MONITOR,T.MONITOR,_,T.MONITOR,T.MONITOR,_,_,_,_,_,_,_,_,w],
  // Linha 5 — mesas baixo + cadeiras
  [w,_,_,_,T.DESK_BL,T.DESK_BR,_,T.DESK_BL,T.DESK_BR,_,_,_,_,_,_,_,T.DESK_BL,T.DESK_BR,_,T.DESK_BL,T.DESK_BR,_,_,_,_,_,_,_,_,w],
  // Linha 6 — cadeiras frente mesas
  [w,_,_,_,T.CHAIR_DOWN,_,_,T.CHAIR_DOWN,_,_,_,_,_,_,_,_,T.CHAIR_DOWN,_,_,T.CHAIR_DOWN,_,_,_,_,_,_,_,_,_,w],
  // Linha 7 — corredor
  [w,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,w],
  // Linha 8 — mesa de reunião topo
  [w,_,_,_,_,_,_,_,_,_,T.TABLE_TL,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,_,w],
  // Linha 9 — mesa reunião meio
  [w,_,_,_,_,_,_,_,_,_,T.CHAIR_UP,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T.CHAIR_UP,_,w],
  // Linha 10
  [w,_,_,_,_,_,_,_,_,_,T.CHAIR_UP,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T.CHAIR_UP,_,w],
  // Linha 11 — mesa reunião baixo
  [w,_,_,_,_,_,_,_,_,_,T.TABLE_BL,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,_,w],
  // Linha 12 — corredor divisória
  [w,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,w],
  // Linha 13 — sofá recepção
  [w,_,T.SOFA_L,T.SOFA_M,T.SOFA_M,T.SOFA_R,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T.PLANT_LG,_,_,T.MACHINE,_,_,_,w],
  // Linha 14
  [w,_,_,_,_,_,_,_,_,_,_,_,T.FRAME_L,T.FRAME_R,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,w],
  // Linha 15 — cadeiras sofá
  [w,_,T.CHAIR_UP,_,_,T.CHAIR_UP,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,w],
  // Linha 16 — corredor
  [w,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,w],
  // Linha 17 — mesas fila 2
  [w,_,_,T.DESK_TL,T.DESK_TR,_,T.DESK_TL,T.DESK_TR,_,_,_,_,_,_,_,_,T.DESK_TL,T.DESK_TR,_,T.DESK_TL,T.DESK_TR,_,_,_,_,T.PLANT_SM,_,_,_,w],
  // Linha 18 — monitors fila 2
  [w,_,_,T.MONITOR,T.MONITOR,_,T.MONITOR,T.MONITOR,_,_,_,_,_,_,_,_,T.MONITOR,T.MONITOR,_,T.MONITOR,T.MONITOR,_,_,_,_,_,_,_,_,w],
  // Linha 19 — mesas baixo fila 2
  [w,_,_,T.DESK_BL,T.DESK_BR,_,T.DESK_BL,T.DESK_BR,_,_,_,_,_,_,_,_,T.DESK_BL,T.DESK_BR,_,T.DESK_BL,T.DESK_BR,_,_,_,_,_,_,_,_,w],
  // Linha 20 — cadeiras fila 2
  [w,_,_,T.CHAIR_DOWN,_,_,T.CHAIR_DOWN,_,_,_,_,_,_,_,_,_,T.CHAIR_DOWN,_,_,T.CHAIR_DOWN,_,_,_,_,_,_,_,_,_,w],
  // Linha 21
  [w,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,w],
  // Linha 22
  [w,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,w],
  // Linha 23 — parede inferior
  [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
];
