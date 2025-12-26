
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
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&display=swap');
            .baseline-text { font-family: 'Teko', sans-serif; font-weight: 700; letter-spacing: 1px; }
            `}
        </style>
        
        {/* Main B shape */}
        <g>
            {/* Left part (blue with court lines) */}
            <defs>
                <clipPath id="courtClip">
                    <path d="M103,0 L50,0 50,180 103,180 C154.5,180,185,155,185,115 L185,65 C185,25,154.5,0,103,0 Z" />
                </clipPath>
            </defs>
            <path d="M103,0 L50,0 50,180 103,180 C154.5,180,185,155,185,115 L185,65 C185,25,154.5,0,103,0 Z" fill="#0D2B4E"/>

            {/* Court lines */}
            <g clipPath="url(#courtClip)" stroke="#D83125" strokeWidth="3" fill="none">
                {/* Lower court */}
                <rect x="50" y="100" width="55" height="80" />
                <circle cx="105" cy="140" r="30" />
                {/* Upper court */}
                <rect x="50" y="0" width="55" height="80" />
                <circle cx="105" cy="40" r="30" />
                <line x1="50" y1="90" x2="185" y2="90" />
            </g>

            {/* Right part (red) */}
            <path d="M103,0 C154.5,0,185,25,185,65 L185,115 C185,155,154.5,180,103,180 L140,180 C200,180 240,145,240,90 C240,35,200,0,140,0 L103,0 Z" fill="#D83125" />
            <path d="M130,70 L103,70 C95,70,90,75,90,82.5 L90,97.5 C90,105,95,110,103,110 L130,110 C145,110,155,100,155,90 C155,80,145,70,130,70 Z" fill="#F0F0F0" />

            {/* White divider */}
            <path d="M103,0 L103,180" stroke="white" strokeWidth="5" />
        </g>

        {/* Basketball and swoosh */}
        <g transform="translate(190, 10)">
            {/* Swoosh */}
            <path d="M0,45 C20,40,40,30,60,20 L40,10 C20,20,10,30,0,35 Z" fill="#0D2B4E" />
            <path d="M-20,55 C0,50,20,40,40,30 L20,20 C0,30,-10,40,-20,45 Z" fill="#D83125" />

            {/* Basketball */}
            <g transform="scale(0.8)">
                <circle cx="50" cy="50" r="50" fill="url(#ballGradient)"/>
                <circle cx="50" cy="50" r="48" fill="transparent" stroke="#0D2B4E" strokeWidth="4"/>
                <path d="M50,2 A48,48 0 0,0 50,98 M2,50 A48,48 0 0,0 98,50" stroke="#0D2B4E" strokeWidth="4" fill="none"/>
                <path d="M17.5,22.5 C45,40 55,65 82.5,77.5" stroke="#0D2B4E" strokeWidth="4" fill="none"/>
                <path d="M22.5,82.5 C40,55 65,45 77.5,17.5" stroke="#0D2B4E" strokeWidth="4" fill="none"/>
                <text x="35" y="65" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="40" fill="#0D2B4E">B</text>
            </g>
        </g>
        
        {/* BASELINE Text */}
        <text x="35" y="230" className="baseline-text" fontSize="70" fill="#0D2B4E" transform="skewX(-10)">
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
