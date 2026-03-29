import Image from 'next/image';

const brunoFigure = 'hr-893-45.hd-180-1.ch-210-110.lg-270-110.sh-290-110.fa-1201';

export function BrunoAvatar() {
  return (
    <div
      className="relative flex flex-col items-center justify-center pointer-events-none transform-style-3d"
      style={{ gridArea: '31 / 16 / 32 / 18', transformStyle: 'preserve-3d' }} // Center of reception
    >
      {/* VIP Rug */}
      <div 
        className="absolute w-20 h-12 transform-gpu"
        style={{
          backgroundColor: '#7f1d1d', // Dark red
          border: '2px solid #450a0a',
          transform: 'translateZ(0.5px)',
        }}
      >
        <div className="absolute inset-1 border border-[#fcd34d]/30" /> {/* Gold inner border */}
      </div>

      {/* Center Anchor for Avatar */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
        {/* Shadow directly under feet */}
        <div 
          className="absolute top-0 left-0 w-10 h-3 bg-black/40 rounded-full" 
          style={{ transform: 'translate(-50%, -50%) translateZ(1px)' }} 
        />
        
        {/* 3D Pivot Point (Counter-rotated to face camera) */}
        <div 
          className="absolute bottom-0 left-0 w-0 h-0 transition-transform duration-200 hover:scale-110"
          style={{
            transform: 'rotateZ(45deg) rotateX(-60deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Centered Content */}
          <div 
            className="absolute bottom-0 flex flex-col items-center"
            style={{ 
              transform: 'translateX(-50%)',
              transformStyle: 'preserve-3d' 
            }}
          >
            {/* Habbo API Image */}
            <Image
              src={`https://www.habbo.com/habbo-imaging/avatarimage?figure=${brunoFigure}&size=m&direction=2&head_direction=2&gesture=sml`}
              alt="Bruno"
              width={64}
              height={110}
              className="object-contain drop-shadow-md"
              style={{ imageRendering: 'pixelated' }}
              unoptimized
            />

            {/* Name Tag */}
            <div className="mt-[-8px] text-[9px] font-pixel text-white bg-black/60 px-2 py-0.5 rounded-[4px] border border-black/80 whitespace-nowrap z-10">
              Bruno
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
