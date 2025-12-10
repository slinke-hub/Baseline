
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { mockWorkouts, mockSchedule } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Play, Pause, RotateCcw, Check, Plus } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { isSameDay } from 'date-fns';

export default function WorkoutTrackerPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const { appUser } = useAuth();
  const workout = mockWorkouts.find(w => w.id === id);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMarkComplete = useCallback(() => {
    toast({
      title: "Workout Completed!",
      description: `Great job finishing ${workout?.title}.`,
    });
    
    // Play notification sound
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
    audio.play().catch(e => console.error("Error playing sound:", e));

    const currentUserMockId = appUser?.uid?.includes('zion') ? 'user-5' : 'user-2';
    const todaysWorkouts = mockSchedule.filter(event => 
        event.userId === currentUserMockId &&
        event.type === 'workout' &&
        isSameDay(event.date, new Date()) &&
        event.workoutId !== id
    );

    if (todaysWorkouts.length > 0) {
        router.push('/workouts');
    } else {
        router.push('/home');
    }

  }, [workout, toast, router, appUser, id]);

  useEffect(() => {
    if (workout) {
        setTime(workout.duration * 60);
    }
  }, [workout]);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      handleMarkComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, time, handleMarkComplete]);

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const handleStartPause = () => {
    if (time > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if(workout) {
        setTime(workout.duration * 60);
    }
  };

  const handleAddTime = () => {
    setTime(prev => prev + 60);
  }

  if (!workout) {
    return <div className="p-8">Workout not found.</div>;
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-theme(spacing.16))] sm:min-h-screen flex-col p-4 sm:p-6 lg:p-8">
      <Link href={`/workouts/${workout.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Workout
      </Link>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">{workout.title}</CardTitle>
                <CardDescription>Time Remaining. Stay focused!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="text-8xl font-mono font-bold text-primary tabular-nums">
                    {formatTime(time)}
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <Button size="lg" onClick={handleStartPause} className="flex items-center gap-2 col-span-2" disabled={time === 0}>
                        {isRunning ? <><Pause className="h-5 w-5"/>Pause</> : <><Play className="h-5 w-5"/>Start</>}
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleAddTime} className="flex items-center gap-2">
                        <Plus className="h-5 w-5"/>+1 Min
                    </Button>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <Button size="lg" variant="destructive" onClick={handleReset} className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5"/>Reset
                    </Button>
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleMarkComplete}>
                        <Check className="mr-2 h-5 w-5"/> Mark as Completed
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
