
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Dumbbell, UtensilsCrossed, LogOut, Calendar, MessageSquare, MapPin, User, NotebookPen, ShoppingCart, Package, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
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


export function AdminHeader() {
  const pathname = usePathname();
  const { auth } = useFirebase();
  const router = useRouter();
  const { appUser } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <Logo width={100} height={28} />
                    </Link>
                </nav>
                <ScrollArea className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {adminNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                                     pathname.startsWith(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </ScrollArea>
            </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 neon-border">
                        <AvatarImage src={appUser?.photoURL} alt={appUser?.displayName || 'Admin'} />
                        <AvatarFallback>{getInitials(appUser?.displayName)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{appUser?.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{appUser?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/admin/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
