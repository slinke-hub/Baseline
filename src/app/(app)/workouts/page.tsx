
'use client';

import { WorkoutCard } from '@/components/workout-card';
import type { Workout, WorkoutCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const categories: WorkoutCategory[] = ['Shooting', 'Ball Handling', 'Defense', 'Conditioning', 'Vertical Jump'];

function WorkoutsContent() {
  const { firestore } = useFirebase();
  const workoutsQuery = useMemoFirebase(() => collection(firestore, 'workouts'), [firestore]);
  const { data: allWorkouts, isLoading } = useCollection<Workout>(workoutsQuery);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
        <p className="text-muted-foreground">Find the perfect drill to level up your game.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <Tabs defaultValue={'Shooting'} className="w-full">
            <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-grid w-max grid-cols-5 sm:w-full bg-card/20 backdrop-blur-sm">
                    {categories.map(category => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                    ))}
                </TabsList>
                <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          {categories.map(category => (
            <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {allWorkouts?.filter(w => w.category === category).map((workout: Workout) => (
                    <WorkoutCard key={workout.id} workout={workout} transparent />
                  ))}
                </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function WorkoutsPageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="relative min-h-screen"
        >
            <div
                className="absolute inset-0 -z-10 h-full w-full bg-background"
            />
            <div className="absolute inset-0 -z-10 bg-background/90 backdrop-blur-md" />
            <div className="relative z-0">
                {children}
            </div>
        </div>
    )
}

export default function WorkoutsPage() {
    return (
      <WorkoutsPageContainer>
          <WorkoutsContent />
      </WorkoutsPageContainer>
    )
}
