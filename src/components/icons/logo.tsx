
'use client';

import { cn } from '@/lib/utils';

export const Logo = ({
  className,
  width = 140,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  const aspectRatio = 210 / 58; // Aspect ratio of the new SVG logo
  const effectiveHeight = height || width / aspectRatio;

  return (
    <div
      className={cn('relative', className)}
      style={{ width: `${width}px`, height: `${effectiveHeight}px` }}
    >
      <svg
        width={width}
        height={effectiveHeight}
        viewBox="0 0 210 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        <text
          fill="hsl(var(--foreground))"
          xmlSpace="preserve"
          style={{ whiteSpace: 'pre' }}
          fontFamily="Inter, sans-serif"
          fontSize="48"
          fontWeight="bold"
          letterSpacing="0.05em"
        >
          <tspan x="0" y="44.8">
            BASELINE
          </tspan>
        </text>
      </svg>
    </div>
  );
};
