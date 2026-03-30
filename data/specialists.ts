import { Specialist, Furniture } from '@/types';

export const furniture: Furniture[] = [
  // ─── ALA ESQUERDA: Carlos, Marcos, Sophia, Andre ───
  { id: 'desk-carlos',  type: 'desk',  x: 4,  y: 3,  direction: 2, color: '#EF4444' },
  { id: 'chair-carlos', type: 'chair', x: 5,  y: 3,  direction: 6, color: '#EF4444' },

  { id: 'desk-marcos',  type: 'desk',  x: 4,  y: 6,  direction: 2, color: '#06B6D4' },
  { id: 'chair-marcos', type: 'chair', x: 5,  y: 6,  direction: 6, color: '#06B6D4' },

  { id: 'desk-sophia',  type: 'desk',  x: 4,  y: 9,  direction: 2, color: '#8B5CF6' },
  { id: 'chair-sophia', type: 'chair', x: 5,  y: 9,  direction: 6, color: '#8B5CF6' },

  { id: 'desk-andre',   type: 'desk',  x: 4,  y: 12, direction: 2, color: '#3B82F6' },
  { id: 'chair-andre',  type: 'chair', x: 5,  y: 12, direction: 6, color: '#3B82F6' },

  // Prateleiras e lâmpadas — ala esquerda
  { id: 'shelf-L1',  type: 'bookshelf', x: 3, y: 4  },
  { id: 'shelf-L2',  type: 'bookshelf', x: 3, y: 10 },
  { id: 'lamp-L1',   type: 'lamp',      x: 3, y: 2  },
  { id: 'trash-L1',  type: 'trash',     x: 6, y: 4  },
  { id: 'trash-L2',  type: 'trash',     x: 6, y: 10 },

  // ─── ALA DIREITA: Diego, Raquel, Helena, Victor ───
  { id: 'desk-diego',   type: 'desk',  x: 20, y: 3,  direction: 6, color: '#10B981' },
  { id: 'chair-diego',  type: 'chair', x: 19, y: 3,  direction: 2, color: '#10B981' },

  { id: 'desk-raquel',  type: 'desk',  x: 20, y: 6,  direction: 6, color: '#F59E0B' },
  { id: 'chair-raquel', type: 'chair', x: 19, y: 6,  direction: 2, color: '#F59E0B' },

  { id: 'desk-helena',  type: 'desk',  x: 20, y: 9,  direction: 6, color: '#EC4899' },
  { id: 'chair-helena', type: 'chair', x: 19, y: 9,  direction: 2, color: '#EC4899' },

  { id: 'desk-victor',  type: 'desk',  x: 20, y: 12, direction: 6, color: '#F97316' },
  { id: 'chair-victor', type: 'chair', x: 19, y: 12, direction: 2, color: '#F97316' },

  // Prateleiras e lâmpadas — ala direita
  { id: 'shelf-R1',  type: 'bookshelf', x: 21, y: 4  },
  { id: 'shelf-R2',  type: 'bookshelf', x: 21, y: 10 },
  { id: 'lamp-R1',   type: 'lamp',      x: 21, y: 2  },
  { id: 'trash-R1',  type: 'trash',     x: 18, y: 4  },
  { id: 'trash-R2',  type: 'trash',     x: 18, y: 10 },

  // ─── SALA DE REUNIÃO CENTRAL ───
  { id: 'board-table',    type: 'table', x: 12, y: 8 },
  { id: 'board-chair-N1', type: 'chair', x: 11, y: 6,  direction: 4, color: '#334155' },
  { id: 'board-chair-N2', type: 'chair', x: 12, y: 6,  direction: 4, color: '#334155' },
  { id: 'board-chair-N3', type: 'chair', x: 13, y: 6,  direction: 4, color: '#334155' },
  { id: 'board-chair-S1', type: 'chair', x: 11, y: 10, direction: 0, color: '#334155' },
  { id: 'board-chair-S2', type: 'chair', x: 12, y: 10, direction: 0, color: '#334155' },
  { id: 'board-chair-S3', type: 'chair', x: 13, y: 10, direction: 0, color: '#334155' },
  { id: 'board-chair-W',  type: 'chair', x: 10, y: 8,  direction: 2, color: '#334155' },
  { id: 'board-chair-E',  type: 'chair', x: 14, y: 8,  direction: 6, color: '#334155' },

  // Whiteboard e tapete da sala de reunião
  { id: 'board-whiteboard', type: 'whiteboard', x: 12, y: 4, direction: 4 },
  { id: 'board-rug',        type: 'rug',        x: 12, y: 8, color: '#1D4ED8' },
  { id: 'lamp-meeting-L',   type: 'lamp',       x: 9,  y: 5 },
  { id: 'lamp-meeting-R',   type: 'lamp',       x: 15, y: 5 },

  // ─── RECEPÇÃO (canto inferior esquerdo) ───
  { id: 'rec-desk',  type: 'desk',  x: 5,  y: 18, direction: 4, color: '#94A3B8' },
  { id: 'rec-chair', type: 'chair', x: 5,  y: 19, direction: 0, color: '#94A3B8' },
  { id: 'rec-rug',   type: 'rug',   x: 5,  y: 18, color: '#475569' },

  // ─── LOUNGE (canto inferior direito) ───
  { id: 'lounge-sofa',   type: 'sofa',  x: 19, y: 18, direction: 6, color: '#1D4ED8' },
  { id: 'lounge-sofa2',  type: 'sofa',  x: 19, y: 20, direction: 6, color: '#1D4ED8' },
  { id: 'lounge-rug',    type: 'rug',   x: 19, y: 19, color: '#1E3A8A' },
  { id: 'lounge-lamp',   type: 'lamp',  x: 21, y: 17 },
  { id: 'lounge-plant',  type: 'plant', x: 21, y: 21 },

  // ─── DIVISORES VISUAIS DE ZONA ───
  { id: 'div-top-1', type: 'divider', x: 2,  y: 14 },
  { id: 'div-top-2', type: 'divider', x: 4,  y: 14 },
  { id: 'div-top-3', type: 'divider', x: 18, y: 14 },
  { id: 'div-top-4', type: 'divider', x: 20, y: 14 },

  // ─── PLANTAS DECORATIVAS ───
  { id: 'plant-TL',  type: 'plant', x: 2,  y: 2  },
  { id: 'plant-TR',  type: 'plant', x: 22, y: 2  },
  { id: 'plant-BL',  type: 'plant', x: 2,  y: 20 },
  { id: 'plant-BR',  type: 'plant', x: 22, y: 20 },
  { id: 'plant-TC',  type: 'plant', x: 12, y: 2  },
  { id: 'plant-ML1', type: 'plant', x: 6,  y: 14 },
  { id: 'plant-MR1', type: 'plant', x: 16, y: 14 },
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
