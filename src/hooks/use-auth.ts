'use client';

import { useContext } from 'react';
import { AuthContext } from '@/lib/auth-provider';
import { useUser } from '@/firebase';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const { user, isUserLoading: loading } = useUser();
  return { ...context, user, loading };
}
