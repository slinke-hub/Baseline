'use client';

import { BottomNav } from '@/components/layout/bottom-nav';
import { DesktopSidebar } from '@/components/layout/desktop-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        // Mobile layout
        <div className="flex min-h-screen flex-col">
          <div className="flex-1 pb-20">{children}</div>
          <BottomNav />
        </div>
      ) : (
        // Desktop layout
        <div className="flex">
          <DesktopSidebar />
          <main className="flex-1 pl-64">{children}</main>
        </div>
      )}
    </>
  );
}
