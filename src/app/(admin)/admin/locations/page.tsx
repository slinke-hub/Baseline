
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MapPin, Trash2, Loader2 } from 'lucide-react';
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
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import type { Location } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AdminLocationsPage() {
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { appUser } = useAuth();

    const locationsQuery = useMemoFirebase(() => collection(firestore, 'locations'), [firestore]);
    const { data: locations, isLoading: isLoadingLocations } = useCollection<Location>(locationsQuery);

    const handleDelete = async (location: Location) => {
        if (appUser?.role !== 'admin') {
            toast({ title: "Permission Denied", description: "You are not authorized to delete locations.", variant: "destructive" });
            return;
        }

        try {
            await deleteDoc(doc(firestore, 'locations', location.id));
            toast({ title: "Location Deleted", description: "The location has been removed.", variant: "destructive" });
        } catch (error) {
            console.error("Error deleting location:", error);
            toast({ title: "Deletion Failed", description: "Could not delete the location.", variant: "destructive" });
        }
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Practice Locations</h1>
                    <p className="text-muted-foreground">Manage all user-submitted gym and court locations.</p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Locations List</CardTitle>
                        <CardDescription>A list of all submitted practice locations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isLoadingLocations ? (
                           <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
                       ) : (
                           <ul className="space-y-4">
                                {locations?.map(location => (
                                    <li key={location.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-4">
                                            <MapPin className="h-6 w-6 text-primary" />
                                            <div>
                                                <p className="font-semibold">{location.name}</p>
                                                <p className="text-sm text-muted-foreground">{location.address}</p>
                                            </div>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span tabIndex={0}>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={appUser?.role !== 'admin'}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure you want to delete {location.name}?</AlertDialogTitle>
                                                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(location)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </span>
                                                </TooltipTrigger>
                                                {appUser?.role !== 'admin' && (
                                                    <TooltipContent>
                                                        <p>Only admins can delete locations.</p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>
                                    </li>
                                ))}
                           </ul>
                       )}
                       {!isLoadingLocations && (!locations || locations.length === 0) && (
                           <p className="text-center text-muted-foreground py-8">No locations have been submitted yet.</p>
                       )}
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <CardTitle>Map View</CardTitle>
                        <CardDescription>Visual representation of all locations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video w-full bg-secondary rounded-lg flex items-center justify-center">
                            <p className="text-muted-foreground">Map integration coming soon.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
