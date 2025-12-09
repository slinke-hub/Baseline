'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useFirebase } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name is too short.'),
  age: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']).optional(),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Pro']).optional(),
});

export function ProfileForm() {
  const { appUser, user } = useAuth();
  const { firestore, firebaseApp } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (appUser?.photoURL) {
      setPhotoPreview(appUser.photoURL);
    }
  }, [appUser?.photoURL]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      age: undefined,
      height: undefined,
      weight: undefined,
      position: undefined,
      experienceLevel: undefined,
    },
  });
  
  useEffect(() => {
    if (appUser) {
      form.reset({
        displayName: appUser.displayName || '',
        age: appUser.age || undefined,
        height: appUser.height || undefined,
        weight: appUser.weight || undefined,
        position: appUser.position || undefined,
        experienceLevel: appUser.experienceLevel || undefined,
      })
    }
  }, [appUser, form]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
      setIsUploading(true);
      
      try {
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `profile-photos/${user.uid}`);
        const snapshot = await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(snapshot.ref);

        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, { photoURL });
        
        setPhotoPreview(photoURL);
        toast({
          title: 'Photo Updated',
          description: 'Your new profile photo has been saved.',
        });
      } catch (error) {
        console.error("Photo upload failed:", error);
        toast({
          title: 'Upload Failed',
          description: 'Could not upload your new photo. Please try again.',
          variant: 'destructive',
        });
        setPhotoPreview(appUser?.photoURL || null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) return;
    setIsSaving(true);

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, values);

      toast({
        title: 'Profile Updated',
        description: 'Your information has been saved successfully.',
      });
      router.push('/profile');
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not update your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your Information</CardTitle>
        <CardDescription>Keep your profile up-to-date.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 relative">
                <AvatarImage src={photoPreview || ''} />
                <AvatarFallback>PIC</AvatarFallback>
                {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
              </Avatar>
              <Button asChild variant="outline" disabled={isUploading}>
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Change Photo'}
                  <Input id="photo-upload" type="file" className="sr-only" onChange={handlePhotoChange} accept="image/*" disabled={isUploading} />
                </label>
              </Button>
            </div>

            <FormField control={form.control} name="displayName" render={({ field }) => (
                <FormItem><FormLabel>Display Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="height" render={({ field }) => (
                    <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="weight" render={({ field }) => (
                    <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="position" render={({ field }) => (
                    <FormItem><FormLabel>Position</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger></FormControl>
                        <SelectContent>{['PG', 'SG', 'SF', 'PF', 'C'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                    <FormItem><FormLabel>Experience Level</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                        <SelectContent>{['Beginner', 'Intermediate', 'Advanced', 'Pro'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
            </div>
            
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSaving || isUploading}>
                    {(isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
