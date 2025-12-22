
'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function Loader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // When the pathname changes, we want to reset and show the loader.
    // The key change will force a re-render of the loader div, restarting the animation.
    setIsLoading(true);
    setKey(prev => prev + 1);

    // Hide loader after a short delay to simulate loading completion.
    // This provides a better UX than instantly hiding it, as the page might still be rendering.
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 750); // A short duration for the loading bar to be visible

    return () => clearTimeout(timer);
  }, [pathname]);
  
  return (
    <div key={key} className={cn("fixed top-0 left-0 right-0 h-1 z-50", isLoading ? "block" : "hidden")}>
      <div
        className="h-full bg-primary"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)`,
          backgroundSize: '200% 100%',
          animation: 'page-loader-anim 1s linear infinite',
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
