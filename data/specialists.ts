import { Specialist, RoomConfig, Furniture } from '@/types';

export const rooms: RoomConfig[] = [
  { id: 'board_room', name: 'Board Room', gridArea: '2 / 14 / 12 / 28' },
  { id: 'strategy', name: 'Sala de Estratégia', gridArea: '2 / 2 / 16 / 12' },
  { id: 'data', name: 'Sala de IA & Dados', gridArea: '2 / 30 / 16 / 40' },
  { id: 'lounge', name: 'Lounge', gridArea: '16 / 14 / 26 / 28' },
  { id: 'product', name: 'Sala de Produto', gridArea: '20 / 2 / 34 / 12' },
  { id: 'engineering', name: 'Sala de Engenharia', gridArea: '20 / 30 / 34 / 40' },
  { id: 'reception', name: 'Recepção', gridArea: '30 / 14 / 40 / 28' },
];

export const furniture: Furniture[] = [
  // Board Room
  { id: 'board-table-1', type: 'table', gridArea: '5 / 18 / 9 / 24' },
  { id: 'board-chair-1', type: 'chair', gridArea: '4 / 20 / 5 / 21' },
  { id: 'board-chair-2', type: 'chair', gridArea: '9 / 20 / 10 / 21' },
  { id: 'board-chair-3', type: 'chair', gridArea: '6 / 17 / 7 / 18' },
  { id: 'board-chair-4', type: 'chair', gridArea: '6 / 24 / 7 / 25' },
  { id: 'board-whiteboard-1', type: 'whiteboard', gridArea: '2 / 18 / 3 / 24' },
  { id: 'board-plant-1', type: 'plant', gridArea: '10 / 26 / 11 / 27' },

  // Strategy Room
  { id: 'strat-desk-1', type: 'desk', gridArea: '6 / 4 / 8 / 8', color: '#475569' },
  { id: 'strat-chair-1', type: 'chair', gridArea: '5 / 5 / 6 / 6' },
  { id: 'strat-plant-1', type: 'plant', gridArea: '3 / 3 / 4 / 4' },
  { id: 'strat-shelf-1', type: 'shelf', gridArea: '2 / 8 / 6 / 9' },
  { id: 'strat-whiteboard-1', type: 'whiteboard', gridArea: '2 / 4 / 3 / 8' },
  { id: 'strat-sofa-1', type: 'sofa', gridArea: '12 / 4 / 14 / 8' },
  { id: 'strat-cabinet-1', type: 'filing_cabinet', gridArea: '2 / 2 / 3 / 4' },
  
  // Data Room
  { id: 'data-desk-1', type: 'desk', gridArea: '6 / 32 / 8 / 36', color: '#334155' },
  { id: 'data-chair-1', type: 'chair', gridArea: '5 / 33 / 6 / 34' },
  { id: 'data-monitor-1', type: 'monitor', gridArea: '6 / 33 / 7 / 34' },
  { id: 'data-plant-1', type: 'plant', gridArea: '2 / 38 / 3 / 39' },
  { id: 'data-whiteboard-1', type: 'whiteboard', gridArea: '2 / 32 / 3 / 36' },
  { id: 'data-cooler-1', type: 'water_cooler', gridArea: '14 / 38 / 15 / 39' },
  { id: 'data-cabinet-1', type: 'filing_cabinet', gridArea: '2 / 30 / 3 / 32' },

  // Lounge
  { id: 'lounge-sofa-1', type: 'sofa', gridArea: '18 / 18 / 20 / 24' },
  { id: 'lounge-table-1', type: 'table', gridArea: '21 / 20 / 23 / 22' },
  { id: 'lounge-plant-1', type: 'plant', gridArea: '17 / 15 / 18 / 16' },
  { id: 'lounge-plant-2', type: 'plant', gridArea: '17 / 26 / 18 / 27' },
  { id: 'lounge-coffee-1', type: 'coffee', gridArea: '21 / 20 / 22 / 21' },

  // Product Room
  { id: 'prod-desk-1', type: 'desk', gridArea: '24 / 4 / 26 / 8', color: '#475569' },
  { id: 'prod-chair-1', type: 'chair', gridArea: '23 / 5 / 24 / 6' },
  { id: 'prod-plant-1', type: 'plant', gridArea: '32 / 3 / 33 / 4' },
  { id: 'prod-shelf-1', type: 'shelf', gridArea: '20 / 8 / 24 / 9' },
  { id: 'prod-whiteboard-1', type: 'whiteboard', gridArea: '20 / 4 / 21 / 8' },
  { id: 'prod-table-1', type: 'table', gridArea: '30 / 8 / 32 / 10' },

  // Engineering Room
  { id: 'eng-desk-1', type: 'desk', gridArea: '24 / 32 / 26 / 36', color: '#334155' },
  { id: 'eng-chair-1', type: 'chair', gridArea: '23 / 33 / 24 / 34' },
  { id: 'eng-laptop-1', type: 'laptop', gridArea: '24 / 34 / 25 / 35' },
  { id: 'eng-coffee-1', type: 'coffee', gridArea: '24 / 35 / 25 / 36' },
  { id: 'eng-plant-1', type: 'plant', gridArea: '32 / 38 / 33 / 39' },
  { id: 'eng-whiteboard-1', type: 'whiteboard', gridArea: '20 / 32 / 21 / 36' },
  { id: 'eng-sofa-1', type: 'sofa', gridArea: '30 / 32 / 32 / 36' },
  { id: 'eng-rack-1', type: 'server_rack', gridArea: '20 / 38 / 22 / 40' },

  // Reception
  { id: 'rec-desk-1', type: 'desk', gridArea: '34 / 18 / 36 / 24', color: '#1E293B' },
  { id: 'rec-chair-1', type: 'chair', gridArea: '33 / 20 / 34 / 21' },
  { id: 'rec-plant-1', type: 'plant', gridArea: '38 / 15 / 39 / 16' },
  { id: 'rec-plant-2', type: 'plant', gridArea: '38 / 26 / 39 / 27' },
  { id: 'rec-sofa-1', type: 'sofa', gridArea: '38 / 18 / 40 / 24' },

  // Corridors
  { id: 'cor-cooler-1', type: 'water_cooler', gridArea: '14 / 12 / 15 / 13' },
  { id: 'cor-plant-1', type: 'plant', gridArea: '14 / 28 / 15 / 29' },
  { id: 'cor-plant-2', type: 'plant', gridArea: '28 / 12 / 29 / 13' },
  { id: 'cor-plant-3', type: 'plant', gridArea: '28 / 28 / 29 / 29' },
];

