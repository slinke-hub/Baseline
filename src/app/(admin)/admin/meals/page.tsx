'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockMeals } from '@/lib/mock-data';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';

export default function AdminMealsPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Meal Plan Management</CardTitle>
                    <CardDescription>Add, edit, or delete meal plans.</CardDescription>
                </div>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Meal</Button>
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
                        {mockMeals.map(meal => {
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
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
