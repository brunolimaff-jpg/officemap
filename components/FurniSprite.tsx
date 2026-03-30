import React, { useState } from 'react';

interface FurniSpriteProps {
  type: string;
  pos: { x: number; y: number };
  color?: string;
  direction?: number;
  tileX: number;
  tileY: number;
  zBonus?: number;
}

const SIZE: Record<string, { w: number; h: number }> = {
  desk:       { w: 64, h: 72 },
  chair:      { w: 48, h: 56 },
  table:      { w: 96, h: 80 },
  sofa:       { w: 72, h: 64 },
  whiteboard: { w: 48, h: 80 },
  plant:      { w: 40, h: 64 },
  divider:    { w: 64, h: 40 },
};

// Utilidade: escurece/aclara uma cor hex
function shadeHex(hex: string, amount: number): string {
  try {
    const h = hex.replace('#', '');
    const num = parseInt(h, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  } catch { return hex; }
}

// ─── SVGs isométricos por tipo ────────────────────────────────────────────────────────────────

function DeskSVG({ color = '#64748B', flip }: { color: string; flip: boolean }) {
  const dark = shadeHex(color, -40);
  const light = shadeHex(color, 30);
  const mid = shadeHex(color, -15);
  return (
    <svg width="64" height="72" viewBox="0 0 64 72" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      {/* Pernas */}
      <line x1="8" y1="38" x2="6" y2="62" stroke={dark} strokeWidth="3" strokeLinecap="round" />
      <line x1="56" y1="38" x2="56" y2="62" stroke={dark} strokeWidth="3" strokeLinecap="round" />
      {/* Face esquerda da mesa */}
      <polygon points="4,24 32,40 32,52 4,36" fill={dark} />
      {/* Face direita da mesa */}
      <polygon points="60,24 32,40 32,52 60,36" fill={mid} />
      {/* Tampo — face superior */}
      <polygon points="32,8 60,24 32,40 4,24" fill={light} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      {/* Monitor — face esquerda */}
      <polygon points="18,14 32,20 32,32 18,26" fill="#0F172A" />
      {/* Monitor — face direita */}
      <polygon points="46,14 32,20 32,32 46,26" fill="#1E293B" />
      {/* Monitor — tela */}
      <polygon points="32,8 46,14 32,20 18,14" fill="#3B82F6" opacity="0.9" />
      {/* Brilho na tela */}
      <polygon points="32,9 40,13 36,15 28,11" fill="white" opacity="0.15" />
      {/* Base do monitor */}
      <line x1="32" y1="32" x2="32" y2="38" stroke={dark} strokeWidth="2" />
      {/* Sombra */}
      <ellipse cx="32" cy="68" rx="14" ry="4" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function ChairSVG({ color = '#475569', flip }: { color: string; flip: boolean }) {
  const dark = shadeHex(color, -40);
  const light = shadeHex(color, 20);
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      {/* Pernas */}
      <line x1="8" y1="32" x2="6" y2="50" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="32" x2="40" y2="50" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      {/* Face esquerda assento */}
      <polygon points="4,24 24,32 24,40 4,32" fill={dark} />
      {/* Face direita assento */}
      <polygon points="44,24 24,32 24,40 44,32" fill={color} />
      {/* Assento superior */}
      <polygon points="24,16 44,24 24,32 4,24" fill={light} />
      {/* Encosto — face esquerda */}
      <polygon points="4,10 24,18 24,24 4,16" fill={dark} />
      {/* Encosto — face direita */}
      <polygon points="44,10 24,18 24,24 44,16" fill={color} />
      {/* Encosto — topo */}
      <polygon points="24,4 44,10 24,18 4,10" fill={light} />
      {/* Sombra */}
      <ellipse cx="24" cy="52" rx="10" ry="3" fill="black" fillOpacity="0.12" />
    </svg>
  );
}

function TableSVG() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" style={{ imageRendering: 'pixelated' }}>
      {/* Pernas */}
      <line x1="10" y1="44" x2="8" y2="68" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <line x1="86" y1="44" x2="86" y2="68" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      {/* Face esquerda */}
      <polygon points="4,32 48,56 48,66 4,42" fill="#1E293B" />
      {/* Face direita */}
      <polygon points="92,32 48,56 48,66 92,42" fill="#263448" />
      {/* Tampo */}
      <polygon points="48,8 92,32 48,56 4,32" fill="#334155" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      {/* Reflexo no tampo */}
      <polygon points="48,12 72,24 56,30 32,18" fill="white" fillOpacity="0.04" />
      {/* Detalhes na borda do tampo */}
      <polygon points="48,8 92,32 88,34 48,12" fill="white" fillOpacity="0.05" />
      {/* Sombra */}
      <ellipse cx="48" cy="74" rx="20" ry="5" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function SofaSVG({ color = '#475569', flip }: { color: string; flip: boolean }) {
  const dark = shadeHex(color, -50);
  const light = shadeHex(color, 25);
  const mid = shadeHex(color, -20);
  return (
    <svg width="72" height="64" viewBox="0 0 72 64" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}>
      {/* Base — face esquerda */}
      <polygon points="4,38 36,52 36,60 4,46" fill={dark} />
      {/* Base — face direita */}
      <polygon points="68,38 36,52 36,60 68,46" fill={mid} />
      {/* Assento — topo */}
      <polygon points="36,24 68,38 36,52 4,38" fill={color} />
      {/* Encosto traseiro — face esquerda */}
      <polygon points="4,20 36,8 36,24 4,36" fill={dark} />
      {/* Encosto traseiro — face direita */}
      <polygon points="68,20 36,8 36,24 68,36" fill={mid} />
      {/* Encosto traseiro — topo */}
      <polygon points="36,4 68,18 68,20 36,8 4,20 4,18" fill={light} />
      {/* Braço esquerdo */}
      <polygon points="4,20 16,14 16,26 4,32" fill={dark} />
      <polygon points="4,18 16,12 16,14 4,20" fill={light} opacity="0.6" />
      {/* Braço direito */}
      <polygon points="68,20 56,14 56,26 68,32" fill={mid} />
      <polygon points="68,18 56,12 56,14 68,20" fill={light} opacity="0.4" />
      {/* Almofadas */}
      <polygon points="36,26 54,34 36,42 18,34" fill={light} opacity="0.3" />
      {/* Sombra */}
      <ellipse cx="36" cy="62" rx="18" ry="4" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function WhiteboardSVG() {
  return (
    <svg width="48" height="80" viewBox="0 0 48 80" fill="none" style={{ imageRendering: 'pixelated' }}>
      {/* Pés */}
      <line x1="16" y1="60" x2="14" y2="76" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="52" x2="32" y2="68" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      {/* Moldura — face esquerda */}
      <polygon points="2,36 24,48 24,62 2,50" fill="#374151" />
      {/* Moldura — face direita */}
      <polygon points="46,28 24,40 24,54 46,42" fill="#4B5563" />
      {/* Quadro — topo esquerdo */}
      <polygon points="24,12 46,24 24,36 2,24" fill="#F8FAFC" />
      {/* Linhas de escrita */}
      <line x1="14" y1="22" x2="34" y2="28" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7" />
      <line x1="14" y1="26" x2="28" y2="31" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="30" x2="32" y2="35" stroke="#EF4444" strokeWidth="1" opacity="0.5" />
      {/* Bandeja de canetas */}
      <polygon points="24,36 46,24 46,28 24,40" fill="#D1D5DB" />
      {/* Sombra */}
      <ellipse cx="24" cy="76" rx="12" ry="3" fill="black" fillOpacity="0.12" />
    </svg>
  );
}

function PlantSVG() {
  return (
    <svg width="40" height="64" viewBox="0 0 40 64" fill="none" style={{ imageRendering: 'pixelated' }}>
      {/* Vaso — face esquerda */}
      <polygon points="4,46 20,52 20,60 4,54" fill="#92400E" />
      {/* Vaso — face direita */}
      <polygon points="36,46 20,52 20,60 36,54" fill="#B45309" />
      {/* Vaso — topo */}
      <polygon points="20,40 36,46 20,52 4,46" fill="#D97706" />
      {/* Tronco */}
      <line x1="20" y1="40" x2="20" y2="28" stroke="#78350F" strokeWidth="3" />
      {/* Folhas — camada base */}
      <polygon points="20,14 32,22 20,30 8,22" fill="#16A34A" />
      <polygon points="20,10 28,16 20,22 12,16" fill="#22C55E" />
      <polygon points="20,6 26,12 20,18 14,12" fill="#4ADE80" />
      {/* Folhas laterais */}
      <polygon points="20,18 10,14 8,22" fill="#15803D" />
      <polygon points="20,18 30,14 32,22" fill="#16A34A" opacity="0.8" />
      {/* Sombra */}
      <ellipse cx="20" cy="62" rx="10" ry="3" fill="black" fillOpacity="0.15" />
    </svg>
  );
}

function DividerSVG() {
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none" style={{ imageRendering: 'pixelated' }}>
      {/* Face esquerda */}
      <polygon points="4,18 32,28 32,36 4,26" fill="#1E293B" />
      {/* Face direita */}
      <polygon points="60,18 32,28 32,36 60,26" fill="#263448" />
      {/* Topo */}
      <polygon points="32,8 60,18 32,28 4,18" fill="#334155" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      {/* Detalhe dourado no topo */}
      <polygon points="32,8 60,18 58,19 32,9" fill="rgba(251,191,36,0.2)" />
    </svg>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────────────────────

export default function FurniSprite({ type, pos, color = '#64748B', direction = 2, tileX, tileY, zBonus = 2 }: FurniSpriteProps) {
  const [usePng, setUsePng] = useState(true);
  const zIndex = Math.floor((tileX + tileY) * 10 + zBonus);
  const size = SIZE[type] ?? { w: 64, h: 64 };
  const { w, h } = size;

  // Flip: direções 0 e 6 espelham horizontalmente
  const flip = direction === 0 || direction === 6;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: pos.x - w / 2,
    top: pos.y - h,
    zIndex,
    pointerEvents: 'none',
  };

  // PNG do Habbo — tenta primeiro, fallback para SVG
  const FURNI_MAP: Record<string, string> = {
    desk: 'hc_exe_wrkdesk', chair: 'hc_exe_chair', table: 'hc_exe_table',
    sofa: 'hc_exe_sofa', whiteboard: 'hc_exe_whiteboard', plant: 'hc16_5',
  };

  const pngName = FURNI_MAP[type];

  if (pngName && usePng) {
    return (
      <img
        src={`/furni/${pngName}.png`}
        alt={type}
        width={w}
        height={h}
        style={{
          ...style,
          imageRendering: 'pixelated',
          transform: flip ? 'scaleX(-1)' : undefined,
          filter: color && type === 'desk'
            ? `sepia(1) saturate(3) hue-rotate(${hueFromHex(color)}deg) brightness(0.9)`
            : undefined,
        }}
        onError={() => setUsePng(false)}
      />
    );
  }

  // SVG isométrico nativo por tipo
  const svgStyle = { ...style };
  switch (type) {
    case 'desk':       return <div style={svgStyle}><DeskSVG color={color} flip={flip} /></div>;
    case 'chair':      return <div style={svgStyle}><ChairSVG color={color} flip={flip} /></div>;
    case 'table':      return <div style={svgStyle}><TableSVG /></div>;
    case 'sofa':       return <div style={svgStyle}><SofaSVG color={color} flip={flip} /></div>;
    case 'whiteboard': return <div style={svgStyle}><WhiteboardSVG /></div>;
    case 'plant':      return <div style={svgStyle}><PlantSVG /></div>;
    case 'divider':    return <div style={svgStyle}><DividerSVG /></div>;
    default:
      return (
        <div style={svgStyle}>
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            <polygon points={`${w*0.5},4 ${w-4},${h*0.5} ${w*0.5},${h-4} 4,${h*0.5}`} fill="#475569" />
            <text x={w/2} y={h/2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontFamily="monospace">{type[0].toUpperCase()}</text>
          </svg>
        </div>
      );
  }
}

function hueFromHex(hex: string): number {
  try {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0,2), 16) / 255;
    const g = parseInt(h.slice(2,4), 16) / 255;
    const b = parseInt(h.slice(4,6), 16) / 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let hue = 0;
    if (max !== min) {
      const d = max - min;
      if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) hue = ((b - r) / d + 2) / 6;
      else hue = ((r - g) / d + 4) / 6;
    }
    return Math.round(hue * 360);
  } catch { return 0; }
}
