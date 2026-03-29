import { Specialist, SpecialistStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Check, MessageSquareMore } from 'lucide-react';
import Image from 'next/image';

const habboFigures: Record<string, string> = {
  carlos: 'hr-115-42.hd-190-1.ch-210-66.lg-270-82.sh-290-91',
  marcos: 'hr-893-31.hd-209-2.ch-250-64.lg-280-110.sh-300-64',
  sophia: 'hr-515-45.hd-600-1.ch-630-73.lg-710-64.sh-730-62',
  andre: 'hr-100-45.hd-208-8.ch-235-71.lg-3216-82.sh-295-62',
  diego: 'hr-165-45.hd-180-3.ch-255-63.lg-281-110.sh-305-62',
  raquel: 'hr-540-42.hd-600-2.ch-665-71.lg-720-82.sh-725-62',
  helena: 'hr-831-49.hd-620-9.ch-660-86.lg-700-85.sh-735-68',
  victor: 'hr-802-37.hd-600-3.ch-685-79.lg-720-76.sh-730-64',
};

interface SpecialistAvatarProps {
  specialist: Specialist;
  status: SpecialistStatus;
  isSelected: boolean;
  onClick: (id: Specialist['id'], isShiftPressed: boolean) => void;
}

export function SpecialistAvatar({ specialist, status, isSelected, onClick }: SpecialistAvatarProps) {
  const handleClick = (e: React.MouseEvent) => {
    onClick(specialist.id, e.shiftKey);
  };

  return (
    <div
      className="relative group cursor-pointer flex flex-col items-center justify-center transform-style-3d"
      style={{ gridArea: specialist.gridArea, transformStyle: 'preserve-3d' }}
      onClick={handleClick}
    >
      {/* Selection Indicator (Floor) */}
      {isSelected && (
        <div className="absolute w-16 h-16 border-[3px] border-amber-400 bg-amber-400/20 transform-gpu" style={{ transform: 'translateZ(1px)' }} />
      )}

      {/* Habbo Rug (Replaces clunky 3D furniture) */}
      <div 
        className="absolute w-14 h-14 transform-gpu"
        style={{
          backgroundColor: specialist.color,
          border: '2px solid rgba(0,0,0,0.6)',
          transform: 'translateZ(0.5px)',
          opacity: 0.7
        }}
      >
        <div className="absolute inset-1 border border-black/30" />
      </div>

      {/* Center Anchor for Avatar */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
        {/* Shadow directly under feet */}
        <div 
          className={cn(
            "absolute top-0 left-0 w-10 h-3 bg-black/40 rounded-full",
            status === 'thinking' && "animate-shadow-pulse"
          )}
          style={{ transform: 'translate(-50%, -50%) translateZ(1px)' }} 
        />
        
        {/* 3D Pivot Point (Counter-rotated to face camera) */}
        <div 
          className="absolute bottom-0 left-0 w-0 h-0 transition-transform duration-200 group-hover:scale-110"
          style={{
            transform: 'rotateZ(45deg) rotateX(-60deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Centered Content */}
          <div 
            className={cn(
              "absolute bottom-0 flex flex-col items-center transition-all duration-300",
              status === 'thinking' && "animate-thinking-bob"
            )}
            style={{ 
              transform: 'translateX(-50%)',
              transformStyle: 'preserve-3d' 
            }}
          >
            {/* Habbo Speech Bubble (Tooltip) */}
            <div className="absolute bottom-[100%] hidden group-hover:flex flex-col items-center z-50 w-40 pointer-events-none mb-2">
              <div className="bg-white border-2 border-black rounded-md p-2 text-center relative shadow-md">
                {/* Speech bubble pointer */}
                <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black">
                  <div className="absolute -top-[8px] -left-[4px] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-white" />
                </div>
                <div className="font-bold text-[10px] mb-1" style={{ color: specialist.color }}>{specialist.name}</div>
                <div className="text-black text-[9px] font-pixel leading-tight">{specialist.role}</div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="absolute -top-8 flex flex-col items-center">
              {status === 'thinking' && (
                <div className="bg-white border-2 border-black rounded-full p-1 shadow-md animate-bounce">
                  <MessageSquareMore size={12} className="text-black" />
                </div>
              )}
              {status === 'responding' && <div className="w-4 h-4 bg-blue-400 rounded-full animate-[spin_1s_linear_infinite] border-t-2 border-blue-100 mb-1" />}
              {isSelected && <Check size={16} className="text-white bg-green-500 rounded-full p-0.5 mb-1 shadow-md" strokeWidth={3} />}
            </div>

            {/* Habbo API Image */}
            <Image
              src={`https://www.habbo.com/habbo-imaging/avatarimage?figure=${habboFigures[specialist.id] || 'hr-115-42.hd-190-1.ch-210-66.lg-270-82.sh-290-91'}&size=m&direction=2&head_direction=2&gesture=sml`}
              alt={specialist.name}
              width={64}
              height={110}
              className="object-contain drop-shadow-md"
              style={{ imageRendering: 'pixelated' }}
              unoptimized
            />

            {/* Name Tag */}
            <div className="mt-[-8px] text-[9px] font-pixel text-white bg-black/60 px-2 py-0.5 rounded-[4px] border border-black/80 whitespace-nowrap z-10">
              {specialist.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
