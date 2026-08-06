import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateContentWithRetry(params: {
  model?: string;
  contents: any;
}, maxRetries = 3): Promise<string> {
  let attempt = 0;
  let delay = 1000;

  while (attempt < maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: params.model || 'gemini-2.5-flash',
        contents: params.contents,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      attempt++;
      console.warn(`Gemini API call failed (attempt ${attempt}/${maxRetries}):`, err?.message || err);
      if (attempt >= maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff (1s, 2s, 4s)
    }
  }

  throw new Error('Gemini API call failed after retries.');
}
