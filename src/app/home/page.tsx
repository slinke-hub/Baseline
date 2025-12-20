
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RedirectToRoot() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the root, which will handle auth and redirect to the correct home page.
    router.replace('/');
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>Redirecting...</p>
    </div>
  );
}
