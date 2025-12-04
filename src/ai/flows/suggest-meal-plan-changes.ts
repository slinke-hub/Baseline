'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting changes to a user's meal plan based on their progress and goals.
 *
 * - suggestMealPlanChanges - A function that suggests changes to a user's meal plan.
 * - SuggestMealPlanChangesInput - The input type for the suggestMealPlanChanges function.
 * - SuggestMealPlanChangesOutput - The return type for the suggestMealPlanChanges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMealPlanChangesInputSchema = z.object({
  userProgress: z
    .string()
    .describe("A summary of the user's workout progress, including workouts completed, total minutes trained, and shots taken."),
  userGoals: z
    .string()
    .describe('A description of the user goals, including target performance metrics, such as weight, strength and conditioning.'),
  currentMealPlan: z
    .string()
    .describe('A description of the user current meal plan, including typical meals and calorie/macro breakdown.'),
});
export type SuggestMealPlanChangesInput = z.infer<typeof SuggestMealPlanChangesInputSchema>;

const SuggestMealPlanChangesOutputSchema = z.object({
  suggestedChanges: z
    .string()
    .describe('AI suggested changes to the meal plan, including specific meal recommendations and adjustments to calorie and macro targets.'),
});
export type SuggestMealPlanChangesOutput = z.infer<typeof SuggestMealPlanChangesOutputSchema>;

export async function suggestMealPlanChanges(input: SuggestMealPlanChangesInput): Promise<SuggestMealPlanChangesOutput> {
  return suggestMealPlanChangesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMealPlanChangesPrompt',
  input: {schema: SuggestMealPlanChangesInputSchema},
  output: {schema: SuggestMealPlanChangesOutputSchema},
  prompt: `You are a nutrition expert specializing in athletic performance.

  Based on the user's progress, goals, and current meal plan, suggest changes to optimize their nutrition for better performance.

  User Progress: {{{userProgress}}}
  User Goals: {{{userGoals}}}
  Current Meal Plan: {{{currentMealPlan}}}

  Provide specific meal recommendations and adjustments to calorie and macro targets.
  Response should be concise and actionable.
  `,
});

const suggestMealPlanChangesFlow = ai.defineFlow(
  {
    name: 'suggestMealPlanChangesFlow',
    inputSchema: SuggestMealPlanChangesInputSchema,
    outputSchema: SuggestMealPlanChangesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
