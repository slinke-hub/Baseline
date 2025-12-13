'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useFirebase } from '@/firebase';

const LOGO_UPDATED_EVENT = 'logoUpdated';

export const Logo = ({ className }: { className?: string }) => {
  const { firebaseApp } = useFirebase();
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogo = async () => {
    setIsLoading(true);
    try {
      if (!firebaseApp) {
        throw new Error('Firebase not initialized');
      }
      const storage = getStorage(firebaseApp);
      // Add a cache-busting query parameter to the ref path
      const logoRef = ref(storage, 'app/logo.png');
      const url = await getDownloadURL(logoRef);
      // Append a timestamp to break browser cache
      setLogoUrl(`${url}?t=${new Date().getTime()}`);
    } catch (error) {
      // Logo not found in storage, use fallback
      console.log('Custom logo not found, using default.');
      setLogoUrl('/logo.png');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogo();

    const handleLogoUpdate = () => {
      fetchLogo();
    };
    
    window.addEventListener(LOGO_UPDATED_EVENT, handleLogoUpdate);

    return () => {
      window.removeEventListener(LOGO_UPDATED_EVENT, handleLogoUpdate);
    };
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
        unoptimized // Required for Firebase Storage URLs that may not be in next.config.js
        key={logoUrl} // Force re-render of Image component when URL changes
      />
    </div>
  );
};
