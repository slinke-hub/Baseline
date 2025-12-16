
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Image as ImageIcon, MapPin, Trash2, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/hooks/use-auth';
import type { Location } from '@/lib/types';

const formSchema = z.object({
    name: z.string().min(3, "Court name must be at least 3 characters."),
    address: z.string().min(10, "Address seems too short."),
});

type FormValues = z.infer<typeof formSchema>;

// This would be fetched from Firestore in a real app
const isXpForCourtsEnabled = true; // Mocking the admin feature flag
const XP_REWARD_FOR_COURT = 50;

export default function LocationsPage() {
    const { toast } = useToast();
    const { firestore, firebaseApp } = useFirebase();
    const { user } = useAuth();

    const locationsQuery = useMemoFirebase(() => collection(firestore, 'locations'), [firestore]);
    const { data: locations, isLoading: isLoadingLocations } = useCollection<Location>(locationsQuery);
    
    const [isAddFormOpen, setAddFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', address: '' },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setPhotoPreview(null);
        }
    };
    
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!user) {
            toast({ title: "Authentication Error", description: "You must be logged in to add a court.", variant: "destructive" });
            return;
        }

        const photoFile = fileInputRef.current?.files?.[0];
        if (!photoFile) {
            toast({ title: "Photo Required", description: "Please select a photo of the court.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const storage = getStorage(firebaseApp);
            const photoRef = ref(storage, `court-photos/${user.uid}/${Date.now()}_${photoFile.name}`);

            const snapshot = await uploadBytes(photoRef, photoFile);
            const photoUrl = await getDownloadURL(snapshot.ref);

            await addDoc(collection(firestore, 'locations'), {
                name: data.name,
                address: data.address,
                photoUrl: photoUrl,
                creatorId: user.uid,
            });
            
            let toastDescription = "Thanks for contributing to the community.";
            if (isXpForCourtsEnabled) {
                const userDocRef = doc(firestore, 'users', user.uid);
                await updateDoc(userDocRef, {
                    xp: increment(XP_REWARD_FOR_COURT)
                });
                toastDescription = `You've earned ${XP_REWARD_FOR_COURT} XP for adding a new court!`;
            }


            toast({ 
                title: "Court Added!", 
                description: toastDescription,
            });

            setAddFormOpen(false);
            form.reset();
            setPhotoPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error adding location:", error);
            toast({ title: "Submission Failed", description: "Could not save the new court location. Please try again.", variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDelete = async (locationId: string) => {
        try {
            await deleteDoc(doc(firestore, 'locations', locationId));
            toast({ title: "Location Deleted", description: "The location has been removed." });
        } catch (error) {
            console.error("Error deleting location:", error);
            toast({ title: "Delete Failed", description: "Could not delete the location.", variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Find a Court</h1>
                    <p className="text-muted-foreground">Discover and share basketball courts near you.</p>
                </div>
                <Dialog open={isAddFormOpen} onOpenChange={setAddFormOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Court</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <DialogHeader>
                                    <DialogTitle>Add a New Court</DialogTitle>
                                    <DialogDescription>Share a court with the community. Fill in the details below.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Court Name</Label>
                                                <FormControl><Input placeholder="e.g., Downtown Rec Center" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Address</Label>
                                                <FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="space-y-2">
                                        <Label>Court Photo</Label>
                                        {photoPreview ? (
                                            <div className="mt-2 aspect-video w-full relative">
                                                <Image src={photoPreview} alt="Court preview" fill className="rounded-md object-cover" />
                                            </div>
                                        ) : (
                                            <div className="mt-2 flex justify-center items-center h-32 w-full border-2 border-dashed rounded-md">
                                                <div className="text-center text-muted-foreground">
                                                    <ImageIcon className="mx-auto h-8 w-8" />
                                                    <p>Photo Preview</p>
                                                </div>
                                            </div>
                                        )}
                                        <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Court
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            
            {isLoadingLocations && (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations?.map(location => (
                    <Card key={location.id} className="overflow-hidden group">
                        <CardHeader className="p-0">
                            <div className="relative aspect-video w-full">
                                <Image src={location.photoUrl} alt={location.name} fill className="object-cover" />
                                {user?.uid === location.creatorId && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete {location.name}?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(location.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                {location.name}
                            </CardTitle>
                            <CardDescription className="mt-1">{location.address}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

             {!isLoadingLocations && locations?.length === 0 && (
                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12 col-span-full">
                    <MapPin className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold">No Courts Found</h3>
                    <p>Be the first to add a court in your area!</p>
                </div>
            )}
        </div>
    );
}
