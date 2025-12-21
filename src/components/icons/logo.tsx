
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Logo = ({
  className,
  width = 150,
  height = 43,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <h1 style={{ fontSize: `${height * 0.5}px`, fontWeight: 'bold' }}>Baseline</h1>
    </div>
  );
};
