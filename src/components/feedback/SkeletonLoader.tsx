import { cn } from '@/lib/utils';

export function SkeletonLoader({ className, count = 1 }: { className?: string; count?: number }) {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800',
            className || 'h-24 w-full'
          )}
        />
      ))}
    </div>
  );
}

