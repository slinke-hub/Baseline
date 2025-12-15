
import { mockWorkouts } from "@/lib/mock-data";
import { WorkoutTrackerClientPage } from "./workout-tracker-client-page";

export async function generateStaticParams() {
    return mockWorkouts.map((workout) => ({
        id: workout.id,
    }));
}

export default function WorkoutTrackerPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const workout = mockWorkouts.find(w => w.id === id);

    if (!workout) {
        return <div className="p-8">Workout not found.</div>;
    }
    
    return <WorkoutTrackerClientPage workout={workout} />;
}
