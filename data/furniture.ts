import type { FurnitureType } from '@/types';

export interface FurnitureItem {
  id: string;
  type: FurnitureType | string;
  tileX: number;
  tileY: number;
  color?: string;
  direction?: number;
  zBonus?: number;
  label?: string;
}

export const officeFurniture: FurnitureItem[] = [
  // ── BOARDROOM (linhas 2-9, cols 8-15) ─────────────────────────────────
  { id: 'f-board-table',  type: 'table',        tileX: 11, tileY: 5,  color: '#334155' },
  { id: 'f-board-tv',     type: 'tv_screen',    tileX: 9,  tileY: 2,  label: 'WAR ROOM' },
  { id: 'f-board-wb',     type: 'whiteboard',   tileX: 14, tileY: 3 },
  { id: 'f-board-c1',     type: 'chair',        tileX: 9,  tileY: 5,  color: '#1D4ED8', direction: 2 },
  { id: 'f-board-c2',     type: 'chair',        tileX: 10, tileY: 5,  color: '#1D4ED8', direction: 2 },
  { id: 'f-board-c3',     type: 'chair',        tileX: 12, tileY: 5,  color: '#1D4ED8', direction: 6 },
  { id: 'f-board-c4',     type: 'chair',        tileX: 13, tileY: 5,  color: '#1D4ED8', direction: 6 },
  { id: 'f-board-c5',     type: 'chair',        tileX: 11, tileY: 4,  color: '#1D4ED8', direction: 4 },
  { id: 'f-board-c6',     type: 'chair',        tileX: 11, tileY: 7,  color: '#1D4ED8', direction: 0 },
  { id: 'f-board-plant',  type: 'plant',        tileX: 8,  tileY: 2 },
  { id: 'f-board-plant2', type: 'plant',        tileX: 15, tileY: 2 },
  { id: 'f-board-rug',    type: 'rug',          tileX: 11, tileY: 6,  color: '#1D4ED8' },

  // ── OPEN SPACE — Desks dos Especialistas (linhas 12-17) ──────────────
  // Coluna A (esquerda) — Satya, Uncle Bob, Karpathy, Rogati
  { id: 'f-desk-satya',   type: 'desk',         tileX: 3,  tileY: 12, color: '#0078D4' },
  { id: 'f-ch-satya',     type: 'chair',        tileX: 3,  tileY: 13, color: '#0078D4', direction: 0 },
  { id: 'f-mon-satya',    type: 'monitor_dual', tileX: 3,  tileY: 12, zBonus: 3 },

  { id: 'f-desk-bob',     type: 'desk',         tileX: 5,  tileY: 12, color: '#DC2626' },
  { id: 'f-ch-bob',       type: 'chair',        tileX: 5,  tileY: 13, color: '#DC2626', direction: 0 },
  { id: 'f-mon-bob',      type: 'computer',     tileX: 5,  tileY: 12, zBonus: 3 },

  { id: 'f-desk-karp',    type: 'desk',         tileX: 3,  tileY: 15, color: '#7C3AED' },
  { id: 'f-ch-karp',      type: 'chair',        tileX: 3,  tileY: 16, color: '#7C3AED', direction: 0 },
  { id: 'f-mon-karp',     type: 'monitor_dual', tileX: 3,  tileY: 15, zBonus: 3 },

  { id: 'f-desk-rogati',  type: 'desk',         tileX: 5,  tileY: 15, color: '#059669' },
  { id: 'f-ch-rogati',    type: 'chair',        tileX: 5,  tileY: 16, color: '#059669', direction: 0 },
  { id: 'f-mon-rogati',   type: 'computer',     tileX: 5,  tileY: 15, zBonus: 3 },

  // Coluna B (centro) — Osmani, Whittaker, Dixon, Dodds
  { id: 'f-desk-osm',     type: 'desk',         tileX: 11, tileY: 12, color: '#F59E0B' },
  { id: 'f-ch-osm',       type: 'chair',        tileX: 11, tileY: 13, color: '#F59E0B', direction: 0 },
  { id: 'f-mon-osm',      type: 'monitor_dual', tileX: 11, tileY: 12, zBonus: 3 },

  { id: 'f-desk-whit',    type: 'desk',         tileX: 13, tileY: 12, color: '#EF4444' },
  { id: 'f-ch-whit',      type: 'chair',        tileX: 13, tileY: 13, color: '#EF4444', direction: 0 },
  { id: 'f-mon-whit',     type: 'computer',     tileX: 13, tileY: 12, zBonus: 3 },

  { id: 'f-desk-dixon',   type: 'desk',         tileX: 11, tileY: 15, color: '#06B6D4' },
  { id: 'f-ch-dixon',     type: 'chair',        tileX: 11, tileY: 16, color: '#06B6D4', direction: 0 },
  { id: 'f-mon-dixon',    type: 'computer',     tileX: 11, tileY: 15, zBonus: 3 },

  { id: 'f-desk-dodds',   type: 'desk',         tileX: 13, tileY: 15, color: '#EC4899' },
  { id: 'f-ch-dodds',     type: 'chair',        tileX: 13, tileY: 16, color: '#EC4899', direction: 0 },
  { id: 'f-mon-dodds',    type: 'monitor_dual', tileX: 13, tileY: 15, zBonus: 3 },

  // Coluna C (centro-dir) — Rauch, Rodrigues, Kozyrkov, Cagan
  { id: 'f-desk-rauch',   type: 'desk',         tileX: 19, tileY: 12, color: '#171717' },
  { id: 'f-ch-rauch',     type: 'chair',        tileX: 19, tileY: 13, color: '#475569', direction: 0 },
  { id: 'f-mon-rauch',    type: 'monitor_dual', tileX: 19, tileY: 12, zBonus: 3 },

  { id: 'f-desk-rodr',    type: 'desk',         tileX: 21, tileY: 12, color: '#16A34A' },
  { id: 'f-ch-rodr',      type: 'chair',        tileX: 21, tileY: 13, color: '#16A34A', direction: 0 },
  { id: 'f-mon-rodr',     type: 'computer',     tileX: 21, tileY: 12, zBonus: 3 },

  { id: 'f-desk-koz',     type: 'desk',         tileX: 19, tileY: 15, color: '#8B5CF6' },
  { id: 'f-ch-koz',       type: 'chair',        tileX: 19, tileY: 16, color: '#8B5CF6', direction: 0 },
  { id: 'f-mon-koz',      type: 'monitor_dual', tileX: 19, tileY: 15, zBonus: 3 },

  { id: 'f-desk-cagan',   type: 'desk',         tileX: 21, tileY: 15, color: '#F97316' },
  { id: 'f-ch-cagan',     type: 'chair',        tileX: 21, tileY: 16, color: '#F97316', direction: 0 },
  { id: 'f-mon-cagan',    type: 'computer',     tileX: 21, tileY: 15, zBonus: 3 },

  // ── DIRETORIA (cols 24-29, linhas 2-9) ────────────────────────────────
  { id: 'f-desk-grove',   type: 'desk',         tileX: 26, tileY: 4,  color: '#64748B' },
  { id: 'f-ch-grove',     type: 'chair',        tileX: 26, tileY: 5,  color: '#64748B', direction: 0 },
  { id: 'f-mon-grove',    type: 'monitor_dual', tileX: 26, tileY: 4,  zBonus: 3 },
  { id: 'f-desk-grove2',  type: 'desk',         tileX: 28, tileY: 4,  color: '#475569' },
  { id: 'f-ch-grove2',    type: 'chair',        tileX: 28, tileY: 5,  color: '#475569', direction: 0 },
  { id: 'f-mon-grove2',   type: 'computer',     tileX: 28, tileY: 4,  zBonus: 3 },
  { id: 'f-bookdir',      type: 'bookshelf',    tileX: 29, tileY: 3 },
  { id: 'f-cabinet-dir',  type: 'cabinet',      tileX: 25, tileY: 3,  color: '#334155' },

  // Open space — compartilhados
  { id: 'f-plant-os1',    type: 'plant',        tileX: 2,  tileY: 14 },
  { id: 'f-plant-os2',    type: 'plant',        tileX: 22, tileY: 14 },
  { id: 'f-trash-os1',    type: 'trash',        tileX: 7,  tileY: 17 },
  { id: 'f-trash-os2',    type: 'trash',        tileX: 16, tileY: 17 },
  { id: 'f-div1',         type: 'divider',      tileX: 8,  tileY: 14 },
  { id: 'f-div2',         type: 'divider',      tileX: 16, tileY: 14 },
  { id: 'f-wb-os',        type: 'whiteboard',   tileX: 29, tileY: 13 },

  // ── LOUNGE (linhas 19-22, cols 2-12) ──────────────────────────────────
  { id: 'f-rug-lounge',   type: 'rug',          tileX: 6,  tileY: 20, color: '#7C3AED' },
  { id: 'f-couch1',       type: 'couch',        tileX: 4,  tileY: 19, color: '#1D4ED8' },
  { id: 'f-couch2',       type: 'couch',        tileX: 8,  tileY: 19, color: '#1D4ED8', direction: 6 },
  { id: 'f-ctable',       type: 'coffee_table', tileX: 6,  tileY: 20, color: '#334155', zBonus: -1 },
  { id: 'f-lamp1',        type: 'lamp',         tileX: 3,  tileY: 21 },
  { id: 'f-lamp2',        type: 'lamp',         tileX: 10, tileY: 21 },
  { id: 'f-plant-l1',     type: 'plant',        tileX: 2,  tileY: 19 },
  { id: 'f-plant-l2',     type: 'plant',        tileX: 11, tileY: 19 },
  { id: 'f-mug-l',        type: 'mug',          tileX: 6,  tileY: 20, color: '#F59E0B', zBonus: 4 },

  // ── COPA (linhas 19-22, cols 15-21) ───────────────────────────────────
  { id: 'f-fridge',       type: 'fridge',       tileX: 15, tileY: 19 },
  { id: 'f-coffee-m',     type: 'coffee_machine', tileX: 16, tileY: 19 },
  { id: 'f-microwave',    type: 'microwave',    tileX: 17, tileY: 19 },
  { id: 'f-cabinet-c1',   type: 'cabinet',      tileX: 18, tileY: 19, color: '#334155' },
  { id: 'f-cabinet-c2',   type: 'cabinet',      tileX: 20, tileY: 19, color: '#334155' },
  { id: 'f-mug-copa',     type: 'mug',          tileX: 17, tileY: 20, color: '#DC2626', zBonus: 4 },

  // ── RECEPÇÃO (cols 24-29, linhas 19-22) ───────────────────────────────
  { id: 'f-sign',         type: 'sign',         tileX: 27, tileY: 19, label: 'SCOUT 360' },
  { id: 'f-sofa-rec',     type: 'sofa',         tileX: 25, tileY: 20, color: '#475569' },
  { id: 'f-book-rec',     type: 'bookshelf',    tileX: 29, tileY: 20 },
  { id: 'f-rug-rec',      type: 'rug',          tileX: 27, tileY: 21, color: '#0F172A' },

  // ── CORREDOR — acessórios (linhas 11 e 18) ────────────────────────────
  { id: 'f-ac1',          type: 'ac_unit',      tileX: 2,  tileY: 11 },
  { id: 'f-ac2',          type: 'ac_unit',      tileX: 15, tileY: 11 },
  { id: 'f-locker1',      type: 'locker',       tileX: 29, tileY: 11 },
  { id: 'f-locker2',      type: 'locker',       tileX: 28, tileY: 11 },
];
