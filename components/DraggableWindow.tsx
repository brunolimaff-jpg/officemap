import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

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
  height = 400
}: DraggableWindowProps) {
  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: pos.x,
      initialY: pos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      setPos({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className="absolute bg-[#D4D0C8] border-2 border-white border-b-[#808080] border-r-[#808080] shadow-[1px_1px_0_#000] flex flex-col z-50 select-none"
      style={{ 
        left: pos.x, 
        top: pos.y, 
        width, 
        height,
        fontFamily: 'Tahoma, sans-serif'
      }}
    >
      {/* Title Bar */}
      <div 
        className="h-6 bg-[#0A246A] text-white flex items-center justify-between px-1 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-bold pl-1">{title}</span>
        <button 
          onClick={onClose}
          className="w-4 h-4 bg-[#D4D0C8] border border-white border-b-[#808080] border-r-[#808080] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
        >
          <X size={12} color="#000" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-2 bg-[#ECE9D8] border-t-2 border-t-[#808080] border-l-2 border-l-[#808080] border-b-2 border-b-white border-r-2 border-r-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}
