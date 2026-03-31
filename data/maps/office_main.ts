import { T } from '@/lib/topDownEngine';

// Aliases curtos
const F = T.FLOOR_BEIGE;    // piso
const _ = T.EMPTY;          // vazio (transparente)
const WT = T.WALL_TOP;      // parede topo
const WL = T.WALL_LEFT;     // parede lateral esq
const WR = T.WALL_RIGHT;    // parede lateral dir
const WB = T.WALL_BOT;      // parede fundo
const C1 = T.WALL_TOP_L;    // cantos
const C2 = T.WALL_TOP_R;
const C3 = T.WALL_BOT_L;
const C4 = T.WALL_BOT_R;

// 30 colunas x 20 linhas = 960 x 640 px
export const OFFICE_MAIN_MAP: number[][] = [
  // row 0 — parede de topo
  [C1,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,WT,C2],
  // row 1 — estantes na parede
  [WL,T.SHELF_L,T.SHELF_R,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,T.SHELF_L,T.SHELF_R,F,WR],
  // row 2 — piso
  [WL,F,F,F,F,T.PLANT,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,T.PLANT,F,F,F,WR],
  // row 3 — mesas workspace bloco 1 (top)
  [WL,F,F,T.DESK_TL,T.DESK_TR,F,T.DESK_TL,T.DESK_TR,F,F,F,F,F,F,F,F,T.DESK_TL,T.DESK_TR,F,T.DESK_TL,T.DESK_TR,F,F,F,F,F,F,F,F,WR],
  // row 4 — monitores
  [WL,F,F,T.MONITOR_L,T.MONITOR_R,F,T.MONITOR_L,T.MONITOR_R,F,F,F,F,F,F,F,F,T.MONITOR_L,T.MONITOR_R,F,T.MONITOR_L,T.MONITOR_R,F,F,F,F,F,F,F,F,WR],
  // row 5 — mesas (bottom)
  [WL,F,F,T.DESK_ML,T.DESK_MR,F,T.DESK_ML,T.DESK_MR,F,F,F,F,F,F,F,F,T.DESK_ML,T.DESK_MR,F,T.DESK_ML,T.DESK_MR,F,F,F,F,F,F,F,F,WR],
  // row 6 — cadeiras
  [WL,F,F,T.CHAIR_BLACK_TL,T.CHAIR_BLACK_TR,F,T.CHAIR_BLACK_TL,T.CHAIR_BLACK_TR,F,F,F,F,F,F,F,F,T.CHAIR_BLACK_TL,T.CHAIR_BLACK_TR,F,T.CHAIR_BLACK_TL,T.CHAIR_BLACK_TR,F,F,F,F,F,F,F,F,WR],
  // row 7 — cadeiras baixo
  [WL,F,F,T.CHAIR_BLACK_BL,T.CHAIR_BLACK_BR,F,T.CHAIR_BLACK_BL,T.CHAIR_BLACK_BR,F,F,F,F,F,F,F,F,T.CHAIR_BLACK_BL,T.CHAIR_BLACK_BR,F,T.CHAIR_BLACK_BL,T.CHAIR_BLACK_BR,F,F,F,F,F,F,F,F,WR],
  // row 8 — corredor
  [WL,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,WR],
  // row 9 — mesa de reuniao (topo)
  [WL,F,F,F,F,F,F,T.CONF_TL,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TM,T.CONF_TR,F,F,F,F,F,F,F,F,F,WR],
  // row 10 — mesa reuniao meio
  [WL,F,F,F,F,F,F,T.CONF_ML,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MM,T.CONF_MR,F,F,F,F,F,F,F,F,F,WR],
  // row 11 — mesa reuniao baixo
  [WL,F,F,F,F,F,F,T.CONF_BL,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BM,T.CONF_BR,F,F,F,F,F,F,F,F,F,WR],
  // row 12 — corredor
  [WL,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,WR],
  // row 13 — sofa area + planta
  [WL,F,T.SOFA_TL,T.SOFA_TR,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,T.PLANT,F,F,F,F,F,WR],
  // row 14 — sofa baixo
  [WL,F,T.SOFA_BL,T.SOFA_BR,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,WR],
  // row 15 — workspace bloco 2 (top)
  [WL,F,F,T.DESK_TL,T.DESK_TR,F,T.DESK_TL,T.DESK_TR,F,F,F,F,F,F,F,F,T.DESK_TL,T.DESK_TR,F,T.DESK_TL,T.DESK_TR,F,F,F,F,F,F,F,F,WR],
  // row 16 — monitores bloco 2
  [WL,F,F,T.MONITOR_L,T.MONITOR_R,F,T.MONITOR_L,T.MONITOR_R,F,F,F,F,F,F,F,F,T.MONITOR_L,T.MONITOR_R,F,T.MONITOR_L,T.MONITOR_R,F,F,F,F,F,F,F,F,WR],
  // row 17 — mesas bloco 2 baixo
  [WL,F,F,T.DESK_ML,T.DESK_MR,F,T.DESK_ML,T.DESK_MR,F,F,F,F,F,F,F,F,T.DESK_ML,T.DESK_MR,F,T.DESK_ML,T.DESK_MR,F,F,F,F,F,T.PLANT,F,F,WR],
  // row 18 — cadeiras bloco 2
  [WL,F,F,T.CHAIR_BROWN_TL,T.CHAIR_BROWN_TR,F,T.CHAIR_BROWN_TL,T.CHAIR_BROWN_TR,F,F,F,F,F,F,F,F,T.CHAIR_BROWN_TL,T.CHAIR_BROWN_TR,F,T.CHAIR_BROWN_TL,T.CHAIR_BROWN_TR,F,F,F,F,F,F,F,F,WR],
  // row 19 — parede de fundo
  [C3,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,WB,C4],
];
