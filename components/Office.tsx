'use client';

import { useState } from 'react';
import { rooms, specialists, furniture } from '@/data/specialists';
import { Room } from './Room';
import { SpecialistAvatar } from './SpecialistAvatar';
import { BrunoAvatar } from './BrunoAvatar';
import { FurnitureItem } from './FurnitureItem';
import { SpecialistId, SpecialistStatus } from '@/types';

interface OfficeProps {
  selectedSpecialists: SpecialistId[];
  onSpecialistClick: (id: SpecialistId, isShiftPressed: boolean) => void;
  specialistStatuses: Record<SpecialistId, SpecialistStatus>;
}

export function Office({ selectedSpecialists, onSpecialistClick, specialistStatuses }: OfficeProps) {
  return (
    <div 
      className="w-full h-full flex p-8 overflow-auto relative"
      style={{
        backgroundColor: '#0F172A',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
      }}
    >
      <div 
        className="relative m-auto w-[1000px] h-[1000px] flex-shrink-0 grid gap-0 transition-transform duration-500 shadow-2xl"
        style={{
          gridTemplateColumns: 'repeat(32, 1fr)',
          gridTemplateRows: 'repeat(32, 1fr)',
          transform: 'rotateX(60deg) rotateZ(-45deg)', // Habbo 2:1 isometric
          transformStyle: 'preserve-3d',
          backgroundColor: '#334155', // Corridor base color
          backgroundImage: `
            linear-gradient(45deg, #1E293B 25%, transparent 25%, transparent 75%, #1E293B 75%, #1E293B),
            linear-gradient(45deg, #1E293B 25%, transparent 25%, transparent 75%, #1E293B 75%, #1E293B)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
          border: '4px solid #0F172A',
        }}
      >
        {/* Front-Left Edge of the platform (Bottom edge of the grid) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-12 origin-bottom pointer-events-none"
          style={{
            backgroundColor: '#1E293B',
            transform: 'rotateX(90deg)',
            borderBottom: '2px solid #0F172A',
          }}
        />
        {/* Front-Right Edge of the platform (Right edge of the grid) */}
        <div 
          className="absolute top-0 right-0 w-12 h-full origin-right pointer-events-none"
          style={{
            backgroundColor: '#334155',
            transform: 'rotateY(-90deg)',
            borderRight: '2px solid #1E293B',
          }}
        />
        
        {/* Corridor Arrows */}
        <div className="absolute top-[30%] left-[20%] text-slate-400 font-pixel text-[10px] pointer-events-none" style={{ transform: 'translateZ(1px) rotateZ(45deg) rotateX(-60deg)' }}>
          ↑ STRATEGY
        </div>
        <div className="absolute top-[30%] left-[70%] text-slate-400 font-pixel text-[10px] pointer-events-none" style={{ transform: 'translateZ(1px) rotateZ(45deg) rotateX(-60deg)' }}>
          DATA →
        </div>
        <div className="absolute top-[85%] left-[45%] text-slate-400 font-pixel text-[10px] pointer-events-none" style={{ transform: 'translateZ(1px) rotateZ(45deg) rotateX(-60deg)' }}>
          ↓ RECEPTION (Furniture count: {furniture.length})
        </div>

        {rooms.map((room) => {
          const isActive = selectedSpecialists.some(
            (id) => specialists.find((s) => s.id === id)?.roomId === room.id
          );
          
          return (
            <Room key={room.id} room={room} isActive={isActive} />
          );
        })}

        {/* Render Furniture */}
        {furniture.map((item) => (
          <FurnitureItem key={item.id} item={item} />
        ))}

        {/* Render Specialists directly in the main grid so gridArea works */}
        {specialists.map((specialist) => (
          <SpecialistAvatar
            key={specialist.id}
            specialist={specialist}
            status={specialistStatuses[specialist.id] || 'available'}
            isSelected={selectedSpecialists.includes(specialist.id)}
            onClick={onSpecialistClick}
          />
        ))}

        <BrunoAvatar />
      </div>
    </div>
  );
}
