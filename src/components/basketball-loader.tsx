
'use client';

import { cn } from '@/lib/utils';

export function BasketballLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-8', className)}>
      <div className="basketball-loader">
        <div className="basketball">
          <div className="seam"></div>
          <div className="seam"></div>
          <div className="seam"></div>
          <div className="seam"></div>
        </div>
      </div>
      <p className="text-muted-foreground animate-pulse tracking-widest">LOADING...</p>
      
      <style jsx>{`
        .basketball-loader {
          width: 100px;
          height: 100px;
          perspective: 600px;
        }
        .basketball {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: spin 4s infinite linear;
          background: radial-gradient(circle at 35% 35%, #ffc973, #e8751a);
          border-radius: 50%;
          box-shadow: inset -15px -10px 30px rgba(0,0,0,0.3), 5px 5px 15px rgba(0,0,0,0.2);
        }
        .seam {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1.5px solid #2c1e15;
          box-sizing: border-box;
        }
        .seam:nth-child(1) {
          transform: rotateX(0deg);
        }
        .seam:nth-child(2) {
          transform: rotateX(90deg);
        }
        .seam:nth-child(3) {
          transform: rotateY(45deg) rotateX(90deg);
        }
        .seam:nth-child(4) {
          transform: rotateY(-45deg) rotateX(90deg);
        }

        @keyframes spin {
          from {
            transform: rotateY(0deg) rotateX(10deg);
          }
          to {
            transform: rotateY(360deg) rotateX(10deg);
          }
        }
      `}</style>
    </div>
  );
}
