'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { addDays, format } from 'date-fns';

const mockUsers = [
    { id: 'user-1', name: 'LeBron James' },
    { id: 'user-2', name: 'Stephen Curry' },
    { id: 'user-3', name: 'Kevin Durant' },
];

const mockSchedule = {
    'user-1': [
        { date: new Date(), type: 'workout', title: 'Plyometric Power' },
        { date: addDays(new Date(), 2), type: 'workout', title: 'Form Shooting' },
        { date: addDays(new
 Date(), 4), type: 'rest', title: 'Rest Day' },
    ],
    'user-2': [
        { date: new Date(), type: 'workout', title: 'Stationary Dribbling Series' },
        { date: addDays(new Date(), 1), type: 'workout', title: 'Defensive Slides' },
        { date: addDays(new Date(), 3), type: 'game', title: 'Game Day' },
    ],
    'user-3': [
        { date: new Date(), type: 'workout', title: 'Hill Sprints' },
        { date: addDays(new Date(), 1), type: 'rest', title: 'Rest Day' },
        { date: addDays(new Date(), 2), type: 'workout', title: 'Form Shooting' },
    ],
};


export default function AdminSchedulePage() {
    const [selectedUser, setSelectedUser] = useState('user-2');
    const [date, setDate] = useState<Date | undefined>(new Date());

    const userSchedule = mockSchedule[selectedUser as keyof typeof mockSchedule] || [];

    const getEventsForDate = (d: Date) => {
        return userSchedule.filter(event => format(event.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd'));
    }

    return (
        <div className="space-y-6">
             <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Client Schedules</h1>
                <p className="text-muted-foreground">View and manage training schedules for your clients.</p>
            </div>
            <Card>
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
                                                    {events.map((event, i) => (
                                                        <div key={i} className={`h-1.5 w-1.5 rounded-full ${event.type === 'workout' ? 'bg-primary' : event.type === 'game' ? 'bg-destructive' : 'bg-green-500'}`}></div>
                                                    ))}
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
                           {date && getEventsForDate(date).length > 0 ? getEventsForDate(date).map((event, index) => (
                                <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                                    <Badge variant={event.type === 'workout' ? 'default' : event.type === 'game' ? 'destructive' : 'secondary'}>{event.type}</Badge>
                                    <p className="font-medium">{event.title}</p>
                                </div>
                            )) : (
                                <p className="text-muted-foreground p-4 text-center">No events scheduled for this day.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
