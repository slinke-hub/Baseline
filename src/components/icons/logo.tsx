'use client';

import Image from 'next/image';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
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
