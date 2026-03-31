// Mapa grande de escritorio — top-down RPG — LimeZu Modern Office 32x32
// Spritesheet: 19 colunas x N linhas, cada tile 32x32px
// ID = row_na_sheet * 19 + col_na_sheet

import { T } from '@/lib/topDownEngine';

const _ = T.FLOOR_GRAY;    // piso principal
const W = T.WALL_H;        // parede horizontal
const w = T.WALL_V;        // parede vertical

// 30 colunas x 24 linhas = 960 x 768px
export const OFFICE_MAIN_MAP: number[][] = [
  //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29
  [ W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W], // 0
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 1
  [ w,T.SHELF_L,T.SHELF_R, _, _,T.PLANT_LG, _, _, _, _, _, _, _, _, _,T.PLANT_LG, _, _, _, _,T.SHELF_L,T.SHELF_R, _, _, _,T.PLANT_SM, _, _, _,  w], // 2
  [ w,  _,  _,  _,T.DESK_TL,T.DESK_TR,  _,T.DESK_TL,T.DESK_TR,  _,  _,  _,  _,  _,  _,  _,T.DESK_TL,T.DESK_TR,  _,T.DESK_TL,T.DESK_TR,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 3
  [ w,  _,  _,  _,T.MONITOR,T.MONITOR,  _,T.MONITOR,T.MONITOR,  _,  _,  _,  _,  _,  _,  _,T.MONITOR,T.MONITOR,  _,T.MONITOR,T.MONITOR,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 4
  [ w,  _,  _,  _,T.DESK_BL,T.DESK_BR,  _,T.DESK_BL,T.DESK_BR,  _,  _,  _,  _,  _,  _,  _,T.DESK_BL,T.DESK_BR,  _,T.DESK_BL,T.DESK_BR,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 5
  [ w,  _,  _,  _,T.CHAIR_DOWN,  _,  _,T.CHAIR_DOWN,  _,  _,  _,  _,  _,  _,  _,  _,T.CHAIR_DOWN,  _,  _,T.CHAIR_DOWN,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 6
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 7
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.TABLE_TL,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,T.TABLE_TR,  _,  w], // 8
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.CHAIR_UP,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.CHAIR_UP,  _,  w], // 9
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.CHAIR_UP,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.CHAIR_UP,  _,  w], // 10
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.TABLE_BL,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,T.TABLE_BR,  _,  w], // 11
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 12
  [ w,  _,T.SOFA_L,T.SOFA_M,T.SOFA_M,T.SOFA_R,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.PLANT_LG,  _,  _,T.MACHINE,  _,  _,  _,  w], // 13
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.FRAME_L,T.FRAME_R,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 14
  [ w,  _,T.CHAIR_UP,  _,  _,T.CHAIR_UP,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 15
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 16
  [ w,  _,  _,T.DESK_TL,T.DESK_TR,  _,T.DESK_TL,T.DESK_TR,  _,  _,  _,  _,  _,  _,  _,  _,T.DESK_TL,T.DESK_TR,  _,T.DESK_TL,T.DESK_TR,  _,  _,  _,  _,T.PLANT_SM,  _,  _,  _,  w], // 17
  [ w,  _,  _,T.MONITOR,T.MONITOR,  _,T.MONITOR,T.MONITOR,  _,  _,  _,  _,  _,  _,  _,  _,T.MONITOR,T.MONITOR,  _,T.MONITOR,T.MONITOR,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 18
  [ w,  _,  _,T.DESK_BL,T.DESK_BR,  _,T.DESK_BL,T.DESK_BR,  _,  _,  _,  _,  _,  _,  _,  _,T.DESK_BL,T.DESK_BR,  _,T.DESK_BL,T.DESK_BR,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 19
  [ w,  _,  _,T.CHAIR_DOWN,  _,  _,T.CHAIR_DOWN,  _,  _,  _,  _,  _,  _,  _,  _,  _,T.CHAIR_DOWN,  _,  _,T.CHAIR_DOWN,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 20
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 21
  [ w,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  w], // 22
  [ W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W,  W], // 23
];
