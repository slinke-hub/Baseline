
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Dumbbell, UtensilsCrossed, Megaphone, Gift, Loader2 } from 'lucide-react';
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
import { collection } from 'firebase/firestore';
import type { AppUser, Workout, Meal } from '@/lib/types';

type Announcement = {
    id: number;
    author: string;
    text: string;
    date: Date;
}

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const { showNotification } = useNotifications();
    const { firestore } = useFirebase();

    const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
    const { data: allUsers, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const workoutsQuery = useMemoFirebase(() => collection(firestore, 'workouts'), [firestore]);
    const { data: allWorkouts, isLoading: isLoadingWorkouts } = useCollection<Workout>(workoutsQuery);

    const mealsQuery = useMemoFirebase(() => collection(firestore, 'meals'), [firestore]);
    const { data: allMeals, isLoading: isLoadingMeals } = useCollection<Meal>(mealsQuery);

    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [xpForCourtsEnabled, setXpForCourtsEnabled] = useState(true);

    useEffect(() => {
      // In a real app, this initial state would be fetched from Firestore
      const initialAnnouncements = [
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
        
        // This is a simulation. In a real app, a backend service would send this notification.
        showNotification('New Announcement', { body: newAnnouncement });
    }
    
    const handleFeatureToggle = (enabled: boolean) => {
        setXpForCourtsEnabled(enabled);
        // In a real app, this would update the setting in Firestore
        toast({
            title: "Feature Updated",
            description: `XP for new courts has been ${enabled ? 'enabled' : 'disabled'}.`
        });
    }

    const isLoadingStats = isLoadingUsers || isLoadingWorkouts || isLoadingMeals;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Baseline control center.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center p-1 text-center">
              <CardHeader className="p-1">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><Users className="h-4 w-4 text-muted-foreground" /> Total Users</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                  {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{allUsers?.length || 0}</div>}
                  <p className="text-xs text-muted-foreground">All registered users</p>
              </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center p-1 text-center">
              <CardHeader className="p-1">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><Dumbbell className="h-4 w-4 text-muted-foreground" /> Total Workouts</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                  {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{allWorkouts?.length || 0}</div>}
                  <p className="text-xs text-muted-foreground">Manage workout content</p>
              </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center p-1 text-center">
              <CardHeader className="p-1">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><UtensilsCrossed className="h-4 w-4 text-muted-foreground" /> Total Meals</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                  {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{allMeals?.length || 0}</div>}
                  <p className="text-xs text-muted-foreground">Manage nutrition plans</p>
              </CardContent>
          </Card>
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
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="xp-for-courts" className="flex flex-col space-y-1">
                            <span className="flex items-center gap-2 font-semibold"><Gift className="h-4 w-4" />XP for New Courts</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Reward users with 50 XP for submitting a new court location.
                            </span>
                        </Label>
                        <Switch id="xp-for-courts" checked={xpForCourtsEnabled} onCheckedChange={handleFeatureToggle} />
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
