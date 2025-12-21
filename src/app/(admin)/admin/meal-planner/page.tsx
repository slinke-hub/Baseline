
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Trash2, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { useToast } from '@/hooks/use-toast';
import type { Meal, MealCategory, AppUser, UserMealPlan } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTimes: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function AdminMealPlannerPage() {
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { appUser } = useAuth();
    
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState<{ day: string, mealTime: MealCategory } | null>(null);

    // Fetch clients
    const clientsQuery = useMemoFirebase(() => query(collection(firestore, 'users'), where('role', '==', 'client')), [firestore]);
    const { data: clients, isLoading: isLoadingClients } = useCollection<AppUser>(clientsQuery);

    // Fetch meals
    const mealsQuery = useMemoFirebase(() => collection(firestore, 'meals'), [firestore]);
    const { data: meals, isLoading: isLoadingMeals } = useCollection<Meal>(mealsQuery);

    // Fetch meal plans
    const mealPlansQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'mealPlans');
    }, [firestore]);
    const { data: mealPlans, isLoading: isLoadingPlans } = useCollection<UserMealPlan>(mealPlansQuery);

    const userPlan = useMemo(() => {
        if (!selectedUser || !mealPlans) return {};
        const plansForUser = mealPlans.filter(p => p.userId === selectedUser);
        const weeklyPlan: { [day: string]: { [mealTime in MealCategory]?: Meal | null } } = {};
        
        for (const plan of plansForUser) {
            if (!weeklyPlan[plan.day]) {
                weeklyPlan[plan.day] = {};
            }
            const fullMeal = meals?.find(m => m.id === plan.mealId);
            if (fullMeal) {
                weeklyPlan[plan.day][plan.mealTime] = fullMeal;
            }
        }
        return weeklyPlan;
    }, [selectedUser, mealPlans, meals]);
    
    const filteredClients = useMemo(() => {
        if (!clients) return [];
        return clients.filter(c => c.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [clients, searchTerm]);

    const openMealSelector = (day: string, mealTime: MealCategory) => {
        if (!selectedUser) {
            toast({ title: 'No Client Selected', description: 'Please select a client first.', variant: 'destructive' });
            return;
        }
        setCurrentSlot({ day, mealTime });
        setDialogOpen(true);
    };

    const handleSelectMeal = async (meal: Meal) => {
        if (!currentSlot || !selectedUser || !appUser) return;
        const { day, mealTime } = currentSlot;

        const mealPlanId = `${selectedUser}_${day}_${mealTime}`;
        const mealPlanRef = doc(firestore, 'mealPlans', mealPlanId);
        
        try {
            await setDoc(mealPlanRef, {
                id: mealPlanId,
                userId: selectedUser,
                mealId: meal.id,
                day,
                mealTime,
                authorId: appUser.uid
            });
            toast({ title: "Meal Added", description: `${meal.title} assigned for ${mealTime} on ${day}.` });
            setDialogOpen(false);
        } catch (error) {
            console.error("Error setting meal plan:", error);
            toast({ title: "Error", description: "Could not save the meal plan.", variant: 'destructive'});
        }
    };
    
    const handleRemoveMeal = async (day: string, mealTime: MealCategory) => {
        if (!selectedUser) return;
        const mealPlanId = `${selectedUser}_${day}_${mealTime}`;
        const mealPlanRef = doc(firestore, 'mealPlans', mealPlanId);
        try {
            await deleteDoc(mealPlanRef);
            toast({ title: "Meal Removed", variant: 'destructive'});
        } catch (error) {
            console.error("Error removing meal plan:", error);
            toast({ title: "Error", description: "Could not remove the meal plan.", variant: 'destructive'});
        }
    }

    const isLoading = isLoadingClients || isLoadingMeals || isLoadingPlans;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Meal Planner</h1>
                    <p className="text-muted-foreground">Assign and manage weekly meal plans for your clients.</p>
                </div>
                <div className="flex gap-2 w-[400px]">
                    <div className="w-full">
                        <Input 
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Select value={selectedUser || ''} onValueChange={setSelectedUser}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredClients.map(user => (
                                <SelectItem key={user.uid} value={user.uid}>{user.displayName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>}

            {!isLoading && <div className="overflow-x-auto">
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
                                                <Button variant="outline" className="w-full h-16 border-dashed" onClick={() => openMealSelector(day, mealTime)} disabled={!selectedUser}>
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
            </div>}

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Select a Meal for {currentSlot?.day} {currentSlot?.mealTime}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        {meals
                            ?.filter(m => currentSlot?.mealTime === 'Snacks' ? m.category === 'Snacks' : m.category !== 'Snacks')
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
