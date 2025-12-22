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
        viewBox="0 0 1024 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <g clipPath="url(#clip0_401_2)">
        <path d="M0 0H1024V270H0V0Z" fill="transparent"/>
        <path d="M1024 135C1024 209.52 963.52 270 889 270C814.48 270 754 209.52 754 135C754 60.4802 814.48 0 889 0C963.52 0 1024 60.4802 1024 135ZM889 20C825.524 20 774 71.5238 774 135C774 198.476 825.524 250 889 250C952.476 250 1004 198.476 1004 135C1004 71.5238 952.476 20 889 20Z" fill="white"/>
        <path d="M784.819 132.89L994.469 132.89L994.469 137.11L784.819 137.11L784.819 132.89Z" fill="white"/>
        <path d="M125 20C56.0238 20 0 76.0238 0 145C0 213.976 56.0238 270 125 270C169.375 270 208.125 247.905 230.156 213.469L208.625 200.781C191.031 228.063 160.031 247.5 125 247.5C68.4375 247.5 22.5 201.563 22.5 145C22.5 88.4375 68.4375 42.5 125 42.5C160.031 42.5 191.031 61.9375 208.625 89.2188L230.156 76.5312C208.125 42.0952 169.375 20 125 20Z" fill="url(#paint0_linear_401_2)"/>
        <path d="M255 20V270H277.5V20H255Z" fill="url(#paint1_linear_401_2)"/>
        <path d="M438.75 20L376.875 142.031V20H354.375V270H376.875V147.969L438.75 270H464.375L401.25 145L464.375 20H438.75Z" fill="url(#paint2_linear_401_2)"/>
        <path d="M605 20H485V42.5H510V270H532.5V42.5H605V20Z" fill="url(#paint3_linear_401_2)"/>
        <path d="M655 20V42.5H729.375V63.4375H655V124.375H725.625V145.312H655V247.5H733.125V270H632.5V20H655Z" fill="url(#paint4_linear_401_2)"/>
        </g>
        <defs>
        <linearGradient id="paint0_linear_401_2" x1="115.078" y1="20" x2="115.078" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB"/>
        <stop offset="1" stopColor="#A855F7"/>
        </linearGradient>
        <linearGradient id="paint1_linear_401_2" x1="266.25" y1="20" x2="266.25" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB"/>
        <stop offset="1" stopColor="#A855F7"/>
        </linearGradient>
        <linearGradient id="paint2_linear_401_2" x1="409.375" y1="20" x2="409.375" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB"/>
        <stop offset="1" stopColor="#A855F7"/>
        </linearGradient>
        <linearGradient id="paint3_linear_401_2" x1="545" y1="20" x2="545" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB"/>
        <stop offset="1" stopColor="#A855F7"/>
        </linearGradient>
        <linearGradient id="paint4_linear_401_2" x1="682.812" y1="20" x2="682.812" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB"/>
        <stop offset="1" stopColor="#A855F7"/>
        </linearGradient>
        <clipPath id="clip0_401_2">
        <rect width="1024" height="270" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    </div>
  );
};
