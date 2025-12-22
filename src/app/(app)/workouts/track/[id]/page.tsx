
'use client';

import { WorkoutTrackerClientPage } from "./workout-tracker-client-page";
import { notFound, useParams } from "next/navigation";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Workout } from "@/lib/types";
import { BasketballLoader } from "@/components/basketball-loader";

export default function WorkoutTrackerPage() {
    const { id } = useParams() as { id: string };
    const { firestore } = useFirebase();

    const workoutDocRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'workouts', id);
    }, [firestore, id]);

    const { data: workout, isLoading } = useDoc<Workout>(workoutDocRef);

    if (isLoading) {
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <BasketballLoader />
          </div>
        );
    }

    if (!workout) {
        notFound();
    }
    
    return <WorkoutTrackerClientPage workout={workout} />;
}
