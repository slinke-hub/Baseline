
'use client';

import { mockMeals } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';
import { ArrowLeft, Flame, Beef, Wheat, Leaf, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export function generateStaticParams() {
  return mockMeals.map((meal) => ({
    id: meal.id,
  }));
}

export default function MealDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { toast } = useToast();
  const meal = mockMeals.find(m => m.id === id);

  if (!meal) {
    return (
        <div className="p-8 text-center">
            <p>Meal not found.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/meal-planner">Back to Meal Planner</Link>
            </Button>
        </div>
    );
  }
  
  const mealImage = placeholderData.placeholderImages.find(p => p.id === meal.imageId);

  const handleSave = () => {
    // In a real app, this would update user's data in Firestore
    toast({
      title: "Meal Saved!",
      description: `${meal.title} has been added to your meal plan.`,
    });
  };

  const macroInfo = [
    { icon: Flame, value: `${meal.calories} kcal`, label: 'Calories' },
    { icon: Beef, value: `${meal.protein}g`, label: 'Protein' },
    { icon: Wheat, value: `${meal.carbs}g`, label: 'Carbs' },
    { icon: Leaf, value: `${meal.fat}g`, label: 'Fat' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link href="/meal-planner" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Meals
      </Link>
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
            {mealImage && (
                <div className="relative h-64 w-full">
                <Image
                    src={mealImage.imageUrl}
                    alt={meal.title}
                    fill
                    className="object-cover"
                    data-ai-hint={mealImage.imageHint}
                />
                </div>
            )}
            <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{meal.category}</Badge>
                <CardTitle className="text-3xl font-bold">{meal.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg border p-4">
                    {macroInfo.map(info => (
                        <div key={info.label} className="flex flex-col items-center gap-2 text-center">
                            <info.icon className="h-6 w-6 text-primary" />
                            <p className="font-bold text-lg">{info.value}</p>
                            <p className="text-xs text-muted-foreground">{info.label}</p>
                        </div>
                    ))}
                </div>
                
                <Separator />
                
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Ingredients</h3>
                        <ul className="space-y-3">
                            {meal.ingredients.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-[7px]" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Steps</h3>
                        <ol className="space-y-4 list-decimal list-outside pl-5">
                            {meal.steps.map((step, index) => (
                                <li key={index} className="pl-2">{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>

                <Separator className="mt-2" />

                <Button size="lg" className="w-full" onClick={handleSave}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Save to My Meal Plan
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
