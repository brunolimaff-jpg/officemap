'use client';

import React, { useMemo, useState } from 'react';
import IsoFurnitureFallback from './IsoFurnitureFallback';

const FURNI_MAP: Record<string, string> = {
  desk:       'hc_exe_wrkdesk',
  chair:      'hc_exe_chair',
  chair2:     'hc_exe_chair2',
  table:      'hc_exe_table',
  sofa:       'hc_exe_sofa',
  whiteboard: 'hc_exe_whiteboard',
  plant:      'hc16_5',
};

const PNG_OVERRIDE: Partial<Record<string, string>> = {
  sofa: '/furni/club_sofa.png',
};

interface FurniSpriteProps {
  type: string;
  pos: { x: number; y: number };
  color?: string;
  direction?: number;
  tileX: number;
  tileY: number;
  zIndex: number;
}

const SIZE: Record<string, { w: number; h: number }> = {
  desk:       { w: 64, h: 64 },
  divider:    { w: 64, h: 64 },
  rug:        { w: 128, h: 64 },
  laptop:     { w: 32, h: 32 },
  bookshelf:  { w: 48, h: 80 },
  chair:      { w: 48, h: 48 },
  chair2:     { w: 48, h: 48 },
  table:      { w: 80, h: 80 },
  sofa:       { w: 72, h: 72 },
  whiteboard: { w: 48, h: 64 },
  plant:      { w: 48, h: 56 },
};

export default function FurniSprite({ type, pos, color, direction, tileX, tileY, zIndex }: FurniSpriteProps) {
  const classname = FURNI_MAP[type];
  const size = SIZE[type] ?? { w: 64, h: 64 };
  const { w, h } = size;
  const flip = direction === 0 || direction === 2;

  const candidates = useMemo(() => {
    const list: string[] = [];
    const o = PNG_OVERRIDE[type];
    if (o) list.push(o);
    if (classname) list.push(`/furni/${classname}.png`);
    return list;
  }, [type, classname]);

  const [idx, setIdx] = useState(0);
  const yOffset = type === 'laptop' ? 24 : 0;

  if (!classname || idx >= candidates.length) {
    return (
      <IsoFurnitureFallback
        type={type}
        color={color}
        w={w}
        h={h}
        left={pos.x - w / 2}
        top={pos.y - h - yOffset}
        zIndex={zIndex}
      />
    );
  }

  const src = candidates[idx];

  return (
    <img
      src={src}
      alt={type}
      width={w}
      height={h}
      className="absolute pointer-events-none"
      style={{
        left: pos.x - w / 2,
        top: pos.y - h - yOffset,
        zIndex,
        imageRendering: 'pixelated',
        transform: flip ? 'scaleX(-1)' : undefined,
        filter: color && type === 'desk'
          ? `sepia(1) saturate(3) hue-rotate(${hueFromHex(color)}deg) brightness(0.9)`
          : undefined,
      }}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

function hueFromHex(hex: string): number {
  try {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue = 0;
    if (max !== min) {
      const d = max - min;
      if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) hue = ((b - r) / d + 2) / 6;
      else hue = ((r - g) / d + 4) / 6;
    }
    return Math.round(hue * 360);
  } catch {
    return 0;
  }
}