'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Dumbbell, UtensilsCrossed, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';

const adminNavItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/admin/meals', icon: UtensilsCrossed, label: 'Meals' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { auth } = useFirebase();
  const router = useRouter();
  const { appUser } = useAuth();


  const handleLogout = async () => {
    // Re-enable auth guard logic when logging out
    await signOut(auth);
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-56 flex-col border-r bg-card md:flex">
      <div className="flex h-20 items-center justify-center px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">HoopsCoach</span>
        </Link>
      </div>
      
      <nav className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-1">
           {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                  <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-base',
                      isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                  >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  </Link>
              );
          })}
        </div>
        
        <div>
            <div className="space-y-1 p-2 border-t">
                 <p className="font-semibold text-sm">{appUser?.displayName || 'Admin'}</p>
                 <p className="text-xs text-muted-foreground">{appUser?.email}</p>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
            </Button>
        </div>
      </nav>
    </aside>
  );
}
