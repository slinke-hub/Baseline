
'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, UtensilsCrossed } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { mockWorkouts, mockMeals } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

const mockUsers = [
    { id: 'user-1', name: 'LeBron James' },
    { id: 'user-2', name: 'Stephen Curry' },
    { id: 'user-3', name: 'Kevin Durant' },
    { id: 'user-5', name: 'Zion Williamson' },
];

type ScheduleEvent = {
    id: string;
    userId: string;
    date: Date;
    type: 'workout' | 'rest' | 'game' | 'meal';
    title: string;
    workoutId?: string;
    mealId?: string;
}

const initialSchedule: ScheduleEvent[] = [
    { id: 'event-1', userId: 'user-1', date: new Date(), type: 'workout', title: 'Plyometric Power', workoutId: '5' },
    { id: 'event-2', userId: 'user-1', date: addDays(new Date(), 2), type: 'workout', title: 'Form Shooting', workoutId: '1' },
    { id: 'event-3', userId: 'user-1', date: addDays(new Date(), 4), type: 'rest', title: 'Rest Day' },
    { id: 'event-4', userId: 'user-2', date: new Date(), type: 'workout', title: 'Stationary Dribbling Series', workoutId: '2' },
    { id: 'event-5', userId: 'user-2', date: addDays(new Date(), 1), type: 'workout', title: 'Defensive Slides', workoutId: '3' },
    { id: 'event-6', userId: 'user-2', date: addDays(new Date(), 3), type: 'game', title: 'Game Day' },
    { id: 'event-10', userId: 'user-2', date: new Date(), type: 'meal', title: 'Power Oatmeal', mealId: '1'},
    { id: 'event-11', userId: 'user-2', date: new Date(), type: 'meal', title: 'Grilled Chicken Salad', mealId: '2'},
    { id: 'event-12', userId: 'user-2', date: addDays(new Date(),1), type: 'meal', title: 'Recovery Salmon', mealId: '3'},
    { id: 'event-7', userId: 'user-3', date: new Date(), type: 'workout', title: 'Hill Sprints', workoutId: '4' },
    { id: 'event-8', userId: 'user-3', date: addDays(new Date(), 1), type: 'rest', title: 'Rest Day' },
    { id: 'event-9', userId: 'user-3', date: addDays(new Date(), 2), type: 'workout', title: 'Form Shooting', workoutId: '1' },
    { id: 'event-13', userId: 'user-5', date: new Date(), type: 'meal', title: 'Post-Game Protein Shake', mealId: '5' },
]

function ScheduleComponent() {
    const searchParams = useSearchParams();
    const userIdFromParams = searchParams.get('userId');

    const { toast } = useToast();
    const [schedule, setSchedule] = useState(initialSchedule);
    const [selectedUser, setSelectedUser] = useState(userIdFromParams || 'user-2');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

    useEffect(() => {
        if (userIdFromParams) {
            setSelectedUser(userIdFromParams);
        }
    }, [userIdFromParams]);

    const isEditing = !!selectedEvent;
    const userSchedule = schedule.filter(event => event.userId === selectedUser);

    const getEventsForDate = (d: Date) => {
        return userSchedule.filter(event => isSameDay(event.date, d));
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

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        const selectedWorkout = mockWorkouts.find(w => w.id === values.workoutId);
        const selectedMeal = mockMeals.find(m => m.id === values.mealId);

        let title = '';
        if (values.type === 'workout' && selectedWorkout) {
            title = selectedWorkout.title;
        } else if (values.type === 'meal' && selectedMeal) {
            title = selectedMeal.title;
        } else {
            title = values.title;
        }
        
        const eventData = {
            userId: values.userId,
            date: date!,
            type: values.type,
            title: title,
            workoutId: values.workoutId,
            mealId: values.mealId,
        };
        
        if (isEditing) {
            setSchedule(current => current.map(ev => ev.id === selectedEvent.id ? { ...ev, ...eventData } : ev));
            toast({ title: "Event Updated", description: "The schedule has been updated."});
        } else {
            setSchedule(current => [...current, { id: `event-${Date.now()}`, ...eventData }]);
            toast({ title: "Event Added", description: "The client's schedule has been updated."});
        }
        
        closeForm();
    }
    
    const handleDelete = (eventId: string) => {
        setSchedule(current => current.filter(ev => ev.id !== eventId));
        toast({ title: "Event Deleted", description: "The event has been removed from the schedule.", variant: 'destructive'});
    }

    const getEventBadge = (type: ScheduleEvent['type']) => {
        switch(type) {
            case 'workout': return <Badge variant="default">{type}</Badge>;
            case 'meal': return <Badge className="bg-amber-500 text-black hover:bg-amber-500/80">{type}</Badge>;
            case 'game': return <Badge variant="destructive">{type}</Badge>;
            case 'rest': return <Badge className="bg-green-500 hover:bg-green-500/80 text-white">{type}</Badge>;
            default: return <Badge>{type}</Badge>;
        }
    }

    return (
        <div className="space-y-6">
             <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Client Schedules</h1>
                    <p className="text-muted-foreground">View and manage training schedules for your clients.</p>
                </div>
                <Button onClick={() => openForm()}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
            </div>
            <Card className="neon-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Select a Client</CardTitle>
                            <CardDescription>Choose a client to see their weekly schedule.</CardDescription>
                        </div>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockUsers.map(user => (
                                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
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
                                    <div className="flex items-center gap-4">
                                        {event.type === 'meal' && <UtensilsCrossed className="h-4 w-4 text-amber-500" />}
                                        {getEventBadge(event.type)}
                                        <p className="font-medium">{event.title}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openForm(event)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-muted-foreground p-4 text-center">No events scheduled for this day.</p>
                            )}
                        </div>
                    </div>
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

function ScheduleFormFields({ selectedEvent, selectedUser }: { selectedEvent: ScheduleEvent | null, selectedUser: string }) {
    const [eventType, setEventType] = useState(selectedEvent?.type || 'workout');

    return (
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="userId">Client</Label>
                <Select name="userId" defaultValue={selectedUser} required>
                    <SelectTrigger id="userId"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
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
                            {mockWorkouts.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}
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
                            {mockMeals.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
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