export const specialists: Specialist[] = [
  {
    id: 'carlos',
    name: 'Carlos',
    role: 'CTO',
    specialty: 'arquitetura, escalabilidade, débito técnico',
    tone: 'direto, exigente, veta soluções ruins sem cerimônia',
    color: '#EF4444', // red
    roomId: 'strategy',
    gridArea: '10 / 4 / 11 / 5',
  },
  {
    id: 'marcos',
    name: 'Marcos',
    role: 'Estrategista Comercial',
    specialty: 'ROI, produto, mercado, vendas consultivas',
    tone: 'pragmático, orientado a negócio, fala em impacto real',
    color: '#06B6D4', // cyan
    roomId: 'strategy',
    gridArea: '12 / 8 / 13 / 9',
  },
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Arquiteta de IA',
    specialty: 'prompts, sistemas de IA, anti-alucinação, qualidade de output',
    tone: 'analítica, detalhista, orientada a evidências',
    color: '#8B5CF6', // purple
    roomId: 'data',
    gridArea: '10 / 32 / 11 / 33',
  },
  {
    id: 'andre',
    name: 'Andre',
    role: 'Engenheiro de Dados',
    specialty: 'qualidade de dados, validação, fontes, freshness',
    tone: 'cético construtivo, pergunta antes de afirmar',
    color: '#3B82F6', // blue
    roomId: 'data',
    gridArea: '12 / 36 / 13 / 37',
  },
  {
    id: 'diego',
    name: 'Diego',
    role: 'Lead UX/UI',
    specialty: 'experiência do usuário, performance percebida, fluxo visual',
    tone: 'empático, visual, orientado ao usuário final',
    color: '#10B981', // green
    roomId: 'product',
    gridArea: '28 / 4 / 29 / 5',
  },
  {
    id: 'raquel',
    name: 'Raquel',
    role: 'QA & Segurança',
    specialty: 'edge cases, erros, LGPD, robustez',
    tone: 'questionadora, preventiva, não deixa passar nada',
    color: '#F59E0B', // amber
    roomId: 'product',
    gridArea: '30 / 8 / 31 / 9',
  },
  {
    id: 'helena',
    name: 'Helena',
    role: 'Dev Senior',
    specialty: 'TypeScript, React, Next.js, código completo',
    tone: 'executora, objetiva, entrega sem atalhos',
    color: '#EC4899', // pink
    roomId: 'engineering',
    gridArea: '28 / 32 / 29 / 33',
  },
  {
    id: 'victor',
    name: 'Victor',
    role: 'Engenheiro de Infra',
    specialty: 'serverless, Vercel, APIs externas, retry, cache',
    tone: 'sistemático, preventivo, pensa em escala',
    color: '#F97316', // orange
    roomId: 'engineering',
    gridArea: '30 / 36 / 31 / 37',
  },
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
