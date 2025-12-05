'use client';

import { useAuth } from '@/hooks/use-auth';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && (!appUser || appUser.role !== 'admin')) {
  //     router.replace('/login');
  //   }
  // }, [appUser, loading, router]);

  // if (loading || !appUser) {
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center bg-background">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  // if (appUser.role !== 'admin') {
  //   return (
  //       <div className="flex h-screen w-full items-center justify-center bg-background p-4">
  //           <div className="flex flex-col items-center text-center gap-4">
  //               <ShieldAlert className="h-16 w-16 text-destructive" />
  //               <h1 className="text-2xl font-bold">Access Denied</h1>
  //               <p className="text-muted-foreground">You do not have permission to view this page.</p>
  //               <Button asChild>
  //                   <Link href="/home">Go to Client Portal</Link>
  //               </Button>
  //           </div>
  //       </div>
  //   )
  // }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 md:pl-56">{children}</main>
    </div>
  );
}
