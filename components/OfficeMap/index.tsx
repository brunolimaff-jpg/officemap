'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { agents, Agent } from '@/data/agents';

// Note: Ensure the image is placed in the public folder.
const BACKGROUND_IMAGE_PATH = '/isometric-office-bg.png';
const DEFAULT_AVATAR_PATH = '/avatar-businessman.png'; // Fallback if specific agent avatar is missing

export default function OfficeMap() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // When clicking outside avatars, deselect
  const handleMapClick = (e: React.MouseEvent) => {
    // Only deselect if the user actually clicked the background, not an avatar
    if ((e.target as HTMLElement).id === 'map-background') {
      setSelectedAgent(null);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
      {/* 
        Container for panning/zooming (can be enhanced with libraries like react-zoom-pan-pinch later).
        For now, it centers a large absolute container that fits the image aspect ratio.
      */}
      <div 
        className="relative shadow-2xl rounded-lg overflow-hidden border border-gray-700 transition-all duration-300"
        style={{ width: '1200px', height: '800px', maxWidth: '95vw', maxHeight: '90vh' }}
        onClick={handleMapClick}
      >
        <Image
          id="map-background"
          src={BACKGROUND_IMAGE_PATH}
          alt="Isometric Office"
          fill
          className="object-cover pointer-events-auto cursor-crosshair"
          priority
        />

        {/* Render all Agents as pins/avatars on the map */}
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAgent(agent);
            }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-transform duration-200 hover:scale-110 z-10 ${
              selectedAgent?.id === agent.id ? 'scale-110 z-20' : ''
            }`}
            style={{
              left: `${agent.position.x}%`,
              top: `${agent.position.y}%`,
            }}
            aria-label={`Interact with ${agent.name}`}
          >
            <div className="relative w-12 h-16 sm:w-16 sm:h-20 drop-shadow-md">
              {/* Pulsing indicator behind the avatar */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-blue-500 rounded-[100%] opacity-40 blur-sm animate-pulse" />
              
              <Image
                src={DEFAULT_AVATAR_PATH} // using the generated pixel art for all currently. Real assets can be added per agent later.
                alt={agent.name}
                fill
                className="object-contain"
              />
              
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap shadow-lg">
                <span className="font-bold block">{agent.name}</span>
                <span className="text-gray-300 text-[10px]">{agent.role}</span>
              </div>
            </div>
          </button>
        ))}

        {/* Selected Agent Information Card overlay */}
        {selectedAgent && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-200 z-30 animate-in slide-in-from-bottom-5">
            <button 
              onClick={() => setSelectedAgent(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                <Image
                  src={DEFAULT_AVATAR_PATH}
                  alt={selectedAgent.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{selectedAgent.name}</h3>
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">{selectedAgent.role}</p>
                <p className="text-gray-600 text-sm leading-tight">
                  {selectedAgent.description}
                </p>
                
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Iniciar Reunião (Chat)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
