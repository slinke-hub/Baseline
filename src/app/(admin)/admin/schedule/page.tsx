
'use client';

import { Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, UtensilsCrossed, Dumbbell, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import type { Workout, Meal, ScheduleEvent, AppUser } from '@/lib/types';


function ScheduleComponent() {
    const searchParams = useSearchParams();
    const userIdFromParams = searchParams.get('userId');
    const { toast } = useToast();
    const { firestore } = useFirebase();

    const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(userIdFromParams);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

    const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
    const { data: users, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const workoutsQuery = useMemoFirebase(() => collection(firestore, 'workouts'), [firestore]);
    const { data: workouts, isLoading: isLoadingWorkouts } = useCollection<Workout>(workoutsQuery);

    const mealsQuery = useMemoFirebase(() => collection(firestore, 'meals'), [firestore]);
    const { data: meals, isLoading: isLoadingMeals } = useCollection<Meal>(mealsQuery);

    useEffect(() => {
        if (userIdFromParams) {
            setSelectedUser(userIdFromParams);
        } else if (users && users.length > 0) {
            setSelectedUser(users[0].uid);
        }
    }, [userIdFromParams, users]);

    useEffect(() => {
        if (!selectedUser) return;
        const scheduleQuery = query(collection(firestore, 'users', selectedUser, 'schedule'));
        const unsubscribe = onSnapshot(scheduleQuery, (snapshot) => {
            const userSchedule = snapshot.docs.map(doc => {
                const data = doc.data();
                return { ...data, id: doc.id, date: data.date.toDate() } as ScheduleEvent;
            });
            setSchedule(userSchedule);
        });
        return () => unsubscribe();
    }, [selectedUser, firestore]);

    const isEditing = !!selectedEvent;

    const getEventsForDate = (d: Date) => {
        return schedule.filter(event => isSameDay(event.date, d));
    }

    const openForm = (event?: ScheduleEvent) => {
        setSelectedEvent(event || null);
        if (event) {
            setDate(event.date);
        }
        setFormOpen(true);
    }
    
    const closeForm = () => {
        setFormOpen(false);
        setSelectedEvent(null);
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        const selectedWorkout = workouts?.find(w => w.id === values.workoutId);
        const selectedMeal = meals?.find(m => m.id === values.mealId);

        let title = '';
        if (values.type === 'workout' && selectedWorkout) title = selectedWorkout.title;
        else if (values.type === 'meal' && selectedMeal) title = selectedMeal.title;
        else title = values.title;
        
        const eventData: Omit<ScheduleEvent, 'id'> = {
            userId: values.userId,
            date: date!,
            type: values.type,
            title: title,
            workoutId: values.workoutId,
            mealId: values.mealId,
        };
        
        try {
            if (isEditing && selectedEvent) {
                const eventRef = doc(firestore, 'users', values.userId, 'schedule', selectedEvent.id);
                await setDoc(eventRef, eventData);
                toast({ title: "Event Updated", description: "The schedule has been updated."});
            } else {
                const scheduleColRef = collection(firestore, 'users', values.userId, 'schedule');
                await addDoc(scheduleColRef, eventData);
                toast({ title: "Event Added", description: "The client's schedule has been updated."});
            }
            closeForm();
        } catch (error) {
            console.error("Error saving event:", error);
            toast({ title: "Save Failed", description: "Could not save the event.", variant: "destructive"});
        }
    }
    
    const handleDelete = async (event: ScheduleEvent) => {
        try {
            const eventRef = doc(firestore, 'users', event.userId, 'schedule', event.id);
            await deleteDoc(eventRef);
            toast({ title: "Event Deleted", description: "The event has been removed from the schedule.", variant: 'destructive'});
        } catch (error) {
            console.error("Error deleting event:", error);
            toast({ title: "Delete Failed", description: "Could not delete the event.", variant: "destructive"});
        }
    }

    const getEventBadge = (type: ScheduleEvent['type']) => {
        switch(type) {
            case 'workout': return <Badge variant="default"><Dumbbell className="h-3 w-3 mr-1" />{type}</Badge>;
            case 'meal': return <Badge className="bg-amber-500 text-black hover:bg-amber-500/80"><UtensilsCrossed className="h-3 w-3 mr-1" />{type}</Badge>;
            case 'game': return <Badge variant="destructive">{type}</Badge>;
            case 'rest': return <Badge className="bg-green-500 hover:bg-green-500/80 text-white">{type}</Badge>;
            default: return <Badge>{type}</Badge>;
        }
    }

    const isLoading = isLoadingUsers || isLoadingWorkouts || isLoadingMeals;

    return (
        <div className="space-y-6">
             <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Client Schedules</h1>
                    <p className="text-muted-foreground">View and manage training schedules for your clients.</p>
                </div>
                <Button onClick={() => openForm()} disabled={!selectedUser}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
            </div>
            <Card className="neon-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Select a Client</CardTitle>
                            <CardDescription>Choose a client to see their weekly schedule.</CardDescription>
                        </div>
                        <Select value={selectedUser || ''} onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                            <SelectContent>
                                {users?.map(user => (
                                    <SelectItem key={user.uid} value={user.uid}>{user.displayName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    {isLoading ? <div className="flex justify-center items-center col-span-full h-64"><Loader2 className="h-8 w-8 animate-spin" /></div> : <>
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            components={{
                                DayContent: ({ date }) => {
                                    const events = getEventsForDate(date);
                                    return (
                                        <div className="relative h-full w-full">
                                            {format(date, 'd')}
                                            {events.length > 0 && (
                                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                                                    {events.map((event, i) => {
                                                        let color = 'bg-gray-400';
                                                        if (event.type === 'workout') color = 'bg-primary';
                                                        else if (event.type === 'game') color = 'bg-destructive';
                                                        else if (event.type === 'rest') color = 'bg-green-500';
                                                        else if (event.type === 'meal') color = 'bg-amber-500';
                                                        return <div key={i} className={`h-1.5 w-1.5 rounded-full ${color}`}></div>
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }
                            }}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Schedule for {date ? format(date, 'MMMM do, yyyy') : '...'}
                        </h3>
                        <div className="space-y-4">
                           {date && getEventsForDate(date).length > 0 ? getEventsForDate(date).map((event) => (
                                <div key={event.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        {getEventBadge(event.type)}
                                        <p className="font-medium truncate">{event.title}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openForm(event)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(event)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-muted-foreground p-4 text-center">No events scheduled for this day.</p>
                            )}
                        </div>
                    </div>
                    </>}
                </CardContent>
            </Card>
            
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogContent>
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                        </DialogHeader>
                        <ScheduleFormFields 
                            selectedEvent={selectedEvent} 
                            selectedUser={selectedUser}
                            users={users}
                            workouts={workouts}
                            meals={meals}
                        />
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Event'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export default function AdminSchedulePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ScheduleComponent />
        </Suspense>
    );
}

function ScheduleFormFields({ selectedEvent, selectedUser, users, workouts, meals }: { 
    selectedEvent: ScheduleEvent | null, 
    selectedUser: string | null,
    users: AppUser[] | null,
    workouts: Workout[] | null,
    meals: Meal[] | null,
}) {
    const [eventType, setEventType] = useState(selectedEvent?.type || 'workout');

    return (
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="userId">Client</Label>
                <Select name="userId" defaultValue={selectedUser || ''} required>
                    <SelectTrigger id="userId"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {users?.map(u => <SelectItem key={u.uid} value={u.uid}>{u.displayName}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select name="type" value={eventType} onValueChange={(v) => setEventType(v as ScheduleEvent['type'])} required>
                    <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="workout">Workout</SelectItem>
                        <SelectItem value="meal">Meal</SelectItem>
                        <SelectItem value="rest">Rest Day</SelectItem>
                        <SelectItem value="game">Game Day</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {eventType === 'workout' && (
                <div className="space-y-2">
                    <Label htmlFor="workoutId">Workout</Label>
                    <Select name="workoutId" defaultValue={selectedEvent?.workoutId} required>
                        <SelectTrigger id="workoutId"><SelectValue placeholder="Select a workout" /></SelectTrigger>
                        <SelectContent>
                            {workouts?.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}
            
            {eventType === 'meal' && (
                 <div className="space-y-2">
                    <Label htmlFor="mealId">Meal</Label>
                    <Select name="mealId" defaultValue={selectedEvent?.mealId} required>
                        <SelectTrigger id="mealId"><SelectValue placeholder="Select a meal" /></SelectTrigger>
                        <SelectContent>
                            {meals?.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {eventType === 'rest' && (
                 <input type="hidden" name="title" value="Rest Day" />
            )}

            {eventType === 'game' && (
                <input type="hidden" name="title" value="Game Day" />
            )}
        </div>
    )
}
