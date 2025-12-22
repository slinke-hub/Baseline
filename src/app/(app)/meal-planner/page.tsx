
'use client';

import { MealCard } from '@/components/meal-card';
import type { Meal, MealCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const categories: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Pre-game', 'Post-game'];

export default function MealPlannerPage() {
  const { firestore } = useFirebase();
  const mealsQuery = useMemoFirebase(() => collection(firestore, 'meals'), [firestore]);
  const { data: meals, isLoading } = useCollection<Meal>(mealsQuery);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Meal Planner</h1>
            <p className="text-muted-foreground">Fuel your performance with the right nutrition.</p>
        </div>
        <Button asChild>
            <Link href="/meal-planner/my-plan">My Meal Plan</Link>
        </Button>
      </div>

      <Tabs defaultValue="Breakfast" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">{category}</TabsTrigger>
          ))}
        </TabsList>
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-48 w-full" />
                            <CardHeader><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-40 mt-2" /></CardHeader>
                            <CardContent><Skeleton className="h-5 w-full" /></CardContent>
                            <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {meals?.filter(m => m.category === category).map((meal: Meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                  {meals?.filter(m => m.category === category).length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center mt-8">No {category.toLowerCase()} meals found.</p>
                  )}
                </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
