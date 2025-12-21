
import { WorkoutTrackerClientPage } from "./workout-tracker-client-page";
import { getWorkoutById, getAllWorkoutIds } from "@/lib/firebase-admin-utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const ids = await getAllWorkoutIds();
    return ids.map((id) => ({
        id: id,
    }));
}

export default async function WorkoutTrackerPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const workout = await getWorkoutById(id);

    if (!workout) {
        notFound();
    }
    
    return <WorkoutTrackerClientPage workout={workout} />;
}
