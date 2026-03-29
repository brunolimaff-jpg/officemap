import { RoomConfig } from '@/types';
import { cn } from '@/lib/utils';

interface RoomProps {
  room: RoomConfig;
  isActive: boolean;
  children?: React.ReactNode;
}

const roomColors: Record<string, { floor: string, wall1: string, wall2: string }> = {
  strategy: { floor: '#1E3A5F', wall1: '#2A4A75', wall2: '#152A45' },
  data: { floor: '#2D1B69', wall1: '#3F278C', wall2: '#1E1247' },
  product: { floor: '#0D3B2E', wall1: '#145442', wall2: '#08241C' },
  engineering: { floor: '#3B1F0A', wall1: '#542D0F', wall2: '#241306' },
  reception: { floor: '#1E293B', wall1: '#2A3A52', wall2: '#131A26' },
};

export function Room({ room, isActive, children }: RoomProps) {
  const colors = roomColors[room.id] || roomColors.reception;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center transition-all duration-300',
        isActive ? 'shadow-[8px_8px_0_rgba(251,191,36,0.5)]' : 'shadow-[8px_8px_0_rgba(0,0,0,0.3)]'
      )}
      style={{ 
        gridArea: room.gridArea,
        backgroundColor: colors.floor,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        border: '1px solid rgba(255,255,255,0.1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Radial lighting */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)'
        }}
      />

      {/* Rug */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-2 border-white/10",
          room.id === 'reception' ? "w-2/3 h-2/3 rounded-full bg-indigo-900/40 border-indigo-500/30" : "w-3/4 h-3/4 bg-black/20"
        )}
        style={{
          transform: 'translateZ(0.5px)',
        }}
      />

      {/* Left Wall */}
      <div 
        className="absolute top-0 left-0 h-full origin-left pointer-events-none transform-gpu"
        style={{
          width: '160px',
          backgroundColor: colors.wall1,
          transform: 'rotateY(-90deg)',
          border: '1px solid rgba(255,255,255,0.1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Baseboard */}
        <div className="absolute top-0 left-0 w-4 h-full" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} />
        {/* Wall Top Edge (Thickness) */}
        <div 
          className="absolute top-0 left-full w-4 h-full origin-left"
          style={{
            backgroundColor: colors.floor,
            filter: 'brightness(1.2)',
            transform: 'rotateY(90deg)',
            borderRight: '1px solid rgba(255,255,255,0.2)',
          }}
        />
      </div>

      {/* Top Wall */}
      <div 
        className="absolute top-0 left-0 w-full origin-top pointer-events-none transform-gpu"
        style={{
          height: '160px',
          backgroundColor: colors.wall2,
          transform: 'rotateX(90deg)',
          border: '1px solid rgba(255,255,255,0.1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Baseboard */}
        <div className="absolute top-0 left-0 w-full h-4" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} />
        {/* Wall Top Edge (Thickness) */}
        <div 
          className="absolute top-full left-0 w-full h-4 origin-top"
          style={{
            backgroundColor: colors.floor,
            filter: 'brightness(1.2)',
            transform: 'rotateX(-90deg)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
          }}
        />
        
        {/* Room Label Sign */}
        <div 
          className="absolute top-1/2 left-4 text-[7px] font-pixel text-slate-200 uppercase tracking-widest bg-black/60 px-1.5 py-0.5 border border-slate-500 shadow-sm flex items-center justify-center pointer-events-none"
          style={{
            transform: 'translateY(-50%) translateZ(1px) scaleY(-1)', // scaleY(-1) flips it so it's right-side up in 3D
          }}
        >
          {room.name}
        </div>
      </div>

      {children}
    </div>
  );
}
