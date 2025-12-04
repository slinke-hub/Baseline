'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons/logo';

export default function EntryPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // For demonstration, redirect directly to the client portal
    router.replace('/home');
    
    // Original logic is commented out below.
    // if (!loading) {
    //   if (user && appUser) {
    //     if (appUser.role === 'admin') {
    //       router.replace('/admin');
    //     } else {
    //       router.replace('/home');
    //     }
    //   } else {
    //     router.replace('/onboarding');
    //   }
    // }
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Logo className="h-16 w-16 text-primary" />
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>Redirecting to client portal...</p>
    </div>
  );
}
