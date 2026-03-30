import React from 'react';

// ─── Mapeamento classname → tipo de móvel ───────────────────────────────────
// Prioridade: PNG do Habbo real. Fallback: SVG embutido.
const FURNI_MAP: Record<string, string> = {
  desk:       'hc_exe_wrkdesk',
  chair:      'hc_exe_chair',
  chair2:     'hc_exe_chair2',
  table:      'hc_exe_table',
  sofa:       'hc_exe_sofa',
  whiteboard: 'hc_exe_whiteboard',
  plant:      'hc16_5',
};

interface FurniSpriteProps {
  type: string;
  pos: { x: number; y: number };
  color?: string;
  direction?: number;
  tileX: number;
  tileY: number;
}

// Tamanho de exibição para cada tipo
const SIZE: Record<string, { w: number; h: number }> = {
  desk:       { w: 64, h: 64 },
  chair:      { w: 48, h: 48 },
  chair2:     { w: 48, h: 48 },
  table:      { w: 80, h: 80 },
  sofa:       { w: 72, h: 72 },
  whiteboard: { w: 48, h: 64 },
  plant:      { w: 48, h: 56 },
};

// ─── Fallback SVG minimalista (caso o PNG não carregue) ──────────────────────
function FallbackSVG({ type, color = '#64748B', pos, zIndex, w, h }: {
  type: string; color?: string; pos: { x: number; y: number };
  zIndex: number; w: number; h: number;
}) {
  const label = type[0].toUpperCase();
  return (
    <svg
      width={w} height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="absolute pointer-events-none"
      style={{ left: pos.x - w / 2, top: pos.y - h, zIndex, imageRendering: 'pixelated' }}
    >
      {/* Sombra */}
      <ellipse cx={w/2} cy={h - 4} rx={w * 0.35} ry={6} fill="#000" opacity={0.15} />
      {/* Corpo isométrico simples */}
      <polygon
        points={`${w*0.1},${h*0.5} ${w*0.5},${h*0.3} ${w*0.9},${h*0.5} ${w*0.5},${h*0.7}`}
        fill={color}
        stroke={`${color}88`}
        strokeWidth="1"
      />
      {/* Label central */}
      <text x={w/2} y={h*0.54} textAnchor="middle" dominantBaseline="middle"
        fill="#fff" fontSize="10" fontWeight="bold" fontFamily="monospace">
        {label}
      </text>
    </svg>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function FurniSprite({ type, pos, color, direction, tileX, tileY }: FurniSpriteProps) {
  const zIndex = Math.floor((tileX + tileY) * 10 + 2);
  const classname = FURNI_MAP[type];
  const size = SIZE[type] ?? { w: 64, h: 64 };
  const { w, h } = size;

  // Flip horizontal para direções 0 e 2 (espelho)
  const flip = direction === 0 || direction === 2;

  if (!classname) {
    return <FallbackSVG type={type} color={color} pos={pos} zIndex={zIndex} w={w} h={h} />;
  }

  return (
    <img
      src={`/furni/${classname}.png`}
      alt={type}
      width={w}
      height={h}
      className="absolute pointer-events-none"
      style={{
        left: pos.x - w / 2,
        top: pos.y - h,
        zIndex,
        imageRendering: 'pixelated',
        transform: flip ? 'scaleX(-1)' : undefined,
        filter: color && type === 'desk'
          ? `sepia(1) saturate(3) hue-rotate(${hueFromHex(color)}deg) brightness(0.9)`
          : undefined,
      }}
      onError={(e) => {
        // Fallback: esconde a img e mostra nada (o tile aparece vazio)
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

// Converte cor hex para graus de hue-rotate (aproximado)
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
