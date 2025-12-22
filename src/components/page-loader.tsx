'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function Loader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);
  
  // This is a bit of a trick. We are using a client component to wrap a server component.
  // We use a separate component to avoid Suspense boundary issues.
  // The outer component sets up the loading state, and the inner component listens for path changes.
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    // In a real app, you'd use router events, but they're not available in this simplified setup.
    // For demonstration, we'll simulate loading on link clicks.
    const links = document.querySelectorAll('a');
    links.forEach(link => link.addEventListener('click', handleStart));

    return () => {
       links.forEach(link => link.removeEventListener('click', handleStart));
    }
  }, []);


  return (
    <div className={cn("fixed top-0 left-0 right-0 h-1 z-50", isLoading ? "block" : "hidden")}>
      <div
        className="h-full bg-primary animate-pulse"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)`,
          backgroundSize: '200% 100%',
          animation: 'page-loader-anim 1.5s linear infinite',
        }}
      />
    </div>
  );
}


export function PageLoader() {
    return (
        <Suspense fallback={null}>
            <Loader />
        </Suspense>
    )
}
