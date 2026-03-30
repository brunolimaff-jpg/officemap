import { Specialist, Furniture } from '@/types';

export const furniture: Furniture[] = [
  // ─── ALA ESQUERDA: Carlos, Marcos, Sophia, Andre ───
  // Carlos (CTO) — desk top-left
  { id: 'desk-carlos',  type: 'desk',  x: 4,  y: 3,  direction: 2, color: '#EF4444' },
  { id: 'chair-carlos', type: 'chair', x: 5,  y: 3,  direction: 6 },

  // Marcos (Comercial)
  { id: 'desk-marcos',  type: 'desk',  x: 4,  y: 6,  direction: 2, color: '#06B6D4' },
  { id: 'chair-marcos', type: 'chair', x: 5,  y: 6,  direction: 6 },

  // Sophia (IA)
  { id: 'desk-sophia',  type: 'desk',  x: 4,  y: 9,  direction: 2, color: '#8B5CF6' },
  { id: 'chair-sophia', type: 'chair', x: 5,  y: 9,  direction: 6 },

  // Andre (Dados)
  { id: 'desk-andre',   type: 'desk',  x: 4,  y: 12, direction: 2, color: '#3B82F6' },
  { id: 'chair-andre',  type: 'chair', x: 5,  y: 12, direction: 6 },

  // ─── ALA DIREITA: Diego, Raquel, Helena, Victor ───
  // Diego (UX)
  { id: 'desk-diego',   type: 'desk',  x: 18, y: 3,  direction: 6, color: '#10B981' },
  { id: 'chair-diego',  type: 'chair', x: 17, y: 3,  direction: 2 },

  // Raquel (QA)
  { id: 'desk-raquel',  type: 'desk',  x: 18, y: 6,  direction: 6, color: '#F59E0B' },
  { id: 'chair-raquel', type: 'chair', x: 17, y: 6,  direction: 2 },

  // Helena (Dev)
  { id: 'desk-helena',  type: 'desk',  x: 18, y: 9,  direction: 6, color: '#EC4899' },
  { id: 'chair-helena', type: 'chair', x: 17, y: 9,  direction: 2 },

  // Victor (Infra)
  { id: 'desk-victor',  type: 'desk',  x: 18, y: 12, direction: 6, color: '#F97316' },
  { id: 'chair-victor', type: 'chair', x: 17, y: 12, direction: 2 },

  // ─── SALA DE REUNIÃO CENTRAL ───
  { id: 'board-table',    type: 'table', x: 11, y: 8 },
  // 8 cadeiras ao redor
  { id: 'board-chair-N1', type: 'chair', x: 10, y: 7,  direction: 4 },
  { id: 'board-chair-N2', type: 'chair', x: 11, y: 7,  direction: 4 },
  { id: 'board-chair-N3', type: 'chair', x: 12, y: 7,  direction: 4 },
  { id: 'board-chair-S1', type: 'chair', x: 10, y: 9,  direction: 0 },
  { id: 'board-chair-S2', type: 'chair', x: 11, y: 9,  direction: 0 },
  { id: 'board-chair-S3', type: 'chair', x: 12, y: 9,  direction: 0 },
  { id: 'board-chair-W',  type: 'chair', x: 10, y: 8,  direction: 0 },
  { id: 'board-chair-E',  type: 'chair', x: 12, y: 8,  direction: 4 },

  // Whiteboard
  { id: 'board-whiteboard', type: 'whiteboard', x: 11, y: 5, direction: 4 },

  // ─── RECEPÇÃO (canto inferior esquerdo) ───
  { id: 'rec-desk',  type: 'desk',  x: 5,  y: 17, direction: 4 },
  { id: 'rec-chair', type: 'chair', x: 5,  y: 18, direction: 0 },

  // ─── LOUNGE (canto inferior direito) ───
  { id: 'lounge-sofa', type: 'sofa', x: 17, y: 17, direction: 6 },

  // ─── PLANTAS DECORATIVAS ───
  { id: 'plant-TL', type: 'plant', x: 3,  y: 2  },
  { id: 'plant-TR', type: 'plant', x: 20, y: 2  },
  { id: 'plant-BL', type: 'plant', x: 3,  y: 18 },
  { id: 'plant-BR', type: 'plant', x: 20, y: 18 },
  { id: 'plant-TC', type: 'plant', x: 11, y: 2  },
  { id: 'plant-BC', type: 'plant', x: 11, y: 18 },
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

// Posições fixas de cada especialista no escritório (desk)
export const specialistDeskPositions: Record<string, { x: number; y: number; direction: number }> = {
  carlos:  { x: 5,  y: 3,  direction: 6 },
  marcos:  { x: 5,  y: 6,  direction: 6 },
  sophia:  { x: 5,  y: 9,  direction: 6 },
  andre:   { x: 5,  y: 12, direction: 6 },
  diego:   { x: 17, y: 3,  direction: 2 },
  raquel:  { x: 17, y: 6,  direction: 2 },
  helena:  { x: 17, y: 9,  direction: 2 },
  victor:  { x: 17, y: 12, direction: 2 },
};

// 8 posições ao redor da mesa de reunião central
export const meetingPositions = [
  { x: 10, y: 7,  dir: 4 },
  { x: 11, y: 7,  dir: 4 },
  { x: 12, y: 7,  dir: 4 },
  { x: 10, y: 9,  dir: 0 },
  { x: 11, y: 9,  dir: 0 },
  { x: 12, y: 9,  dir: 0 },
  { x: 10, y: 8,  dir: 2 },
  { x: 12, y: 8,  dir: 6 },
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
