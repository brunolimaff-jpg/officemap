'use client';
import dynamic from 'next/dynamic';
import { OFFICE_MAIN_MAP } from '@/data/maps/office_main';

const TopDownCanvas = dynamic(() => import('@/components/TopDownCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-screen bg-gray-950">
      <div className="text-green-400 font-mono text-sm animate-pulse">Carregando mapa...</div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-white font-mono text-lg font-bold">🗺️ OfficeMap</h1>
        <span className="text-gray-400 font-mono text-xs">LimeZu Modern Office — 32×32</span>
      </div>
      <div
        className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl"
        style={{ maxWidth: '960px', maxHeight: '768px' }}
      >
        <TopDownCanvas
          map={OFFICE_MAIN_MAP}
          spritesheetUrl="/assets/tiles/1_Room_Builder_Office/Room_Builder_Office_32x32.png"
        />
      </div>
      <p className="mt-4 text-gray-500 font-mono text-xs">
        Fase 1 — render estático · Fase 2 → movimento do personagem
      </p>
    </main>
  );
}
