
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ClipboardList, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase } from '@/firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
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

// This is a simplified way to identify the admin. In a real-world scenario,
// this might come from a configuration file or a specific Firestore document.
const ADMIN_UID = 'I2UQx7rrrEZH51eGJq4yxIjHY2R2';

export default function MySessionsPage() {
  const { appUser, user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const sessionsCompleted = appUser?.sessionsCompleted || 0;
  const totalSessions = appUser?.totalSessions || 8;
  const progressPercentage = (sessionsCompleted / totalSessions) * 100;
  const sessionsRemaining = totalSessions - sessionsCompleted;
  const allSessionsUsed = sessionsCompleted >= totalSessions;

  const handleMarkAttendance = async () => {
    if (!user || allSessionsUsed) return;
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
          
          {allSessionsUsed ? (
             <div className="text-center space-y-4 rounded-lg border-2 border-dashed border-primary/50 p-6">
                <p className="font-medium text-green-500">
                    Congratulations! You've completed all your sessions for this month!
                </p>
                <Button onClick={handleRequestRenewal} disabled={isRequesting}>
                    {isRequesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                    Request Renewal
                </Button>
            </div>
          ) : (
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        size="lg" 
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
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
          )}

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
