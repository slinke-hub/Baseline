'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { UtensilsCrossed, Dumbbell } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

type ScheduleEvent = {
    id: string;
    userId: string;
    date: Date;
    type: 'workout' | 'rest' | 'game' | 'meal';
    title: string;
    workoutId?: string;
    mealId?: string;
}

// NOTE: This is the same mock data from the admin schedule page to simulate persistence
const initialSchedule: ScheduleEvent[] = [
    { id: 'event-1', userId: 'user-1', date: new Date(), type: 'workout', title: 'Plyometric Power', workoutId: '5' },
    { id: 'event-2', userId: 'user-1', date: addDays(new Date(), 2), type: 'workout', title: 'Form Shooting', workoutId: '1' },
    { id: 'event-4', userId: 'user-2', date: new Date(), type: 'workout', title: 'Stationary Dribbling Series', workoutId: '2' },
    { id: 'event-5', userId: 'user-2', date: addDays(new Date(), 1), type: 'workout', title: 'Defensive Slides', workoutId: '3' },
    { id: 'event-6', userId: 'user-2', date: addDays(new Date(), 3), type: 'game', title: 'Game Day' },
    { id: 'event-10', userId: 'user-2', date: new Date(), type: 'meal', title: 'Power Oatmeal', mealId: '1'},
    { id: 'event-11', userId: 'user-2', date: new Date(), type: 'meal', title: 'Grilled Chicken Salad', mealId: '2'},
    { id: 'event-12', userId: 'user-2', date: addDays(new Date(),1), type: 'meal', title: 'Recovery Salmon', mealId: '3'},
];


export default function ClientSchedulePage() {
    const { appUser } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    // In a real app, this would be a Firestore query. For now, we mock a "logged in" user.
    const currentUserMockId = 'user-2'; 
    const userSchedule = initialSchedule.filter(event => event.userId === currentUserMockId);

    const getEventsForDate = (d: Date) => {
        return userSchedule.filter(event => isSameDay(event.date, d));
    }
    
    const getEventBadge = (type: ScheduleEvent['type']) => {
        switch(type) {
            case 'workout': return <Badge variant="default" className="flex-shrink-0"><Dumbbell className="h-3 w-3 mr-1" /> {type}</Badge>;
            case 'meal': return <Badge className="bg-amber-500 text-black hover:bg-amber-500/80 flex-shrink-0"><UtensilsCrossed className="h-3 w-3 mr-1" />{type}</Badge>;
            case 'game': return <Badge variant="destructive" className="flex-shrink-0">{type}</Badge>;
            case 'rest': return <Badge className="bg-green-500 hover:bg-green-500/80 text-white flex-shrink-0">{type}</Badge>;
            default: return <Badge className="flex-shrink-0">{type}</Badge>;
        }
    }


    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
             <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
                <p className="text-muted-foreground">Your weekly training and nutrition plan.</p>
            </div>
            <Card>
                <CardContent className="grid md:grid-cols-2 gap-8 p-4 sm:p-6">
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
                            Plan for {date ? format(date, 'MMMM do, yyyy') : '...'}
                        </h3>
                        <div className="space-y-4">
                           {date && getEventsForDate(date).length > 0 ? getEventsForDate(date).map((event) => (
                                <div key={event.id} className="flex items-center gap-4 rounded-lg border p-4">
                                    {getEventBadge(event.type)}
                                    <p className="font-medium flex-1 truncate">{event.title}</p>
                                </div>
                            )) : (
                                <div className="text-muted-foreground p-4 text-center border-2 border-dashed rounded-lg">
                                    <p>No events scheduled for this day.</p>
                                    <p className="text-xs">Check back later or contact your coach.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
