'use server';
/**
 * @fileOverview An AI flow for analyzing a user's basketball jump shot form from a video.
 *
 * - analyzeShot - A function that takes a video of a jump shot and returns expert coaching feedback.
 * - AnalyzeShotInput - The input type for the analyzeShot function.
 * - AnalyzeShotOutput - The return type for the analyzeShot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeShotInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a user's jump shot, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeShotInput = z.infer<typeof AnalyzeShotInputSchema>;

const ShotAnalysisSchema = z.object({
  isShotGood: z.boolean().describe('Whether the overall shooting form is good.'),
  feet: z.string().describe('Feedback on foot alignment and base.'),
  elbow: z.string().describe('Feedback on elbow alignment (shooting arm).'),
  followThrough: z.string().describe('Feedback on the follow-through motion.'),
  summary: z.string().describe('A concise overall summary of the feedback and one key area for improvement.'),
});

const AnalyzeShotOutputSchema = z.object({
  analysis: ShotAnalysisSchema,
});
export type AnalyzeShotOutput = z.infer<typeof AnalyzeShotOutputSchema>;

export async function analyzeShot(input: AnalyzeShotInput): Promise<AnalyzeShotOutput> {
  return analyzeShotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeShotPrompt',
  input: {schema: AnalyzeShotInputSchema},
  output: {schema: AnalyzeShotOutputSchema},
  prompt: `You are an elite basketball shooting coach. Your task is to analyze the provided video of a player's jump shot and provide structured, actionable feedback on their form.

  Analyze the following key components of the shot:
  1.  **Feet/Base**: Are their feet pointed towards the basket? Is their base balanced and shoulder-width apart?
  2.  **Elbow Alignment**: Is their shooting elbow tucked in and aligned with the basket, forming an 'L' shape?
  3.  **Follow-Through**: Do they hold their follow-through, with their wrist flopped over like they're reaching into a cookie jar?

  Based on your analysis, populate the 'analysis' object. For the 'summary', provide a brief, encouraging overview and identify the single most important thing the player should focus on to improve.

  Video to analyze: {{media url=videoDataUri}}`,
});

const analyzeShotFlow = ai.defineFlow(
  {
    name: 'analyzeShotFlow',
    inputSchema: AnalyzeShotInputSchema,
    outputSchema: AnalyzeShotOutputSchema,
  },
  async input => {
    // The model expects the data URI without the metadata prefix.
    const videoData = input.videoDataUri.substring(input.videoDataUri.indexOf(',') + 1);
    const {output} = await prompt({ videoDataUri: videoData });
    return output!;
  }
);
