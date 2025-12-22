
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';
import { ArrowLeft, CheckCircle, Pause, Play, RotateCcw, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Workout, WorkoutProgress } from "@/lib/types";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export function WorkoutDetailClientPage({ workout }: { workout: Workout }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDuration = useRef(0);

  const workoutImage = workout.photoUrl || placeholderData.placeholderImages.find(p => p.id === workout.imageId)?.imageUrl;
  const cardClassName = "bg-card/20 backdrop-blur-sm";

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

      router.push('/home');

    } catch(e) {
        console.error("Failed to save workout progress", e);
        toast({
            title: "Save Failed",
            description: "Could not save your workout progress. Please try again.",
            variant: "destructive",
        });
    }

  }, [workout, toast, router, user, firestore, time]);

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
    <div className="relative min-h-screen">
       <div
            className="absolute inset-0 -z-10 h-full w-full bg-background"
        />
        <div className="absolute inset-0 -z-10 bg-background/90 backdrop-blur-md" />
        <div className="relative z-0 p-4 sm:p-6 lg:p-8">
            <Link href="/workouts" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Workouts
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className={cardClassName}>
                        {workoutImage && (
                            <div className="relative h-64 w-full rounded-t-lg overflow-hidden">
                            <Image
                                src={workoutImage}
                                alt={workout.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 67vw"
                            />
                            </div>
                        )}
                        <CardHeader>
                            <Badge variant="secondary" className="w-fit mb-2">{workout.category}</Badge>
                            <CardTitle className="text-3xl font-bold">{workout.title}</CardTitle>
                            <div className="flex items-center gap-4 text-muted-foreground pt-2">
                                <span>{workout.difficulty}</span>
                                <span>•</span>
                                <span>{workout.duration} minutes</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg mb-6">{workout.description}</p>
                            <h3 className="text-xl font-bold mb-4">Instructions</h3>
                            <ul className="space-y-4">
                                {workout.steps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className={cn("sticky top-24", cardClassName)}>
                        <CardHeader>
                            <CardTitle>Workout Timer</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                            <div className="aspect-video w-full bg-secondary rounded-lg mb-4">
                                <iframe
                                    className="w-full h-full rounded-lg"
                                    src={workout.videoUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="text-5xl md:text-6xl font-mono font-bold text-primary tabular-nums drop-shadow-lg">
                                {formatTime(time)}
                            </div>
                             <div className="w-full grid grid-cols-3 gap-2">
                                <Button size="lg" onClick={handleStartPause} className="flex items-center gap-2 col-span-2" disabled={time === 0}>
                                    {isRunning ? <><Pause className="h-5 w-5"/>Pause</> : <><Play className="h-5 w-5"/>Start</>}
                                </Button>
                                <Button size="lg" variant="outline" onClick={handleAddTime} className="flex items-center gap-2 bg-transparent/20 hover:bg-transparent/40 border-white/50 text-white">
                                    <Plus className="h-5 w-5"/>
                                </Button>
                            </div>
                             <div className="w-full grid grid-cols-2 gap-2">
                                <Button size="lg" variant="destructive" onClick={handleReset} className="flex items-center gap-2">
                                    <RotateCcw className="h-5 w-5"/>Reset
                                </Button>
                                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleMarkComplete}>
                                    <Check className="mr-2 h-5 w-5"/>Done
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
