
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Logo = ({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  const aspectRatio = 600 / 60; // Original aspect ratio
  
  // If only one dimension is provided, calculate the other
  let newWidth = width;
  let newHeight = height;

  if (width && !height) {
    newHeight = width / aspectRatio;
  } else if (height && !width) {
    newWidth = height * aspectRatio;
  } else if (!width && !height) {
    // Default size if none provided
    newWidth = 140;
    newHeight = 140 / aspectRatio;
  }
  
  return (
    <div className={cn('relative', className)} style={{ width: newWidth, height: newHeight }}>
      <Image
        src="/logo.png"
        alt="Baseline Logo"
        fill
        className="object-contain"
        priority
        sizes={`${newWidth}px`}
      />
    </div>
  );
};
