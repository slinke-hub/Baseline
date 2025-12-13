'use client';

import { useState, useEffect, useRef } from 'react';
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

export function SignupForm() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: 'Admin User',
      email: 'admin@baseline.dev',
      password: 'password',
    },
  });

  useEffect(() => {
    // Automatically submit the form on initial render to create the admin user
    if (formRef.current) {
        form.handleSubmit(onSubmit)();
    }
  }, [form.handleSubmit]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: values.displayName,
      });

      const userRole: AppUser['role'] = values.email.endsWith('@baseline.dev') ? 'admin' : 'client';

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        uid: user.uid,
        displayName: values.displayName,
        email: values.email,
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        role: userRole,
      };

      await setDoc(userDocRef, userData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
      router.push('/login');
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please log in or use a different email.';
        // If admin already exists, just go to login.
        router.push('/login');
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
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <Logo className="h-16 w-32" />
        </div>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details below to create your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
