
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MediaPart } from 'genkit';

const GenerateImageSchema = z.object({
  prompt: z.string(),
});

export type GenerateImageInput = z.infer<typeof GenerateImageSchema>;

export const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageSchema,
    outputSchema: z.object({ media: z.string() }),
  },
  async ({ prompt }) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-2.0-fast-generate-001',
      prompt: prompt,
    });

    if (!media) {
      throw new Error('No media returned from image generation model.');
    }

    return { media: media.url };
  }
);

export async function generateImage(prompt: string): Promise<{ media: string }> {
  return generateImageFlow({ prompt });
}
