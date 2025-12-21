
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
                    backgroundImage: `radial-gradient(circle at 30% 30%, #ffc973, #e8751a)`,
                    animationDuration: '1.2s',
                    animationTimingFunction: 'cubic-bezier(0.5, 0.05, 1, 0.5)'
                }}
            >
                <svg viewBox="0 0 50 50" className="absolute top-0 left-0 w-full h-full overflow-visible transform -rotate-12">
                    <path d="M 25, 0 A 25 25 0 0 0 25 50" fill="none" stroke="black" strokeWidth="0.8"/>
                    <path d="M 0, 25 A 25 25 0 0 1 50 25" fill="none" stroke="black" strokeWidth="0.8"/>
                    <path d="M 10, 10 C 20,20 30,20 40,10" fill="none" stroke="black" strokeWidth="0.8"/>
                    <path d="M 10, 40 C 20,30 30,30 40,40" fill="none" stroke="black" strokeWidth="0.8"/>
                </svg>
            </div>
            
            {/* The Shadow */}
            <div 
                className="absolute bottom-[23%] left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full"
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
        @keyframes bounce {
            0%, 100% {
                transform: translateY(0) rotate(0deg);
                animation-timing-function: cubic-bezier(0.5, 0.05, 1, 0.5);
            }
            50% {
                transform: translateY(-80px) rotate(180deg);
                animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
            }
        }
        
        .animate-bounce {
            animation: bounce 1.2s infinite;
        }

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
