
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { UtensilsCrossed, Dumbbell, Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { ScheduleEvent } from '@/lib/types';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, query, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';


export default function ClientSchedulePage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        const scheduleQuery = query(collection(firestore, 'users', user.uid, 'schedule'));
        const unsubscribe = onSnapshot(scheduleQuery, (snapshot) => {
            const userSchedule = snapshot.docs.map(doc => {
                const data = doc.data();
                return { ...data, id: doc.id, date: data.date.toDate() } as ScheduleEvent;
            });
            setSchedule(userSchedule);
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to fetch schedule: ", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [user, firestore]);

    const isEditing = !!selectedEvent;

    const getEventsForDate = (d: Date) => {
        return schedule.filter(event => isSameDay(event.date, d)).sort((a, b) => a.title.localeCompare(b.title));
    }
    
    const getEventBadge = (type: ScheduleEvent['type']) => {
        switch(type) {
            case 'workout': return <Badge variant="default" className="flex-shrink-0"><Dumbbell className="h-3 w-3 mr-1" /> {type}</Badge>;
            case 'meal': return <Badge className="bg-amber-500 text-black hover:bg-amber-500/80 flex-shrink-0"><UtensilsCrossed className="h-3 w-3 mr-1" />{type}</Badge>;
            case 'game': return <Badge variant="destructive" className="flex-shrink-0">{type}</Badge>;
            case 'rest': return <Badge className="bg-green-500 hover:bg-green-500/80 text-white flex-shrink-0">{type}</Badge>;
            case 'practice': return <Badge className="bg-sky-500 text-white flex-shrink-0">{type}</Badge>;
            case 'reminder': return <Badge variant="secondary" className="flex-shrink-0">{type}</Badge>;
            default: return <Badge className="flex-shrink-0">{type}</Badge>;
        }
    }

    const openForm = (event?: ScheduleEvent) => {
        setSelectedEvent(event || null);
        if (event) {
            setDate(event.date);
        } else if (date) {
            // New event, make sure date is set
        }
        setFormOpen(true);
    }
    
    const closeForm = () => {
        setFormOpen(false);
        setSelectedEvent(null);
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !date) return;

        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        
        const eventData = {
            userId: user.uid,
            date: date,
            type: values.type,
            title: values.title,
        };

        try {
            if (isEditing && selectedEvent) {
                const eventRef = doc(firestore, 'users', user.uid, 'schedule', selectedEvent.id);
                await setDoc(eventRef, eventData);
                toast({ title: "Event Updated" });
            } else {
                const scheduleColRef = collection(firestore, 'users', user.uid, 'schedule');
                await addDoc(scheduleColRef, eventData);
                toast({ title: "Event Added to your schedule." });
            }
            closeForm();
        } catch (error) {
            console.error("Error saving event:", error);
            toast({ title: "Save Failed", variant: "destructive"});
        }
    }

    const handleDelete = async (eventId: string) => {
        if (!user) return;
        try {
            const eventRef = doc(firestore, 'users', user.uid, 'schedule', eventId);
            await deleteDoc(eventRef);
            toast({ title: "Event Deleted", variant: 'destructive'});
        } catch (error) {
            console.error("Error deleting event:", error);
            toast({ title: "Delete Failed", variant: "destructive"});
        }
    }

    const eventsForSelectedDate = date ? getEventsForDate(date) : [];

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
             <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
                    <p className="text-muted-foreground">Your weekly training and nutrition plan.</p>
                </div>
                <Button onClick={() => openForm()} disabled={!date}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
            </div>
            <Card>
                <CardContent className="flex flex-col items-center gap-8 p-4 sm:p-6">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        components={{
                            DayContent: ({ date: d }) => {
                                const events = getEventsForDate(d);
                                return (
                                    <div className="relative h-full w-full">
                                        {format(d, 'd')}
                                        {events.length > 0 && (
                                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                                                {events.slice(0, 3).map((event, i) => {
                                                    let color = 'bg-gray-400';
                                                    if (event.type === 'workout') color = 'bg-primary';
                                                    else if (event.type === 'game') color = 'bg-destructive';
                                                    else if (event.type === 'rest') color = 'bg-green-500';
                                                    else if (event.type === 'meal') color = 'bg-amber-500';
                                                    else if (event.type === 'practice') color = 'bg-sky-500';
                                                    else if (event.type === 'reminder') color = 'bg-secondary-foreground';
                                                    return <div key={i} className={`h-1.5 w-1.5 rounded-full ${color}`}></div>
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        }}
                    />
                    <div className="w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            Plan for {date ? format(date, 'MMMM do, yyyy') : '...'}
                        </h3>
                         {isLoading ? <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div> :
                            <div className="space-y-4">
                               {eventsForSelectedDate.length > 0 ? eventsForSelectedDate.map((event) => (
                                    <div key={event.id} className="flex items-center gap-4 rounded-lg border p-4 group">
                                        {getEventBadge(event.type)}
                                        <p className="font-medium flex-1 truncate">{event.title}</p>
                                        {(event.type === 'practice' || event.type === 'reminder') && (
                                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => openForm(event)}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div className="text-muted-foreground p-4 text-center border-2 border-dashed rounded-lg">
                                        <p>No events scheduled for this day.</p>
                                        <p className="text-xs">Add an event to get started.</p>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogContent>
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                            <DialogDescription>
                                Add a custom event to your schedule for {date ? format(date, 'MMMM do') : ''}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title</Label>
                                <Input id="title" name="title" required defaultValue={selectedEvent?.title} placeholder="e.g. Extra shooting practice" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Event Type</Label>
                                <Select name="type" required defaultValue={selectedEvent?.type || 'practice'}>
                                    <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="practice">Practice</SelectItem>
                                        <SelectItem value="reminder">Reminder</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                            <Button type="submit">{isEditing ? 'Save Changes' : 'Add Event'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
