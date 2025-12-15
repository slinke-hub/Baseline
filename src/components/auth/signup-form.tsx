
'use client';

import { useState, useEffect, useCallback } from 'react';
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
});

const defaultUsers = [
    { displayName: 'Admin User', email: 'admin@baseline.dev', password: 'password', role: 'admin' },
    { displayName: 'Coach Carter', email: 'coach@baseline.dev', password: 'password', role: 'coach' },
    { displayName: 'Stephen Curry', email: 'steph@example.com', password: 'password', role: 'client' },
    { displayName: 'Zion Williamson', email: 'zion@example.com', password: 'password', role: 'client' },
];

export function SignupForm() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  const createDefaultUsers = useCallback(async () => {
    setIsSeeding(true);

    for (const defaultUser of defaultUsers) {
        try {
            await handleSignup(defaultUser, defaultUser.role as AppUser['role'], true);
        } catch (error: any) {
            // We ignore email-already-in-use errors for default users
            if (error.code !== 'auth/email-already-in-use') {
                 toast({
                    title: `Failed to create ${defaultUser.displayName}`,
                    description: error.message || 'An unknown error occurred.',
                    variant: 'destructive',
                });
            }
        }
    }
    
    setIsSeeding(false);
    toast({
        title: 'Default users ready!',
        description: 'You can now log in with the default accounts.',
    });

  }, [toast]);

  useEffect(() => {
    // This effect runs once on mount to seed default users.
    createDefaultUsers();
  }, [createDefaultUsers]);

  async function handleSignup(values: z.infer<typeof formSchema>, role: AppUser['role'], isDefault: boolean = false) {
    if (!isDefault) setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: values.displayName,
      });

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData: Omit<AppUser, 'uid'> & { id: string, uid: string, createdAt: string } = {
        id: user.uid,
        uid: user.uid,
        displayName: values.displayName,
        email: values.email,
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        role: role,
      };

      await setDoc(userDocRef, userData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw new Error("Firestore permission denied.");
      });
      
      if (!isDefault) {
        router.push('/login');
      }
    } catch (error: any) {
      if (!isDefault) {
          let errorMessage = 'An unexpected error occurred.';
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already in use. Please log in or use a different email.';
          }
          toast({
            title: 'Sign Up Failed',
            description: errorMessage,
            variant: 'destructive',
          });
      } else {
        // re-throw for the batch creator to handle
        throw error;
      }
    } finally {
      if (!isDefault) setIsLoading(false);
    }
  }

  const onPublicSubmit = (values: z.infer<typeof formSchema>) => {
    handleSignup(values, 'client');
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <Logo className="h-32 w-full max-w-sm" />
        </div>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details below to create your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {isSeeding ? (
            <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Setting up default user accounts...</p>
            </div>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onPublicSubmit)} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
                </Button>
            </form>
            </Form>
        )}
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
