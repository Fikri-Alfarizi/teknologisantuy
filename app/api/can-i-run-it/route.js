import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const { appId, gameName, pcSpecs } = body;

    if (!appId || !pcSpecs) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Fetch PC requirements from Steam
    const steamRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`);
    const steamData = await steamRes.json();

    const gameDetails = steamData[appId]?.data;
    if (!gameDetails || !gameDetails.pc_requirements) {
      return NextResponse.json({ 
        canRun: 'UNKNOWN',
        message: 'System requirements not found on Steam.' 
      });
    }

    const minReq = gameDetails.pc_requirements.minimum || 'Not specified';
    const recReq = gameDetails.pc_requirements.recommended || 'Not specified';

    const prompt = `
You are an expert PC hardware analyst. 
Determine if the following user's PC specifications can run the game "${gameName}".

Game Minimum Requirements (HTML): 
${minReq}

Game Recommended Requirements (HTML):
${recReq}

User's PC Specifications:
${pcSpecs}

Analyze carefully. Compare the user's CPU, GPU, and RAM to the minimum requirements.
Respond EXACTLY in this JSON format:
{
  "canRun": "YES" | "NO" | "MAYBE",
  "message": "A short, engaging 1-2 sentence explanation in Indonesian. e.g. 'Wah, RAM kamu kurang nih untuk main game ini, bakal patah-patah!' or 'Aman banget Bos! PC kamu kuat rata kanan!'"
}
Do not return markdown, just the JSON.
`;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Strip markdown formatting if Gemini mistakenly included it
    if (text.startsWith('```json')) text = text.replace('```json', '').replace('```', '').trim();
    if (text.startsWith('```')) text = text.replace('```', '').replace('```', '').trim();

    const parsed = JSON.parse(text);

    return NextResponse.json({ 
      canRun: parsed.canRun, 
      message: parsed.message 
    });

  } catch (err) {
    console.error('Can I Run It Error:', err);
    return NextResponse.json({ error: 'Failed to analyze specs' }, { status: 500 });
  }
}
