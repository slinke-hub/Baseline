
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell, Droplet, Rocket, BarChart, Megaphone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import placeholderData from '@/lib/placeholder-images.json';
import { BmiCalculatorWidget } from '@/components/bmi-calculator-widget';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { Workout } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const workoutCategories = [
  { name: 'Shooting', icon: <Droplet className="h-8 w-8 text-white" />, href: '/workouts?category=Shooting', imageId: 'cat-shooting' },
  { name: 'Strength', icon: <Dumbbell className="h-8 w-8 text-white" />, href: '/workouts?category=Conditioning', imageId: 'cat-strength' },
  { name: 'Dribbling', icon: <Rocket className="h-8 w-8 text-white" />, href: '/workouts?category=Ball+Handling', imageId: 'cat-dribbling' },
];

const progressStats = [
  { label: 'Minutes Trained', value: 78, dailyValue: 25, goal: 120 },
  { label: 'Shots Taken', value: 250, dailyValue: 150, goal: 500 },
  { label: 'Workouts', value: 3, dailyValue: 1, goal: 5 },
];

const TodaysWorkoutImage = placeholderData.placeholderImages.find(p => p.id === 'todays-workout');
const latestAnnouncement = "Reminder: The gym will be closed this Friday for maintenance. All sessions are canceled.";

function TodaysWorkoutCard() {
  const { firestore } = useFirebase();
  const workoutQuery = useMemoFirebase(() => query(collection(firestore, 'workouts'), limit(1)), [firestore]);
  const { data: workouts, isLoading } = useCollection<Workout>(workoutQuery);
  const todaysWorkout = workouts?.[0];

  if (isLoading) {
    return (
      <Card className="overflow-hidden lg:col-span-1">
        <div className="grid md:grid-cols-2">
          <div className="p-6 md:p-8">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-16 w-full mb-4" />
            <Skeleton className="h-5 w-36 mb-6" />
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="relative h-48 md:h-auto min-h-[200px]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </Card>
    )
  }

  if (!todaysWorkout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Workout Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your coach hasn't added a workout yet. Check back later!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden lg:col-span-1">
      <div className="grid md:grid-cols-2">
        <div className="p-6 md:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Today's Focus</h2>
          <p className="mt-1 text-2xl font-bold">{todaysWorkout.title}</p>
          <p className="mt-2 text-muted-foreground">{todaysWorkout.description}</p>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
              <span>{todaysWorkout.difficulty} Difficulty</span>
              <span>•</span>
              <span>{todaysWorkout.duration} Mins</span>
          </div>
          <Button asChild size="lg" className="mt-6">
            <Link href={`/workouts/track/${todaysWorkout.id}`}>Start Workout</Link>
          </Button>
        </div>
        {TodaysWorkoutImage && (
          <div className="relative h-48 md:h-auto min-h-[200px]">
            <Image
              src={TodaysWorkoutImage.imageUrl}
              alt={todaysWorkout.title}
              fill
              className="object-cover"
              data-ai-hint={TodaysWorkoutImage.imageHint}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </Card>
  )
}

export default function HomePage() {
  const { appUser } = useAuth();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 animate-in fade-in-0 duration-500">
      <div className="rounded-lg bg-card p-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {appUser?.displayName?.split(' ')[0] || 'Player'}!</h1>
        <p className="text-muted-foreground">Ready to crush another session? Let's get it.</p>
      </div>

       <Card className="bg-primary/10 border-primary/20">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
            <Megaphone className="h-6 w-6 text-primary"/>
            <CardTitle>Coach's Announcement</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{latestAnnouncement}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysWorkoutCard />
        <div className="lg:col-span-1">
          <BmiCalculatorWidget />
        </div>
      </div>
      
      <div>
        <h2 className="mb-4 text-2xl font-bold">Explore Workouts</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {workoutCategories.map(category => {
            const categoryImage = placeholderData.placeholderImages.find(p => p.id === category.imageId);
            return (
              <Link href={category.href} key={category.name}>
                <Card className="group relative flex h-48 flex-col justify-end overflow-hidden rounded-lg p-4 text-white transition-transform duration-300 ease-in-out hover:scale-105">
                  {categoryImage && (
                    <Image
                      src={categoryImage.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={categoryImage.imageHint}
                       sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0"></div>
                  <div className="relative z-10">
                    {category.icon}
                    <h3 className="mt-2 text-xl font-bold">{category.name}</h3>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Weekly Progress</CardTitle>
          <CardDescription>You're doing great, keep up the hard work!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progressStats.map(stat => (
            <div key={stat.label}>
              <div className="mb-1 flex justify-between text-sm font-medium">
                <span>{stat.label}</span>
                <span className="text-muted-foreground">{stat.value} / {stat.goal}</span>
              </div>
               <div className="relative h-2 w-full">
                  <Progress value={(stat.value / stat.goal) * 100} className="absolute h-2 w-full bg-primary/50" />
                  <Progress value={(stat.dailyValue / stat.goal) * 100} className="absolute h-2 w-full" />
              </div>
            </div>
          ))}
          <Button asChild variant="outline" className="mt-4 w-full">
             <Link href="/progress" className="flex w-full items-center justify-center">
                <BarChart className="mr-2 h-4 w-4" /> View Detailed Progress
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
