'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MapPin, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockLocations = [
    { id: 1, name: "Staples Center", address: "1111 S Figueroa St, Los Angeles, CA 90015" },
    { id: 2, name: "Rucker Park", address: "W 155th St & Frederick Douglass Blvd, New York, NY 10039" },
    { id: 3, name: "Venice Beach Courts", address: "1800 Ocean Front Walk, Venice, CA 90291" },
]

export default function AdminLocationsPage() {
    const { toast } = useToast();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Practice Locations</h1>
                    <p className="text-muted-foreground">Manage gym and court locations for training sessions.</p>
                </div>
                <Button onClick={() => toast({title: "Coming Soon!", description: "Adding new locations will be available shortly."})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Location
                </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Locations List</CardTitle>
                        <CardDescription>A list of available practice locations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ul className="space-y-4">
                            {mockLocations.map(location => (
                                <li key={location.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex items-center gap-4">
                                        <MapPin className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-semibold">{location.name}</p>
                                            <p className="text-sm text-muted-foreground">{location.address}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => toast({title: "Delete Location", description: `This would delete ${location.name}.`})}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
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
