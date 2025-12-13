'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useFirebase } from '@/firebase';

export const Logo = ({ className }: { className?: string }) => {
  const { firebaseApp } = useFirebase();
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const storage = getStorage(firebaseApp);
        const logoRef = ref(storage, 'app/logo.png');
        const url = await getDownloadURL(logoRef);
        setLogoUrl(url);
      } catch (error) {
        // Logo not found in storage, use fallback
        console.log('Custom logo not found, using default.');
        setLogoUrl('/logo.png');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [firebaseApp]);

  if (isLoading) {
    return <div className={`relative ${className} bg-muted/20 animate-pulse rounded-md`}></div>;
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={logoUrl}
        alt="Baseline Logo"
        fill
        style={{ objectFit: 'contain' }}
        priority
        unoptimized // Required for Firebase Storage URLs
      />
    </div>
  );
};
