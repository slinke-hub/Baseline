
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, User, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

const BasketballFlameIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
      <path d="M12 12a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
      <path d="M12 12c-3 0-5.5 2.5-5.5 5.5S9 23 12 23s5.5-2.5 5.5-5.5" />
      <path d="M12 12c3 0 5.5-2.5 5.5-5.5S15 1 12 1s-5.5 2.5-5.5 5.5" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
      <path d="M15.5 15.5c-2-2-2.5-4-1-6" />
      <path d="M8.5 8.5c2 2 2.5 4 1 6" />
      <path d="M10 19a3.5 3.5 0 0 1-3-5.5c.5-1 1.5-2 3-2s2.5 1 3 2c.5 1 .5 3-1 4.5" />
      <path d="M12 22c-2.5 0-4.5-2-4.5-4.5" />
    </svg>
  );

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/ball-is-life', icon: BasketballFlameIcon, label: 'Ball is Life' },
  { href: '/store', icon: ShoppingCart, label: 'Store' },
  { href: '/profile', icon: User, label: 'Profile' },
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
      </div>
    </nav>
  );
}
