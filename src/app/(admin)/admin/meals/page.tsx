
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit, MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockMeals as initialMeals } from '@/lib/mock-data';
import type { Meal, MealCategory } from '@/lib/types';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminMealsPage() {
    const { toast } = useToast();
    const [meals, setMeals] = useState(initialMeals);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

    const isEditing = !!selectedMeal;

    const handleDelete = (mealId: string) => {
        setMeals(current => current.filter(m => m.id !== mealId));
        toast({ title: "Meal Deleted", description: "The meal has been removed from the list.", variant: "destructive" });
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        const processedValues = {
            ...values,
            calories: parseInt(values.calories),
            protein: parseInt(values.protein),
            carbs: parseInt(values.carbs),
            fat: parseInt(values.fat),
            ingredients: values.ingredients.split('\n'),
            steps: values.steps.split('\n'),
        }

        if (isEditing) {
            setMeals(current => current.map(m => m.id === selectedMeal.id ? { ...m, ...processedValues } : m));
            toast({ title: "Meal Updated", description: "The meal has been successfully updated." });
        } else {
            const newMeal: Meal = {
                id: `meal-${Date.now()}`,
                imageId: `meal-${values.category.toLowerCase().split('-')[0]}-1`,
                ...processedValues
            };
            setMeals(current => [newMeal, ...current]);
            toast({ title: "Meal Added", description: "The new meal has been created." });
        }
        closeForm();
    }
    
    const openForm = (meal?: Meal) => {
        setSelectedMeal(meal || null);
        setIsFormOpen(true);
    }
    
    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedMeal(null);
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Meal Plan Management</CardTitle>
                    <CardDescription>Add, edit, or delete meal plans.</CardDescription>
                </div>
                <Button onClick={() => openForm()}><PlusCircle className="mr-2 h-4 w-4" /> Add Meal</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Calories</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals.map(meal => {
                            const image = placeholderData.placeholderImages.find(p => p.id === meal.imageId);
                            return (
                                <TableRow key={meal.id}>
                                    <TableCell>
                                        {image && <Image src={image.imageUrl} alt={meal.title} width={64} height={64} className="rounded-md object-cover" data-ai-hint={image.imageHint} />}
                                    </TableCell>
                                    <TableCell className="font-medium">{meal.title}</TableCell>
                                    <TableCell><Badge variant="outline">{meal.category}</Badge></TableCell>
                                    <TableCell>{meal.calories} kcal</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openForm(meal)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive w-full">
                                                            <Trash2 className="mr-2 h-4 w-4" />Delete
                                                        </div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to delete {meal.title}?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(meal.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Meal' : 'Add New Meal'}</DialogTitle>
                            <DialogDescription>Fill in the details for the meal.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" name="title" defaultValue={selectedMeal?.title} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Select name="category" defaultValue={selectedMeal?.category} required>
                                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a category" /></SelectTrigger>
                                    <SelectContent>
                                        {(['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Pre-game', 'Post-game'] as MealCategory[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2"><Label htmlFor="calories">Calories</Label><Input id="calories" name="calories" type="number" defaultValue={selectedMeal?.calories} required /></div>
                                <div className="space-y-2"><Label htmlFor="protein">Protein (g)</Label><Input id="protein" name="protein" type="number" defaultValue={selectedMeal?.protein} required /></div>
                                <div className="space-y-2"><Label htmlFor="carbs">Carbs (g)</Label><Input id="carbs" name="carbs" type="number" defaultValue={selectedMeal?.carbs} required /></div>
                                <div className="space-y-2"><Label htmlFor="fat">Fat (g)</Label><Input id="fat" name="fat" type="number" defaultValue={selectedMeal?.fat} required /></div>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="ingredients" className="text-right mt-2">Ingredients</Label>
                                <Textarea id="ingredients" name="ingredients" defaultValue={selectedMeal?.ingredients.join('\n')} className="col-span-3" required placeholder="Enter each ingredient on a new line." rows={5}/>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="steps" className="text-right mt-2">Steps</Label>
                                <Textarea id="steps" name="steps" defaultValue={selectedMeal?.steps.join('\n')} className="col-span-3" required placeholder="Enter each step on a new line." rows={5}/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Meal'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
