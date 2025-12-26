
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Dumbbell, UtensilsCrossed, Megaphone, Gift, Loader2, ArrowRight, NotebookPen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { AppUser, Workout, Meal } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

type Announcement = {
    id: number;
    author: string;
    text: string;
    date: Date;
}

const quickLinks = [
    { title: "Manage Users", href: "/admin/users", icon: Users, description: "View and edit users.", color: 'text-sky-400' },
    { title: "Create Workout", href: "/admin/workouts", icon: Dumbbell, description: "Add a new workout.", color: 'text-red-500' },
    { title: "Plan Meals", href: "/admin/meal-planner", icon: NotebookPen, description: "Assign meals to clients.", color: 'text-teal-400' },
];

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const { showNotification } = useNotifications();
    const { firestore } = useFirebase();

    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [xpForCourtsEnabled, setXpForCourtsEnabled] = useState(true);
    const [sellerOrderAccess, setSellerOrderAccess] = useState(true);

    const usersQuery = useMemoFirebase(() => query(collection(firestore, 'users')), [firestore]);
    const { data: allUsers, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const workoutsQuery = useMemoFirebase(() => query(collection(firestore, 'workouts')), [firestore]);
    const { data: allWorkouts, isLoading: isLoadingWorkouts } = useCollection<Workout>(workoutsQuery);
    
    const mealsQuery = useMemoFirebase(() => query(collection(firestore, 'meals')), [firestore]);
    const { data: allMeals, isLoading: isLoadingMeals } = useCollection<Meal>(mealsQuery);

    useEffect(() => {
      const initialAnnouncements: Announcement[] = [
          { id: 1, author: 'Admin', text: 'Reminder: The gym will be closed this Friday for maintenance. All sessions are canceled.', date: new Date() },
          { id: 2, author: 'Admin', text: 'New "Vertical Jump" workouts have been added! Check them out in the workouts section.', date: new Date(new Date().setDate(new Date().getDate() - 1)) },
      ];
      setAnnouncements(initialAnnouncements);
    }, []);

    const handlePostAnnouncement = () => {
        if (!newAnnouncement.trim()) return;

        const announcement = {
            id: Date.now(),
            author: 'Admin',
            text: newAnnouncement,
            date: new Date(),
        };

        setAnnouncements([announcement, ...announcements]);
        setNewAnnouncement('');
        toast({ title: "Announcement Posted", description: "Your announcement is now visible to all clients." });
        
        showNotification('New Announcement', { body: newAnnouncement });
    }
    
    const handleFeatureToggle = (feature: 'xp' | 'orders', enabled: boolean) => {
       if (feature === 'xp') {
           setXpForCourtsEnabled(enabled);
           toast({
               title: "Feature Updated",
               description: `XP for new courts has been ${enabled ? 'enabled' : 'disabled'}.`
           });
       } else if (feature === 'orders') {
            setSellerOrderAccess(enabled);
            toast({
                title: "Permissions Updated",
                description: `Seller access to orders has been ${enabled ? 'enabled' : 'disabled'}.`
            });
       }
    }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the HoopsCoach control center.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-1">
                  {isLoadingUsers ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{allUsers?.length || 0}</div>}
                  <p className="text-xs text-muted-foreground">All registered users</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-1">
                  {isLoadingWorkouts ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{allWorkouts?.length || 0}</div>}
                  <p className="text-xs text-muted-foreground">Manage workout content</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
                  <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-1">
                  {isLoadingMeals ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{allMeals?.length || 0}</div>}
                  <p className="text-xs text-muted-foreground">Manage nutrition plans</p>
              </CardContent>
          </Card>
      </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map(link => (
                <Card key={link.title} className="hover:bg-accent/50 transition-colors">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <div className="p-3 rounded-full bg-primary/10">
                            <link.icon className={`h-6 w-6 ${link.color}`} />
                        </div>
                        <CardTitle>{link.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">{link.description}</p>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href={link.href}>Go <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /> Post an Announcement</CardTitle>
                    <CardDescription>This message will be broadcast to all client dashboards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Type your announcement here..."
                        value={newAnnouncement}
                        onChange={(e) => setNewAnnouncement(e.target.value)}
                        rows={4}
                    />
                    <Button onClick={handlePostAnnouncement} disabled={!newAnnouncement.trim()}>Post Announcement</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                    <CardDescription>A log of your most recent posts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {announcements.map(ann => (
                             <div key={ann.id} className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{ann.author}</p>
                                    <p className="text-sm text-muted-foreground">{ann.text}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{format(ann.date, "PPP p")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                    <CardDescription>Enable or disable experimental features.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="xp-for-courts" className="flex flex-col space-y-1">
                            <span className="flex items-center gap-2 font-semibold"><Gift className="h-4 w-4" />XP for New Courts</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Reward users with 50 XP for submitting a new court location.
                            </span>
                        </Label>
                        <Switch id="xp-for-courts" checked={xpForCourtsEnabled} onCheckedChange={(c) => handleFeatureToggle('xp', c)} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="seller-orders" className="flex flex-col space-y-1">
                            <span className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" />Seller Order Access</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Allow sellers to view and manage all orders.
                            </span>
                        </Label>
                        <Switch id="seller-orders" checked={sellerOrderAccess} onCheckedChange={(c) => handleFeatureToggle('orders', c)} />
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
