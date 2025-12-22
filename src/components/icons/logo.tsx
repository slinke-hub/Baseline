
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
  // New logo's aspect ratio
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
