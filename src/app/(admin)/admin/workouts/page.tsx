
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit, MoreVertical, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Workout, WorkoutCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

export default function AdminWorkoutsPage() {
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { appUser } = useAuth();
    
    const workoutsQuery = useMemoFirebase(() => collection(firestore, 'workouts'), [firestore]);
    const { data: workouts, isLoading: isLoadingWorkouts } = useCollection<Workout>(workoutsQuery);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

    const isEditing = !!selectedWorkout;

    const handleDelete = async (workoutId: string) => {
        try {
            await deleteDoc(doc(firestore, 'workouts', workoutId));
            toast({ title: "Workout Deleted", description: "The workout has been removed.", variant: "destructive" });
        } catch (error) {
            console.error("Error deleting workout:", error);
            toast({ title: "Deletion Failed", variant: "destructive" });
        }
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!appUser) return;

        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        const processedValues = {
            ...values,
            duration: parseInt(values.duration),
            steps: values.steps.split('\n'),
            authorId: appUser.uid,
        };

        try {
            if (isEditing && selectedWorkout) {
                await updateDoc(doc(firestore, 'workouts', selectedWorkout.id), processedValues);
                toast({ title: "Workout Updated", description: "The workout has been saved." });
            } else {
                const newWorkoutData = {
                    ...processedValues,
                    videoUrl: 'https://www.youtube.com/embed/example',
                    imageId: `workout-${values.category.toLowerCase().replace(/\s+/g, '-')}-1`,
                };
                await addDoc(collection(firestore, 'workouts'), newWorkoutData);
                toast({ title: "Workout Added", description: "The new workout has been created." });
            }
            closeForm();
        } catch (error) {
            console.error("Error saving workout:", error);
            toast({ title: "Save Failed", variant: "destructive" });
        }
    }
    
    const openForm = (workout?: Workout) => {
        setSelectedWorkout(workout || null);
        setIsFormOpen(true);
    }
    
    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedWorkout(null);
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Workout Management</CardTitle>
                    <CardDescription>Add, edit, or delete workout programs.</CardDescription>
                </div>
                <Button onClick={() => openForm()}><PlusCircle className="mr-2 h-4 w-4" /> Add Workout</Button>
            </CardHeader>
            <CardContent>
                {isLoadingWorkouts ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
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
                            {workouts?.map(workout => (
                                <TableRow key={workout.id}>
                                    <TableCell className="font-medium">{workout.title}</TableCell>
                                    <TableCell><Badge variant="outline">{workout.category}</Badge></TableCell>
                                    <TableCell>{workout.difficulty}</TableCell>
                                    <TableCell>{workout.duration} min</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openForm(workout)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive w-full">
                                                            <Trash2 className="mr-2 h-4 w-4" />Delete
                                                        </div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to delete {workout.title}?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(workout.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Workout' : 'Add New Workout'}</DialogTitle>
                            <DialogDescription>Fill in the details for the workout program.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" name="title" defaultValue={selectedWorkout?.title} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Textarea id="description" name="description" defaultValue={selectedWorkout?.description} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Select name="category" defaultValue={selectedWorkout?.category} required>
                                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a category" /></SelectTrigger>
                                    <SelectContent>
                                        {(['Shooting', 'Ball Handling', 'Defense', 'Conditioning', 'Vertical Jump'] as WorkoutCategory[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="difficulty" className="text-right">Difficulty</Label>
                                <Select name="difficulty" defaultValue={selectedWorkout?.difficulty} required>
                                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                                    <SelectContent>
                                        {(['Easy', 'Medium', 'Hard'] as const).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="duration" className="text-right">Duration (min)</Label>
                                <Input id="duration" name="duration" type="number" defaultValue={selectedWorkout?.duration} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="steps" className="text-right mt-2">Steps</Label>
                                <Textarea id="steps" name="steps" defaultValue={selectedWorkout?.steps.join('\n')} className="col-span-3" required placeholder="Enter each step on a new line." rows={5}/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Workout'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
