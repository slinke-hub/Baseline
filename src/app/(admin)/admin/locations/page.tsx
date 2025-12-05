
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MapPin, Trash2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialLocations = [
    { id: 1, name: "Staples Center", address: "1111 S Figueroa St, Los Angeles, CA 90015" },
    { id: 2, name: "Rucker Park", address: "W 155th St & Frederick Douglass Blvd, New York, NY 10039" },
    { id: 3, name: "Venice Beach Courts", address: "1800 Ocean Front Walk, Venice, CA 90291" },
];

type Location = typeof initialLocations[0];

export default function AdminLocationsPage() {
    const { toast } = useToast();
    const [locations, setLocations] = useState(initialLocations);
    const [isAddFormOpen, setAddFormOpen] = useState(false);

    const handleDelete = (locationId: number) => {
        setLocations(current => current.filter(loc => loc.id !== locationId));
        toast({ title: "Location Deleted", description: "The location has been removed.", variant: "destructive" });
    }
    
    const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const address = formData.get('address') as string;

        const newLocation: Location = {
            id: Date.now(),
            name,
            address,
        };
        
        setLocations(current => [newLocation, ...current]);
        toast({ title: "Location Added", description: `${name} has been added.` });
        setAddFormOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Practice Locations</h1>
                    <p className="text-muted-foreground">Manage gym and court locations for training sessions.</p>
                </div>
                <Dialog open={isAddFormOpen} onOpenChange={setAddFormOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Location</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAdd}>
                            <DialogHeader>
                                <DialogTitle>Add New Location</DialogTitle>
                                <DialogDescription>Enter the details for the new practice location.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Location Name</Label>
                                    <Input id="name" name="name" placeholder="e.g., Downtown Rec Center" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" placeholder="123 Main St, Anytown, USA" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Add Location</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Locations List</CardTitle>
                        <CardDescription>A list of available practice locations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ul className="space-y-4">
                            {locations.map(location => (
                                <li key={location.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex items-center gap-4">
                                        <MapPin className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-semibold">{location.name}</p>
                                            <p className="text-sm text-muted-foreground">{location.address}</p>
                                        </div>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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
                                                <AlertDialogAction onClick={() => handleDelete(location.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </li>
                            ))}
                       </ul>
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
                            {/* In a real app, you would use a library like Google Maps, Mapbox, or Leaflet here */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    