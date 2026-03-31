import OfficeMap from '@/components/OfficeMap';

export default function OfficePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* 
        Here we embed the immersive Office Map.
        In the future, this layout can contain a sidebar, topnav, etc.
      */}
      <OfficeMap />
    </main>
  );
}
