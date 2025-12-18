
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, User, ShoppingCart, Flame, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MoreMenuSheet } from './more-menu-sheet';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/ball-is-life', icon: Flame, label: 'Ball is Life' },
  { href: '/store', icon: ShoppingCart, label: 'Store' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-sm">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md p-2 text-xs font-medium transition-colors w-16',
                isActive ? 'text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <MoreMenuSheet />
      </div>
    </nav>
  );
}
