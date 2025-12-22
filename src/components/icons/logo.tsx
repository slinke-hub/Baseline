
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Logo = ({
  className,
  width = 140,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  // Assuming the new logo has a certain aspect ratio.
  // We can adjust this if the new logo's dimensions are different.
  const aspectRatio = 140 / 38; 
  const effectiveHeight = height || width / aspectRatio;

  return (
    <div
      className={cn('relative', className)}
      style={{ width: `${width}px`, height: `${effectiveHeight}px` }}
    >
      <Image
        src="/logo.png"
        alt="Baseline Logo"
        fill
        sizes={`${width}px`}
        priority
      />
    </div>
  );
};
