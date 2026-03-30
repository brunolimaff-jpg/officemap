import { Specialist, Furniture } from '@/types';

export const furniture: Furniture[] = [

  // ─── ALA ESQUERDA: Carlos, Marcos, Sophia, Andre ───────────────────────────
  { id: 'desk-carlos',     type: 'desk',     x: 4,  y: 3,  direction: 2, color: '#EF4444' },
  { id: 'chair-carlos',   type: 'chair',    x: 5,  y: 3,  direction: 6, color: '#EF4444' },
  { id: 'pc-carlos',      type: 'computer', x: 4,  y: 3,  direction: 2 },
  { id: 'mug-carlos',     type: 'mug',      x: 4,  y: 3,  color: '#EF4444' },

  { id: 'desk-marcos',    type: 'desk',     x: 4,  y: 6,  direction: 2, color: '#06B6D4' },
  { id: 'chair-marcos',   type: 'chair',    x: 5,  y: 6,  direction: 6, color: '#06B6D4' },
  { id: 'pc-marcos',      type: 'computer', x: 4,  y: 6,  direction: 2 },
  { id: 'mug-marcos',     type: 'mug',      x: 4,  y: 6,  color: '#06B6D4' },

  { id: 'desk-sophia',    type: 'desk',     x: 4,  y: 9,  direction: 2, color: '#8B5CF6' },
  { id: 'chair-sophia',   type: 'chair',    x: 5,  y: 9,  direction: 6, color: '#8B5CF6' },
  { id: 'pc-sophia',      type: 'computer', x: 4,  y: 9,  direction: 2 },
  { id: 'mug-sophia',     type: 'mug',      x: 4,  y: 9,  color: '#8B5CF6' },

  { id: 'desk-andre',     type: 'desk',     x: 4,  y: 12, direction: 2, color: '#3B82F6' },
  { id: 'chair-andre',    type: 'chair',    x: 5,  y: 12, direction: 6, color: '#3B82F6' },
  { id: 'pc-andre',       type: 'computer', x: 4,  y: 12, direction: 2 },
  { id: 'mug-andre',      type: 'mug',      x: 4,  y: 12, color: '#3B82F6' },

  // Mobiliário ala esquerda
  { id: 'shelf-L1',       type: 'bookshelf', x: 3, y: 4  },
  { id: 'shelf-L2',       type: 'bookshelf', x: 3, y: 10 },
  { id: 'cabinet-L1',     type: 'cabinet',   x: 3, y: 7,  color: '#334155' },
  { id: 'lamp-L1',        type: 'lamp',      x: 3, y: 2  },
  { id: 'lamp-L2',        type: 'lamp',      x: 3, y: 13 },
  { id: 'trash-L1',       type: 'trash',     x: 6, y: 4  },
  { id: 'trash-L2',       type: 'trash',     x: 6, y: 10 },

  // ─── ALA DIREITA: Diego, Raquel, Helena, Victor ─────────────────────────────
  { id: 'desk-diego',     type: 'desk',     x: 20, y: 3,  direction: 6, color: '#10B981' },
  { id: 'chair-diego',    type: 'chair',    x: 19, y: 3,  direction: 2, color: '#10B981' },
  { id: 'pc-diego',       type: 'computer', x: 20, y: 3,  direction: 6 },
  { id: 'mug-diego',      type: 'mug',      x: 20, y: 3,  color: '#10B981' },

  { id: 'desk-raquel',    type: 'desk',     x: 20, y: 6,  direction: 6, color: '#F59E0B' },
  { id: 'chair-raquel',   type: 'chair',    x: 19, y: 6,  direction: 2, color: '#F59E0B' },
  { id: 'pc-raquel',      type: 'computer', x: 20, y: 6,  direction: 6 },
  { id: 'mug-raquel',     type: 'mug',      x: 20, y: 6,  color: '#F59E0B' },

  { id: 'desk-helena',    type: 'desk',     x: 20, y: 9,  direction: 6, color: '#EC4899' },
  { id: 'chair-helena',   type: 'chair',    x: 19, y: 9,  direction: 2, color: '#EC4899' },
  { id: 'pc-helena',      type: 'computer', x: 20, y: 9,  direction: 6 },
  { id: 'mug-helena',     type: 'mug',      x: 20, y: 9,  color: '#EC4899' },

  { id: 'desk-victor',    type: 'desk',     x: 20, y: 12, direction: 6, color: '#F97316' },
  { id: 'chair-victor',   type: 'chair',    x: 19, y: 12, direction: 2, color: '#F97316' },
  { id: 'pc-victor',      type: 'computer', x: 20, y: 12, direction: 6 },
  { id: 'mug-victor',     type: 'mug',      x: 20, y: 12, color: '#F97316' },

  // Mobiliário ala direita
  { id: 'shelf-R1',       type: 'bookshelf', x: 21, y: 4  },
  { id: 'shelf-R2',       type: 'bookshelf', x: 21, y: 10 },
  { id: 'cabinet-R1',     type: 'cabinet',   x: 21, y: 7,  color: '#334155' },
  { id: 'lamp-R1',        type: 'lamp',      x: 21, y: 2  },
  { id: 'lamp-R2',        type: 'lamp',      x: 21, y: 13 },
  { id: 'trash-R1',       type: 'trash',     x: 18, y: 4  },
  { id: 'trash-R2',       type: 'trash',     x: 18, y: 10 },

  // ─── SALA DE REUNIÃO CENTRAL ─────────────────────────────────────────────────
  { id: 'board-table',        type: 'table',      x: 12, y: 8 },
  { id: 'board-chair-N1',     type: 'chair',      x: 11, y: 6,  direction: 4, color: '#334155' },
  { id: 'board-chair-N2',     type: 'chair',      x: 12, y: 6,  direction: 4, color: '#334155' },
  { id: 'board-chair-N3',     type: 'chair',      x: 13, y: 6,  direction: 4, color: '#334155' },
  { id: 'board-chair-S1',     type: 'chair',      x: 11, y: 10, direction: 0, color: '#334155' },
  { id: 'board-chair-S2',     type: 'chair',      x: 12, y: 10, direction: 0, color: '#334155' },
  { id: 'board-chair-S3',     type: 'chair',      x: 13, y: 10, direction: 0, color: '#334155' },
  { id: 'board-chair-W',      type: 'chair',      x: 10, y: 8,  direction: 2, color: '#334155' },
  { id: 'board-chair-E',      type: 'chair',      x: 14, y: 8,  direction: 6, color: '#334155' },
  { id: 'board-whiteboard',   type: 'whiteboard', x: 12, y: 4,  direction: 4 },
  { id: 'board-rug',          type: 'rug',        x: 12, y: 8,  color: '#1D4ED8' },
  { id: 'lamp-meeting-L',     type: 'lamp',       x: 9,  y: 5  },
  { id: 'lamp-meeting-R',     type: 'lamp',       x: 15, y: 5  },
  { id: 'mug-meeting-1',      type: 'mug',        x: 11, y: 8,  color: '#94A3B8' },
  { id: 'mug-meeting-2',      type: 'mug',        x: 13, y: 8,  color: '#94A3B8' },

  // ─── RECEPÇÃO ────────────────────────────────────────────────────────────────
  { id: 'rec-desk',           type: 'desk',         x: 5,  y: 18, direction: 4, color: '#94A3B8' },
  { id: 'rec-chair',          type: 'chair',        x: 5,  y: 19, direction: 0, color: '#94A3B8' },
  { id: 'rec-pc',             type: 'computer',     x: 5,  y: 18, direction: 4 },
  { id: 'rec-rug',            type: 'rug',          x: 5,  y: 18, color: '#475569' },
  { id: 'rec-couch-1',        type: 'couch',        x: 3,  y: 20, direction: 6, color: '#1E40AF' },
  { id: 'rec-couch-2',        type: 'couch',        x: 7,  y: 20, direction: 2, color: '#1E40AF' },
  { id: 'rec-coffee',         type: 'coffee_table', x: 5,  y: 21, color: '#1E293B' },
  { id: 'rec-plant-1',        type: 'plant',        x: 2,  y: 18 },
  { id: 'rec-plant-2',        type: 'plant',        x: 8,  y: 18 },
  { id: 'rec-lamp',           type: 'lamp',         x: 2,  y: 20 },
  { id: 'rec-mug-1',          type: 'mug',          x: 5,  y: 21, color: '#F1F5F9' },
  { id: 'rec-cabinet',        type: 'cabinet',      x: 2,  y: 22, color: '#334155' },

  // ─── COPA ────────────────────────────────────────────────────────────────────
  { id: 'copa-cabinet-1',     type: 'cabinet',      x: 20, y: 18, color: '#475569' },
  { id: 'copa-cabinet-2',     type: 'cabinet',      x: 21, y: 18, color: '#475569' },
  { id: 'copa-coffee',        type: 'coffee_table', x: 20, y: 20, color: '#1E293B' },
  { id: 'copa-mug-1',         type: 'mug',          x: 20, y: 18, color: '#F59E0B' },
  { id: 'copa-mug-2',         type: 'mug',          x: 21, y: 18, color: '#EF4444' },
  { id: 'copa-mug-3',         type: 'mug',          x: 20, y: 20, color: '#8B5CF6' },
  { id: 'copa-plant',         type: 'plant',        x: 22, y: 20 },
  { id: 'copa-lamp',          type: 'lamp',         x: 22, y: 18 },
  { id: 'copa-trash',         type: 'trash',        x: 19, y: 20 },

  // ─── LOUNGE ──────────────────────────────────────────────────────────────────
  { id: 'lounge-couch-1',     type: 'couch',        x: 18, y: 22, direction: 6, color: '#1D4ED8' },
  { id: 'lounge-couch-2',     type: 'couch',        x: 20, y: 22, direction: 2, color: '#1D4ED8' },
  { id: 'lounge-coffee',      type: 'coffee_table', x: 19, y: 23, color: '#0F172A' },
  { id: 'lounge-rug',         type: 'rug',          x: 19, y: 22, color: '#1E3A8A' },
  { id: 'lounge-lamp-1',      type: 'lamp',         x: 17, y: 21 },
  { id: 'lounge-lamp-2',      type: 'lamp',         x: 22, y: 21 },
  { id: 'lounge-plant-1',     type: 'plant',        x: 17, y: 23 },
  { id: 'lounge-plant-2',     type: 'plant',        x: 22, y: 23 },
  { id: 'lounge-mug-1',       type: 'mug',          x: 19, y: 23, color: '#F1F5F9' },

  // ─── DIVISORES DE ZONA ───────────────────────────────────────────────────────
  { id: 'div-top-1',  type: 'divider', x: 2,  y: 14 },
  { id: 'div-top-2',  type: 'divider', x: 4,  y: 14 },
  { id: 'div-top-3',  type: 'divider', x: 18, y: 14 },
  { id: 'div-top-4',  type: 'divider', x: 20, y: 14 },
  { id: 'div-mid-1',  type: 'divider', x: 8,  y: 16 },
  { id: 'div-mid-2',  type: 'divider', x: 14, y: 16 },

  // ─── PLANTAS DECORATIVAS ─────────────────────────────────────────────────────
  { id: 'plant-TL',   type: 'plant', x: 2,  y: 2  },
  { id: 'plant-TR',   type: 'plant', x: 22, y: 2  },
  { id: 'plant-BL',   type: 'plant', x: 2,  y: 16 },
  { id: 'plant-BR',   type: 'plant', x: 22, y: 16 },
  { id: 'plant-TC',   type: 'plant', x: 12, y: 2  },
  { id: 'plant-ML1',  type: 'plant', x: 6,  y: 14 },
  { id: 'plant-MR1',  type: 'plant', x: 16, y: 14 },
  { id: 'plant-C1',   type: 'plant', x: 9,  y: 16 },
  { id: 'plant-C2',   type: 'plant', x: 15, y: 16 },
];

