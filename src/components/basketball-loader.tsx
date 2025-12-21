
'use client';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons/logo';

export function BasketballLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', className)}>
      <div className="animate-pulse">
        <Logo width={120} height={34} />
      </div>
      <p className="text-muted-foreground animate-pulse tracking-widest">LOADING...</p>
    </div>
  );
}
