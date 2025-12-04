'use client';

import { AuthProvider } from '@/lib/auth-provider';
import { FirebaseClientProvider } from '@/firebase';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseClientProvider>
  );
}
