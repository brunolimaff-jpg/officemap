import { Specialist, Furniture } from '@/types';

// ═══════════════════════════════════════════════════════════════════════════════
// MOBÍLIA — ~180 peças organizadas por zona
// ═══════════════════════════════════════════════════════════════════════════════

export const furniture: Furniture[] = [

  // ─── C-SUITE (Esquerda Superior): Satya, Cagan, Grove ───────────────────────
  { id: 'desk-satya',      type: 'desk',         x: 4,  y: 3,  direction: 2, color: '#0078D4' },
  { id: 'chair-satya',     type: 'chair',        x: 5,  y: 3,  direction: 6, color: '#0078D4' },
  { id: 'pc-satya',        type: 'monitor_dual', x: 4,  y: 2,  direction: 2 },
  { id: 'mug-satya',       type: 'mug',          x: 3,  y: 3,  color: '#0078D4' },

  { id: 'desk-cagan',      type: 'desk',         x: 4,  y: 6,  direction: 2, color: '#F97316' },
  { id: 'chair-cagan',     type: 'chair',        x: 5,  y: 6,  direction: 6, color: '#F97316' },
  { id: 'pc-cagan',        type: 'monitor_dual', x: 4,  y: 5,  direction: 2 },
  { id: 'mug-cagan',       type: 'mug',          x: 3,  y: 6,  color: '#F97316' },

  { id: 'desk-grove',      type: 'desk',         x: 4,  y: 9,  direction: 2, color: '#64748B' },
  { id: 'chair-grove',     type: 'chair',        x: 5,  y: 9,  direction: 6, color: '#64748B' },
  { id: 'pc-grove',        type: 'monitor_dual', x: 4,  y: 8,  direction: 2 },
  { id: 'mug-grove',       type: 'mug',          x: 3,  y: 9,  color: '#64748B' },

  // Mobiliário C-Suite
  { id: 'csuite-shelf1',   type: 'bookshelf',    x: 2,  y: 3  },
  { id: 'csuite-shelf2',   type: 'bookshelf',    x: 2,  y: 7  },
  { id: 'csuite-cabinet1', type: 'cabinet',      x: 2,  y: 5,  color: '#334155' },
  { id: 'csuite-lamp1',    type: 'lamp',         x: 2,  y: 2  },
  { id: 'csuite-lamp2',    type: 'lamp',         x: 6,  y: 10 },
  { id: 'csuite-trash1',   type: 'trash',        x: 6,  y: 4  },
  { id: 'csuite-locker1',  type: 'locker',       x: 2,  y: 10 },
  { id: 'csuite-ac',       type: 'ac_unit',      x: 4,  y: 1  },
  { id: 'csuite-rug',      type: 'rug',          x: 4,  y: 4,  color: '#1E3A8A' },
  { id: 'csuite-sign',     type: 'sign',         x: 4,  y: 1,  label: 'LIDERANÇA' },

  // ─── ENGINEERING (Direita Superior): Uncle Bob, Dodds, Rauch ────────────────
  { id: 'desk-uncle_bob',  type: 'desk',         x: 24, y: 3,  direction: 6, color: '#DC2626' },
  { id: 'chair-uncle_bob', type: 'chair',        x: 23, y: 3,  direction: 2, color: '#DC2626' },
  { id: 'pc-uncle_bob',    type: 'monitor_dual', x: 24, y: 2,  direction: 6 },
  { id: 'mug-uncle_bob',   type: 'mug',          x: 25, y: 3,  color: '#DC2626' },

  { id: 'desk-dodds',      type: 'desk',         x: 24, y: 6,  direction: 6, color: '#EC4899' },
  { id: 'chair-dodds',     type: 'chair',        x: 23, y: 6,  direction: 2, color: '#EC4899' },
  { id: 'pc-dodds',        type: 'monitor_dual', x: 24, y: 5,  direction: 6 },
  { id: 'mug-dodds',       type: 'mug',          x: 25, y: 6,  color: '#EC4899' },

  { id: 'desk-rauch',      type: 'desk',         x: 24, y: 9,  direction: 6, color: '#171717' },
  { id: 'chair-rauch',     type: 'chair',        x: 23, y: 9,  direction: 2, color: '#171717' },
  { id: 'pc-rauch',        type: 'monitor_dual', x: 24, y: 8,  direction: 6 },
  { id: 'mug-rauch',       type: 'mug',          x: 25, y: 9,  color: '#171717' },

  // Mobiliário Engineering
  { id: 'eng-shelf1',      type: 'bookshelf',    x: 26, y: 3  },
  { id: 'eng-shelf2',      type: 'bookshelf',    x: 26, y: 7  },
  { id: 'eng-cabinet1',    type: 'cabinet',      x: 26, y: 5,  color: '#334155' },
  { id: 'eng-lamp1',       type: 'lamp',         x: 27, y: 2  },
  { id: 'eng-lamp2',       type: 'lamp',         x: 22, y: 10 },
  { id: 'eng-trash1',      type: 'trash',        x: 22, y: 4  },
  { id: 'eng-locker1',     type: 'locker',       x: 26, y: 10 },
  { id: 'eng-ac',          type: 'ac_unit',      x: 24, y: 1  },
  { id: 'eng-whiteboard',  type: 'whiteboard',   x: 26, y: 9 },
  { id: 'eng-sign',        type: 'sign',         x: 24, y: 1,  label: 'ENGENHARIA' },

  // ─── PAREDES DE VIDRO — alas → corredor ─────────────────────────────────────
  { id: 'glass-L1',        type: 'glass_wall',   x: 7,  y: 3,  direction: 2 },
  { id: 'glass-L2',        type: 'glass_wall',   x: 7,  y: 6,  direction: 2 },
  { id: 'glass-L3',        type: 'glass_wall',   x: 7,  y: 9,  direction: 2 },
  { id: 'glass-R1',        type: 'glass_wall',   x: 20, y: 3,  direction: 6 },
  { id: 'glass-R2',        type: 'glass_wall',   x: 20, y: 6,  direction: 6 },
  { id: 'glass-R3',        type: 'glass_wall',   x: 20, y: 9,  direction: 6 },

  // ─── SALA DE REUNIÃO (Centro Superior) — BOARD ROOM ─────────────────────────
  { id: 'board-table',     type: 'table',        x: 14, y: 7 },
  { id: 'board-chair-N1',  type: 'chair',        x: 12, y: 5,  direction: 4, color: '#334155' },
  { id: 'board-chair-N2',  type: 'chair',        x: 13, y: 5,  direction: 4, color: '#334155' },
  { id: 'board-chair-N3',  type: 'chair',        x: 14, y: 5,  direction: 4, color: '#334155' },
  { id: 'board-chair-N4',  type: 'chair',        x: 15, y: 5,  direction: 4, color: '#334155' },
  { id: 'board-chair-N5',  type: 'chair',        x: 16, y: 5,  direction: 4, color: '#334155' },
  { id: 'board-chair-S1',  type: 'chair',        x: 12, y: 9,  direction: 0, color: '#334155' },
  { id: 'board-chair-S2',  type: 'chair',        x: 13, y: 9,  direction: 0, color: '#334155' },
  { id: 'board-chair-S3',  type: 'chair',        x: 14, y: 9,  direction: 0, color: '#334155' },
  { id: 'board-chair-S4',  type: 'chair',        x: 15, y: 9,  direction: 0, color: '#334155' },
  { id: 'board-chair-S5',  type: 'chair',        x: 16, y: 9,  direction: 0, color: '#334155' },
  { id: 'board-chair-W1',  type: 'chair',        x: 11, y: 7,  direction: 2, color: '#334155' },
  { id: 'board-chair-E1',  type: 'chair',        x: 17, y: 7,  direction: 6, color: '#334155' },
  { id: 'board-chair-W2',  type: 'chair',        x: 11, y: 8,  direction: 2, color: '#334155' },
  { id: 'board-whiteboard',type: 'whiteboard',   x: 14, y: 3,  direction: 4 },
  { id: 'board-tv',        type: 'tv_screen',    x: 14, y: 4,  label: 'SCORE PORTA' },
  { id: 'board-rug',       type: 'rug',          x: 14, y: 7,  color: '#1D4ED8' },
  { id: 'lamp-meeting-L',  type: 'lamp',         x: 10, y: 4  },
  { id: 'lamp-meeting-R',  type: 'lamp',         x: 18, y: 4  },
  { id: 'mug-meeting-1',   type: 'mug',          x: 13, y: 6,  color: '#94A3B8' },
  { id: 'mug-meeting-2',   type: 'mug',          x: 15, y: 6,  color: '#94A3B8' },
  { id: 'mug-meeting-3',   type: 'mug',          x: 13, y: 8,  color: '#94A3B8' },
  { id: 'sign-boardroom',  type: 'sign',         x: 14, y: 2,  label: 'SALA DE REUNIÃO' },

  // ─── DATA LAB (Esquerda Inferior): Karpathy, Rogati, Kozyrkov, Osmani ──────
  { id: 'desk-karpathy',   type: 'desk',         x: 4,  y: 17, direction: 2, color: '#7C3AED' },
  { id: 'chair-karpathy',  type: 'chair',        x: 5,  y: 17, direction: 6, color: '#7C3AED' },
  { id: 'pc-karpathy',     type: 'monitor_dual', x: 4,  y: 16, direction: 2 },
  { id: 'mug-karpathy',    type: 'mug',          x: 3,  y: 17, color: '#7C3AED' },

  { id: 'desk-rogati',     type: 'desk',         x: 4,  y: 20, direction: 2, color: '#059669' },
  { id: 'chair-rogati',    type: 'chair',        x: 5,  y: 20, direction: 6, color: '#059669' },
  { id: 'pc-rogati',       type: 'monitor_dual', x: 4,  y: 19, direction: 2 },
  { id: 'mug-rogati',      type: 'mug',          x: 3,  y: 20, color: '#059669' },

  { id: 'desk-kozyrkov',   type: 'desk',         x: 4,  y: 23, direction: 2, color: '#8B5CF6' },
  { id: 'chair-kozyrkov',  type: 'chair',        x: 5,  y: 23, direction: 6, color: '#8B5CF6' },
  { id: 'pc-kozyrkov',     type: 'monitor_dual', x: 4,  y: 22, direction: 2 },
  { id: 'mug-kozyrkov',    type: 'mug',          x: 3,  y: 23, color: '#8B5CF6' },

  { id: 'desk-osmani',     type: 'desk',         x: 7,  y: 20, direction: 6, color: '#F59E0B' },
  { id: 'chair-osmani',    type: 'chair',        x: 6,  y: 20, direction: 2, color: '#F59E0B' },
  { id: 'pc-osmani',       type: 'monitor_dual', x: 7,  y: 19, direction: 6 },
  { id: 'mug-osmani',      type: 'mug',          x: 7,  y: 21, color: '#F59E0B' },

  // Mobiliário Data Lab
  { id: 'data-shelf1',     type: 'bookshelf',    x: 2,  y: 17 },
  { id: 'data-shelf2',     type: 'bookshelf',    x: 2,  y: 21 },
  { id: 'data-cabinet1',   type: 'cabinet',      x: 2,  y: 19, color: '#334155' },
  { id: 'data-lamp1',      type: 'lamp',         x: 2,  y: 16 },
  { id: 'data-lamp2',      type: 'lamp',         x: 7,  y: 24 },
  { id: 'data-trash1',     type: 'trash',        x: 6,  y: 18 },
  { id: 'data-whiteboard', type: 'whiteboard',   x: 7,  y: 17 },
  { id: 'data-tv',         type: 'tv_screen',    x: 2,  y: 24, label: 'DADOS' },
  { id: 'data-sign',       type: 'sign',         x: 4,  y: 16, label: 'LAB DE DADOS' },

  // ─── SALES FLOOR (Direita Inferior): Dixon, Rodrigues, Whittaker ────────────
  { id: 'desk-dixon',      type: 'desk',         x: 24, y: 17, direction: 6, color: '#06B6D4' },
  { id: 'chair-dixon',     type: 'chair',        x: 23, y: 17, direction: 2, color: '#06B6D4' },
  { id: 'pc-dixon',        type: 'monitor_dual', x: 24, y: 16, direction: 6 },
  { id: 'mug-dixon',       type: 'mug',          x: 25, y: 17, color: '#06B6D4' },

  { id: 'desk-rodrigues',  type: 'desk',         x: 24, y: 20, direction: 6, color: '#16A34A' },
  { id: 'chair-rodrigues', type: 'chair',        x: 23, y: 20, direction: 2, color: '#16A34A' },
  { id: 'pc-rodrigues',    type: 'monitor_dual', x: 24, y: 19, direction: 6 },
  { id: 'mug-rodrigues',   type: 'mug',          x: 25, y: 20, color: '#16A34A' },

  { id: 'desk-whittaker',  type: 'desk',         x: 24, y: 23, direction: 6, color: '#EF4444' },
  { id: 'chair-whittaker', type: 'chair',        x: 23, y: 23, direction: 2, color: '#EF4444' },
  { id: 'pc-whittaker',    type: 'monitor_dual', x: 24, y: 22, direction: 6 },
  { id: 'mug-whittaker',   type: 'mug',          x: 25, y: 23, color: '#EF4444' },

  // Mobiliário Sales Floor
  { id: 'sales-shelf1',    type: 'bookshelf',    x: 27, y: 17 },
  { id: 'sales-shelf2',    type: 'bookshelf',    x: 27, y: 21 },
  { id: 'sales-cabinet1',  type: 'cabinet',      x: 27, y: 19, color: '#334155' },
  { id: 'sales-lamp1',     type: 'lamp',         x: 27, y: 16 },
  { id: 'sales-lamp2',     type: 'lamp',         x: 22, y: 24 },
  { id: 'sales-trash1',    type: 'trash',        x: 22, y: 18 },
  { id: 'sales-whiteboard',type: 'whiteboard',   x: 22, y: 17 },
  { id: 'sales-tv',        type: 'tv_screen',    x: 27, y: 24, label: 'PIPELINE' },
  { id: 'sales-sign',      type: 'sign',         x: 24, y: 16, label: 'VENDAS' },

  // ─── LOUNGE & COPA (Centro Inferior) ────────────────────────────────────────
  // Lounge
  { id: 'lounge-pool',     type: 'pool_table',   x: 14, y: 18 },
  { id: 'lounge-couch1',   type: 'couch',        x: 11, y: 20, direction: 2, color: '#1D4ED8' },
  { id: 'lounge-couch2',   type: 'couch',        x: 17, y: 20, direction: 6, color: '#1D4ED8' },
  { id: 'lounge-coffee',   type: 'coffee_table', x: 14, y: 20, color: '#0F172A' },
  { id: 'lounge-rug',      type: 'rug',          x: 14, y: 19, color: '#1E3A8A' },
  { id: 'lounge-lamp1',    type: 'lamp',         x: 10, y: 17 },
  { id: 'lounge-lamp2',    type: 'lamp',         x: 18, y: 17 },
  { id: 'lounge-tv',       type: 'tv_screen',    x: 14, y: 16, label: 'SCOUT 360' },
  { id: 'lounge-sign',     type: 'sign',         x: 14, y: 16, label: 'LOUNGE' },

  // Copa
  { id: 'copa-fridge',         type: 'fridge',         x: 11, y: 21 },
  { id: 'copa-coffee-machine', type: 'coffee_machine', x: 12, y: 21 },
  { id: 'copa-microwave',      type: 'microwave',      x: 13, y: 21 },
  { id: 'copa-cabinet1',       type: 'cabinet',        x: 15, y: 21, color: '#475569' },
  { id: 'copa-cabinet2',       type: 'cabinet',        x: 16, y: 21, color: '#475569' },
  { id: 'copa-coffee-table',   type: 'coffee_table',   x: 14, y: 23, color: '#1E293B' },
  { id: 'copa-mug1',           type: 'mug',            x: 13, y: 22, color: '#F59E0B' },
  { id: 'copa-mug2',           type: 'mug',            x: 15, y: 22, color: '#EF4444' },
  { id: 'copa-mug3',           type: 'mug',            x: 14, y: 24, color: '#8B5CF6' },
  { id: 'copa-trash',          type: 'trash',          x: 17, y: 22 },
  { id: 'copa-plant1',         type: 'plant',          x: 10, y: 22 },

  // ─── GLASS WALLS — zonas inferiores ──────────────────────────────────────────
  { id: 'glass-BL1',       type: 'glass_wall',   x: 8,  y: 17, direction: 2 },
  { id: 'glass-BL2',       type: 'glass_wall',   x: 8,  y: 20, direction: 2 },
  { id: 'glass-BR1',       type: 'glass_wall',   x: 19, y: 17, direction: 6 },
  { id: 'glass-BR2',       type: 'glass_wall',   x: 19, y: 20, direction: 6 },

  // ─── DIVISORES DE ZONA (corredor) ────────────────────────────────────────────
  { id: 'div-top-1',  type: 'divider', x: 3,  y: 12 },
  { id: 'div-top-2',  type: 'divider', x: 5,  y: 12 },
  { id: 'div-top-3',  type: 'divider', x: 22, y: 12 },
  { id: 'div-top-4',  type: 'divider', x: 24, y: 12 },
  { id: 'div-bot-1',  type: 'divider', x: 3,  y: 15 },
  { id: 'div-bot-2',  type: 'divider', x: 5,  y: 15 },
  { id: 'div-bot-3',  type: 'divider', x: 22, y: 15 },
  { id: 'div-bot-4',  type: 'divider', x: 24, y: 15 },

  // ─── PLANTAS DECORATIVAS ─────────────────────────────────────────────────────
  { id: 'plant-TL',   type: 'plant', x: 2,  y: 2  },
  { id: 'plant-TR',   type: 'plant', x: 27, y: 2  },
  { id: 'plant-ML1',  type: 'plant', x: 2,  y: 13 },
  { id: 'plant-MR1',  type: 'plant', x: 27, y: 13 },
  { id: 'plant-BL',   type: 'plant', x: 2,  y: 24 },
  { id: 'plant-BR',   type: 'plant', x: 27, y: 24 },
  { id: 'plant-C1',   type: 'plant', x: 10, y: 13 },
  { id: 'plant-C2',   type: 'plant', x: 18, y: 13 },
  { id: 'plant-C3',   type: 'plant', x: 10, y: 14 },
  { id: 'plant-C4',   type: 'plant', x: 18, y: 14 },
  { id: 'plant-TC',   type: 'plant', x: 14, y: 2  },
  { id: 'plant-BC',   type: 'plant', x: 14, y: 24 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 13 ESPECIALISTAS — Board Room do Senior Scout 360
// ═══════════════════════════════════════════════════════════════════════════════

export const specialists: Specialist[] = [
  {
    id: 'satya',
    name: 'Satya',
    realPerson: 'Satya Nadella',
    role: 'Líder Geral',
    specialty: 'visão de produto, plataforma, adoção enterprise, copilots',
    tone: 'visionário, estratégico, orientado a adoção real',
    color: '#0078D4',
  },
  {
    id: 'uncle_bob',
    name: 'Uncle Bob',
    realPerson: 'Robert C. Martin',
    role: 'CTO',
    specialty: 'arquitetura, SOLID, Clean Code, débito técnico',
    tone: 'rigoroso, direto, veta soluções ruins sem cerimônia',
    color: '#DC2626',
  },
  {
    id: 'karpathy',
    name: 'Karpathy',
    realPerson: 'Andrej Karpathy',
    role: 'Arquiteto de IA',
    specialty: 'prompts, sistemas de IA, anti-alucinação, pipeline de prompts',
    tone: 'analítico, detalhista, orientado a evidências',
    color: '#7C3AED',
  },
  {
    id: 'rogati',
    name: 'Rogati',
    realPerson: 'Monica Rogati',
    role: 'Guardiã de Dados',
    specialty: 'qualidade de dados, entity resolution, validação, freshness',
    tone: 'cética construtiva, pergunta antes de afirmar',
    color: '#059669',
  },
  {
    id: 'osmani',
    name: 'Osmani',
    realPerson: 'Addy Osmani',
    role: 'Líder de UX',
    specialty: 'performance percebida, mobile-first, loading, web vitals',
    tone: 'empático, visual, orientado ao usuário final',
    color: '#F59E0B',
  },
  {
    id: 'whittaker',
    name: 'Whittaker',
    realPerson: 'James Whittaker',
    role: 'QA & Segurança',
    specialty: 'edge cases, erros, LGPD, robustez, attack surfaces',
    tone: 'questionador, preventivo, não deixa passar nada',
    color: '#EF4444',
  },
  {
    id: 'dixon',
    name: 'Dixon',
    realPerson: 'Matt Dixon',
    role: 'Estrategista Comercial',
    specialty: 'Challenger Sale, ROI, MEDDPICC, JOLT Effect',
    tone: 'pragmático, orientado a negócio, fala em impacto real',
    color: '#06B6D4',
  },
  {
    id: 'dodds',
    name: 'Dodds',
    realPerson: 'Kent C. Dodds',
    role: 'Dev Senior',
    specialty: 'TypeScript, React, Next.js, código completo, testes',
    tone: 'executor, objetivo, entrega sem atalhos',
    color: '#EC4899',
  },
  {
    id: 'rauch',
    name: 'Rauch',
    realPerson: 'Guillermo Rauch',
    role: 'Engenheiro de Infra',
    specialty: 'serverless, Vercel, APIs externas, retry, cache',
    tone: 'sistemático, preventivo, pensa em escala',
    color: '#171717',
  },
  {
    id: 'rodrigues',
    name: 'Rodrigues',
    realPerson: 'Roberto Rodrigues',
    role: 'Especialista Agro',
    specialty: 'agronegócio brasileiro, sazonalidade, regulação, cooperativas',
    tone: 'experiente, prático, corrige estereótipos com vivência',
    color: '#16A34A',
  },
  {
    id: 'kozyrkov',
    name: 'Kozyrkov',
    realPerson: 'Cassie Kozyrkov',
    role: 'Cientista de Decisão',
    specialty: 'Score PORTA, validação estatística, backtesting, confiança',
    tone: 'analítica, questionadora, baseada em dados',
    color: '#8B5CF6',
  },
  {
    id: 'cagan',
    name: 'Cagan',
    realPerson: 'Marty Cagan',
    role: 'Líder de Produto',
    specialty: 'product discovery, priorização, métricas, roadmap',
    tone: 'focado, elimina desperdício, "apaixone-se pelo problema"',
    color: '#F97316',
  },
  {
    id: 'grove',
    name: 'Grove',
    realPerson: 'Andy Grove',
    role: 'Verificador de Realidade',
    specialty: 'viabilidade interna, adoção, budget, realidade operacional',
    tone: 'confrontador construtivo, fala por último, "só os paranoicos sobrevivem"',
    color: '#64748B',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// POSIÇÕES DOS ESPECIALISTAS NAS MESAS
// ═══════════════════════════════════════════════════════════════════════════════

export const specialistDeskPositions: Record<string, { x: number; y: number; direction: number }> = {
  // C-Suite
  satya:      { x: 5,  y: 3,  direction: 6 },
  cagan:      { x: 5,  y: 6,  direction: 6 },
  grove:      { x: 5,  y: 9,  direction: 6 },
  // Engineering
  uncle_bob:  { x: 23, y: 3,  direction: 2 },
  dodds:      { x: 23, y: 6,  direction: 2 },
  rauch:      { x: 23, y: 9,  direction: 2 },
  // Data Lab
  karpathy:   { x: 5,  y: 17, direction: 6 },
  rogati:     { x: 5,  y: 20, direction: 6 },
  kozyrkov:   { x: 5,  y: 23, direction: 6 },
  osmani:     { x: 6,  y: 20, direction: 2 },
  // Sales Floor
  dixon:      { x: 23, y: 17, direction: 2 },
  rodrigues:  { x: 23, y: 20, direction: 2 },
  whittaker:  { x: 23, y: 23, direction: 2 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// POSIÇÕES NA SALA DE REUNIÃO (para convocação)
// ═══════════════════════════════════════════════════════════════════════════════

export const meetingPositions = [
  { x: 12, y: 5,  dir: 4 },
  { x: 13, y: 5,  dir: 4 },
  { x: 14, y: 5,  dir: 4 },
  { x: 15, y: 5,  dir: 4 },
  { x: 16, y: 5,  dir: 4 },
  { x: 12, y: 9,  dir: 0 },
  { x: 13, y: 9,  dir: 0 },
  { x: 14, y: 9,  dir: 0 },
  { x: 15, y: 9,  dir: 0 },
  { x: 16, y: 9,  dir: 0 },
  { x: 11, y: 7,  dir: 2 },
  { x: 17, y: 7,  dir: 6 },
  { x: 11, y: 8,  dir: 2 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

export function getSpecialistPrompt(specialist: Specialist): string {
  return `Você é ${specialist.realPerson} (${specialist.name}), ${specialist.role} do Board Room — escritório virtual de Bruno Lima, economista e especialista em tecnologia para agronegócio.

Sua especialidade: ${specialist.specialty}
Seu estilo: ${specialist.tone}

REGRAS INEGOCIÁVEIS:
- Responda de forma executiva e direta — sem rodeios acadêmicos
- Seja específico ao contexto enviado — NUNCA genérico
- NUNCA invente dados ou métricas sem fonte explícita
- Quando em convocação de grupo, leia o que os outros especialistas disseram e reaja genuinamente: concorde, discorde ou complemente com argumento concreto
- Máximo 4 parágrafos por resposta, a menos que pedido diferente
- Use markdown para estruturar: negrito para pontos críticos, listas quando houver múltiplos itens`;
}
