
'use client';

import { useAuth } from '@/hooks/use-auth';
import { ShieldAlert } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AdminHeader } from '@/components/layout/admin-header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Footer } from '@/components/layout/footer';
import { BasketballLoader } from '@/components/basketball-loader';
import { cn } from '@/lib/utils';

const allowedRoles: AppUser['role'][] = ['admin', 'coach', 'seller'];
const sellerAllowedPaths = ['/admin/orders', '/admin/chat', '/admin', '/admin/profile'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!appUser || !allowedRoles.includes(appUser.role))) {
      router.replace('/login');
    }
  }, [appUser, loading, router]);

  if (loading || !appUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <BasketballLoader />
      </div>
    );
  }

  const isAllowed = () => {
    if (!appUser) return false;
    if (appUser.role === 'admin' || appUser.role === 'coach') {
        return true;
    }
    if (appUser.role === 'seller') {
        return sellerAllowedPaths.some(path => pathname.startsWith(path));
    }
    return false;
  }

  if (!isAllowed()) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <div className="flex flex-col items-center text-center gap-4">
                <ShieldAlert className="h-16 w-16 text-destructive" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
                <Button asChild>
                    <Link href="/home">Go to Client Portal</Link>
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 neon-border-glow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
