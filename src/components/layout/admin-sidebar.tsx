
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
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/schedule', icon: Calendar, label: 'Schedules' },
  { href: '/admin/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/admin/meals', icon: UtensilsCrossed, label: 'Meals' },
  { href: '/admin/meal-planner', icon: NotebookPen, label: 'Meal Planner'},
  { href: '/admin/products', icon: ShoppingCart, label: 'Products' },
  { href: '/admin/orders', icon: Package, label: 'Orders' },
  { href: '/admin/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/admin/locations', icon: MapPin, label: 'Locations' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Logo width={120} height={34} />
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
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
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
