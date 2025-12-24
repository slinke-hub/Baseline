
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ClipboardList, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp, query } from 'firebase/firestore';
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
import type { ScheduleEvent } from '@/lib/types';
import { isPast } from 'date-fns';

const ADMIN_UID = '96tEClb7y8aUnYxTds2v4pW0b2C2';

export default function MySessionsPage() {
  const { appUser, user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const scheduleQuery = useMemoFirebase(() => {
    if (!user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'schedule'));
  }, [user?.uid, firestore]);

  const { data: schedule, isLoading: isLoadingSchedule } = useCollection<ScheduleEvent>(scheduleQuery);
  
  const sessionsCompleted = schedule?.filter(e => e.type === 'workout' && isPast(e.date)).length || 0;
  const totalSessions = schedule?.filter(e => e.type === 'workout').length || 0;
  const progressPercentage = totalSessions > 0 ? (sessionsCompleted / totalSessions) * 100 : 0;
  const sessionsRemaining = totalSessions - sessionsCompleted;
  
  const handleMarkAttendance = async () => {
    if (!user) return;
    setIsLoading(true);
    const eventData: Omit<ScheduleEvent, 'id'> = {
      userId: user.uid,
      date: new Date(),
      type: 'practice',
      title: 'Attended Training Session'
    };

    try {
      const scheduleColRef = collection(firestore, 'users', user.uid, 'schedule');
      await addDoc(scheduleColRef, eventData);
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

  const handleRequestRenewal = async () => {
    if (!user) return;
    setIsRequesting(true);

    const chatId = user.uid < ADMIN_UID ? `${user.uid}_${ADMIN_UID}` : `${ADMIN_UID}_${user.uid}`;
    const messagesColRef = collection(firestore, 'chats', chatId, 'messages');

    const renewalMessage = `[SESSION_RENEWAL_REQUEST] Client ${appUser?.displayName} (${user.uid}) has requested a session renewal.`;

    try {
        await addDoc(messagesColRef, {
            text: renewalMessage,
            senderId: user.uid,
            receiverId: ADMIN_UID,
            createdAt: serverTimestamp(),
            isSystem: true,
        });

        toast({
            title: "Request Sent!",
            description: "Your coach has been notified. You will receive a message when your sessions have been renewed.",
        });
    } catch (error) {
        console.error("Failed to send renewal request:", error);
        toast({
            title: 'Error',
            description: 'Could not send renewal request. Please try again later.',
            variant: 'destructive',
        });
    } finally {
        setIsRequesting(false);
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
        <p className="text-muted-foreground">Track your monthly training session attendance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
           {isLoadingSchedule ? <div className="h-5 w-48 bg-muted animate-pulse rounded-md" /> :
          <CardDescription>
            You have completed {sessionsCompleted} out of {totalSessions} scheduled workout sessions this month.
          </CardDescription>
           }
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingSchedule ? <div className="h-4 w-full bg-muted animate-pulse rounded-full" /> :
          <div>
            <Progress value={progressPercentage} className="h-4" />
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>{sessionsCompleted} Completed</span>
              <span>{sessionsRemaining} Remaining</span>
            </div>
          </div>
          }
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    size="lg" 
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Mark Ad-hoc Attendance
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Ad-hoc Session</AlertDialogTitle>
                    <AlertDialogDescription>
                        Did you complete an extra training session that wasn't on your schedule? This will be added to your calendar.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleMarkAttendance}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <div className="text-center space-y-4 rounded-lg border-2 border-dashed border-primary/50 p-6">
            <p className="font-medium">
                Need more scheduled sessions from your coach?
            </p>
            <Button onClick={handleRequestRenewal} disabled={isRequesting}>
                {isRequesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                Request More Sessions
            </Button>
        </div>

        </CardContent>
      </Card>
      
      <Card>
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

    