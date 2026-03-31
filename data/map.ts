// officeMap — Board Room do Senior Scout 360
// 0 = Void
// 1 = Piso open space (alas de trabalho)
// 2 = Corredor / tapete (tom mais frio)
// 3 = Meeting Room floor (azul petróleo profundo)
// 4 = Meia-parede interna (h:48) — separa zonas
// 5 = Divider baixo
// 6 = Piso lounge (tom quente madeira)
// 7 = Piso copa (concreto claro)
// 8 = Parede externa alta (h:80)
// 9 = Parede com janelas azuis (h:80)
// 10 = Parede de fundo — mais alta (h:96)
// 32 colunas x 30 linhas
export const officeMap = [
  // Linha 0 — void
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Linha 1 — parede fundo topo com janelas
  [0,10,10, 9, 9,10,10,10, 9, 9,10,10,10,10, 9, 9,10,10, 9, 9,10,10,10,10, 9, 9,10,10,10,10,10, 0],
  // Linha 2 — BOARDROOM (centro-esq) | ENGENHARIA (centro-dir) | DIRETORIA (dir)
  [0, 8, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 3
  [0, 9, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 4
  [0, 8, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 5
  [0, 9, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 6
  [0, 8, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 7
  [0, 9, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 8
  [0, 8, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 9
  [0, 9, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 10
  [0, 8, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 11 — corredor horizontal superior
  [0, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 0],
  // Linha 12 — OPEN SPACE (andar principal)
  [0, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 13
  [0, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 14
  [0, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 15
  [0, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 16
  [0, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 17
  [0, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 18 — corredor horizontal inferior
  [0, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 0],
  // Linha 19 — LOUNGE + COPA + RECEPÇÃO
  [0, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 7, 7, 7, 7, 7, 7, 7, 2, 2, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 20
  [0, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 7, 7, 7, 7, 7, 7, 7, 2, 2, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 21
  [0, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 7, 7, 7, 7, 7, 7, 7, 2, 2, 1, 1, 1, 1, 1, 1, 9, 0],
  // Linha 22
  [0, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 7, 7, 7, 7, 7, 7, 7, 2, 2, 1, 1, 1, 1, 1, 1, 8, 0],
  // Linha 23 — parede inferior
  [0, 8, 8, 8, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 8, 8, 8, 8, 8, 0],
  // Linha 24 — void
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// ─── Sprint 3: Collision layer — tiles intranspossíveis por móveis fixos ────────
// Formato: [col, row] — mesma grade que officeMap
// BFS e isWalkable já bloqueiam tiles 4/5/8/9/10.
// blockedTiles cobre tiles tipo 1/2/3/6/7 que tenham móveis grandes fixos.
// Uso: passar ao isWalkable como segundo parâmetro (ver lib/isoEngine.ts v2)
export const blockedTiles: Array<[number, number]> = [
  // Paredes de divisória internas (meia-parede tipo 4) já bloqueiam via tile
  // Móveis grandes no open space que obstruem passagem
  [3,  12], [3,  13],  // mesa lounge lado esquerdo
  [5,  12], [5,  13],  // mesa lounge lado direito
  [9,   4], [9,   5],  // mesa boardroom centro
  [12,  4], [12,  5],  // mesa boardroom lado
  [19, 12], [19, 13],  // mesa open space centro
  [22, 12], [22, 13],  // mesa open space direita
  [25,  3], [25,  4],  // mesa diretoria esq
  [28,  3], [28,  4],  // mesa diretoria dir
  [4,  20], [5,  20],  // sofá lounge
  [16, 20], [17, 20],  // balcão copa
];