export const specialists: Specialist[] = [
  {
    id: 'carlos',
    name: 'Carlos',
    role: 'CTO',
    specialty: 'arquitetura, escalabilidade, débito técnico',
    tone: 'direto, exigente, veta soluções ruins sem cerimônia',
    color: '#EF4444',
  },
  {
    id: 'marcos',
    name: 'Marcos',
    role: 'Estrategista Comercial',
    specialty: 'ROI, produto, mercado, vendas consultivas',
    tone: 'pragmático, orientado a negócio, fala em impacto real',
    color: '#06B6D4',
  },
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Arquiteta de IA',
    specialty: 'prompts, sistemas de IA, anti-alucinação, qualidade de output',
    tone: 'analítica, detalhista, orientada a evidências',
    color: '#8B5CF6',
  },
  {
    id: 'andre',
    name: 'Andre',
    role: 'Engenheiro de Dados',
    specialty: 'qualidade de dados, validação, fontes, freshness',
    tone: 'cético construtivo, pergunta antes de afirmar',
    color: '#3B82F6',
  },
  {
    id: 'diego',
    name: 'Diego',
    role: 'Lead UX/UI',
    specialty: 'experiência do usuário, performance percebida, fluxo visual',
    tone: 'empático, visual, orientado ao usuário final',
    color: '#10B981',
  },
  {
    id: 'raquel',
    name: 'Raquel',
    role: 'QA & Segurança',
    specialty: 'edge cases, erros, LGPD, robustez',
    tone: 'questionadora, preventiva, não deixa passar nada',
    color: '#F59E0B',
  },
  {
    id: 'helena',
    name: 'Helena',
    role: 'Dev Senior',
    specialty: 'TypeScript, React, Next.js, código completo',
    tone: 'executora, objetiva, entrega sem atalhos',
    color: '#EC4899',
  },
  {
    id: 'victor',
    name: 'Victor',
    role: 'Engenheiro de Infra',
    specialty: 'serverless, Vercel, APIs externas, retry, cache',
    tone: 'sistemático, preventivo, pensa em escala',
    color: '#F97316',
  },
];

