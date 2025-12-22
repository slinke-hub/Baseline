'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Logo = ({
  className,
  width = 600,
  height = 60,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <Image
        src="/logo.png"
        alt="Baseline Logo"
        fill
        className="object-contain"
        priority
        sizes={`${width}px`}
      />
    </div>
  );
};
