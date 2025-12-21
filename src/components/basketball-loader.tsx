
'use client';

import { cn } from '@/lib/utils';

export function BasketballLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', className)}>
      <div className="scene">
        <div className="court">
          <div className="ball-shadow"></div>
          <div className="ball">
            <div className="ball-texture"></div>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground animate-pulse tracking-widest">LOADING...</p>
      
      <style jsx>{`
        .scene {
          width: 200px;
          height: 200px;
          perspective: 1000px;
        }
        .court {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateX(75deg);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .court::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: #D2B48C;
          border-radius: 50%;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        }
        .ball {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          position: absolute;
          transform-style: preserve-3d;
          animation: bounce 1.2s cubic-bezier(0.5, 0.05, 1, 0.5) infinite;
        }
        .ball-texture {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #ffc973, #e8751a);
          position: absolute;
          animation: spin 2.4s linear infinite;
        }
        .ball-texture::before, .ball-texture::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 1px solid black;
            box-sizing: border-box;
        }
        .ball-texture::before {
            transform: rotateZ(90deg);
        }
        .ball-shadow {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          position: absolute;
          animation: shadow-pulse 1.2s cubic-bezier(0.5, 0.05, 1, 0.5) infinite;
          filter: blur(5px);
        }

        @keyframes bounce {
            0%, 100% {
                transform: translate3d(0, 0, 0);
            }
            50% {
                transform: translate3d(0, 0, 100px);
            }
        }
        
        @keyframes spin {
          from {
            transform: rotateY(0deg) rotateX(0deg);
          }
          to {
            transform: rotateY(360deg) rotateX(360deg);
          }
        }
        
        @keyframes shadow-pulse {
            0%, 100% {
                transform: scale(0.6);
                opacity: 0.2;
            }
            50% {
                transform: scale(1);
                opacity: 0.5;
            }
        }
      `}</style>
    </div>
  );
}
