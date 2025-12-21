
'use client';

import { cn } from '@/lib/utils';

export function BasketballLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', className)}>
      <div className="animate-pulse">
        <h1 className="text-2xl font-bold">Baseline</h1>
      </div>
      <p className="text-muted-foreground animate-pulse tracking-widest">LOADING...</p>
    </div>
  );
}
