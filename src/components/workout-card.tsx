
import Link from 'next/link';
import Image from 'next/image';
import type { Workout } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const workoutImage = workout.photoUrl || placeholderData.placeholderImages.find(p => p.id === workout.imageId)?.imageUrl;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {workoutImage && (
        <div className="relative h-48 w-full">
          <Image
            src={workoutImage}
            alt={workout.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
            <Badge variant="secondary">{workout.category}</Badge>
            <div className="text-sm text-muted-foreground">{workout.duration} min</div>
        </div>
        <CardTitle className="mt-2">{workout.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <p className="mb-4 text-sm text-muted-foreground">{workout.description}</p>
        <Button asChild className="w-full">
          <Link href={`/workouts/${workout.id}`}>View Workout</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
