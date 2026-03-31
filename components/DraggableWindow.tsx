import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DraggableWindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  defaultX?: number;
  defaultY?: number;
  width?: number;
  height?: number;
}

export default function DraggableWindow({
  title,
  children,
  onClose,
  defaultX = 100,
  defaultY = 100,
  width = 300,
  height = 400,
}: DraggableWindowProps) {
  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Nao inicia drag em botoes
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, initX: pos.x, initY: pos.y };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const nx = dragRef.current.initX + (e.clientX - dragRef.current.startX);
      const ny = dragRef.current.initY + (e.clientY - dragRef.current.startY);
      // Clamp: janela nao sai da viewport
      setPos({
        x: Math.max(0, Math.min(nx, window.innerWidth  - width)),
        y: Math.max(0, Math.min(ny, window.innerHeight - 40)),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [isDragging, width]);

  return (
    <div
      style={{
        position:   'absolute',
        left:       pos.x,
        top:        pos.y,
        width,
        height:     isMinimized ? 'auto' : height,
        zIndex:     100,
        userSelect: 'none',
        display:    'flex',
        flexDirection: 'column',
        // Sombra solida estilo Habbo (offset 3px)
        boxShadow: '3px 3px 0 #000, 1px 1px 0 #30363d',
        border: '2px solid #30363d',
        borderTop: '2px solid #484f58',
        borderLeft: '2px solid #484f58',
        background: '#0d1117',
        fontFamily: 'monospace',
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          height: 28,
          background: isDragging
            ? 'linear-gradient(180deg, #1f6feb 0%, #1158c7 100%)'
            : 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 8,
          paddingRight: 4,
          cursor: isDragging ? 'grabbing' : 'grab',
          flexShrink: 0,
        }}
      >
        <span style={{ color: '#e6edf3', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 }}>
          {title}
        </span>

        {/* Botoes de controle estilo OS pixel */}
        <div style={{ display: 'flex', gap: 3 }}>
          {/* Minimizar */}
          <button
            onClick={() => setIsMinimized(p => !p)}
            title={isMinimized ? 'Restaurar' : 'Minimizar'}
            style={{
              width: 16,
              height: 16,
              background: 'linear-gradient(180deg, #3D3D3D 0%, #252525 100%)',
              border: '1px solid #555',
              borderBottom: '1px solid #111',
              borderRight: '1px solid #111',
              color: '#ccc',
              fontSize: 9,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              padding: 0,
              fontFamily: 'monospace',
            }}
          >
            {isMinimized ? '+' : '–'}
          </button>
          {/* Fechar */}
          <button
            onClick={onClose}
            title="Fechar"
            style={{
              width: 16,
              height: 16,
              background: 'linear-gradient(180deg, #8B0000 0%, #5A0000 100%)',
              border: '1px solid #C00',
              borderBottom: '1px solid #400',
              borderRight: '1px solid #400',
              color: '#FCA5A5',
              fontSize: 9,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              padding: 0,
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content Area */}
      {!isMinimized && (
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            background: '#0d1117',
            borderTop: '1px solid #21262d',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
