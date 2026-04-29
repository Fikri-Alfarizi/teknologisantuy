import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const data = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview', // User's original model
      contents: 'Halo'
    });
    console.log('Success (3.1-flash-lite):', data.text);
  } catch (err) {
    console.error('Error (3.1-flash-lite):', err.message);
  }

  try {
    const data2 = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // What I changed it to
      contents: 'Halo'
    });
    console.log('Success (1.5-flash):', data2.text);
  } catch (err) {
    console.error('Error (1.5-flash):', err.message);
  }

  try {
    const data3 = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // The one from the docs they pasted
      contents: 'Halo'
    });
    console.log('Success (3-flash-preview):', data3.text);
  } catch (err) {
    console.error('Error (3-flash-preview):', err.message);
  }
}
test();
