
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ClipboardList, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MySessionsPage() {
  const { appUser, user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sessionsCompleted = appUser?.sessionsCompleted || 0;
  const totalSessions = appUser?.totalSessions || 8;
  const progressPercentage = (sessionsCompleted / totalSessions) * 100;
  const sessionsRemaining = totalSessions - sessionsCompleted;

  const handleMarkAttendance = async () => {
    if (!user || sessionsCompleted >= totalSessions) return;
    setIsLoading(true);
    const userDocRef = doc(firestore, 'users', user.uid);

    try {
      await updateDoc(userDocRef, {
        sessionsCompleted: increment(1)
      });
      toast({
        title: 'Attendance Marked!',
        description: 'Great job showing up. Keep up the hard work!',
      });
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      toast({
        title: 'Error',
        description: 'Could not mark attendance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
        <p className="text-muted-foreground">Track your monthly training session attendance.</p>
      </div>

      <Card className="neon-border">
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>
            You have completed {sessionsCompleted} out of {totalSessions} sessions this month.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Progress value={progressPercentage} className="h-4" />
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>{sessionsCompleted} Completed</span>
              <span>{sessionsRemaining} Remaining</span>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    size="lg" 
                    className="w-full"
                    disabled={sessionsCompleted >= totalSessions || isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Check className="mr-2 h-4 w-4" />
                    )}
                    Mark Today's Attendance
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Attendance</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to mark your attendance for a session today? This will count as one of your {totalSessions} monthly sessions.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleMarkAttendance}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {sessionsCompleted >= totalSessions && (
            <p className="text-center text-green-500 font-medium">
              Congratulations! You've completed all your sessions for this month!
            </p>
          )}

        </CardContent>
      </Card>
      
      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" /> Session Details</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                <p>Your session history and details will appear here soon.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
