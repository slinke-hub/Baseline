
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

export function BasketballLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', className)}>
      <div className="animate-pulse">
        <Image src="/logo.png" alt="Baseline Logo" width={160} height={45} priority className="object-contain"/>
      </div>
      <p className="text-muted-foreground animate-pulse tracking-widest">LOADING...</p>
    </div>
  );
}
