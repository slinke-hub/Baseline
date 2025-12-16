
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { mockSchedule, mockWorkouts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, RotateCcw, Check, Plus } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { isSameDay } from 'date-fns';
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import type { Workout, WorkoutProgress } from '@/lib/types';
import Image from 'next/image';

export function WorkoutTrackerClientPage({ workout }: { workout: Workout }) {
  const router = useRouter();
  const { toast } = useToast();
  const { appUser, user } = useAuth();
  const { firestore } = useFirebase();
  const id = workout.id;

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDuration = useRef(0);

  useEffect(() => {
    if (workout) {
      const durationInSeconds = workout.duration * 60;
      setTime(durationInSeconds);
      initialDuration.current = durationInSeconds;
    }
  }, [workout]);

  const handleMarkComplete = useCallback(async () => {
    if (!user || !workout) return;

    setIsRunning(false);

    const timeSpent = Math.round((initialDuration.current - time) / 60);

    const progressData: Omit<WorkoutProgress, 'id'> = {
      userId: user.uid,
      workoutId: workout.id,
      date: Timestamp.now(),
      timeSpent: timeSpent > 0 ? timeSpent : 1, // Log at least 1 minute
      isCompleted: true,
    };

    try {
      const progressColRef = collection(firestore, 'users', user.uid, 'workoutProgress');
      await addDoc(progressColRef, progressData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: progressColRef.path,
            operation: 'create',
            requestResourceData: progressData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({
        title: "Workout Completed!",
        description: `Great job finishing ${workout.title}.`,
      });
      
      const audio = new Audio('https://actions.google.com/sounds/v1/notifications/notification_simple.ogg');
      audio.volume = 0.5;
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
    } catch(e) {
        console.error("Failed to save workout progress", e);
        toast({
            title: "Save Failed",
            description: "Could not save your workout progress. Please try again.",
            variant: "destructive",
        });
    }

  }, [workout, toast, router, appUser, id, user, firestore, time]);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleMarkComplete();
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

  return (
    <div className="relative flex h-full min-h-[calc(100vh-theme(spacing.16))] sm:min-h-screen flex-col p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage: `url(/logo.png)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm -z-10" />

      <div className="relative z-10">
        <Link href={`/workouts/${workout.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Workout
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 text-white">
        <div className="w-full max-w-md space-y-8">
            <div>
                <h1 className="text-3xl font-bold">{workout.title}</h1>
                <p className="text-muted-foreground">Time Remaining. Stay focused!</p>
            </div>
            
            <div className="text-7xl md:text-8xl font-mono font-bold text-primary tabular-nums drop-shadow-lg">
                {formatTime(time)}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                <Button size="lg" onClick={handleStartPause} className="flex items-center gap-2 col-span-2" disabled={time === 0}>
                    {isRunning ? <><Pause className="h-5 w-5"/>Pause</> : <><Play className="h-5 w-5"/>Start</>}
                </Button>
                <Button size="lg" variant="outline" onClick={handleAddTime} className="flex items-center gap-2 bg-transparent/20 hover:bg-transparent/40 border-white/50 text-white">
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
        </div>
      </div>
    </div>
  );
}
