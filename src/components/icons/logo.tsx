
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Logo = ({
  className,
  width = 200,
  height = 59,
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
        style={{
            width: 'auto',
            height: 'auto',
        }}
        sizes="200px"
      />
    </div>
  );
};
