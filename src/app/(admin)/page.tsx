
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Dumbbell, UtensilsCrossed, Megaphone, Gift, Loader2, ArrowRight, NotebookPen, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, query } from 'firebase/firestore';
import type { AppUser, Workout, Meal, Product, UserOrder } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { ProgressChart } from '@/components/progress-chart';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type Announcement = {
    id: number;
    author: string;
    text: string;
    date: Date;
}

const adminQuickLinks = [
    { title: "Manage Users", href: "/admin/users", icon: Users, description: "View and edit users.", color: 'text-sky-400' },
    { title: "Create Workout", href: "/admin/workouts", icon: Dumbbell, description: "Add a new workout.", color: 'text-red-500' },
    { title: "Plan Meals", href: "/admin/meal-planner", icon: NotebookPen, description: "Assign meals to clients.", color: 'text-teal-400' },
];

function AdminDashboard() {
    const { toast } = useToast();
    const { showNotification } = useNotifications();
    const { firestore } = useFirebase();

    const usersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
    const { data: allUsers, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const workoutsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'workouts') : null, [firestore]);
    const { data: allWorkouts, isLoading: isLoadingWorkouts } = useCollection<Workout>(workoutsQuery);

    const mealsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'meals') : null, [firestore]);
    const { data: allMeals, isLoading: isLoadingMeals } = useCollection<Meal>(mealsQuery);

    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [xpForCourtsEnabled, setXpForCourtsEnabled] = useState(true);

    useEffect(() => {
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
        showNotification('New Announcement', { body: newAnnouncement });
    }
    
    const handleFeatureToggle = (enabled: boolean) => {
        setXpForCourtsEnabled(enabled);
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
        <p className="text-muted-foreground">Welcome to the HoopsCoach control center.</p>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminQuickLinks.map(link => (
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


function SellerDashboard() {
    const { firestore } = useFirebase();

    const ordersQuery = useMemoFirebase(() => query(collectionGroup(firestore, 'orders')), [firestore]);
    const { data: orders, isLoading: isLoadingOrders } = useCollection<UserOrder>(ordersQuery);

    const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
    const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

    const totalSales = useMemo(() => {
        if (!orders) return 0;
        return orders.reduce((acc, order) => {
            if(order.paymentMethod === 'cod') {
                return acc + order.amountPaid;
            }
            return acc;
        }, 0)
    }, [orders]);

    const pendingOrders = useMemo(() => {
        if (!orders) return 0;
        return orders.filter(o => o.status === 'Pending').length;
    }, [orders]);

    const lowStockProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(p => p.stock < 10);
    }, [products]);

    const salesChartData = useMemo(() => {
        if (!orders) return [];
        const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });
        
        const dailyStats = last7Days.map(day => {
            const dayOrders = orders.filter(o => o.paymentMethod === 'cod' && o.createdAt && isSameDay(o.createdAt.toDate(), day));
            const totalRevenue = dayOrders.reduce((acc, curr) => acc + curr.amountPaid, 0);
            return {
                day: format(day, 'E'),
                Sales: totalRevenue,
            };
        });
        return dailyStats;
    }, [orders]);


    const isLoading = isLoadingOrders || isLoadingProducts;

    const kpis = [
        { title: "Total Sales (SAR)", value: totalSales.toFixed(2), icon: DollarSign },
        { title: "Pending Orders", value: pendingOrders, icon: Package },
        { title: "Total Products", value: products?.length || 0, icon: ShoppingCart },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
                <p className="text-muted-foreground">Your e-commerce performance at a glance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {kpis.map(kpi => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{kpi.value}</div>}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Sales Performance</CardTitle>
                        <CardDescription>Last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <div className="flex items-center justify-center h-60"><Loader2 className="h-8 w-8 animate-spin" /></div> :
                            <ProgressChart data={salesChartData} />
                        }
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Your 5 most recent sales.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {isLoading ? <div className="flex items-center justify-center h-60"><Loader2 className="h-8 w-8 animate-spin" /></div> :
                            <div className="space-y-4">
                                {orders?.slice(0, 5).map(order => (
                                    <div key={order.id} className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center">
                                            <Image src={order.photoUrl} alt={order.productName} width={40} height={40} className="rounded-md object-cover"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{order.productName}</p>
                                            <p className="text-xs text-muted-foreground">{format(order.createdAt.toDate(), 'PPP')}</p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {order.paymentMethod === 'cod' ? `$${order.amountPaid.toFixed(2)}` : `${order.amountPaid} XP`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </CardContent>
                </Card>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                     <CardHeader>
                        <CardTitle>Low Stock Alerts</CardTitle>
                        <CardDescription>Products with less than 10 units remaining.</CardDescription>
                     </CardHeader>
                     <CardContent>
                        {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div> :
                            lowStockProducts.length > 0 ? (
                                <ul className="space-y-2">
                                    {lowStockProducts.map(p => (
                                        <li key={p.id} className="flex justify-between items-center text-sm">
                                            <span className="font-medium">{p.name}</span>
                                            <Badge variant="destructive">{p.stock} in stock</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-center text-muted-foreground py-4">No products are low on stock. Great job!</p>
                        }
                     </CardContent>
                 </Card>
                  <Card>
                     <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Navigate to key management pages.</CardDescription>
                     </CardHeader>
                     <CardContent className="grid grid-cols-2 gap-4">
                         <Button asChild variant="outline" className="h-20">
                             <Link href="/admin/orders" className="flex flex-col gap-1">
                                 <Package className="h-6 w-6" />
                                 <span>Manage Orders</span>
                             </Link>
                         </Button>
                         <Button asChild variant="outline" className="h-20">
                             <Link href="/admin/products" className="flex flex-col gap-1">
                                 <ShoppingCart className="h-6 w-6" />
                                 <span>Manage Products</span>
                             </Link>
                         </Button>
                     </CardContent>
                 </Card>
            </div>
        </div>
    );
}


export default function DashboardPage() {
  const { appUser, loading } = useAuth();

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  if (appUser?.role === 'seller') {
    return <SellerDashboard />;
  }
  
  return <AdminDashboard />;
}
