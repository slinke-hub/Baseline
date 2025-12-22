
import Link from 'next/link';
import Image from 'next/image';
import type { Meal } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from './ui/button';
import { Flame, Beef, Wheat } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const mealImage = placeholderData.placeholderImages.find(p => p.id === meal.imageId);

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {mealImage && (
        <div className="relative h-48 w-full">
          <Image
            src={mealImage.imageUrl}
            alt={meal.title}
            fill
            className="object-cover"
            data-ai-hint={mealImage.imageHint}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </div>
      )}
      <CardHeader>
        <Badge variant="outline" className="w-fit">{meal.category}</Badge>
        <CardTitle className="mt-2">{meal.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex justify-around text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><Flame className="h-4 w-4 text-primary" /> {meal.calories} kcal</div>
            <div className="flex items-center gap-1"><Beef className="h-4 w-4 text-primary" /> {meal.protein}g P</div>
            <div className="flex items-center gap-1"><Wheat className="h-4 w-4 text-primary" /> {meal.carbs}g C</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/meal-planner/${meal.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
