'use client';

import React, { useMemo } from 'react';
import { RoomConfig, RoomFurniture, Specialist, SpecialistStatus, SpecialistId } from '@/types';
import { HabboCharacter } from './HabboCharacter';
import { Check, MessageSquareMore } from 'lucide-react';

// ─── Isometric math constants ───────────────────────────────────────────────
const TW = 64;   // tile width  (diamond width)
const TH = 32;   // tile height (diamond height)
const WALL_H = 90; // wall height in screen pixels
const CHAR_W = 52;
const CHAR_H = 80;

function tileTopXY(col: number, row: number, ox: number, oy: number) {
  return {
    x: (col - row) * (TW / 2) + ox,
    y: (col + row) * (TH / 2) + oy,
  };
}

// ─── Furniture SVG shapes ────────────────────────────────────────────────────
function renderFurniture(item: RoomFurniture, ox: number, oy: number): React.ReactNode {
  const { x, y } = tileTopXY(item.col, item.row, ox, oy);
  // Tile corners
  const T = { x, y };
  const R = { x: x + TW / 2, y: y + TH / 2 };
  const B = { x, y: y + TH };
  const L = { x: x - TW / 2, y: y + TH / 2 };

  const pts = (arr: { x: number; y: number }[]) => arr.map(p => `${p.x},${p.y}`).join(' ');

  switch (item.type) {
    case 'desk': {
      const H = 14;
      const top = '#D4A04A';
      const left = '#A07030';
      const right = '#C08040';
      return (
        <g key={item.id}>
          {/* right face */}
          <polygon points={pts([R, B, { x: B.x, y: B.y - H }, { x: R.x, y: R.y - H }])} fill={right} />
          {/* left face */}
          <polygon points={pts([L, B, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={left} />
          {/* top face */}
          <polygon points={pts([{ x: T.x, y: T.y - H }, { x: R.x, y: R.y - H }, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={item.color || top} />
          {/* desktop lines */}
          <line x1={T.x} y1={T.y - H} x2={B.x} y2={B.y - H} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        </g>
      );
    }
    case 'chair': {
      const H = 8;
      const SH = 16; // seat + back height total
      const seatColor = item.color || '#2D3748';
      const backColor = '#1A2030';
      return (
        <g key={item.id}>
          {/* Seat right */}
          <polygon points={pts([{ x: x + 10, y: y + TH / 2 }, B, { x: B.x, y: B.y - H }, { x: x + 10, y: y + TH / 2 - H }])} fill="#1A2030" />
          {/* Seat left */}
          <polygon points={pts([L, { x: x - 10, y: y + TH / 2 }, { x: x - 10, y: y + TH / 2 - H }, { x: L.x, y: L.y - H }])} fill={seatColor} />
          {/* Seat top */}
          <polygon points={pts([{ x: T.x + 6, y: T.y + 4 - H }, { x: x + 10, y: y + TH / 2 - H }, { x: B.x, y: B.y - H }, { x: x - 10, y: y + TH / 2 - H }])} fill={seatColor} />
          {/* Chair back */}
          <polygon points={pts([{ x: T.x - 4, y: T.y + 2 - H }, { x: T.x + 4, y: T.y + 2 - H }, { x: T.x + 4, y: T.y + 2 - SH }, { x: T.x - 4, y: T.y + 2 - SH }])} fill={backColor} />
          <polygon points={pts([{ x: T.x - 4, y: T.y + 2 - H }, { x: T.x + 4, y: T.y + 2 - H }, { x: T.x + 4, y: T.y + 2 - SH }, { x: T.x - 4, y: T.y + 2 - SH }])} fill={backColor} />
        </g>
      );
    }
    case 'plant': {
      const cx = x;
      const cy = y + TH / 2;
      return (
        <g key={item.id}>
          {/* Pot */}
          <polygon points={pts([{ x: cx - 8, y: cy }, { x: cx + 8, y: cy }, { x: cx + 6, y: cy + 12 }, { x: cx - 6, y: cy + 12 }])} fill="#7C4A1E" />
          <ellipse cx={cx} cy={cy} rx={8} ry={4} fill="#9B5E26" />
          {/* Leaves */}
          <circle cx={cx} cy={cy - 14} r={14} fill="#16A34A" />
          <circle cx={cx - 10} cy={cy - 10} r={10} fill="#15803D" />
          <circle cx={cx + 10} cy={cy - 10} r={10} fill="#22C55E" />
          <circle cx={cx} cy={cy - 22} r={9} fill="#16A34A" />
          {/* Highlight */}
          <circle cx={cx + 4} cy={cy - 18} r={3} fill="rgba(255,255,255,0.2)" />
        </g>
      );
    }
    case 'sofa': {
      const H = 12;
      const backH = 22;
      const sofaColor = item.color || '#4F46E5';
      const darkSofa = '#3730A3';
      return (
        <g key={item.id}>
          <polygon points={pts([R, B, { x: B.x, y: B.y - H }, { x: R.x, y: R.y - H }])} fill={darkSofa} />
          <polygon points={pts([L, B, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={sofaColor} />
          <polygon points={pts([{ x: T.x, y: T.y - H }, { x: R.x, y: R.y - H }, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={sofaColor} />
          {/* Back rest */}
          <polygon points={pts([{ x: T.x - 6, y: T.y - H }, { x: T.x + 6, y: T.y - H }, { x: T.x + 6, y: T.y - backH }, { x: T.x - 6, y: T.y - backH }])} fill={darkSofa} />
          <polygon points={`${L.x},${L.y - H} ${T.x - 6},${T.y - H} ${T.x - 6},${T.y - backH} ${L.x},${L.y - backH}`} fill={sofaColor} />
        </g>
      );
    }
    case 'table': {
      const H = 10;
      const tableColor = '#C4956A';
      const darkTable = '#8B6040';
      return (
        <g key={item.id}>
          <polygon points={pts([R, B, { x: B.x, y: B.y - H }, { x: R.x, y: R.y - H }])} fill={darkTable} />
          <polygon points={pts([L, B, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={darkTable} />
          <polygon points={pts([{ x: T.x, y: T.y - H }, { x: R.x, y: R.y - H }, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={tableColor} />
          <line x1={T.x} y1={T.y - H} x2={B.x} y2={B.y - H} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
          <line x1={L.x} y1={L.y - H} x2={R.x} y2={R.y - H} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        </g>
      );
    }
    case 'whiteboard': {
      const WH = 40;
      const cx = T.x;
      const cy = T.y - 4;
      return (
        <g key={item.id}>
          {/* Frame */}
          <rect x={cx - 22} y={cy - WH - 2} width={44} height={WH + 4} rx="1" fill="#374151" />
          {/* Board */}
          <rect x={cx - 20} y={cy - WH} width={40} height={WH} fill="#F1F5F9" />
          {/* Lines on board */}
          <line x1={cx - 15} y1={cy - WH + 8} x2={cx + 12} y2={cy - WH + 8} stroke="#94A3B8" strokeWidth="1.5" />
          <line x1={cx - 15} y1={cy - WH + 16} x2={cx + 5}  y2={cy - WH + 16} stroke="#94A3B8" strokeWidth="1.5" />
          <line x1={cx - 15} y1={cy - WH + 24} x2={cx + 8}  y2={cy - WH + 24} stroke="#3B82F6" strokeWidth="1.5" />
          {/* Marker tray */}
          <rect x={cx - 20} y={cy - 4} width={40} height={4} fill="#6B7280" />
        </g>
      );
    }
    case 'server_rack': {
      const H = 48;
      const rackColor = '#1E293B';
      const darkRack = '#0F172A';
      return (
        <g key={item.id}>
          <polygon points={pts([R, B, { x: B.x, y: B.y - H }, { x: R.x, y: R.y - H }])} fill={darkRack} />
          <polygon points={pts([L, B, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={rackColor} />
          <polygon points={pts([{ x: T.x, y: T.y - H }, { x: R.x, y: R.y - H }, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={rackColor} />
          {/* LEDs on front */}
          {[0, 1, 2, 3, 4].map(i => (
            <circle key={i} cx={x + 4} cy={y + TH / 2 - 8 - i * 8} r={2} fill={i % 2 === 0 ? '#22C55E' : '#3B82F6'} />
          ))}
          {/* Rack lines */}
          {[0, 1, 2, 3].map(i => (
            <line key={i} x1={L.x + 4} y1={L.y - 10 - i * 10} x2={B.x - 4} y2={B.y - 10 - i * 10} stroke="#334155" strokeWidth="1" />
          ))}
        </g>
      );
    }
    case 'monitor': {
      const cx = T.x;
      const cy = T.y - 4;
      return (
        <g key={item.id}>
          {/* Screen */}
          <rect x={cx - 18} y={cy - 30} width={36} height={26} rx="2" fill="#0F172A" />
          <rect x={cx - 16} y={cy - 28} width={32} height={22} rx="1" fill="#1E3A5F" />
          {/* Screen content */}
          <rect x={cx - 12} y={cy - 26} width={24} height={4} rx="1" fill="#3B82F6" opacity="0.7" />
          <rect x={cx - 12} y={cy - 20} width={16} height={2} rx="1" fill="#64748B" opacity="0.6" />
          <rect x={cx - 12} y={cy - 16} width={20} height={2} rx="1" fill="#64748B" opacity="0.6" />
          {/* Stand */}
          <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 2} stroke="#374151" strokeWidth="3" />
          <rect x={cx - 8} y={cy + 2} width={16} height={3} rx="1" fill="#374151" />
        </g>
      );
    }
    case 'laptop': {
      const cx = T.x - 4;
      const cy = T.y + TH / 2 - 4;
      return (
        <g key={item.id}>
          {/* Base */}
          <polygon points={`${cx - 14},${cy} ${cx + 14},${cy} ${cx + 12},${cy + 6} ${cx - 12},${cy + 6}`} fill="#334155" />
          {/* Screen */}
          <polygon points={`${cx - 14},${cy} ${cx + 14},${cy} ${cx + 8},${cy - 14} ${cx - 8},${cy - 14}`} fill="#1E293B" />
          <polygon points={`${cx - 10},${cy - 2} ${cx + 10},${cy - 2} ${cx + 6},${cy - 12} ${cx - 6},${cy - 12}`} fill="#3B82F6" opacity="0.6" />
        </g>
      );
    }
    case 'coffee': {
      const cx = T.x;
      const cy = T.y + TH / 2;
      return (
        <g key={item.id}>
          {/* Machine body */}
          <rect x={cx - 12} y={cy - 24} width={24} height={20} rx="2" fill="#1E293B" />
          <rect x={cx - 10} y={cy - 22} width={20} height={12} rx="1" fill="#0F172A" />
          {/* Buttons */}
          <circle cx={cx - 5} cy={cy - 8} r={3} fill="#F59E0B" />
          <circle cx={cx + 5} cy={cy - 8} r={3} fill="#22C55E" />
          {/* Cup */}
          <polygon points={`${cx - 6},${cy - 4} ${cx + 6},${cy - 4} ${cx + 4},${cy + 4} ${cx - 4},${cy + 4}`} fill="#F8FAFC" />
          {/* Steam */}
          <path d={`M${cx - 2},${cy - 6} Q${cx},${cy - 10} ${cx + 2},${cy - 6}`} stroke="#94A3B8" strokeWidth="1" fill="none" opacity="0.6" />
        </g>
      );
    }
    case 'water_cooler': {
      const cx = T.x;
      const cy = T.y + TH / 2;
      return (
        <g key={item.id}>
          <rect x={cx - 8} y={cy - 30} width={16} height={26} rx="2" fill="#CBD5E1" />
          <ellipse cx={cx} cy={cy - 34} rx={7} ry={9} fill="#93C5FD" />
          <rect x={cx - 4} y={cy - 12} width={8} height={4} rx="1" fill="#3B82F6" />
        </g>
      );
    }
    case 'bookshelf': {
      const H = 42;
      const shelfColor = '#7C4A1E';
      const darkShelf = '#5C3410';
      return (
        <g key={item.id}>
          <polygon points={pts([R, B, { x: B.x, y: B.y - H }, { x: R.x, y: R.y - H }])} fill={darkShelf} />
          <polygon points={pts([L, B, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={shelfColor} />
          <polygon points={pts([{ x: T.x, y: T.y - H }, { x: R.x, y: R.y - H }, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={shelfColor} />
          {/* Book spines */}
          {['#EF4444','#3B82F6','#22C55E','#F59E0B','#8B5CF6'].map((c, i) => (
            <rect key={i} x={x - 16 + i * 7} y={y - H + 6} width={5} height={H - 12} rx="1" fill={c} opacity="0.9" />
          ))}
        </g>
      );
    }
    case 'trophy': {
      const cx = T.x;
      const cy = T.y + TH / 2 - 4;
      return (
        <g key={item.id}>
          <polygon points={`${cx - 8},${cy} ${cx + 8},${cy} ${cx + 5},${cy - 16} ${cx - 5},${cy - 16}`} fill="#F59E0B" />
          <path d={`M${cx - 8},${cy - 10} Q${cx - 14},${cy - 16} ${cx - 10},${cy - 22}`} stroke="#F59E0B" strokeWidth="3" fill="none" />
          <path d={`M${cx + 8},${cy - 10} Q${cx + 14},${cy - 16} ${cx + 10},${cy - 22}`} stroke="#F59E0B" strokeWidth="3" fill="none" />
          <ellipse cx={cx} cy={cy - 22} rx={9} ry={7} fill="#FBBF24" />
          <line x1={cx} y1={cy} x2={cx} y2={cy + 4} stroke="#92400E" strokeWidth="3" />
          <rect x={cx - 8} y={cy + 4} width={16} height={4} rx="1" fill="#92400E" />
        </g>
      );
    }
    case 'rug': {
      const rugColor = '#7C3AED';
      return (
        <g key={item.id}>
          <polygon points={pts([T, R, B, L])} fill={rugColor} opacity="0.5" />
          <polygon
            points={`${T.x},${T.y + 6} ${R.x - 6},${R.y} ${B.x},${B.y - 6} ${L.x + 6},${L.y}`}
            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
          />
        </g>
      );
    }
    case 'shelf':
    case 'filing_cabinet': {
      const H = 24;
      const fc = '#475569';
      const dark = '#334155';
      return (
        <g key={item.id}>
          <polygon points={pts([R, B, { x: B.x, y: B.y - H }, { x: R.x, y: R.y - H }])} fill={dark} />
          <polygon points={pts([L, B, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={fc} />
          <polygon points={pts([{ x: T.x, y: T.y - H }, { x: R.x, y: R.y - H }, { x: B.x, y: B.y - H }, { x: L.x, y: L.y - H }])} fill={fc} />
          <line x1={L.x + 2} y1={L.y - 10} x2={B.x - 2} y2={B.y - 10} stroke={dark} strokeWidth="1" />
        </g>
      );
    }
    default:
      return null;
  }
}

// ─── Main component ──────────────────────────────────────────────────────────
interface HabboRoomProps {
  room: RoomConfig;
  specialists: Specialist[];
  showBruno: boolean;
  selectedSpecialists: SpecialistId[];
  onSpecialistClick: (id: SpecialistId, isShiftPressed: boolean) => void;
  specialistStatuses: Record<SpecialistId, SpecialistStatus>;
}

interface CharData {
  col: number;
  row: number;
  specialist?: Specialist;
  isBruno?: boolean;
}

export function HabboRoom({
  room,
  specialists: roomSpecialists,
  showBruno,
  selectedSpecialists,
  onSpecialistClick,
  specialistStatuses,
}: HabboRoomProps) {
  const { cols, rows } = room;

  // SVG offset so that left-most point is at x = CHAR_W/2 + 4 and top is at y = 4
  const ox = rows * (TW / 2) + CHAR_W / 2 + 4;
  const oy = WALL_H + CHAR_H + 4;

  const svgW = (cols + rows) * (TW / 2) + CHAR_W + 8;
  const svgH = (cols + rows) * (TH / 2) + WALL_H + CHAR_H + 16;

  // Sort tiles by painter's order (back to front)
  const tiles = useMemo(() => {
    const list: { col: number; row: number }[] = [];
    for (let sum = 0; sum < cols + rows - 1; sum++) {
      for (let c = 0; c <= sum; c++) {
        const r = sum - c;
        if (c < cols && r < rows) list.push({ col: c, row: r });
      }
    }
    return list;
  }, [cols, rows]);

  // Sort furniture by depth
  const sortedFurniture = useMemo(
    () => [...room.furniture].sort((a, b) => (a.col + a.row) - (b.col + b.row)),
    [room.furniture]
  );

  // Build character list
  const characters: CharData[] = useMemo(() => {
    const list: CharData[] = [];
    roomSpecialists.forEach(s => list.push({ col: s.col, row: s.row, specialist: s }));
    if (showBruno && room.brunoCol !== undefined && room.brunoRow !== undefined) {
      list.push({ col: room.brunoCol, row: room.brunoRow, isBruno: true });
    }
    return list;
  }, [roomSpecialists, showBruno, room]);

  // Sort characters by depth (painters)
  const sortedChars = useMemo(
    () => [...characters].sort((a, b) => (a.col + a.row) - (b.col + b.row)),
    [characters]
  );

  return (
    <div className="relative select-none" style={{ width: svgW, height: svgH }}>
      {/* SVG layer: floor, walls, furniture */}
      <svg
        width={svgW}
        height={svgH}
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
      >
        {/* Back wall (row = 0) */}
        {Array.from({ length: cols }, (_, c) => {
          const { x, y } = tileTopXY(c, 0, ox, oy);
          const T2 = { x, y };
          const R2 = { x: x + TW / 2, y: y + TH / 2 };
          return (
            <polygon
              key={`bw${c}`}
              points={`${T2.x},${T2.y} ${R2.x},${R2.y} ${R2.x},${R2.y - WALL_H} ${T2.x},${T2.y - WALL_H}`}
              fill={room.wallColor}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Left wall (col = 0) */}
        {Array.from({ length: rows }, (_, r) => {
          const { x, y } = tileTopXY(0, r, ox, oy);
          const T2 = { x, y };
          const L2 = { x: x - TW / 2, y: y + TH / 2 };
          return (
            <polygon
              key={`lw${r}`}
              points={`${T2.x},${T2.y} ${L2.x},${L2.y} ${L2.x},${L2.y - WALL_H} ${T2.x},${T2.y - WALL_H}`}
              fill={room.wallColor2}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Wall top edge line */}
        {(() => {
          const start = tileTopXY(0, 0, ox, oy);
          const endBack = tileTopXY(cols - 1, 0, ox, oy);
          const endLeft = tileTopXY(0, rows - 1, ox, oy);
          return (
            <>
              <line
                x1={start.x} y1={start.y - WALL_H}
                x2={endBack.x + TW / 2} y2={endBack.y + TH / 2 - WALL_H}
                stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
              />
              <line
                x1={start.x} y1={start.y - WALL_H}
                x2={endLeft.x - TW / 2} y2={endLeft.y + TH / 2 - WALL_H}
                stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"
              />
              {/* Corner vertical edge */}
              <line
                x1={start.x} y1={start.y}
                x2={start.x} y2={start.y - WALL_H}
                stroke="rgba(255,255,255,0.12)" strokeWidth="1"
              />
            </>
          );
        })()}

        {/* Floor tiles */}
        {tiles.map(({ col, row }) => {
          const { x, y } = tileTopXY(col, row, ox, oy);
          const isLight = (col + row) % 2 === 0;
          const fill = isLight ? room.floorColors[0] : room.floorColors[1];
          return (
            <polygon
              key={`t${col}${row}`}
              points={`${x},${y} ${x + TW / 2},${y + TH / 2} ${x},${y + TH} ${x - TW / 2},${y + TH / 2}`}
              fill={fill}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Furniture */}
        {sortedFurniture.map(item => renderFurniture(item, ox, oy))}
      </svg>

      {/* Character layer: interactive HTML divs */}
      {sortedChars.map((char, idx) => {
        const { x, y } = tileTopXY(char.col, char.row, ox, oy);
        // Feet at tile bottom
        const feetX = x;
        const feetY = y + TH;
        const charLeft = feetX - CHAR_W / 2;
        const charTop = feetY - CHAR_H + 8;

        if (char.isBruno) {
          return (
            <div
              key="bruno"
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ left: charLeft, top: charTop, zIndex: 10 + char.col + char.row }}
            >
              <HabboCharacter color="#1E5B8A" isBruno />
              <div className="mt-[-4px] text-[8px] font-pixel text-white bg-[#1E5B8A] px-2 py-0.5 rounded border border-[#0F3460] whitespace-nowrap shadow">
                Bruno
              </div>
            </div>
          );
        }

        const s = char.specialist!;
        const status = specialistStatuses[s.id] || 'available';
        const isSelected = selectedSpecialists.includes(s.id);

        return (
          <div
            key={s.id}
            className="absolute flex flex-col items-center cursor-pointer group"
            style={{ left: charLeft, top: charTop - 4, zIndex: 10 + char.col + char.row }}
            onClick={(e) => onSpecialistClick(s.id, e.shiftKey)}
          >
            {/* Status indicators */}
            <div className="absolute -top-6 flex items-center gap-1">
              {status === 'thinking' && (
                <div className="bg-white border border-black rounded-full p-0.5 animate-bounce shadow">
                  <MessageSquareMore size={10} className="text-black" />
                </div>
              )}
              {status === 'responding' && (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              )}
              {isSelected && (
                <div className="bg-green-500 rounded-full p-0.5 shadow">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Selection ring */}
            {isSelected && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: `0 0 0 3px ${s.color}, 0 0 12px ${s.color}80`,
                  borderRadius: '50%',
                  width: CHAR_W,
                  height: CHAR_H - 8,
                }}
              />
            )}

            {/* Thinking bob */}
            <div className={status === 'thinking' ? 'animate-thinking-bob' : ''}>
              <HabboCharacter color={s.color} role={s.role} />
            </div>

            {/* Name tag */}
            <div
              className="mt-[-4px] text-[8px] font-pixel px-1.5 py-0.5 rounded border whitespace-nowrap shadow-sm group-hover:scale-110 transition-transform"
              style={{
                backgroundColor: s.color + 'CC',
                borderColor: s.color,
                color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {s.name}
            </div>

            {/* Hover tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
              <div className="habbo-speech text-center w-36">
                <div className="font-bold text-[9px] mb-1" style={{ color: s.color }}>{s.name}</div>
                <div className="text-[8px] text-slate-600">{s.role}</div>
                <div className="mt-1 text-[7px] text-slate-400">
                  {isSelected ? 'Clique para deselecionar' : 'Clique para conversar'}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
