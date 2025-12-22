
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UtensilsCrossed, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Meal, MealCategory, UserMealPlan } from '@/lib/types';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import Link from 'next/link';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTimes: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function MyMealPlanPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();

    // Fetch meal plans for the current user
    const mealPlansQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'mealPlans'), where('userId', '==', user.uid));
    }, [firestore, user]);
    const { data: mealPlans, isLoading: isLoadingPlans } = useCollection<UserMealPlan>(mealPlansQuery);

    // Fetch all meals to get details
    const mealsQuery = useMemoFirebase(() => collection(firestore, 'meals'), [firestore]);
    const { data: meals, isLoading: isLoadingMeals } = useCollection<Meal>(mealsQuery);

    const userPlan = useMemo(() => {
        if (!mealPlans || !meals) return {};
        const weeklyPlan: { [day: string]: { [mealTime in MealCategory]?: Meal | null } } = {};
        
        for (const plan of mealPlans) {
            if (!weeklyPlan[plan.day]) {
                weeklyPlan[plan.day] = {};
            }
            const fullMeal = meals.find(m => m.id === plan.mealId);
            if (fullMeal) {
                weeklyPlan[plan.day][plan.mealTime] = fullMeal;
            }
        }
        return weeklyPlan;
    }, [mealPlans, meals]);

    const isLoading = isLoadingPlans || isLoadingMeals;

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Meal Plan</h1>
                    <p className="text-muted-foreground">Your personalized weekly nutrition schedule.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
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
                                                    <Link href={`/meal-planner/${meal.id}`} className="block group">
                                                        <div className="border rounded-lg p-2 flex items-center gap-2 hover:bg-accent/50 transition-colors">
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
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <div className="w-full h-16 border-dashed border rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                                                        No meal assigned
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {!isLoading && Object.keys(userPlan).length === 0 && (
                 <Card>
                    <CardContent className="p-12">
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                            <UtensilsCrossed className="h-12 w-12 mb-4" />
                            <h3 className="font-semibold">No Meal Plan Found</h3>
                            <p className="text-sm">Your coach has not assigned you a meal plan yet. Check back later!</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
