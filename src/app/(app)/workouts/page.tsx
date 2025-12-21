
'use client';

import { Suspense } from 'react';
import { WorkoutCard } from '@/components/workout-card';
import type { Workout, WorkoutCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const categories: WorkoutCategory[] = ['Shooting', 'Ball Handling', 'Defense', 'Conditioning', 'Vertical Jump'];

function WorkoutsContent() {
  const searchParams = useSearchParams();
  const { firestore } = useFirebase();
  const selectedCategoryParam = searchParams.get('category') as WorkoutCategory | null;
  const activeTab = selectedCategoryParam && categories.includes(selectedCategoryParam) ? selectedCategoryParam : 'Shooting';

  const workoutsQuery = useMemoFirebase(() => collection(firestore, 'workouts'), [firestore]);
  const { data: allWorkouts, isLoading: isLoadingWorkouts } = useCollection<Workout>(workoutsQuery);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
        <p className="text-muted-foreground">Find the perfect drill to level up your game.</p>
      </div>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto bg-card/20 backdrop-blur-sm">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            {isLoadingWorkouts ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                   <Card key={i} className="bg-card/20 backdrop-blur-sm">
                     <CardHeader>
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-6 w-48 mt-2" />
                     </CardHeader>
                     <CardContent>
                       <Skeleton className="h-10 w-full" />
                     </CardContent>
                   </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allWorkouts?.filter(w => w.category === category).map((workout: Workout) => (
                  <WorkoutCard key={workout.id} workout={workout} transparent />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
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
                style={{
                    backgroundImage: `url(/logo.png)`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundAttachment: 'fixed',
                }}
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
        <Suspense fallback={<div>Loading...</div>}>
            <WorkoutsPageContainer>
                <WorkoutsContent />
            </WorkoutsPageContainer>
        </Suspense>
    )
}
