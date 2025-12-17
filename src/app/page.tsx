
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function EntryPage() {
  const { user, appUser, loading } = useAuth();
  const { auth } = useFirebase();
  const router = useRouter();
  const [authAttempted, setAuthAttempted] = useState(false);

  useEffect(() => {
    if (loading) {
      return; // Wait until Firebase auth state is loaded
    }

    if (user && appUser) {
      // If user is already logged in and we have their profile
      if (appUser.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/home');
      }
    } else if (!user && !authAttempted) {
      // If no user is logged in, attempt to log in as admin automatically
      setAuthAttempted(true);
      signInWithEmailAndPassword(auth, 'monti.training@gmail.com', 'password')
        .then(() => {
          // The onAuthStateChanged listener will handle the redirect
        })
        .catch(() => {
          // If admin login fails (e.g., user not created), go to onboarding
          router.replace('/onboarding');
        });
    } else if (!user && authAttempted) {
        // If login was attempted and failed, go to onboarding
        router.replace('/onboarding');
    }
  }, [user, appUser, loading, router, auth, authAttempted]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Logo className="h-40 w-[512px]" />
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>Loading your experience...</p>
    </div>
  );
}
