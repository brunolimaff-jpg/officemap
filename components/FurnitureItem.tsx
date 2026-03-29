'use client';

import { Furniture } from '@/types';
import { cn } from '@/lib/utils';

interface FurnitureItemProps {
  item: Furniture;
}

export function FurnitureItem({ item }: FurnitureItemProps) {
  const renderItem = () => {
    switch (item.type) {
      case 'desk':
        return (
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {/* Desk Top */}
            <div 
              className="absolute inset-0 bg-slate-400 border border-slate-500 shadow-md"
              style={{ transform: 'translateZ(12px)' }}
            />
            {/* Desk Legs */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-slate-600" style={{ transform: 'translateZ(0) rotateX(-90deg)', transformOrigin: 'top' }} />
            <div className="absolute top-0 right-0 w-1 h-1 bg-slate-600" style={{ transform: 'translateZ(0) rotateX(-90deg)', transformOrigin: 'top' }} />
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-slate-600" style={{ transform: 'translateZ(0) rotateX(-90deg)', transformOrigin: 'top' }} />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-slate-600" style={{ transform: 'translateZ(0) rotateX(-90deg)', transformOrigin: 'top' }} />
          </div>
        );
      case 'chair':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
             <div 
              className="w-4 h-4 bg-slate-700 border border-slate-800 rounded-sm"
              style={{ transform: 'translateZ(6px)' }}
            />
            <div 
              className="absolute bottom-0 w-4 h-4 bg-slate-800 border border-slate-900"
              style={{ transform: 'rotateX(-90deg) translateZ(2px)', transformOrigin: 'bottom' }}
            />
          </div>
        );
      case 'plant':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Pot */}
            <div className="w-3 h-3 bg-amber-800 border border-amber-900" style={{ transform: 'translateZ(4px)' }} />
            {/* Leaves (Billboarded) */}
            <div 
              className="absolute bottom-1 w-6 h-8 bg-green-600 rounded-full border border-green-800"
              style={{ 
                transform: 'rotateZ(45deg) rotateX(-60deg) translateY(-4px)',
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
              }}
            />
          </div>
        );
      case 'shelf':
        return (
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-amber-900 border border-amber-950" style={{ transform: 'rotateY(90deg)', transformOrigin: 'left' }} />
            <div className="absolute inset-0 bg-amber-800 border border-amber-900" style={{ transform: 'translateZ(20px)' }} />
          </div>
        );
      case 'monitor':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <div 
              className="w-4 h-3 bg-black border border-slate-700"
              style={{ transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(14px)' }}
            >
              <div className="absolute inset-0.5 bg-blue-400/20" />
            </div>
          </div>
        );
      case 'laptop':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <div 
              className="w-3 h-2 bg-slate-300 border border-slate-400"
              style={{ transform: 'translateZ(13px) rotateX(-10deg)' }}
            />
          </div>
        );
      case 'coffee':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <div className="w-1.5 h-1.5 bg-white border border-slate-200 rounded-full" style={{ transform: 'translateZ(13px)' }} />
          </div>
        );
      case 'water_cooler':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Base */}
            <div className="w-3 h-4 bg-slate-200 border border-slate-300" style={{ transform: 'translateZ(2px)' }} />
            {/* Bottle */}
            <div className="absolute bottom-4 w-2.5 h-3 bg-blue-300/60 border border-blue-400/80 rounded-t-sm" style={{ transform: 'translateZ(6px)' }} />
          </div>
        );
      case 'whiteboard':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Stand */}
            <div className="w-full h-1 bg-slate-400" style={{ transform: 'translateZ(1px)' }} />
            {/* Board */}
            <div 
              className="absolute bottom-1 w-8 h-6 bg-white border-2 border-slate-300"
              style={{ transform: 'rotateX(-90deg) translateZ(8px)', transformOrigin: 'bottom' }}
            >
              {/* Scribbles */}
              <div className="absolute top-1 left-1 w-4 h-0.5 bg-blue-400/50" />
              <div className="absolute top-2 left-1 w-3 h-0.5 bg-red-400/50" />
              <div className="absolute top-3 left-1 w-5 h-0.5 bg-green-400/50" />
            </div>
          </div>
        );
      case 'sofa':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Seat */}
            <div 
              className="w-full h-full bg-red-700 border border-red-800 rounded-sm"
              style={{ transform: 'translateZ(4px)' }}
            />
            {/* Backrest */}
            <div 
              className="absolute top-0 w-full h-4 bg-red-800 border border-red-900 rounded-t-sm"
              style={{ transform: 'rotateX(-90deg) translateZ(4px)', transformOrigin: 'top' }}
            />
            {/* Armrests */}
            <div className="absolute left-0 w-1 h-full bg-red-600 border border-red-700" style={{ transform: 'translateZ(6px)' }} />
            <div className="absolute right-0 w-1 h-full bg-red-600 border border-red-700" style={{ transform: 'translateZ(6px)' }} />
          </div>
        );
      case 'table':
        return (
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {/* Table Top */}
            <div 
              className="absolute inset-0 bg-amber-700 border border-amber-800 shadow-md rounded-full"
              style={{ transform: 'translateZ(10px)' }}
            />
            {/* Center Leg */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-slate-700 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(0) rotateX(-90deg)', transformOrigin: 'top' }} />
          </div>
        );
      case 'server_rack':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Rack Body (Top) */}
            <div 
              className="absolute inset-0 bg-slate-800 border border-slate-900 shadow-lg"
              style={{ transform: 'translateZ(48px)' }}
            />
            {/* Front Panel */}
            <div 
              className="absolute bottom-0 w-full h-12 bg-slate-900 border border-slate-950 flex flex-col items-center justify-evenly py-1"
              style={{ transform: 'rotateX(-90deg)', transformOrigin: 'bottom' }}
            >
              <div className="w-3/4 h-1 bg-slate-700 flex justify-end px-0.5 items-center"><div className="w-0.5 h-0.5 bg-green-400 rounded-full animate-pulse" /></div>
              <div className="w-3/4 h-1 bg-slate-700 flex justify-end px-0.5 items-center"><div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse" /></div>
              <div className="w-3/4 h-1 bg-slate-700 flex justify-end px-0.5 items-center"><div className="w-0.5 h-0.5 bg-green-400 rounded-full animate-pulse" /></div>
              <div className="w-3/4 h-1 bg-slate-700 flex justify-end px-0.5 items-center"><div className="w-0.5 h-0.5 bg-red-400 rounded-full animate-pulse" /></div>
            </div>
            {/* Side Panel (Left) */}
            <div 
              className="absolute bottom-0 left-0 w-full h-12 bg-slate-800 border border-slate-900"
              style={{ transform: 'rotateY(-90deg) rotateX(-90deg)', transformOrigin: 'bottom left' }}
            />
            {/* Side Panel (Right) */}
            <div 
              className="absolute bottom-0 right-0 w-full h-12 bg-slate-800 border border-slate-900"
              style={{ transform: 'rotateY(90deg) rotateX(-90deg)', transformOrigin: 'bottom right' }}
            />
            {/* Back Panel */}
            <div 
              className="absolute top-0 w-full h-12 bg-slate-800 border border-slate-900"
              style={{ transform: 'rotateX(-90deg)', transformOrigin: 'top' }}
            />
          </div>
        );
      case 'filing_cabinet':
        return (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* Cabinet Body (Top) */}
            <div 
              className="absolute inset-0 bg-slate-300 border border-slate-400 shadow-sm"
              style={{ transform: 'translateZ(24px)' }}
            />
            {/* Front Panel with Drawers */}
            <div 
              className="absolute bottom-0 w-full h-6 bg-slate-200 border border-slate-300 flex flex-col items-center justify-evenly py-0.5"
              style={{ transform: 'rotateX(-90deg)', transformOrigin: 'bottom' }}
            >
              <div className="w-5/6 h-1.5 bg-slate-100 border border-slate-300 flex justify-center items-center"><div className="w-2 h-0.5 bg-slate-400" /></div>
              <div className="w-5/6 h-1.5 bg-slate-100 border border-slate-300 flex justify-center items-center"><div className="w-2 h-0.5 bg-slate-400" /></div>
              <div className="w-5/6 h-1.5 bg-slate-100 border border-slate-300 flex justify-center items-center"><div className="w-2 h-0.5 bg-slate-400" /></div>
            </div>
            {/* Side Panel (Left) */}
            <div 
              className="absolute bottom-0 left-0 w-full h-6 bg-slate-300 border border-slate-400"
              style={{ transform: 'rotateY(-90deg) rotateX(-90deg)', transformOrigin: 'bottom left' }}
            />
            {/* Side Panel (Right) */}
            <div 
              className="absolute bottom-0 right-0 w-full h-6 bg-slate-300 border border-slate-400"
              style={{ transform: 'rotateY(90deg) rotateX(-90deg)', transformOrigin: 'bottom right' }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative w-full h-full pointer-events-none"
      style={{ gridArea: item.gridArea, transformStyle: 'preserve-3d' }}
    >
      {renderItem()}
    </div>
  );
}
