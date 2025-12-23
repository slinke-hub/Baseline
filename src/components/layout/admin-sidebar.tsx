
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UtensilsCrossed,
  Calendar,
  MessageSquare,
  MapPin,
  NotebookPen,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '../icons/logo';

const adminNavItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', color: 'text-sky-400' },
  { href: '/admin/users', icon: Users, label: 'Users', color: 'text-amber-400' },
  { href: '/admin/schedule', icon: Calendar, label: 'Schedules', color: 'text-blue-400' },
  { href: '/admin/workouts', icon: Dumbbell, label: 'Workouts', color: 'text-red-500' },
  { href: '/admin/meals', icon: UtensilsCrossed, label: 'Meals', color: 'text-teal-400' },
  { href: '/admin/meal-planner', icon: NotebookPen, label: 'Meal Planner', color: 'text-green-400' },
  { href: '/admin/chat', icon: MessageSquare, label: 'Chat', color: 'text-rose-400' },
  { href: '/admin/locations', icon: MapPin, label: 'Locations', color: 'text-violet-400' },
  { href: '/admin/products', icon: ShoppingCart, label: 'Products', color: 'text-purple-400' },
  { href: '/admin/orders', icon: Package, label: 'Orders', color: 'text-orange-400' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Logo width={140} />
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', isActive ? '' : item.color)} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
