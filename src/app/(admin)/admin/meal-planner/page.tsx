
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { mockMeals } from '@/lib/mock-data';
import { PlusCircle, UtensilsCrossed, Trash2 } from 'lucide-react';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { useToast } from '@/hooks/use-toast';
import type { Meal, MealCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockUsers = [
    { id: 'user-1', name: 'LeBron James' },
    { id: 'user-2', name: 'Stephen Curry' },
    { id: 'user-3', name: 'Kevin Durant' },
    { id: 'user-5', name: 'Zion Williamson' },
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTimes: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

type WeeklyPlan = {
    [day: string]: {
        [mealTime in MealCategory]?: Meal | null;
    };
};

type UserWeeklyPlans = {
    [userId: string]: WeeklyPlan;
};

const initialPlan: UserWeeklyPlans = {
    'user-2': {
        'Monday': { 'Breakfast': mockMeals[0], 'Lunch': mockMeals[1], 'Dinner': mockMeals[2] },
        'Tuesday': { 'Breakfast': mockMeals[0], 'Dinner': mockMeals[2], 'Snacks': mockMeals[3] },
        'Wednesday': { 'Lunch': mockMeals[1] },
    },
    'user-1': {
        'Monday': { 'Breakfast': mockMeals[0] },
    },
    'user-5': {
        'Monday': { 'Post-game': mockMeals[4] },
    }
};

export default function AdminMealPlannerPage() {
    const { toast } = useToast();
    const [selectedUser, setSelectedUser] = useState('user-2');
    const [plans, setPlans] = useState<UserWeeklyPlans>(initialPlan);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState<{ day: string, mealTime: MealCategory } | null>(null);

    const userPlan = plans[selectedUser] || {};

    const openMealSelector = (day: string, mealTime: MealCategory) => {
        setCurrentSlot({ day, mealTime });
        setDialogOpen(true);
    };

    const handleSelectMeal = (meal: Meal) => {
        if (!currentSlot || !selectedUser) return;
        const { day, mealTime } = currentSlot;

        setPlans(prev => {
            const newPlans = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (!newPlans[selectedUser]) {
                newPlans[selectedUser] = {};
            }
            if (!newPlans[selectedUser][day]) {
                newPlans[selectedUser][day] = {};
            }
            newPlans[selectedUser][day][mealTime] = meal;
            return newPlans;
        });

        toast({ title: "Meal Added", description: `${meal.title} assigned for ${mealTime} on ${day}.` });
        setDialogOpen(false);
    };
    
    const handleRemoveMeal = (day: string, mealTime: MealCategory) => {
        if (!selectedUser) return;

        setPlans(prev => {
            const newPlans = JSON.parse(JSON.stringify(prev)); // Deep copy
            if(newPlans[selectedUser] && newPlans[selectedUser][day]) {
                newPlans[selectedUser][day][mealTime] = null;
            }
            return newPlans;
        });
        toast({ title: "Meal Removed", variant: 'destructive'});
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Meal Planner</h1>
                    <p className="text-muted-foreground">Assign and manage weekly meal plans for your clients.</p>
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
            
            <div className="overflow-x-auto">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-1 min-w-[1200px]">
                    {weekDays.map(day => (
                        <Card key={day} className="flex-1">
                            <CardHeader>
                                <CardTitle className="text-center">{day}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {mealTimes.map(mealTime => {
                                    const meal = userPlan[day]?.[mealTime];
                                    return (
                                        <div key={mealTime}>
                                            <h4 className="font-semibold text-sm mb-2">{mealTime}</h4>
                                            {meal ? (
                                                <div className="relative group">
                                                    <div className="border rounded-lg p-2 flex items-center gap-2">
                                                        <Image
                                                            src={placeholderData.placeholderImages.find(p => p.id === meal.imageId)?.imageUrl || ''}
                                                            alt={meal.title}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-md object-cover"
                                                        />
                                                        <div className="flex-1 overflow-hidden">
                                                            <p className="text-sm font-medium truncate">{meal.title}</p>
                                                            <p className="text-xs text-muted-foreground">{meal.calories} kcal</p>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveMeal(day, mealTime)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button variant="outline" className="w-full h-16 border-dashed" onClick={() => openMealSelector(day, mealTime)}>
                                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Meal
                                                </Button>
                                            )}
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Select a Meal for {currentSlot?.day} {currentSlot?.mealTime}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        {mockMeals
                            .filter(m => currentSlot?.mealTime === 'Snacks' ? m.category === 'Snacks' : m.category !== 'Snacks')
                            .map(meal => (
                            <Card key={meal.id} className="cursor-pointer hover:shadow-primary/20 hover:shadow-lg" onClick={() => handleSelectMeal(meal)}>
                                <CardHeader className="p-4">
                                     <Image
                                        src={placeholderData.placeholderImages.find(p => p.id === meal.imageId)?.imageUrl || ''}
                                        alt={meal.title}
                                        width={200}
                                        height={120}
                                        className="rounded-md object-cover w-full aspect-[16/9]"
                                    />
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <Badge variant="outline">{meal.category}</Badge>
                                    <h3 className="font-semibold mt-2">{meal.title}</h3>
                                    <p className="text-xs text-muted-foreground">{meal.calories} kcal</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
