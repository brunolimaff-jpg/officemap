import os
import re

ROOT = r"C:\Users\bruno.ferreira\Desktop\NOVO APP\officemap"

# 1. Update types/index.ts
types_path = os.path.join(ROOT, "types", "index.ts")
with open(types_path, "r", encoding="utf-8") as f:
    t_data = f.read()
t_data = re.sub(
    r"'desk' \| 'chair'[^;]+",
    r"'desk' | 'chair' | 'plant' | 'shelf' | 'monitor' | 'laptop' | 'coffee' | 'water_cooler' | 'whiteboard' | 'sofa' | 'table' | 'server_rack' | 'filing_cabinet' | 'divider' | 'rug' | 'bookshelf'",
    t_data
)
with open(types_path, "w", encoding="utf-8") as f:
    f.write(t_data)

# 2. Update lib/isoDepth.ts
iso_path = os.path.join(ROOT, "lib", "isoDepth.ts")
with open(iso_path, "r", encoding="utf-8") as f:
    i_data = f.read()
i_data = i_data.replace("desk: 34", "bookshelf: 32,\n  divider: 33,\n  rug: 12,\n  desk: 34,\n  laptop: 35")
with open(iso_path, "w", encoding="utf-8") as f:
    f.write(i_data)

# 3. Update components/IsoFurnitureFallback.tsx
fb_path = os.path.join(ROOT, "components", "IsoFurnitureFallback.tsx")
with open(fb_path, "r", encoding="utf-8") as f:
    fb_data = f.read()

new_cases = """
    case 'rug':
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} {...common}>
          <polygon points={`${w/2},4 ${w-4},${h/2} ${w/2},${h-4} 4,${h/2}`} fill={color} stroke="#1e293b" strokeWidth="1" opacity={0.6} />
          <polygon points={`${w/2},8 ${w-10},${h/2} ${w/2},${h-8} 10,${h/2}`} fill="#ffffff" opacity={0.05} />
        </svg>
      );
    case 'divider':
      return (
        <svg width={w} height={h} viewBox="0 0 64 64" {...common}>
          {/* Glass pane */}
          <polygon points="32,16 64,32 64,52 32,36" fill="#38bdf8" opacity={0.25} stroke="#0ea5e9" strokeWidth="1" />
          {/* Solid base */}
          <polygon points="32,36 64,52 64,56 32,40" fill="#0f172a" />
          <polygon points="32,36 32,40 0,24 0,20" fill="#1e293b" />
          <polygon points="0,20 32,36 64,52 32,36" fill="#475569" stroke="#334155" strokeWidth="1" opacity={0.5} />
        </svg>
      );
    case 'laptop':
      return (
        <svg width={w} height={h} viewBox="0 0 32 32" {...common}>
          {/* Shadow */}
          <ellipse cx="16" cy="24" rx="8" ry="3" fill="#000" opacity={0.2} />
          {/* Screen */}
          <polygon points="16,14 24,18 16,22 8,18" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
          <polygon points="8,18 16,10 20,12 12,20" fill="#0f172a" />
          {/* Glow */}
          <polygon points="10,17 16,11 19,12.5 13,18.5" fill="#38bdf8" opacity={0.6} />
        </svg>
      );
    case 'bookshelf':
      return (
        <svg width={w} height={h} viewBox="0 0 48 80" {...common}>
          <ellipse cx="24" cy="74" rx="14" ry="4" fill="#000" opacity={0.2} />
          <polygon points="8,42 24,34 40,42 40,72 24,80 8,72" fill={wood} stroke={woodDark} strokeWidth="1" />
          <polygon points="8,42 24,34 24,4 8,12" fill={wood} stroke={woodDark} strokeWidth="1" />
          <polygon points="40,42 24,34 24,4 40,12" fill={woodDark} stroke={woodDark} strokeWidth="1" />
          <polygon points="8,12 24,4 40,12 24,20" fill={woodLight} stroke={woodDark} strokeWidth="1" />
          {/* Shelves */}
          <line x1="8" y1="27" x2="24" y2="19" stroke={woodDark} strokeWidth="2" />
          <line x1="8" y1="42" x2="24" y2="34" stroke={woodDark} strokeWidth="2" />
          <line x1="8" y1="57" x2="24" y2="49" stroke={woodDark} strokeWidth="2" />
          {/* Books */}
          <rect x="12" y="32" width="3" height="8" fill="#ef4444" transform="skewY(-26.5)" />
          <rect x="16" y="34" width="2" height="7" fill="#3b82f6" transform="skewY(-26.5)" />
        </svg>
      );
"""
if "case 'rug':" not in fb_data:
    fb_data = fb_data.replace("switch (type) {", "switch (type) {\n" + new_cases)
    with open(fb_path, "w", encoding="utf-8") as f:
        f.write(fb_data)

