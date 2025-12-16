
'use client';

import { Suspense } from 'react';
import { WorkoutCard } from '@/components/workout-card';
import { mockWorkouts } from '@/lib/mock-data';
import type { Workout, WorkoutCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';

const categories: WorkoutCategory[] = ['Shooting', 'Ball Handling', 'Defense', 'Conditioning', 'Vertical Jump'];

function WorkoutsContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') as WorkoutCategory | null;

  const filteredWorkouts = selectedCategory ? mockWorkouts.filter(w => w.category === selectedCategory) : mockWorkouts;
  const defaultValue = selectedCategory && categories.includes(selectedCategory) ? selectedCategory : 'Shooting';

  return (
    <div
      className="space-y-6 p-4 sm:p-6 lg:p-8 relative"
      style={{
        backgroundImage: `url(/logo.png)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md -z-10" />
      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">Find the perfect drill to level up your game.</p>
        </div>

        <Tabs defaultValue={defaultValue} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mockWorkouts.filter(w => w.category === category).map((workout: Workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default function WorkoutsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WorkoutsContent />
        </Suspense>
    )
}
