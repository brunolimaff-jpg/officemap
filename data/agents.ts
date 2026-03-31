export type AgentRole =
  | 'Chief Visionary'
  | 'CTO'
  | 'Head of AI'
  | 'VP of Data'
  | 'Principal UX Engineer'
  | 'Director of QA'
  | 'VP of Sales Strategy'
  | 'Principal Frontend'
  | 'VP of Infrastructure'
  | 'Agri-Business Advisor'
  | 'Chief Decision Scientist'
  | 'VP of Product'
  | 'COO';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  avatarUrl: string;
  position: { x: number; y: number }; // Percentage positions (0-100) for responsive isometric map
}

export const agents: Agent[] = [
  {
    id: 'satya-nadella',
    name: 'Satya Nadella',
    role: 'Chief Visionary',
    description: 'Líder Geral do Projeto. Transforma ferramentas em plataformas essenciais para produtividade B2B.',
    avatarUrl: '/avatars/satya.png',
    position: { x: 50, y: 20 }, // Ex: Sala da Diretoria central (ao fundo)
  },
  {
    id: 'uncle-bob',
    name: 'Robert C. Martin (Uncle Bob)',
    role: 'CTO',
    description: 'Guardião Arquitetural. Foca em SOLID, Clean Architecture e refatoração contínua.',
    avatarUrl: '/avatars/bob.png',
    position: { x: 75, y: 35 }, // Ex: Sala técnica (canto superior direito)
  },
  {
    id: 'andrej-karpathy',
    name: 'Andrej Karpathy',
    role: 'Head of AI',
    description: 'Focado em precisão, anti-alucinação e na coreografia entre LLMs.',
    avatarUrl: '/avatars/andrej.png',
    position: { x: 25, y: 35 }, // Ex: Laboratório AI
  },
  {
    id: 'monica-rogati',
    name: 'Monica Rogati',
    role: 'VP of Data',
    description: 'Estruturação de dados para IA. Garbage in, garbage out.',
    avatarUrl: '/avatars/monica.png',
    position: { x: 35, y: 55 }, // Ex: Baias de dados
  },
  {
    id: 'addy-osmani',
    name: 'Addy Osmani',
    role: 'Principal UX Engineer',
    description: 'Performance web e experiência do usuário (Web Vitals).',
    avatarUrl: '/avatars/addy.png',
    position: { x: 65, y: 55 }, // Ex: Design room
  },
  {
    id: 'james-whittaker',
    name: 'James Whittaker',
    role: 'Director of QA',
    description: 'Testes destrutivos, segurança e quebra de sistemas antes dos usuários.',
    avatarUrl: '/avatars/james.png',
    position: { x: 15, y: 65 }, // QA section
  },
  {
    id: 'matt-dixon',
    name: 'Matt Dixon',
    role: 'VP of Sales Strategy',
    description: 'Estratégia Challenger Sale. Insights B2B que ensinam o cliente a pensar diferente.',
    avatarUrl: '/avatars/matt.png',
    position: { x: 85, y: 65 }, // Sales floor
  },
  {
    id: 'kent-dodds',
    name: 'Kent C. Dodds',
    role: 'Principal Frontend',
    description: 'Focado no desenvolvimento limpo e testável em React/Next.js.',
    avatarUrl: '/avatars/kent.png',
    position: { x: 45, y: 75 }, // Dev pod 1
  },
  {
    id: 'guillermo-rauch',
    name: 'Guillermo Rauch',
    role: 'VP of Infrastructure',
    description: 'Deploy, Edge computing, Vercel e infraestrutura escalável.',
    avatarUrl: '/avatars/guillermo.png',
    position: { x: 55, y: 75 }, // Dev pod 2
  },
  {
    id: 'roberto-rodrigues',
    name: 'Roberto Rodrigues',
    role: 'Agri-Business Advisor',
    description: 'O contexto real e pragmático do agronegócio brasileiro.',
    avatarUrl: '/avatars/roberto.png',
    position: { x: 70, y: 25 }, // Meeting room
  },
  {
    id: 'cassie-kozyrkov',
    name: 'Cassie Kozyrkov',
    role: 'Chief Decision Scientist',
    description: 'Decisões guiadas por dados. Evitar vieses analíticos e focar no impacto.',
    avatarUrl: '/avatars/cassie.png',
    position: { x: 30, y: 25 }, // Meeting room
  },
  {
    id: 'marty-cagan',
    name: 'Marty Cagan',
    role: 'VP of Product',
    description: 'Criar produtos que clientes amam e que funcionam para o negócio (Product Discovery).',
    avatarUrl: '/avatars/marty.png',
    position: { x: 50, y: 45 }, // Central pod
  },
  {
    id: 'andy-grove',
    name: 'Andy Grove',
    role: 'COO',
    description: 'High Output Management. OKRs, clareza, alinhamento e execução impiedosa.',
    avatarUrl: '/avatars/andy.png',
    position: { x: 50, y: 85 }, // Perto da recepção/operação
  }
];