import React from 'react';

interface SpriteProps {
  pos: { x: number; y: number };
  color?: string;
  direction?: number;
  zIndex: number;
}

// Utilitário: escurece uma cor hex
function darken(hex: string, amount: number): string {
  try {
    const h = hex.replace('#', '');
    const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch { return hex; }
}

// ─── DESK ───────────────────────────────────────────────────────────────────
// Mesa isométrica com monitor em cima. Cor do especialista no tampo.
function DeskSVG({ pos, color = '#8B5A2B', zIndex }: SpriteProps) {
  const top = color;
  const left = darken(color, -40);
  const right = darken(color, -70);
  const legC = '#3D2B1F';
  const monFrame = '#1E293B';
  const monScreen = '#38BDF8';

  return (
    <svg
      width="96" height="80"
      viewBox="0 0 96 80"
      className="absolute pointer-events-none"
      style={{ left: pos.x - 48, top: pos.y - 64, zIndex, imageRendering: 'pixelated' }}
    >
      {/* Pernas */}
      <rect x="14" y="52" width="6" height="18" fill={legC} />
      <rect x="76" y="52" width="6" height="18" fill={legC} />
      <rect x="26" y="58" width="6" height="12" fill={legC} />
      <rect x="64" y="58" width="6" height="12" fill={legC} />

      {/* Tampo — face esquerda */}
      <polygon points="8,46 48,26 48,36 8,56" fill={left} />
      {/* Tampo — face direita */}
      <polygon points="48,26 88,46 88,56 48,36" fill={right} />
      {/* Tampo — face superior */}
      <polygon points="8,46 48,26 88,46 48,66" fill={top} />

      {/* Gaveta */}
      <rect x="52" y="38" width="28" height="8" rx="1" fill={darken(color, -20)} />
      <circle cx="66" cy="42" r="2" fill={darken(color, 20)} />

      {/* Monitor — base */}
      <rect x="34" y="22" width="8" height="6" rx="1" fill={monFrame} />
      {/* Monitor — suporte */}
      <rect x="37" y="18" width="2" height="6" fill={monFrame} />
      {/* Monitor — tela */}
      <rect x="26" y="6" width="24" height="14" rx="2" fill={monFrame} />
      <rect x="28" y="8" width="20" height="10" rx="1" fill={monScreen} />
      {/* Reflexo tela */}
      <rect x="29" y="9" width="4" height="2" rx="1" fill="#BAE6FD" opacity="0.6" />

      {/* Teclado */}
      <rect x="50" y="28" width="22" height="8" rx="1" fill="#334155" />
      <rect x="52" y="30" width="18" height="4" rx="0.5" fill="#475569" />
    </svg>
  );
}

// ─── CHAIR ──────────────────────────────────────────────────────────────────
// Cadeira giratória com encosto. Direction define para qual lado vira.
function ChairSVG({ pos, direction = 6, zIndex }: SpriteProps) {
  const seat = '#475569';
  const back = '#334155';
  const dark = '#1E293B';
  const base = '#64748B';

  // Flip horizontal se direction = 2 (esquerda)
  const flip = direction === 2 || direction === 0;
  const transform = flip ? `scale(-1,1) translate(-56,0)` : undefined;

  return (
    <svg
      width="56" height="56"
      viewBox="0 0 56 56"
      className="absolute pointer-events-none"
      style={{ left: pos.x - 28, top: pos.y - 48, zIndex, imageRendering: 'pixelated' }}
    >
      <g transform={transform}>
        {/* Base com rodas */}
        <ellipse cx="28" cy="52" rx="14" ry="4" fill={dark} opacity="0.4" />
        <rect x="24" y="42" width="8" height="10" rx="2" fill={base} />
        <circle cx="18" cy="52" r="3" fill={dark} />
        <circle cx="28" cy="54" r="3" fill={dark} />
        <circle cx="38" cy="52" r="3" fill={dark} />

        {/* Assento — face esquerda */}
        <polygon points="10,36 28,26 28,34 10,44" fill={dark} />
        {/* Assento — face direita */}
        <polygon points="28,26 46,36 46,44 28,34" fill={back} />
        {/* Assento — topo */}
        <polygon points="10,36 28,26 46,36 28,46" fill={seat} />

        {/* Encosto — face esquerda */}
        <polygon points="14,18 28,10 28,26 14,34" fill={dark} />
        {/* Encosto — face direita */}
        <polygon points="28,10 42,18 42,34 28,26" fill={back} />
        {/* Encosto — topo */}
        <polygon points="14,18 28,10 42,18 28,26" fill={seat} />
      </g>
    </svg>
  );
}

// ─── TABLE (mesa de reunião) ─────────────────────────────────────────────────
function TableSVG({ pos, zIndex }: SpriteProps) {
  const top = '#F1F5F9';
  const left = '#CBD5E1';
  const right = '#94A3B8';
  const leg = '#64748B';

  return (
    <svg
      width="128" height="96"
      viewBox="0 0 128 96"
      className="absolute pointer-events-none"
      style={{ left: pos.x - 64, top: pos.y - 72, zIndex, imageRendering: 'pixelated' }}
    >
      {/* Pernas */}
      <rect x="10" y="60" width="6" height="28" fill={leg} />
      <rect x="112" y="60" width="6" height="28" fill={leg} />
      <rect x="30" y="66" width="6" height="22" fill={leg} />
      <rect x="92" y="66" width="6" height="22" fill={leg} />

      {/* Tampo — esquerda */}
      <polygon points="4,56 64,24 64,36 4,68" fill={left} />
      {/* Tampo — direita */}
      <polygon points="64,24 124,56 124,68 64,36" fill={right} />
      {/* Tampo — topo */}
      <polygon points="4,56 64,24 124,56 64,88" fill={top} />

      {/* Borda do tampo */}
      <polygon points="4,56 64,24 124,56 64,88" fill="none" stroke="#CBD5E1" strokeWidth="1" />

      {/* Detalhe central — linha divisória */}
      <line x1="64" y1="24" x2="64" y2="88" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

// ─── SOFA ────────────────────────────────────────────────────────────────────
function SofaSVG({ pos, direction = 6, zIndex }: SpriteProps) {
  const c1 = '#EF4444';
  const c2 = darken('#EF4444', -30);
  const c3 = darken('#EF4444', -55);
  const flip = direction === 2 || direction === 0;
  const transform = flip ? `scale(-1,1) translate(-100,0)` : undefined;

  return (
    <svg
      width="100" height="72"
      viewBox="0 0 100 72"
      className="absolute pointer-events-none"
      style={{ left: pos.x - 50, top: pos.y - 60, zIndex, imageRendering: 'pixelated' }}
    >
      <g transform={transform}>
        {/* Base/Pés */}
        <rect x="8" y="62" width="8" height="8" rx="1" fill={c3} />
        <rect x="84" y="62" width="8" height="8" rx="1" fill={c3} />

        {/* Assento — esquerda */}
        <polygon points="6,52 50,30 50,42 6,64" fill={c2} />
        {/* Assento — direita */}
        <polygon points="50,30 94,52 94,64 50,42" fill={c3} />
        {/* Assento — topo */}
        <polygon points="6,52 50,30 94,52 50,74" fill={c1} />

        {/* Encosto — esquerda */}
        <polygon points="10,28 50,8 50,30 10,50" fill={c2} />
        {/* Encosto — direita */}
        <polygon points="50,8 90,28 90,50 50,30" fill={c3} />
        {/* Encosto — topo */}
        <polygon points="10,28 50,8 90,28 50,48" fill={c1} />

        {/* Braço direito — topo */}
        <polygon points="82,22 94,28 94,52 82,46" fill={c2} />
        <polygon points="82,22 94,28 90,26 78,20" fill={c1} />

        {/* Almofadas */}
        <ellipse cx="32" cy="48" rx="10" ry="5" fill={darken('#EF4444', 20)} opacity="0.3" />
        <ellipse cx="68" cy="48" rx="10" ry="5" fill={darken('#EF4444', 20)} opacity="0.3" />
      </g>
    </svg>
  );
}

// ─── WHITEBOARD ──────────────────────────────────────────────────────────────
function WhiteboardSVG({ pos, zIndex }: SpriteProps) {
  return (
    <svg
      width="72" height="88"
      viewBox="0 0 72 88"
      className="absolute pointer-events-none"
      style={{ left: pos.x - 36, top: pos.y - 80, zIndex, imageRendering: 'pixelated' }}
    >
      {/* Suporte */}
      <rect x="33" y="72" width="6" height="14" fill="#64748B" />
      <rect x="20" y="82" width="32" height="4" rx="2" fill="#475569" />

      {/* Moldura — esquerda */}
      <polygon points="8,60 36,44 36,76 8,92" fill="#475569" />
      {/* Moldura — direita */}
      <polygon points="36,44 64,60 64,92 36,76" fill="#334155" />
      {/* Moldura — topo */}
      <polygon points="8,60 36,44 64,60 36,76" fill="#64748B" />

      {/* Board — face frontal (esquerda isométrica) */}
      <polygon points="10,22 36,8 36,60 10,74" fill="#F8FAFC" />
      {/* Board — topo */}
      <polygon points="10,22 36,8 62,22 36,36" fill="#F1F5F9" />
      {/* Board — borda */}
      <polygon points="10,22 36,8 62,22 36,36" fill="none" stroke="#94A3B8" strokeWidth="1" />
      <polygon points="10,22 36,8 36,60 10,74" fill="none" stroke="#94A3B8" strokeWidth="1" />

      {/* Escritas no board */}
      <line x1="14" y1="30" x2="32" y2="21" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7" />
      <line x1="14" y1="38" x2="32" y2="29" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="46" x2="28" y2="38" stroke="#10B981" strokeWidth="1" opacity="0.5" />
      <circle cx="15" cy="52" r="2" fill="#EF4444" opacity="0.6" />
    </svg>
  );
}

// ─── PLANT ───────────────────────────────────────────────────────────────────
function PlantSVG({ pos, zIndex }: SpriteProps) {
  return (
    <svg
      width="48" height="64"
      viewBox="0 0 48 64"
      className="absolute pointer-events-none"
      style={{ left: pos.x - 24, top: pos.y - 56, zIndex, imageRendering: 'pixelated' }}
    >
      {/* Vaso — esquerda */}
      <polygon points="8,48 24,40 24,56 8,64" fill="#92400E" />
      {/* Vaso — direita */}
      <polygon points="24,40 40,48 40,64 24,56" fill="#78350F" />
      {/* Vaso — topo */}
      <polygon points="8,48 24,40 40,48 24,56" fill="#B45309" />

      {/* Terra */}
      <polygon points="10,46 24,39 38,46 24,53" fill="#292524" />

      {/* Tronco */}
      <rect x="22" y="30" width="4" height="16" fill="#713F12" />

      {/* Folhas — traseiras */}
      <ellipse cx="16" cy="24" rx="10" ry="6" fill="#15803D" transform="rotate(-20,16,24)" />
      <ellipse cx="32" cy="22" rx="10" ry="6" fill="#15803D" transform="rotate(20,32,22)" />

      {/* Folhas — frente */}
      <ellipse cx="24" cy="18" rx="12" ry="7" fill="#16A34A" />
      <ellipse cx="14" cy="20" rx="8" ry="5" fill="#22C55E" transform="rotate(-30,14,20)" />
      <ellipse cx="34" cy="20" rx="8" ry="5" fill="#22C55E" transform="rotate(30,34,20)" />

      {/* Brilho folha */}
      <ellipse cx="22" cy="16" rx="4" ry="2" fill="#4ADE80" opacity="0.4" />
    </svg>
  );
}

// ─── EXPORT PRINCIPAL ────────────────────────────────────────────────────────
interface FurniSpriteProps {
  type: string;
  pos: { x: number; y: number };
  color?: string;
  direction?: number;
  tileX: number;
  tileY: number;
}

export default function FurniSprite({ type, pos, color, direction, tileX, tileY }: FurniSpriteProps) {
  const zIndex = Math.floor((tileX + tileY) * 10 + 2);

  switch (type) {
    case 'desk':       return <DeskSVG pos={pos} color={color} zIndex={zIndex} />;
    case 'chair':      return <ChairSVG pos={pos} direction={direction} zIndex={zIndex} />;
    case 'table':      return <TableSVG pos={pos} zIndex={zIndex} />;
    case 'sofa':       return <SofaSVG pos={pos} direction={direction} zIndex={zIndex} />;
    case 'whiteboard': return <WhiteboardSVG pos={pos} zIndex={zIndex} />;
    case 'plant':      return <PlantSVG pos={pos} zIndex={zIndex} />;
    default:           return null;
  }
}
