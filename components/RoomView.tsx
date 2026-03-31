'use client';
import React, { useRef, useCallback, useEffect, useState, memo } from 'react';
import IsoCanvas from './IsoCanvas';
import FurniSprite from './FurniSprite';
import { tileToScreen, TILE_H, CANVAS_W, CANVAS_H, zOrder } from '@/lib/isoEngine';
import { furniture } from '@/data/specialists';
import type { User } from './HabboClient';
import type { AvatarStatus } from '@/types';

interface RoomViewProps {
  users: User[];
  map: number[][];
  onTileClick: (x: number, y: number) => void;
}

function getHabboGestureParams(status: AvatarStatus): string {
  switch (status) {
    case 'idle':     return '&action=sit&gesture=eyb';
    case 'speaking': return '&action=sit&gesture=spk';
    case 'summoned': return '&gesture=wav';
    case 'walking':
    default:         return '&gesture=std';
  }
}

function StatusBadge({ status }: { status: AvatarStatus }) {
  if (status === 'walking' || status === 'idle') return null;
  const cfg: Record<string, { label: string; color: string }> = {
    speaking: { label: '🗣', color: '#7C3AED' },
    summoned: { label: '📍', color: '#1D4ED8' },
  };
  const { label, color } = cfg[status] ?? { label: '', color: '#ccc' };
  return (
    <span style={{
      display: 'inline-block', fontSize: 8, lineHeight: 1,
      padding: '2px 4px', borderRadius: 3, background: color,
      marginBottom: 2, fontWeight: 700, letterSpacing: '0.05em',
      boxShadow: `0 1px 4px ${color}80`,
    }}>{label}</span>
  );
}

// ─── Mobília pré-calculada (posições não mudam em runtime) ────────────────────
// Calculamos fora do componente para evitar recalcular a cada render.
const furniWithPos = furniture.map(f => {
  const { px, py } = tileToScreen(f.x, f.y);
  return { ...f, pos: { x: px, y: py + TILE_H } };
});

export default function RoomView({ users, map, onTileClick }: RoomViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const scaleX = el.clientWidth  / CANVAS_W;
      const scaleY = el.clientHeight / CANVAS_H;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const avatarStyle = useCallback(
    (user: User) => {
      const { px, py } = tileToScreen(user.x, user.y);
      const footX = px;
      const footY = py + TILE_H;
      const isWalking = user.avatarStatus === 'walking';
      return {
        left:   footX * scale,
        top:    footY * scale,
        zIndex: zOrder(user.x, user.y) + 200,
        transition: isWalking
          ? 'left 140ms linear, top 140ms linear'
          : 'left 60ms ease-out, top 60ms ease-out',
      };
    },
    [scale]
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0f1e]">
      {/* Bandeira topo */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
        style={{ height: 32 }}
      >
        <div
          className="px-4 py-1 font-pixel text-[9px] text-white tracking-wider"
          style={{
            background: 'linear-gradient(180deg,rgba(10,20,40,0.95),rgba(5,15,35,0.9))',
            border: '1px solid rgba(74,158,255,0.4)',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
            textShadow: '0 1px 2px rgba(0,0,0,0.9)',
          }}
        >
          🏢 BOARD ROOM — Senior Scout 360
        </div>
      </div>

      {/* Container do canvas + sprites + avatares */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ paddingTop: 32 }}
      >
        {/* Camada 1 — canvas isométrico: apenas tiles */}
        <IsoCanvas
          map={map}
          onTileClick={onTileClick}
          scale={scale}
        />

        {/* Camada 2 — móveis SVG: posicionados como HTML sobre o canvas */}
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width:  CANVAS_W * scale,
            height: CANVAS_H * scale,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {furniWithPos.map(f => (
            <FurniSprite
              key={f.id}
              type={f.type}
              pos={f.pos}
              color={f.color}
              direction={f.direction}
              tileX={f.x}
              tileY={f.y}
              label={f.label}
            />
          ))}
        </div>

        {/* Camada 3 — avatares */}
        {users.map((user) => {
          const st       = avatarStyle(user);
          const habboDir = user.direction % 8;
          const gesture  = getHabboGestureParams(user.avatarStatus);
          const avatarSrc =
            `https://www.habbo.com/habbo-imaging/avatarimage?figure=${user.figure}` +
            `&direction=${habboDir}&head_direction=${habboDir}${gesture}&size=m`;
          const avatarH = Math.round(78 * scale);

          return (
            <div
              key={user.id}
              className="absolute pointer-events-none flex flex-col items-center"
              style={{
                left:      st.left,
                top:       st.top,
                zIndex:    st.zIndex,
                transform: 'translate(-50%, -100%)',
                transition: st.transition,
              }}
            >
              <StatusBadge status={user.avatarStatus} />
              <div
                className="mb-0.5 px-1.5 py-px font-pixel text-[8px] font-bold text-white whitespace-nowrap rounded-sm border border-blue-300/40"
                style={{ background: 'rgba(10,30,70,0.85)', fontSize: Math.max(7, 8 * scale) }}
              >
                {user.name}
              </div>
              <img
                src={avatarSrc}
                alt={user.name}
                style={{ height: avatarH, width: 'auto', imageRendering: 'pixelated' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
