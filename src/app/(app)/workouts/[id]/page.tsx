
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';
import { ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWorkoutById, getAllWorkoutIds } from '@/lib/firebase-admin-utils';
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const ids = await getAllWorkoutIds();
  return ids.map((id) => ({
    id: id,
  }));
}

export default async function WorkoutDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const workout = await getWorkoutById(id);

  if (!workout) {
    notFound();
  }
  
  const workoutImage = placeholderData.placeholderImages.find(p => p.id === workout.imageId);
  const cardClassName = "bg-card/20 backdrop-blur-sm";

  return (
    <div className="relative min-h-screen">
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
        <div className="relative z-0 p-4 sm:p-6 lg:p-8">
            <Link href="/workouts" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Workouts
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className={cardClassName}>
                        {workoutImage && (
                            <div className="relative h-64 w-full rounded-t-lg overflow-hidden">
                            <Image
                                src={workoutImage.imageUrl}
                                alt={workout.title}
                                fill
                                className="object-cover"
                                data-ai-hint={workoutImage.imageHint}
                            />
                            </div>
                        )}
                        <CardHeader>
                            <Badge variant="secondary" className="w-fit mb-2">{workout.category}</Badge>
                            <CardTitle className="text-3xl font-bold">{workout.title}</CardTitle>
                            <div className="flex items-center gap-4 text-muted-foreground pt-2">
                                <span>{workout.difficulty}</span>
                                <span>•</span>
                                <span>{workout.duration} minutes</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg mb-6">{workout.description}</p>
                            <h3 className="text-xl font-bold mb-4">Instructions</h3>
                            <ul className="space-y-4">
                                {workout.steps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className={cn("sticky top-24", cardClassName)}>
                        <CardHeader>
                            <CardTitle>Ready to Train?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video w-full bg-secondary rounded-lg mb-4">
                                <iframe
                                    className="w-full h-full rounded-lg"
                                    src={workout.videoUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <Button asChild size="lg" className="w-full">
                                <Link href={`/workouts/track/${workout.id}`}>Start Workout</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
