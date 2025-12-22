
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, UtensilsCrossed, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp, limit } from 'firebase/firestore';
import type { Workout, ScheduleEvent } from '@/lib/types';
import { format, isSameDay, isAfter, startOfToday } from 'date-fns';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { BmiCalculatorWidget } from '@/components/bmi-calculator-widget';

function TodaysPlan() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    
    const scheduleQuery = useMemoFirebase(() => {
        if (!user?.uid) return null;
        const today = startOfToday();
        return query(
            collection(firestore, 'users', user.uid, 'schedule'), 
            where('date', '>=', Timestamp.fromDate(today)),
            limit(5)
        );
    }, [user?.uid, firestore]);

    const { data: schedule, isLoading } = useCollection<ScheduleEvent>(scheduleQuery);
    
    const today = new Date();
    const todaysEvents = schedule?.filter(event => isSameDay(event.date, today)) || [];
    const upcomingEvents = schedule?.filter(event => isAfter(event.date, today)) || [];

    const getEventIcon = (type: ScheduleEvent['type']) => {
        switch(type) {
            case 'workout': return <Dumbbell className="h-5 w-5 text-primary" />;
            case 'meal': return <UtensilsCrossed className="h-5 w-5 text-amber-500" />;
            case 'game': return <span className="text-lg">🏀</span>;
            case 'rest': return <span className="text-lg">😴</span>;
            default: return <Calendar className="h-5 w-5 text-muted-foreground" />;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Plan</CardTitle>
                <CardDescription>Your scheduled workouts and meals for today.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : todaysEvents.length > 0 ? (
                    <ul className="space-y-4">
                        {todaysEvents.map(event => (
                            <li key={event.id} className="flex items-center gap-4">
                                {getEventIcon(event.type)}
                                <span className="font-medium flex-1">{event.title}</span>
                                {event.type === 'workout' && event.workoutId && (
                                    <Button asChild variant="secondary" size="sm">
                                        <Link href={`/workouts/track/${event.workoutId}`}>Start</Link>
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center py-4">No activities scheduled for today. Time for a pick-up game?</p>
                )}
                 {upcomingEvents.length > 0 && (
                    <>
                        <h4 className="text-sm font-semibold mt-6 mb-2 text-muted-foreground">Upcoming</h4>
                        <ul className="space-y-3">
                        {upcomingEvents.slice(0, 2).map(event => (
                            <li key={event.id} className="flex items-center gap-4 text-sm">
                                {getEventIcon(event.type)}
                                <span className="font-medium flex-1">{event.title}</span>
                               <span className="text-muted-foreground">{format(event.date, 'MMM d')}</span>
                            </li>
                        ))}
                    </ul>
                    </>
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild variant="outline" className="w-full">
                    <Link href="/schedule">View Full Schedule</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function HomePage() {
  const { appUser } = useAuth();

  const sessionsCompleted = appUser?.sessionsCompleted || 0;
  const totalSessions = appUser?.totalSessions || 8;
  const progressPercentage = totalSessions > 0 ? (sessionsCompleted / totalSessions) * 100 : 0;

  const quickLinks = [
    { title: "Find a Workout", href: "/workouts", icon: Dumbbell, description: "Level up your skills." },
    { title: "Plan Your Meals", href: "/meal-planner", icon: UtensilsCrossed, description: "Fuel your performance." },
  ];

  const heroImage = placeholderData.placeholderImages.find(p => p.id === 'todays-workout');

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Card className="flex flex-col lg:flex-row items-center gap-6 p-6 overflow-hidden">
        <div className="flex-1">
          <CardTitle className="text-3xl font-bold">Welcome back, {appUser?.displayName || 'baller'}!</CardTitle>
          <CardDescription className="mt-2 text-lg text-muted-foreground">
            Ready to dominate the court today? Let's get to it.
          </CardDescription>
        </div>
        {heroImage && (
             <div className="relative w-full lg:w-64 h-48 lg:h-32 rounded-lg overflow-hidden">
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
            </div>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Monthly Session Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">{sessionsCompleted} of {totalSessions} sessions completed this month.</p>
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href="/my-sessions">Mark Attendance <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>

            <div className="grid sm:grid-cols-2 gap-6">
                {quickLinks.map(link => (
                    <Card key={link.title} className="hover:bg-accent/50 transition-colors">
                         <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <div className="p-3 rounded-full bg-primary/10">
                               <link.icon className="h-6 w-6 text-primary" />
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
        </div>
        <div className="space-y-6">
           <TodaysPlan />
           <BmiCalculatorWidget />
        </div>
      </div>
    </div>
  );
}
