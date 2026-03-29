import { Specialist, RoomConfig, Furniture } from '@/types';

export const rooms: RoomConfig[] = [
  { id: 'reception', name: 'Recepção', gridArea: '29 / 12 / 33 / 22' },
  { id: 'strategy', name: 'Sala de Estratégia', gridArea: '2 / 2 / 14 / 14' },
  { id: 'data', name: 'Sala de IA & Dados', gridArea: '2 / 16 / 14 / 28' },
  { id: 'product', name: 'Sala de Produto', gridArea: '16 / 2 / 28 / 14' },
  { id: 'engineering', name: 'Sala de Engenharia', gridArea: '16 / 16 / 28 / 28' },
];

export const furniture: Furniture[] = [
  // Strategy Room
  { id: 'strat-desk-1', type: 'desk', gridArea: '4 / 4 / 6 / 8', color: '#475569' },
  { id: 'strat-chair-1', type: 'chair', gridArea: '3 / 5 / 4 / 6' },
  { id: 'strat-plant-1', type: 'plant', gridArea: '3 / 3 / 4 / 4' },
  { id: 'strat-shelf-1', type: 'shelf', gridArea: '2 / 10 / 6 / 11' },
  { id: 'strat-whiteboard-1', type: 'whiteboard', gridArea: '2 / 6 / 3 / 10' },
  { id: 'strat-sofa-1', type: 'sofa', gridArea: '12 / 4 / 14 / 8' },
  { id: 'strat-cabinet-1', type: 'filing_cabinet', gridArea: '2 / 4 / 3 / 6' },
  
  // Data Room
  { id: 'data-desk-1', type: 'desk', gridArea: '4 / 18 / 6 / 22', color: '#334155' },
  { id: 'data-chair-1', type: 'chair', gridArea: '3 / 19 / 4 / 20' },
  { id: 'data-monitor-1', type: 'monitor', gridArea: '4 / 19 / 5 / 20' },
  { id: 'data-plant-1', type: 'plant', gridArea: '2 / 26 / 3 / 27' },
  { id: 'data-whiteboard-1', type: 'whiteboard', gridArea: '2 / 20 / 3 / 24' },
  { id: 'data-cooler-1', type: 'water_cooler', gridArea: '12 / 26 / 13 / 27' },
  { id: 'data-cabinet-1', type: 'filing_cabinet', gridArea: '2 / 18 / 3 / 20' },

  // Product Room
  { id: 'prod-desk-1', type: 'desk', gridArea: '18 / 4 / 20 / 8', color: '#475569' },
  { id: 'prod-chair-1', type: 'chair', gridArea: '17 / 5 / 18 / 6' },
  { id: 'prod-plant-1', type: 'plant', gridArea: '26 / 3 / 27 / 4' },
  { id: 'prod-shelf-1', type: 'shelf', gridArea: '16 / 10 / 20 / 11' },
  { id: 'prod-whiteboard-1', type: 'whiteboard', gridArea: '16 / 6 / 17 / 10' },
  { id: 'prod-table-1', type: 'table', gridArea: '26 / 10 / 28 / 12' },

  // Engineering Room
  { id: 'eng-desk-1', type: 'desk', gridArea: '18 / 18 / 20 / 22', color: '#334155' },
  { id: 'eng-chair-1', type: 'chair', gridArea: '17 / 19 / 18 / 20' },
  { id: 'eng-laptop-1', type: 'laptop', gridArea: '18 / 20 / 19 / 21' },
  { id: 'eng-coffee-1', type: 'coffee', gridArea: '18 / 21 / 19 / 22' },
  { id: 'eng-plant-1', type: 'plant', gridArea: '26 / 26 / 27 / 27' },
  { id: 'eng-whiteboard-1', type: 'whiteboard', gridArea: '16 / 20 / 17 / 24' },
  { id: 'eng-sofa-1', type: 'sofa', gridArea: '26 / 18 / 28 / 22' },
  { id: 'eng-rack-1', type: 'server_rack', gridArea: '16 / 26 / 18 / 28' },

  // Reception
  { id: 'rec-desk-1', type: 'desk', gridArea: '31 / 14 / 32 / 18', color: '#1E293B' },
  { id: 'rec-chair-1', type: 'chair', gridArea: '30 / 15 / 31 / 16' },
  { id: 'rec-plant-1', type: 'plant', gridArea: '30 / 13 / 31 / 14' },
  { id: 'rec-sofa-1', type: 'sofa', gridArea: '31 / 19 / 33 / 21' },
  { id: 'rec-table-1', type: 'table', gridArea: '30 / 20 / 31 / 21' },

  // Corridor
  { id: 'cor-cooler-1', type: 'water_cooler', gridArea: '14 / 14 / 15 / 15' },
  { id: 'cor-plant-1', type: 'plant', gridArea: '14 / 15 / 15 / 16' },
  { id: 'cor-plant-2', type: 'plant', gridArea: '15 / 14 / 16 / 15' },
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
    gridArea: '8 / 4 / 9 / 5',
  },
  {
    id: 'marcos',
    name: 'Marcos',
    role: 'Estrategista Comercial',
    specialty: 'ROI, produto, mercado, vendas consultivas',
    tone: 'pragmático, orientado a negócio, fala em impacto real',
    color: '#06B6D4', // cyan
    roomId: 'strategy',
    gridArea: '10 / 8 / 11 / 9',
  },
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Arquiteta de IA',
    specialty: 'prompts, sistemas de IA, anti-alucinação, qualidade de output',
    tone: 'analítica, detalhista, orientada a evidências',
    color: '#8B5CF6', // purple
    roomId: 'data',
    gridArea: '8 / 18 / 9 / 19',
  },
  {
    id: 'andre',
    name: 'Andre',
    role: 'Engenheiro de Dados',
    specialty: 'qualidade de dados, validação, fontes, freshness',
    tone: 'cético construtivo, pergunta antes de afirmar',
    color: '#3B82F6', // blue
    roomId: 'data',
    gridArea: '10 / 22 / 11 / 23',
  },
  {
    id: 'diego',
    name: 'Diego',
    role: 'Lead UX/UI',
    specialty: 'experiência do usuário, performance percebida, fluxo visual',
    tone: 'empático, visual, orientado ao usuário final',
    color: '#10B981', // green
    roomId: 'product',
    gridArea: '22 / 4 / 23 / 5',
  },
  {
    id: 'raquel',
    name: 'Raquel',
    role: 'QA & Segurança',
    specialty: 'edge cases, erros, LGPD, robustez',
    tone: 'questionadora, preventiva, não deixa passar nada',
    color: '#F59E0B', // amber
    roomId: 'product',
    gridArea: '24 / 8 / 25 / 9',
  },
  {
    id: 'helena',
    name: 'Helena',
    role: 'Dev Senior',
    specialty: 'TypeScript, React, Next.js, código completo',
    tone: 'executora, objetiva, entrega sem atalhos',
    color: '#EC4899', // pink
    roomId: 'engineering',
    gridArea: '22 / 18 / 23 / 19',
  },
  {
    id: 'victor',
    name: 'Victor',
    role: 'Engenheiro de Infra',
    specialty: 'serverless, Vercel, APIs externas, retry, cache',
    tone: 'sistemático, preventivo, pensa em escala',
    color: '#F97316', // orange
    roomId: 'engineering',
    gridArea: '24 / 22 / 25 / 23',
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
