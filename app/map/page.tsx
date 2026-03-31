'use client';
import dynamic from 'next/dynamic';
import { OFFICE_MAIN_MAP } from '@/data/maps/office_main';

const TopDownCanvas = dynamic(() => import('@/components/TopDownCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-screen bg-gray-950">
      <div className="text-green-400 font-mono text-sm animate-pulse">
        Carregando mapa...
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <main className="w-full h-screen bg-gray-950 overflow-auto flex items-start justify-center">
      <TopDownCanvas
        map={OFFICE_MAIN_MAP}
        spritesheetUrl="/assets/tiles/Modern_Office_32x32.png"
      />
    </main>
  );
}
