
'use client';

import { cn } from '@/lib/utils';

export const Logo = ({
  className,
  width = 256,
  height = 100,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 256 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="clipPathForB">
            <path d="M43.6,56.2h28.1c8.8,0,13.8-5.3,13.8-12.3c0-7.3-5-12.3-13.8-12.3H43.6V56.2z M100.3,56.2c12.3,0,19.9-7.3,19.9-19.1c0-11.8-7.6-19.1-19.9-19.1H21v64.5h53.8c12.3,0,19.9-7.3,19.9-19.1C94.7,58.8,87.6,56.2,81.4,56.2H43.6V69.4h37.8c8.8,0,13.8,5.3,13.8,12.3c0,7.3-5,12.3-13.8,12.3H21V18H75.4z"/>
          </clipPath>
           <pattern id="courtPattern" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="rotate(15)">
            <rect width="30" height="30" fill="#002855" />
            <path d="M0 15 H30 M15 0 V30" stroke="#FFFFFF" strokeWidth="0.5"/>
            <circle cx="15" cy="15" r="5" stroke="#FFFFFF" strokeWidth="0.5" fill="none"/>
             <rect x="0" y="10" width="10" height="10" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        
        {/* Letter B with court texture */}
        <path fill="#002855" d="M75.4,18H21v64.5h54.4c12.3,0,22.4-7.3,22.4-19.1c0-7.3-5-12.3-13.8-12.3H43.6V69.4h37.8c8.8,0,13.8,5.3,13.8,12.3c0,7.3-5,12.3-13.8,12.3H21v-8.5h54.4c8.8,0,13.8-5.3,13.8-12.3c0-7.3-5-12.3-13.8-12.3H43.6V56.2h37.8c8.8,0,13.8-5.3,13.8-12.3c0-7.3-5-12.3-13.8-12.3H43.6V31.7h31.8c8.8,0,13.8-5.3,13.8-12.3c0-7.3-5-12.3-13.8-12.3H21V18z"/>
        <path
          clipPath="url(#clipPathForB)"
          d="M75.4,18H21v64.5h54.4c12.3,0,22.4-7.3,22.4-19.1c0-7.3-5-12.3-13.8-12.3H43.6V69.4h37.8c8.8,0,13.8,5.3,13.8,12.3c0,7.3-5,12.3-13.8,12.3H21v-8.5h54.4c8.8,0,13.8-5.3,13.8-12.3c0-7.3-5-12.3-13.8-12.3H43.6V56.2h37.8c8.8,0,13.8-5.3,13.8-12.3c0-7.3-5-12.3-13.8-12.3H43.6V31.7h31.8c8.8,0,13.8-5.3,13.8-12.3c0-7.3-5-12.3-13.8-12.3H21V18z"
          fill="url(#courtPattern)"
        />
        <path fill="#EF4444" d="M100.3,56.2c12.3,0,19.9-7.3,19.9-19.1c0-11.8-7.6-19.1-19.9-19.1H43.6v38.2H100.3z"/>

        {/* Basketball */}
        <g transform="translate(110, 25) scale(0.6)">
            <circle cx="25" cy="25" r="24" fill="#F97316"/>
            <path d="M25,1 A24,24 0 0,1 25,49" stroke="#002855" strokeWidth="1.5" fill="none"/>
            <path d="M1,25 A24,24 0 0,1 49,25" stroke="#002855" strokeWidth="1.5" fill="none"/>
            <path d="M10,10 A24,24 0 0,1 40,40" stroke="#002855" strokeWidth="1.5" fill="none"/>
            <path d="M10,40 A24,24 0 0,0 40,10" stroke="#002855" strokeWidth="1.5" fill="none"/>
        </g>
        
        {/* Swoosh */}
        <path d="M95 32 C 105 32, 115 34, 125 38" stroke="#EF4444" strokeWidth="3" fill="none" />
        <path d="M98 36 C 108 36, 118 37, 128 40" stroke="#002855" strokeWidth="3" fill="none" />
        <path d="M101 40 C 111 40, 121 40, 131 42" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        
        {/* Text */}
        <text x="128" y="85" fontFamily="sans-serif" fontSize="28" fontWeight="bold" fill="#002855" textAnchor="middle">
          BASELINE
        </text>
      </svg>
    </div>
  );
};
