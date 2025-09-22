import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || '',
});

export async function generateDescription({ prompt }: { prompt: string }) {
  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response.text) {
      return console.error('Error response from Google GenAI:');
    }

    const text = response?.text?.trim() || null;

    return text;
  } catch (error) {
    console.error('Error generating description:', error);
    return null;
  }
}
