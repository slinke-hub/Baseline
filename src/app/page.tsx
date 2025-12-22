
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BasketballLoader } from '@/components/basketball-loader';

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
      if (appUser.role === 'admin' || appUser.role === 'coach' || appUser.role === 'seller') {
        router.replace('/admin');
      } else {
        router.replace('/home');
      }
    } else if (!user && !authAttempted) {
      // If no user is logged in, attempt to log in as admin automatically
      setAuthAttempted(true);
      signInWithEmailAndPassword(auth, 'monti.training@gmail.com', 'password')
        .then(() => {
          // The onAuthStateChanged listener in the AuthProvider will handle the redirect
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
      <BasketballLoader />
    </div>
  );
}

