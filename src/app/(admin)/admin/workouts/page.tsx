'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockWorkouts } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function AdminWorkoutsPage() {
    const { toast } = useToast();

    const showToast = (title: string, description: string) => {
        toast({ title, description });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Workout Management</CardTitle>
                    <CardDescription>Add, edit, or delete workout programs.</CardDescription>
                </div>
                <Button onClick={() => showToast('Add Workout', 'Add workout functionality coming soon!')}><PlusCircle className="mr-2 h-4 w-4" /> Add Workout</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockWorkouts.map(workout => (
                            <TableRow key={workout.id}>
                                <TableCell className="font-medium">{workout.title}</TableCell>
                                <TableCell><Badge variant="outline">{workout.category}</Badge></TableCell>
                                <TableCell>{workout.difficulty}</TableCell>
                                <TableCell>{workout.duration} min</TableCell>
                                <TableCell className="text-right">
                                    <Button onClick={() => showToast('Edit Workout', `Editing ${workout.title}`)} variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    <Button onClick={() => showToast('Delete Workout', `Deleting ${workout.title}`)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
