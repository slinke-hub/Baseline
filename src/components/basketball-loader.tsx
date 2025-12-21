
'use client';

import { cn } from '@/lib/utils';

export function BasketballLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative h-24 w-24 animate-bounce" style={{ animationDuration: '1s' }}>
        <div 
          className="w-full h-full rounded-full bg-orange-500"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 30%, #ffc973, #e8751a),
              linear-gradient(to right, rgba(0,0,0,0.2) 2px, transparent 2px),
              linear-gradient(to bottom, rgba(0,0,0,0.2) 2px, transparent 2px),
              path('M 12,0 A 12,12 0 0,1 12,24 A 12,12 0 0,1 12,0 Z')
            `
          }}
        >
           <svg viewBox="0 0 50 50" className="absolute top-0 left-0 w-full h-full overflow-visible">
            <path
              d="M 25, 0 A 25 25 0 0 0 25 50"
              fill="none"
              stroke="black"
              strokeWidth="0.8"
            />
            <path
              d="M 0, 25 A 25 25 0 0 1 50 25"
              fill="none"
              stroke="black"
              strokeWidth="0.8"
            />
             <path
              d="M 10, 10 C 20,20 30,20 40,10"
              fill="none"
              stroke="black"
              strokeWidth="0.8"
            />
             <path
              d="M 10, 40 C 20,30 30,30 40,40"
              fill="none"
              stroke="black"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      </div>
      <p className="text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}
