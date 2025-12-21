'use client';

import Image from 'next/image';

export const Logo = ({ className, width = 512, height = 148 }: { className?: string, width?: number, height?: number }) => {
  return (
    <div className={`relative ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
      <Image
        src="/logo.png"
        alt="Baseline Logo"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
};
