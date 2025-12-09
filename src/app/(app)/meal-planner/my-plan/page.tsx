import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';

export default function MyMealPlanPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">My Meal Plan</h1>
            <p className="text-muted-foreground">Your personalized weekly nutrition schedule.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>The full weekly meal plan editor is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <UtensilsCrossed className="h-12 w-12 mb-4" />
                <p>Your saved meals and weekly schedule will appear here.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
