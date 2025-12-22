
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize the genkit AI model with the Google AI plugin.
// This allows you to use models like Gemini and Imagen.
export const ai = genkit({
  plugins: [
    // The googleAI plugin is required to use Google's generative models.
    googleAI(),
  ],
});
