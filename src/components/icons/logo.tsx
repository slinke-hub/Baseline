'use client';

import Image from 'next/image';
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
      <Image
        src="/logo.png"
        alt="Baseline Logo"
        fill
        sizes={`${width}px`}
        className="object-contain"
        priority
      />
    </div>
  );
};
