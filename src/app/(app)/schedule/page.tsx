
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { UtensilsCrossed, Dumbbell } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { ScheduleEvent } from '@/lib/types';
import { mockSchedule } from '@/lib/mock-data';


export default function ClientSchedulePage() {
    const { appUser } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    // In a real app, this would be a Firestore query. For now, we mock a "logged in" user.
    const currentUserMockId = appUser?.uid?.includes('zion') ? 'user-5' : 'user-2'; 
    const userSchedule = mockSchedule.filter(event => event.userId === currentUserMockId);

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
            <Card className="neon-border">
                <CardContent className="grid md:grid-cols-2 gap-8 p-4 sm:p-6">
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
