
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Dumbbell, UtensilsCrossed, User, Settings, LogOut, BarChart, Calculator, Calendar, MessageSquare, ClipboardList, MapPin, Users, Star, Flame, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { useAuth as useAppAuth } from '@/hooks/use-auth';
import { signOut } from 'firebase/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFirebase } from '@/firebase';

const mainNavItems = [
  { href: '/home', icon: Home, label: 'Home', color: 'text-sky-400' },
  { href: '/friends', icon: Users, label: 'Friends', color: 'text-amber-400' },
  { href: '/ball-is-life', icon: Flame, label: 'Ball is Life', color: 'text-orange-500' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts', color: 'text-red-500' },
  { href: '/meal-planner', icon: UtensilsCrossed, label: 'Meal Planner', color: 'text-teal-400' },
  { href: '/my-sessions', icon: ClipboardList, label: 'My Sessions', color: 'text-cyan-400' },
  { href: '/schedule', icon: Calendar, label: 'Schedule', color: 'text-blue-400' },
  { href: '/chat', icon: MessageSquare, label: 'Chat', color: 'text-green-400' },
  { href: '/locations', icon: MapPin, label: 'Courts', color: 'text-rose-400' },
  { href: '/progress', icon: BarChart, label: 'Progress', color: 'text-violet-400' },
  { href: '/bmi-calculator', icon: Calculator, label: 'BMI Calculator', color: 'text-lime-400' },
  { href: '/store', icon: ShoppingCart, label: 'Store', color: 'text-pink-400' },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const { appUser } = useAppAuth();
  const { auth } = useFirebase();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r bg-card/95 bg-transparent text-white backdrop-blur-lg md:flex">
      <div className="flex h-20 items-center justify-center border-b px-6">
        <Link href="/home" className="flex items-center gap-2">
          <Logo className="h-20 w-[512px]" />
        </Link>
      </div>

      <div className="p-4 border-b">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all hover:bg-accent/50">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={appUser?.photoURL} alt={appUser?.displayName || 'User'} />
                        <AvatarFallback>{getInitials(appUser?.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate font-medium text-foreground">{appUser?.displayName || 'User'}</span>
                        <span className="truncate text-xs text-muted-foreground">{appUser?.email}</span>
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-muted-foreground font-bold">{appUser?.xp || 0} XP</span>
                        </div>
                    </div>
                </button>
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
                    <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
           {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                  <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-base',
                      isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                  >
                  <item.icon className={cn("h-5 w-5", !isActive && item.color)} />
                  <span>{item.label}</span>
                  </Link>
              );
          })}
        </div>
      </nav>
    </aside>
  );
}
