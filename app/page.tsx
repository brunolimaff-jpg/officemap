'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const HabboClient = dynamic(() => import('@/components/HabboClient'), { ssr: false });

export default function Page() {
  return (
    <ErrorBoundary>
      <HabboClient />
    </ErrorBoundary>
  );
}
