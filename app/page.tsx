import BoardRoomClient from '@/components/BoardRoomClient';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Page() {
  return (
    <ErrorBoundary>
      <BoardRoomClient />
    </ErrorBoundary>
  );
}
