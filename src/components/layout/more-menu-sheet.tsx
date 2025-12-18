'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { mainNavItems } from './desktop-sidebar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function MoreMenuSheet() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center gap-1 rounded-md p-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground w-16">
          <Menu className="h-5 w-5" />
          <span>More</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>More</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {mainNavItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-6 w-6', !isActive && item.color)} />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