export const specialistDeskPositions: Record<string, { x: number; y: number; direction: number }> = {
  carlos:  { x: 5,  y: 3,  direction: 6 },
  marcos:  { x: 5,  y: 6,  direction: 6 },
  sophia:  { x: 5,  y: 9,  direction: 6 },
  andre:   { x: 5,  y: 12, direction: 6 },
  diego:   { x: 19, y: 3,  direction: 2 },
  raquel:  { x: 19, y: 6,  direction: 2 },
  helena:  { x: 19, y: 9,  direction: 2 },
  victor:  { x: 19, y: 12, direction: 2 },
};

export const meetingPositions = [
  { x: 11, y: 6,  dir: 4 },
  { x: 12, y: 6,  dir: 4 },
  { x: 13, y: 6,  dir: 4 },
  { x: 11, y: 10, dir: 0 },
  { x: 12, y: 10, dir: 0 },
  { x: 13, y: 10, dir: 0 },
  { x: 10, y: 8,  dir: 2 },
  { x: 14, y: 8,  dir: 6 },
];

export function getSpecialistPrompt(specialist: Specialist): string {
  return `Você é ${specialist.name}, ${specialist.role} do Board Room — escritório virtual de Bruno Lima, economista e especialista em tecnologia para agronegócio.

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
