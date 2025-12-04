'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { suggestMealPlanChanges } from '@/ai/flows/suggest-meal-plan-changes';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AiSuggestionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [goals, setGoals] = useState('Improve vertical jump and on-court stamina.');
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion('');
    try {
      // In a real app, this data would be fetched from the user's profile and progress logs
      const mockProgress = "Completed 3 workouts this week. Total minutes: 78. Focused on shooting and conditioning.";
      const mockMealPlan = "Current plan: oatmeal for breakfast, chicken salad for lunch, salmon with quinoa for dinner. ~2200 calories.";

      const result = await suggestMealPlanChanges({
        userProgress: mockProgress,
        userGoals: goals,
        currentMealPlan: mockMealPlan,
      });

      setSuggestion(result.suggestedChanges);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        title: 'Error',
        description: 'Could not generate AI suggestions. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Get AI Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Meal Plan Suggestions</DialogTitle>
          <DialogDescription>
            Let our AI analyze your goals and suggest improvements to your meal plan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="goals">Your primary goal</Label>
            <Textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g., increase muscle mass, improve agility"
            />
            <p className="text-xs text-muted-foreground">This will be sent to the AI along with your mock progress and current meal plan.</p>
          </div>
          <Button onClick={handleGetSuggestion} disabled={isLoading || !goals}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Suggestions'
            )}
          </Button>

          {suggestion && (
            <div className="mt-4 rounded-lg border bg-secondary p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Suggested Changes:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion}</p>
            </div>
          )}

        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
