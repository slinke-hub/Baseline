
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/icons/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { AppUser } from '@/lib/types';
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';

const formSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  totalSessions: z.coerce.number().min(1, 'You must select at least 1 session.').max(30, 'Please contact us for plans with more than 30 sessions.'),
});

export function SignupForm() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      totalSessions: 8,
    },
  });

  async function handleSignup(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: values.displayName,
      });

      const userDocRef = doc(firestore, 'users', user.uid);
      
      const role = values.email === 'monti.training@gmail.com' ? 'admin' : 'client';

      const userData: Omit<AppUser, 'id'> = {
        uid: user.uid,
        displayName: values.displayName,
        email: values.email,
        photoURL: user.photoURL || '',
        role: role,
        sessionsCompleted: 0,
        totalSessions: values.totalSessions,
        xp: 0,
      };

      await setDoc(userDocRef, userData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
        // Also re-throw to be caught by the outer try-catch
        throw new Error("Firestore permission denied during user creation.");
      });
      
      router.push('/login');
      toast({
        title: 'Account Created!',
        description: "You can now sign in with your new credentials.",
      });

    } catch (error: any) {
      console.error("Signup Error:", error);
      let errorMessage = 'An unexpected error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please log in or use a different email.';
      } else if (error.message?.includes("Firestore permission denied")) {
        errorMessage = "There was a problem setting up your user profile. Please check security rules.";
      }
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <Logo className="h-32 w-full max-w-sm" />
        </div>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details below to create your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
              <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                      <Input placeholder="Michael Jordan" {...field} autoComplete="name" />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                      <Input placeholder="name@example.com" {...field} autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="totalSessions"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Monthly Sessions</FormLabel>
                  <FormControl>
                      <Input type="number" {...field} />
                  </FormControl>
                   <FormMessage />
                  </FormItem>
              )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
              </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
