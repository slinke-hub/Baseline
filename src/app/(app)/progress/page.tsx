
'use client';

import { ProgressChart } from "@/components/progress-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Flame, Timer, Loader2 } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import type { WorkoutProgress } from '@/lib/types';
import { eachDayOfInterval, subDays, startOfDay, endOfDay, format } from 'date-fns';

const stats = [
    { label: "Total Workouts", value: "12", icon: BarChart },
    { label: "Total Minutes", value: "348", icon: Timer },
    { label: "Calories Burned", value: "2,100", icon: Flame },
]

export default function ProgressPage() {
    const { firestore } = useFirebase();
    const { user } = useAuth();

    const sevenDaysAgo = subDays(new Date(), 6);
    const progressQuery = useMemoFirebase(() => {
        if (!user?.uid) return null;
        return query(
            collection(firestore, 'users', user.uid, 'workoutProgress'),
            where('date', '>=', Timestamp.fromDate(startOfDay(sevenDaysAgo)))
        );
    }, [user?.uid, firestore]);
    
    const { data: progressData, isLoading } = useCollection<WorkoutProgress>(progressQuery);

    const chartData = useMemoFirebase(() => {
        const today = new Date();
        const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
        
        const dailyStats = last7Days.map(day => {
            const dayProgress = progressData?.filter(p => startOfDay(p.date.toDate()).getTime() === startOfDay(day).getTime());
            
            const totalMinutes = dayProgress?.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0) || 0;
            const totalWorkouts = dayProgress?.length || 0;
            
            return {
                day: format(day, 'E'),
                minutes: totalMinutes,
                workouts: totalWorkouts,
            };
        });

        return dailyStats;
    }, [progressData]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
            <p className="text-muted-foreground">Track your journey and celebrate your milestones.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
            {stats.map(stat => (
                <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>A summary of your workouts over the last week.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex h-[200px] w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ProgressChart data={chartData} />
                )}
            </CardContent>
        </Card>
    </div>
  );
}
