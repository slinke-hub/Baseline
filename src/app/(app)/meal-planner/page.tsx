'use client';

import { MealCard } from '@/components/meal-card';
import { mockMeals } from '@/lib/mock-data';
import type { Meal, MealCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const categories: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Pre-game', 'Post-game'];

export default function MealPlannerPage() {
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockMeals.filter(m => m.category === category).map((meal: Meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
              {mockMeals.filter(m => m.category === category).length === 0 && (
                <p className="text-muted-foreground col-span-full text-center mt-8">No {category.toLowerCase()} meals found.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
