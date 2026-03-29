import { SpecialistStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: SpecialistStatus;
  color: string;
}

export function StatusIndicator({ status, color }: StatusIndicatorProps) {
  return (
    <div
      className={cn(
        'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800',
        status === 'available' && 'bg-green-500',
        status === 'thinking' && 'bg-yellow-500 animate-pulse',
        status === 'responding' && 'bg-blue-500 animate-spin'
      )}
      style={{
        backgroundColor: status === 'available' ? color : undefined,
      }}
    />
  );
}
