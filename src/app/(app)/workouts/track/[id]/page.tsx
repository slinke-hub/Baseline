'use client';

import { useState, useEffect, useRef } from 'react';
import { mockWorkouts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, RotateCcw, Check } from "lucide-react";
import Link from 'next/link';

export default function WorkoutTrackerPage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const workout = mockWorkouts.find(w => w.id === id);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleMarkComplete = () => {
    // In a real app, this would write to Firestore
    toast({
      title: "Workout Completed!",
      description: `Great job finishing ${workout?.title}.`,
    });
    router.push('/workouts');
  };

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
                <CardDescription>Stay focused and give it your all.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="text-8xl font-mono font-bold text-primary tabular-nums">
                    {formatTime(time)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Button size="lg" onClick={handleStartPause} className="flex items-center gap-2">
                        {isRunning ? <><Pause className="h-5 w-5"/>Pause</> : <><Play className="h-5 w-5"/>Start</>}
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleReset} className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5"/>Reset
                    </Button>
                </div>
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleMarkComplete}>
                    <Check className="mr-2 h-5 w-5"/> Mark as Completed
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
