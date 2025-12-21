
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export const Logo = ({
  className,
  width = 256,
  height = 73,
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
        width={width}
        height={height}
        priority
      />
    </div>
  );
};
