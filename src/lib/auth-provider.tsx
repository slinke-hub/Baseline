'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState, useMemo } from 'react';
import type { AppUser } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirebase, useUser } from '@/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(isUserLoading);
    if (isUserLoading || !user) {
      setAppUser(null);
      return;
    }

    const userDocRef = doc(firestore, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setAppUser({ uid: user.uid, ...doc.data() } as AppUser);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isUserLoading, firestore]);

  const value = useMemo(() => ({ user, appUser, loading }), [user, appUser, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
