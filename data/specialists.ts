import { Specialist, Furniture } from '@/types';

// ═══════════════════════════════════════════════════════════════════════════════
// MOBÍLIA — Layout Habbo Corp style
// Zonas: BOARDROOM | ENGENHARIA | DIRETORIA | OPEN SPACE (ilhas) | LOUNGE | COPA | RECEPÇÃO
// ═══════════════════════════════════════════════════════════════════════════════

export const furniture: Furniture[] = [

  // ─── BOARDROOM (centro-esquerda, linhas 2-10, colunas 8-15) ─────────────────
  { id: 'board-tv',          type: 'tv_screen',    x: 11, y: 2,  label: 'SCORE PORTA' },
  { id: 'board-whiteboard',  type: 'whiteboard',   x: 12, y: 2,  direction: 4 },
  { id: 'board-table',       type: 'table',        x: 11, y: 5 },
  { id: 'board-chair-N1',    type: 'chair',        x: 9,  y: 4,  direction: 4, color: '#1D4ED8' },
  { id: 'board-chair-N2',    type: 'chair',        x: 10, y: 4,  direction: 4, color: '#1D4ED8' },
  { id: 'board-chair-N3',    type: 'chair',        x: 11, y: 4,  direction: 4, color: '#1D4ED8' },
  { id: 'board-chair-N4',    type: 'chair',        x: 12, y: 4,  direction: 4, color: '#1D4ED8' },
  { id: 'board-chair-N5',    type: 'chair',        x: 13, y: 4,  direction: 4, color: '#1D4ED8' },
  { id: 'board-chair-S1',    type: 'chair',        x: 9,  y: 8,  direction: 0, color: '#1D4ED8' },
  { id: 'board-chair-S2',    type: 'chair',        x: 10, y: 8,  direction: 0, color: '#1D4ED8' },
  { id: 'board-chair-S3',    type: 'chair',        x: 11, y: 8,  direction: 0, color: '#1D4ED8' },
  { id: 'board-chair-S4',    type: 'chair',        x: 12, y: 8,  direction: 0, color: '#1D4ED8' },
  { id: 'board-chair-S5',    type: 'chair',        x: 13, y: 8,  direction: 0, color: '#1D4ED8' },
  { id: 'board-chair-W',     type: 'chair',        x: 8,  y: 6,  direction: 2, color: '#1D4ED8' },
  { id: 'board-chair-E',     type: 'chair',        x: 14, y: 6,  direction: 6, color: '#1D4ED8' },
  { id: 'board-rug',         type: 'rug',          x: 11, y: 6,  color: '#1E3A8A' },
  { id: 'board-lamp-L',      type: 'lamp',         x: 8,  y: 3 },
  { id: 'board-lamp-R',      type: 'lamp',         x: 15, y: 3 },
  { id: 'board-plant-L',     type: 'plant',        x: 8,  y: 9 },
  { id: 'board-plant-R',     type: 'plant',        x: 15, y: 9 },
  { id: 'board-sign',        type: 'sign',         x: 11, y: 2,  label: 'BOARD ROOM' },
  { id: 'board-mug-1',       type: 'mug',          x: 10, y: 5,  color: '#94A3B8' },
  { id: 'board-mug-2',       type: 'mug',          x: 12, y: 7,  color: '#94A3B8' },

  // ─── DIRETORIA (direita topo, colunas 24-29, linhas 2-10) ────────────────────
  // Satya — CEO
  { id: 'desk-satya',        type: 'desk',         x: 26, y: 3,  direction: 6, color: '#0078D4' },
  { id: 'chair-satya',       type: 'chair',        x: 25, y: 3,  direction: 2, color: '#0078D4' },
  { id: 'pc-satya',          type: 'monitor_dual', x: 26, y: 2,  direction: 6 },
  { id: 'mug-satya',         type: 'mug',          x: 27, y: 3,  color: '#0078D4' },
  // Cagan — CPO
  { id: 'desk-cagan',        type: 'desk',         x: 26, y: 6,  direction: 6, color: '#F97316' },
  { id: 'chair-cagan',       type: 'chair',        x: 25, y: 6,  direction: 2, color: '#F97316' },
  { id: 'pc-cagan',          type: 'monitor_dual', x: 26, y: 5,  direction: 6 },
  { id: 'mug-cagan',         type: 'mug',          x: 27, y: 6,  color: '#F97316' },
  // Grove — COO
  { id: 'desk-grove',        type: 'desk',         x: 26, y: 9,  direction: 6, color: '#64748B' },
  { id: 'chair-grove',       type: 'chair',        x: 25, y: 9,  direction: 2, color: '#64748B' },
  { id: 'pc-grove',          type: 'monitor_dual', x: 26, y: 8,  direction: 6 },
  { id: 'mug-grove',         type: 'mug',          x: 27, y: 9,  color: '#64748B' },
  // Decoração Diretoria
  { id: 'dir-shelf1',        type: 'bookshelf',    x: 28, y: 3 },
  { id: 'dir-shelf2',        type: 'bookshelf',    x: 28, y: 7 },
  { id: 'dir-cabinet',       type: 'cabinet',      x: 28, y: 5,  color: '#334155' },
  { id: 'dir-lamp1',         type: 'lamp',         x: 28, y: 2 },
  { id: 'dir-lamp2',         type: 'lamp',         x: 24, y: 10 },
  { id: 'dir-plant',         type: 'plant',        x: 24, y: 2 },
  { id: 'dir-rug',           type: 'rug',          x: 26, y: 6,  color: '#1E3A8A' },
  { id: 'dir-sign',          type: 'sign',         x: 26, y: 2,  label: 'DIRETORIA' },
  { id: 'dir-trash',         type: 'trash',        x: 24, y: 4 },

  // ─── ENGENHARIA (centro, colunas 17-22, linhas 2-10) ─────────────────────────
  // Uncle Bob + Dodds — ilha frente a frente
  { id: 'desk-uncle_bob',    type: 'desk',         x: 19, y: 3,  direction: 6, color: '#DC2626' },
  { id: 'chair-uncle_bob',   type: 'chair',        x: 18, y: 3,  direction: 2, color: '#DC2626' },
  { id: 'pc-uncle_bob',      type: 'monitor_dual', x: 19, y: 2,  direction: 6 },
  { id: 'mug-uncle_bob',     type: 'mug',          x: 20, y: 3,  color: '#DC2626' },

  { id: 'desk-dodds',        type: 'desk',         x: 19, y: 5,  direction: 6, color: '#EC4899' },
  { id: 'chair-dodds',       type: 'chair',        x: 18, y: 5,  direction: 2, color: '#EC4899' },
  { id: 'pc-dodds',          type: 'monitor_dual', x: 19, y: 4,  direction: 6 },
  { id: 'mug-dodds',         type: 'mug',          x: 20, y: 5,  color: '#EC4899' },

  // Rauch — mesa lateral
  { id: 'desk-rauch',        type: 'desk',         x: 21, y: 7,  direction: 6, color: '#171717' },
  { id: 'chair-rauch',       type: 'chair',        x: 20, y: 7,  direction: 2, color: '#171717' },
  { id: 'pc-rauch',          type: 'monitor_dual', x: 21, y: 6,  direction: 6 },
  { id: 'mug-rauch',         type: 'mug',          x: 22, y: 7,  color: '#171717' },

  // Decoração Eng
  { id: 'eng-whiteboard',    type: 'whiteboard',   x: 22, y: 3 },
  { id: 'eng-shelf',         type: 'bookshelf',    x: 22, y: 5 },
  { id: 'eng-lamp',          type: 'lamp',         x: 22, y: 2 },
  { id: 'eng-trash',         type: 'trash',        x: 17, y: 4 },
  { id: 'eng-sign',          type: 'sign',         x: 19, y: 2,  label: 'ENGENHARIA' },
  { id: 'eng-plant',         type: 'plant',        x: 17, y: 9 },

  // ─── OPEN SPACE — Ilhas de trabalho (linhas 12-17) ───────────────────────────
  // Ilha A (esquerda): Karpathy + Rogati frente a frente
  { id: 'desk-karpathy',     type: 'desk',         x: 4,  y: 13, direction: 2, color: '#7C3AED' },
  { id: 'chair-karpathy',    type: 'chair',        x: 5,  y: 13, direction: 6, color: '#7C3AED' },
  { id: 'pc-karpathy',       type: 'monitor_dual', x: 4,  y: 12, direction: 2 },
  { id: 'mug-karpathy',      type: 'mug',          x: 3,  y: 13, color: '#7C3AED' },

  { id: 'desk-rogati',       type: 'desk',         x: 4,  y: 15, direction: 2, color: '#059669' },
  { id: 'chair-rogati',      type: 'chair',        x: 5,  y: 15, direction: 6, color: '#059669' },
  { id: 'pc-rogati',         type: 'monitor_dual', x: 4,  y: 14, direction: 2 },
  { id: 'mug-rogati',        type: 'mug',          x: 3,  y: 15, color: '#059669' },

  // Ilha B (centro-esquerda): Kozyrkov + Osmani
  { id: 'desk-kozyrkov',     type: 'desk',         x: 10, y: 13, direction: 2, color: '#8B5CF6' },
  { id: 'chair-kozyrkov',    type: 'chair',        x: 11, y: 13, direction: 6, color: '#8B5CF6' },
  { id: 'pc-kozyrkov',       type: 'monitor_dual', x: 10, y: 12, direction: 2 },
  { id: 'mug-kozyrkov',      type: 'mug',          x: 9,  y: 13, color: '#8B5CF6' },

  { id: 'desk-osmani',       type: 'desk',         x: 10, y: 15, direction: 2, color: '#F59E0B' },
  { id: 'chair-osmani',      type: 'chair',        x: 11, y: 15, direction: 6, color: '#F59E0B' },
  { id: 'pc-osmani',         type: 'monitor_dual', x: 10, y: 14, direction: 2 },
  { id: 'mug-osmani',        type: 'mug',          x: 9,  y: 15, color: '#F59E0B' },

  // Ilha C (centro-direita): Dixon + Rodrigues
  { id: 'desk-dixon',        type: 'desk',         x: 18, y: 13, direction: 6, color: '#06B6D4' },
  { id: 'chair-dixon',       type: 'chair',        x: 17, y: 13, direction: 2, color: '#06B6D4' },
  { id: 'pc-dixon',          type: 'monitor_dual', x: 18, y: 12, direction: 6 },
  { id: 'mug-dixon',         type: 'mug',          x: 19, y: 13, color: '#06B6D4' },

  { id: 'desk-rodrigues',    type: 'desk',         x: 18, y: 15, direction: 6, color: '#16A34A' },
  { id: 'chair-rodrigues',   type: 'chair',        x: 17, y: 15, direction: 2, color: '#16A34A' },
  { id: 'pc-rodrigues',      type: 'monitor_dual', x: 18, y: 14, direction: 6 },
  { id: 'mug-rodrigues',     type: 'mug',          x: 19, y: 15, color: '#16A34A' },

  // Ilha D (direita): Whittaker sozinho (QA — isolamento intencional 😄)
  { id: 'desk-whittaker',    type: 'desk',         x: 25, y: 13, direction: 6, color: '#EF4444' },
  { id: 'chair-whittaker',   type: 'chair',        x: 24, y: 13, direction: 2, color: '#EF4444' },
  { id: 'pc-whittaker',      type: 'monitor_dual', x: 25, y: 12, direction: 6 },
  { id: 'mug-whittaker',     type: 'mug',          x: 26, y: 13, color: '#EF4444' },

  { id: 'desk-whittaker-b',  type: 'desk',         x: 25, y: 15, direction: 6, color: '#EF4444' },
  { id: 'chair-whittaker-b', type: 'chair',        x: 24, y: 15, direction: 2, color: '#94A3B8' },
  { id: 'pc-whittaker-b',    type: 'computer',     x: 25, y: 14, direction: 6 },

  // Decoração Open Space
  { id: 'os-tv1',            type: 'tv_screen',    x: 14, y: 12, label: 'SCOUT 360' },
  { id: 'os-whiteboard1',    type: 'whiteboard',   x: 14, y: 13 },
  { id: 'os-shelf1',         type: 'bookshelf',    x: 2,  y: 13 },
  { id: 'os-shelf2',         type: 'bookshelf',    x: 2,  y: 15 },
  { id: 'os-shelf3',         type: 'bookshelf',    x: 28, y: 13 },
  { id: 'os-lamp1',          type: 'lamp',         x: 2,  y: 12 },
  { id: 'os-lamp2',          type: 'lamp',         x: 28, y: 12 },
  { id: 'os-lamp3',          type: 'lamp',         x: 14, y: 17 },
  { id: 'os-plant1',         type: 'plant',        x: 7,  y: 12 },
  { id: 'os-plant2',         type: 'plant',        x: 15, y: 12 },
  { id: 'os-plant3',         type: 'plant',        x: 22, y: 12 },
  { id: 'os-plant4',         type: 'plant',        x: 7,  y: 17 },
  { id: 'os-plant5',         type: 'plant',        x: 22, y: 17 },
  { id: 'os-trash1',         type: 'trash',        x: 8,  y: 16 },
  { id: 'os-trash2',         type: 'trash',        x: 20, y: 16 },
  { id: 'os-sign-data',      type: 'sign',         x: 4,  y: 12, label: 'DATA & IA' },
  { id: 'os-sign-sales',     type: 'sign',         x: 18, y: 12, label: 'VENDAS & AGRO' },
  { id: 'os-sign-qa',        type: 'sign',         x: 25, y: 12, label: 'QA' },
  { id: 'os-divider1',       type: 'divider',      x: 8,  y: 13 },
  { id: 'os-divider2',       type: 'divider',      x: 8,  y: 15 },
  { id: 'os-divider3',       type: 'divider',      x: 15, y: 13 },
  { id: 'os-divider4',       type: 'divider',      x: 15, y: 15 },
  { id: 'os-divider5',       type: 'divider',      x: 23, y: 13 },
  { id: 'os-divider6',       type: 'divider',      x: 23, y: 15 },
  { id: 'os-rug1',           type: 'rug',          x: 4,  y: 14, color: '#1E3A8A' },
  { id: 'os-rug2',           type: 'rug',          x: 10, y: 14, color: '#1E3A8A' },
  { id: 'os-rug3',           type: 'rug',          x: 18, y: 14, color: '#0F4C75' },
  { id: 'os-rug4',           type: 'rug',          x: 25, y: 14, color: '#7F1D1D' },

  // ─── LOUNGE (linhas 19-22, colunas 2-11) ─────────────────────────────────────
  { id: 'lounge-sofa-L',     type: 'sofa',         x: 3,  y: 20, direction: 2, color: '#1D4ED8' },
  { id: 'lounge-sofa-R',     type: 'sofa',         x: 9,  y: 20, direction: 6, color: '#1D4ED8' },
  { id: 'lounge-sofa-B',     type: 'sofa',         x: 6,  y: 22, direction: 0, color: '#1D4ED8' },
  { id: 'lounge-coffee',     type: 'coffee_table', x: 6,  y: 20, color: '#0F172A' },
  { id: 'lounge-rug',        type: 'rug',          x: 6,  y: 21, color: '#1E3A8A' },
  { id: 'lounge-pool',       type: 'pool_table',   x: 4,  y: 19 },
  { id: 'lounge-tv',         type: 'tv_screen',    x: 6,  y: 19, label: 'SENIOR TV' },
  { id: 'lounge-lamp1',      type: 'lamp',         x: 2,  y: 19 },
  { id: 'lounge-lamp2',      type: 'lamp',         x: 11, y: 19 },
  { id: 'lounge-plant1',     type: 'plant',        x: 2,  y: 22 },
  { id: 'lounge-plant2',     type: 'plant',        x: 11, y: 22 },
  { id: 'lounge-sign',       type: 'sign',         x: 6,  y: 19, label: 'LOUNGE' },
  { id: 'lounge-trash',      type: 'trash',        x: 11, y: 21 },

  // ─── COPA (linhas 19-22, colunas 15-21) ──────────────────────────────────────
  { id: 'copa-fridge',       type: 'fridge',            x: 16, y: 19 },
  { id: 'copa-coffee-mach',  type: 'coffee_machine',    x: 17, y: 19 },
  { id: 'copa-micro',        type: 'microwave',         x: 18, y: 19 },
  { id: 'copa-cabinet1',     type: 'cabinet',           x: 19, y: 19, color: '#475569' },
  { id: 'copa-cabinet2',     type: 'cabinet',           x: 20, y: 19, color: '#475569' },
  { id: 'copa-table',        type: 'coffee_table',      x: 18, y: 21, color: '#1E293B' },
  { id: 'copa-chair1',       type: 'chair',             x: 16, y: 21, direction: 2, color: '#475569' },
  { id: 'copa-chair2',       type: 'chair',             x: 20, y: 21, direction: 6, color: '#475569' },
  { id: 'copa-mug1',         type: 'mug',               x: 17, y: 20, color: '#F59E0B' },
  { id: 'copa-mug2',         type: 'mug',               x: 19, y: 20, color: '#EF4444' },
  { id: 'copa-mug3',         type: 'mug',               x: 18, y: 22, color: '#8B5CF6' },
  { id: 'copa-plant',        type: 'plant',             x: 15, y: 22 },
  { id: 'copa-trash',        type: 'trash',             x: 21, y: 22 },
  { id: 'copa-sign',         type: 'sign',              x: 18, y: 19, label: 'COPA' },
  { id: 'copa-lamp',         type: 'lamp',              x: 15, y: 19 },

  // ─── RECEPÇÃO (direita inferior, colunas 24-29, linhas 19-22) ────────────────
  { id: 'recep-desk',        type: 'desk',         x: 26, y: 20, direction: 0, color: '#0078D4' },
  { id: 'recep-chair',       type: 'chair',        x: 26, y: 21, direction: 0, color: '#0078D4' },
  { id: 'recep-sofa1',       type: 'sofa',         x: 25, y: 19, direction: 4, color: '#334155' },
  { id: 'recep-sofa2',       type: 'sofa',         x: 28, y: 19, direction: 4, color: '#334155' },
  { id: 'recep-coffee',      type: 'coffee_table', x: 27, y: 19, color: '#0F172A' },
  { id: 'recep-plant1',      type: 'plant',        x: 24, y: 19 },
  { id: 'recep-plant2',      type: 'plant',        x: 29, y: 19 },
  { id: 'recep-lamp',        type: 'lamp',         x: 29, y: 22 },
  { id: 'recep-sign',        type: 'sign',         x: 26, y: 19, label: 'RECEPÇÃO' },
  { id: 'recep-rug',         type: 'rug',          x: 27, y: 20, color: '#1E3A8A' },
  { id: 'recep-tv',          type: 'tv_screen',    x: 28, y: 21, label: 'SENIOR SCOUT' },

  // ─── PLANTAS E DECORAÇÃO CORREDORES ──────────────────────────────────────────
  { id: 'plant-cor-TL',      type: 'plant',        x: 2,  y: 2 },
  { id: 'plant-cor-TR',      type: 'plant',        x: 29, y: 2 },
  { id: 'plant-cor-BL',      type: 'plant',        x: 2,  y: 11 },
  { id: 'plant-cor-BR',      type: 'plant',        x: 29, y: 11 },
  { id: 'plant-cor-ML',      type: 'plant',        x: 2,  y: 18 },
  { id: 'plant-cor-MR',      type: 'plant',        x: 29, y: 18 },
  { id: 'ac-top-L',          type: 'ac_unit',      x: 5,  y: 2 },
  { id: 'ac-top-R',          type: 'ac_unit',      x: 23, y: 2 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 13 ESPECIALISTAS — Board Room do Senior Scout 360
// Figure strings únicas — cada especialista tem aparência visual distinta
// Formato: PARTE-ESTILO-COR (Habbo Imager)
// hd=cabeça/pele | hr=cabelo | ch=camisa | lg=calça | sh=sapato | cc=casaco | ea=óculos
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
    // Terno azul Microsoft, cabelo escuro curto, pele tom médio, executivo sênior
    figure: 'hd-180-2.hr-3163-61.ch-3030-110.lg-3023-110.sh-906-110.cc-3007-110',
  },
  {
    id: 'uncle_bob',
    name: 'Uncle Bob',
    realPerson: 'Robert C. Martin',
    role: 'CTO',
    specialty: 'arquitetura, SOLID, Clean Code, débito técnico',
    tone: 'rigoroso, direto, veta soluções ruins sem cerimônia',
    color: '#DC2626',
    // Cabelo branco curto, óculos, camisa vermelha, calça escura, professor clássico
    figure: 'hd-180-10.hr-890-61.ch-3030-62.lg-3023-92.sh-906-92.ea-1406-62',
  },
  {
    id: 'karpathy',
    name: 'Karpathy',
    realPerson: 'Andrej Karpathy',
    role: 'Arquiteto de IA',
    specialty: 'prompts, sistemas de IA, anti-alucinação, pipeline de prompts',
    tone: 'analítico, detalhista, orientado a evidências',
    color: '#7C3AED',
    // Hoodie roxo casual, cabelo escuro liso, jovem pesquisador IA
    figure: 'hd-180-1.hr-3163-92.ch-3114-113.lg-3023-92.sh-3114-92',
  },
  {
    id: 'rogati',
    name: 'Rogati',
    realPerson: 'Monica Rogati',
    role: 'Guardiã de Dados',
    specialty: 'qualidade de dados, entity resolution, validação, freshness',
    tone: 'cética construtiva, pergunta antes de afirmar',
    color: '#059669',
    // Visual feminino profissional, cabelo castanho ondulado, blazer verde
    figure: 'hd-600-2.hr-3012-33.ch-3030-78.lg-3023-78.sh-906-78',
  },
  {
    id: 'osmani',
    name: 'Osmani',
    realPerson: 'Addy Osmani',
    role: 'Líder de UX',
    specialty: 'performance percebida, mobile-first, loading, web vitals',
    tone: 'empático, visual, orientado ao usuário final',
    color: '#F59E0B',
    // Visual casual tech, óculos redondos, camisa amarela, cabelo curto
    figure: 'hd-180-3.hr-3163-30.ch-3030-82.lg-3023-82.sh-906-82.ea-3168-82',
  },
  {
    id: 'whittaker',
    name: 'Whittaker',
    realPerson: 'James Whittaker',
    role: 'QA & Segurança',
    specialty: 'edge cases, erros, LGPD, robustez, attack surfaces',
    tone: 'questionador, preventivo, não deixa passar nada',
    color: '#EF4444',
    // Terno vermelho, expressão séria, cabelo escuro, QA inspector
    figure: 'hd-180-4.hr-3163-16.ch-3030-62.lg-3023-62.sh-906-62.cc-3007-62',
  },
  {
    id: 'dixon',
    name: 'Dixon',
    realPerson: 'Matt Dixon',
    role: 'Estrategista Comercial',
    specialty: 'Challenger Sale, ROI, MEDDPICC, JOLT Effect',
    tone: 'pragmático, orientado a negócio, fala em impacto real',
    color: '#06B6D4',
    // Terno executivo azul-ciano, gravata, visual vendas corporativo
    figure: 'hd-180-5.hr-3163-61.ch-3030-110.lg-3023-110.sh-906-110.cc-3007-110',
  },
  {
    id: 'dodds',
    name: 'Dodds',
    realPerson: 'Kent C. Dodds',
    role: 'Dev Senior',
    specialty: 'TypeScript, React, Next.js, código completo, testes',
    tone: 'executor, objetivo, entrega sem atalhos',
    color: '#EC4899',
    // Dev casual, moletom rosa/magenta, calça jeans, jovem desenvolvedor
    figure: 'hd-180-1.hr-3012-16.ch-3114-75.lg-3023-90.sh-3114-75',
  },
  {
    id: 'rauch',
    name: 'Rauch',
    realPerson: 'Guillermo Rauch',
    role: 'Engenheiro de Infra',
    specialty: 'serverless, Vercel, APIs externas, retry, cache',
    tone: 'sistemático, preventivo, pensa em escala',
    color: '#171717',
    // Todo preto — visual Vercel/dark mode, moletom preto, calça preta
    figure: 'hd-180-1.hr-3163-16.ch-3114-16.lg-3023-16.sh-3114-16',
  },
  {
    id: 'rodrigues',
    name: 'Rodrigues',
    realPerson: 'Roberto Rodrigues',
    role: 'Especialista Agro',
    specialty: 'agronegócio brasileiro, sazonalidade, regulação, cooperativas',
    tone: 'experiente, prático, corrige estereótipos com vivência',
    color: '#16A34A',
    // Terno verde agro, cabelo grisalho, visual ministerial sênior brasileiro
    figure: 'hd-180-7.hr-890-16.ch-3030-78.lg-3023-78.sh-906-78.cc-3007-78',
  },
  {
    id: 'kozyrkov',
    name: 'Kozyrkov',
    realPerson: 'Cassie Kozyrkov',
    role: 'Cientista de Decisão',
    specialty: 'Score PORTA, validação estatística, backtesting, confiança',
    tone: 'analítica, questionadora, baseada em dados',
    color: '#8B5CF6',
    // Visual científico feminino, cabelo loiro, blazer roxo, óculos
    figure: 'hd-600-1.hr-3012-30.ch-3030-113.lg-3023-113.sh-906-113.ea-1406-82',
  },
  {
    id: 'cagan',
    name: 'Cagan',
    realPerson: 'Marty Cagan',
    role: 'Líder de Produto',
    specialty: 'product discovery, priorização, métricas, roadmap',
    tone: 'focado, elimina desperdício, \"apaixone-se pelo problema\"',
    color: '#F97316',
    // Casual product manager, camisa laranja, cabelo grisalho, sem gravata
    figure: 'hd-180-8.hr-890-33.ch-3030-82.lg-3023-82.sh-906-82',
  },
  {
    id: 'grove',
    name: 'Grove',
    realPerson: 'Andy Grove',
    role: 'Verificador de Realidade',
    specialty: 'viabilidade interna, adoção, budget, realidade operacional',
    tone: 'confrontador construtivo, fala por último, \"só os paranoicos sobrevivem\"',
    color: '#64748B',
    // Terno cinza conservador, óculos, cabelo branco, executivo sênior Intel
    figure: 'hd-180-10.hr-890-61.ch-3030-92.lg-3023-92.sh-906-92.cc-3007-92.ea-1406-61',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// POSIÇÕES DOS ESPECIALISTAS NAS MESAS
// ═══════════════════════════════════════════════════════════════════════════════

export const specialistDeskPositions: Record<string, { x: number; y: number; direction: number }> = {
  // Diretoria (topo direita)
  satya:      { x: 25, y: 3,  direction: 2 },
  cagan:      { x: 25, y: 6,  direction: 2 },
  grove:      { x: 25, y: 9,  direction: 2 },
  // Engenharia (centro topo)
  uncle_bob:  { x: 18, y: 3,  direction: 2 },
  dodds:      { x: 18, y: 5,  direction: 2 },
  rauch:      { x: 20, y: 7,  direction: 2 },
  // Open Space — Ilha A (Data & IA)
  karpathy:   { x: 5,  y: 13, direction: 6 },
  rogati:     { x: 5,  y: 15, direction: 6 },
  // Open Space — Ilha B
  kozyrkov:   { x: 11, y: 13, direction: 6 },
  osmani:     { x: 11, y: 15, direction: 6 },
  // Open Space — Ilha C (Vendas & Agro)
  dixon:      { x: 17, y: 13, direction: 2 },
  rodrigues:  { x: 17, y: 15, direction: 2 },
  // Open Space — Ilha D (QA)
  whittaker:  { x: 24, y: 13, direction: 2 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// POSIÇÕES NA SALA DE REUNIÃO (para convocação)
// ═══════════════════════════════════════════════════════════════════════════════

export const meetingPositions = [
  { x: 9,  y: 4,  dir: 4 },
  { x: 10, y: 4,  dir: 4 },
  { x: 11, y: 4,  dir: 4 },
  { x: 12, y: 4,  dir: 4 },
  { x: 13, y: 4,  dir: 4 },
  { x: 9,  y: 8,  dir: 0 },
  { x: 10, y: 8,  dir: 0 },
  { x: 11, y: 8,  dir: 0 },
  { x: 12, y: 8,  dir: 0 },
  { x: 13, y: 8,  dir: 0 },
  { x: 8,  y: 6,  dir: 2 },
  { x: 14, y: 6,  dir: 6 },
  { x: 8,  y: 7,  dir: 2 },
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
