
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { UtensilsCrossed, Dumbbell, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { ScheduleEvent } from '@/lib/types';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';


export default function ClientSchedulePage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
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

    const getEventsForDate = (d: Date) => {
        return schedule.filter(event => isSameDay(event.date, d));
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
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-6 lg:items-center">
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Plan for {date ? format(date, 'MMMM do, yyyy') : '...'}
                        </h3>
                         {isLoading ? <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div> :
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
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
