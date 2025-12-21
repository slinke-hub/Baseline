
'use client';

import { cn } from '@/lib/utils';
import { Logo } from './icons/logo';

export function BasketballLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', className)}>
        <div className="relative w-48 h-48">
            {/* The Court Floor */}
            <div className="absolute bottom-0 w-full h-1/2 bg-[#D2B48C] rounded-b-full" />
            
            {/* The Bouncing Ball */}
            <div 
                className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-orange-500 animate-bounce"
                style={{
                    backgroundImage: `
                    radial-gradient(circle at 30% 30%, #ffc973, #e8751a),
                    linear-gradient(to right, rgba(0,0,0,0.2) 2px, transparent 2px),
                    linear-gradient(to bottom, rgba(0,0,0,0.2) 2px, transparent 2px)
                    `,
                    animationDuration: '1.2s',
                }}
            >
                <svg viewBox="0 0 50 50" className="absolute top-0 left-0 w-full h-full overflow-visible">
                    <path d="M 25, 0 A 25 25 0 0 0 25 50" fill="none" stroke="black" strokeWidth="0.8"/>
                    <path d="M 0, 25 A 25 25 0 0 1 50 25" fill="none" stroke="black" strokeWidth="0.8"/>
                    <path d="M 10, 10 C 20,20 30,20 40,10" fill="none" stroke="black" strokeWidth="0.8"/>
                    <path d="M 10, 40 C 20,30 30,30 40,40" fill="none" stroke="black" strokeWidth="0.8"/>
                </svg>
            </div>
            
            {/* The Shadow */}
            <div 
                className="absolute bottom-[23%] left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full animate-pulse"
                style={{
                    animationName: 'shadow-pulse',
                    animationDuration: '1.2s',
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                }}
            />
        </div>
      <p className="text-muted-foreground animate-pulse">Loading...</p>
      
      <style jsx>{`
        @keyframes shadow-pulse {
            0%, 100% {
                transform: scale(0.6) translateX(-50%);
                opacity: 0.2;
            }
            50% {
                transform: scale(1) translateX(-50%);
                opacity: 0.4;
            }
        }
      `}</style>
    </div>
  );
}