# 4. Update components/FurniSprite.tsx
fs_path = os.path.join(ROOT, "components", "FurniSprite.tsx")
with open(fs_path, "r", encoding="utf-8") as f:
    fs_data = f.read()

# Add new sizes
if "divider:" not in fs_data:
    fs_data = fs_data.replace("desk:       { w: 64, h: 64 },", "desk:       { w: 64, h: 64 },\n  divider:    { w: 64, h: 64 },\n  rug:        { w: 128, h: 64 },\n  laptop:     { w: 32, h: 32 },\n  bookshelf:  { w: 48, h: 80 },")

# Offset laptop Y
if "yOffset =" not in fs_data:
    fs_data = fs_data.replace("const [idx, setIdx] = useState(0);", "const [idx, setIdx] = useState(0);\n  const yOffset = type === 'laptop' ? 24 : 0;")
    fs_data = fs_data.replace("top={pos.y - h}", "top={pos.y - h - yOffset}")
    fs_data = fs_data.replace("top: pos.y - h,", "top: pos.y - h - yOffset,")

with open(fs_path, "w", encoding="utf-8") as f:
    f.write(fs_data)


# 5. Overwrite data/specialists.ts with the new complete layout
spec_path = os.path.join(ROOT, "data", "specialists.ts")
NEW_SPEC = r"""import { Specialist, Furniture } from '@/types';

export const furniture: Furniture[] = [
  // ─── ALA ESQUERDA: Carlos, Marcos, Sophia, Andre ───
  // Carlos (CTO)
  { id: 'desk-carlos',   type: 'desk',   x: 4,  y: 3,  direction: 2, color: '#EF4444' },
  { id: 'chair-carlos',  type: 'chair',  x: 5,  y: 3,  direction: 6 },
  { id: 'lap-carlos',    type: 'laptop', x: 4,  y: 3 },
  { id: 'div-1',         type: 'divider',x: 4,  y: 4,  direction: 2 },

  // Marcos (Comercial)
  { id: 'desk-marcos',   type: 'desk',   x: 4,  y: 6,  direction: 2, color: '#06B6D4' },
  { id: 'chair-marcos',  type: 'chair',  x: 5,  y: 6,  direction: 6 },
  { id: 'lap-marcos',    type: 'laptop', x: 4,  y: 6 },
  { id: 'div-2',         type: 'divider',x: 4,  y: 7,  direction: 2 },

  // Sophia (IA)
  { id: 'desk-sophia',   type: 'desk',   x: 4,  y: 9,  direction: 2, color: '#8B5CF6' },
  { id: 'chair-sophia',  type: 'chair',  x: 5,  y: 9,  direction: 6 },
  { id: 'lap-sophia',    type: 'laptop', x: 4,  y: 9 },
  { id: 'div-3',         type: 'divider',x: 4,  y: 10, direction: 2 },

  // Andre (Dados)
  { id: 'desk-andre',    type: 'desk',   x: 4,  y: 12, direction: 2, color: '#3B82F6' },
  { id: 'chair-andre',   type: 'chair',  x: 5,  y: 12, direction: 6 },
  { id: 'lap-andre',     type: 'laptop', x: 4,  y: 12 },
  { id: 'div-4',         type: 'divider',x: 4,  y: 13, direction: 2 },

  // ─── ALA DIREITA: Diego, Raquel, Helena, Victor ───
  // Diego (UX)
  { id: 'desk-diego',    type: 'desk',   x: 18, y: 3,  direction: 6, color: '#10B981' },
  { id: 'chair-diego',   type: 'chair',  x: 17, y: 3,  direction: 2 },
  { id: 'lap-diego',     type: 'laptop', x: 18, y: 3 },
  { id: 'div-5',         type: 'divider',x: 18, y: 4,  direction: 6 },

  // Raquel (QA)
  { id: 'desk-raquel',   type: 'desk',   x: 18, y: 6,  direction: 6, color: '#F59E0B' },
  { id: 'chair-raquel',  type: 'chair',  x: 17, y: 6,  direction: 2 },
  { id: 'lap-raquel',    type: 'laptop', x: 18, y: 6 },
  { id: 'div-6',         type: 'divider',x: 18, y: 7,  direction: 6 },

  // Helena (Dev)
  { id: 'desk-helena',   type: 'desk',   x: 18, y: 9,  direction: 6, color: '#EC4899' },
  { id: 'chair-helena',  type: 'chair',  x: 17, y: 9,  direction: 2 },
  { id: 'lap-helena',    type: 'laptop', x: 18, y: 9 },
  { id: 'div-7',         type: 'divider',x: 18, y: 10, direction: 6 },

  // Victor (Infra)
  { id: 'desk-victor',   type: 'desk',   x: 18, y: 12, direction: 6, color: '#F97316' },
  { id: 'chair-victor',  type: 'chair',  x: 17, y: 12, direction: 2 },
  { id: 'lap-victor',    type: 'laptop', x: 18, y: 12 },
  { id: 'div-8',         type: 'divider',x: 18, y: 13, direction: 6 },

  // ─── SALA DE REUNIÃO CENTRAL ───
  { id: 'board-rug',      type: 'rug',   x: 11, y: 8, color: '#1e3a8a' }, // Tapete azul executivo
  { id: 'board-table',    type: 'table', x: 11, y: 8 },
  
  // 8 cadeiras ao redor
  { id: 'board-chair-N1', type: 'chair', x: 10, y: 7,  direction: 4 },
  { id: 'board-chair-N2', type: 'chair', x: 11, y: 7,  direction: 4 },
  { id: 'board-chair-N3', type: 'chair', x: 12, y: 7,  direction: 4 },
  { id: 'board-chair-S1', type: 'chair', x: 10, y: 9,  direction: 0 },
  { id: 'board-chair-S2', type: 'chair', x: 11, y: 9,  direction: 0 },
  { id: 'board-chair-S3', type: 'chair', x: 12, y: 9,  direction: 0 },
  { id: 'board-chair-W',  type: 'chair', x: 10, y: 8,  direction: 2 },
  { id: 'board-chair-E',  type: 'chair', x: 12, y: 8,  direction: 6 },

  // Whiteboard e Laptops na mesa
  { id: 'board-whiteboard', type: 'whiteboard', x: 11, y: 5, direction: 4 },
  { id: 'lap-board-1',    type: 'laptop', x: 10, y: 8 },
  { id: 'lap-board-2',    type: 'laptop', x: 12, y: 8 },

  // ─── RECEPÇÃO (canto inferior esquerdo) ───
  { id: 'rec-rug',   type: 'rug',   x: 5,  y: 17, color: '#064e3b' }, // Tapete verde escuro
  { id: 'rec-desk',  type: 'desk',  x: 5,  y: 17, direction: 4, color: '#f59e0b' },
  { id: 'rec-lap',   type: 'laptop',x: 5,  y: 17 },
  { id: 'rec-chair', type: 'chair', x: 5,  y: 18, direction: 0 },

  // ─── LOUNGE (canto inferior direito) ───
  { id: 'lounge-rug',  type: 'rug',  x: 17, y: 17, color: '#7f1d1d' }, // Tapete vinho
  { id: 'lounge-sofa', type: 'sofa', x: 17, y: 17, direction: 6 },
  { id: 'lounge-sofa2',type: 'sofa', x: 18, y: 18, direction: 0 },
  
  // ─── LIVROS / ESTANTES ───
  { id: 'book-1', type: 'bookshelf', x: 2,  y: 2 },
  { id: 'book-2', type: 'bookshelf', x: 21, y: 2 },

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
"""
with open(spec_path, "w", encoding="utf-8") as f:
    f.write(NEW_SPEC)

print("success")
