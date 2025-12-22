
'use client';

import { BottomNav } from '@/components/layout/bottom-nav';
import { DesktopSidebar } from '@/components/layout/desktop-sidebar';
import { Footer } from '@/components/layout/footer';
import { MobileHeader } from '@/components/layout/mobile-header';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BasketballLoader } from '@/components/basketball-loader';

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
        <BasketballLoader />
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        // Mobile layout
        <div className="flex min-h-screen flex-col">
          <MobileHeader />
          <main className="flex-1 pb-20 neon-border-glow">{children}</main>
          <BottomNav />
        </div>
      ) : (
        // Desktop layout
        <div className="flex">
          <DesktopSidebar />
          <main className="flex-1 md:pl-64 flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto neon-border-glow">
                {children}
            </div>
            <Footer />
          </main>
        </div>
      )}
    </>
  );
}
