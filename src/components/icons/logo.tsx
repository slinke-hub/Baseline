'use client';

import { cn } from '@/lib/utils';

export const Logo = ({
  className,
  width = 140,
  height = 37,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <div
      className={cn('relative', className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&display=swap');
                .baseline-text { font-family: 'Teko', sans-serif; font-weight: 700; letter-spacing: 1px; }
                `}
            </style>
            
            <defs>
                <clipPath id="clipB">
                    <path d="M111.4,19.1c32.4,0.1,59,10,79.8,29.9c20.8,19.9,31.2,46.1,31.2,78.6c0,23.6-7.3,44.7-22,63.1 c-14.7,18.5-35.4,27.7-62.1,27.7H111.4V19.1z M111.4,117.8v-77.3h17.9c16.3,0,29,3.9,38,11.8c9.1,7.9,13.6,18.8,13.6,32.7 c0,13.9-4.2,24.8-12.7,32.7c-8.5,7.9-20.4,11.8-35.8,11.8H111.4z"/>
                </clipPath>
            </defs>

            {/* B - Court Part */}
            <g>
                <path fill="#1E3A8A" d="M106,0 L60,0 60,230 106,230 C180,230 240,190 240,115 C240,40 180,0 106,0 Z"/>
                
                {/* Court Lines */}
                <path stroke="#DC2626" strokeWidth="2.5" fill="none" d="M60,115 L106,115 M83,90 a25,25 0 0,1 0,50 M60,90 L83,90 M60,140 L83,140 M60,40 L106,40 M60,190 L106,190 M106,40 a60,60 0 0,0 0,150 M83,115 a5,5 0 0,1 0,0.1"/>
                <path stroke="#DC2626" strokeWidth="2.5" fill="none" d="M60,15 L106,15 M60,215 L106,215"/>
            </g>

            {/* B - Red Part */}
            <path fill="#DC2626" d="M255.4,118.5c0-32.5-10.4-58.7-31.2-78.6c-20.8-19.9-47.4-29.8-79.8-29.9H103v201h28.1 c26.7,0,47.4-9.2,62.1-27.7c14.7-18.4,22-39.5,22-63.1c0-8-1-15.6-3.1-22.7H255.4z"/>
            
            {/* White Outline for B */}
            <path stroke="white" strokeWidth="4" fill="none" strokeLinejoin="round" d="M103,19.1c32.4,0.1,59,10,79.8,29.9c20.8,19.9,31.2,46.1,31.2,78.6c0,23.6-7.3,44.7-22,63.1c-14.7,18.5-35.4,27.7-62.1,27.7H103V19.1z"/>
            <path stroke="white" strokeWidth="4" fill="none" strokeLinejoin="round" d="M62,2 L62,228 L103,228 C185,228 245,190 245,115 C245,40 185,2 103,2 L62,2z" />

            {/* Swoosh */}
            <path fill="#FFFFFF" d="M210,85 l-30,5 l40,-35 l5,-15 Z"/>
            <path fill="#4A6EAF" d="M215,88 l-30,5 l40,-35 l5,-15z"/>

            {/* Basketball */}
            <g transform="translate(230, 40) scale(0.4)">
                <circle cx="100" cy="100" r="100" fill="url(#ballGradient)"/>
                <circle cx="100" cy="100" r="98" fill="transparent" stroke="#1E3A8A" strokeWidth="4"/>
                <path d="M100,2 A98,98 0 0,0 100,198 M2,100 A98,98 0 0,0 198,100" stroke="#1E3A8A" strokeWidth="4" fill="none"/>
                <path d="M35,45 C90,80 110,130 165,155" stroke="#1E3A8A" strokeWidth="4" fill="none"/>
                <path d="M45,165 C80,110 130,90 155,35" stroke="#1E3A8A" strokeWidth="4" fill="none"/>
            </g>

            {/* BASELINE Text */}
            <text x="55" y="280" className="baseline-text" fontSize="70" fill="#1E3A8A" stroke="white" strokeWidth="1" transform="skewX(-10)">
                BASELINE
            </text>

            <defs>
                <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316"/>
                    <stop offset="100%" stopColor="#EA580C"/>
                </linearGradient>
            </defs>
        </svg>
    </div>
  );
};
