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
    if (!loading) {
      if (user && appUser) {
        if (appUser.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/home');
        }
      } else {
        router.replace('/onboarding');
      }
    }
  }, [user, appUser, loading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Logo className="h-32 w-80" />
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>Loading your experience...</p>
    </div>
  );
}
