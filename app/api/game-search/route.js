import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Inisialisasi Gemini AI untuk spell check / typo correction
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getCorrectedQuery(query) {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-3.1-pro-preview' });
    const prompt = `Berikan tepat 1 nama judul game di Steam yang paling mendekati kata kunci pencarian yang mungkin salah ketik ini: "${query}". Balas HANYA dengan nama judul game-nya saja dalam format teks biasa, tanpa tanda kutip, tanpa penjelasan tambahan. Jika kamu sama sekali tidak tahu, balas "None".`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    if (text.toLowerCase() === 'none') return null;
    return text;
  } catch (error) {
    console.error('Gemini correction error:', error);
    return null;
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type');

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  // Handle Category Search using SteamSpy API
  if (type === 'category') {
    try {
      const spyRes = await fetch(`https://steamspy.com/api.php?request=tag&tag=${encodeURIComponent(query)}`);
      const spyData = await spyRes.json();
      
      let items = Object.values(spyData)
        .sort((a, b) => {
          // Sort by CCU (Concurrent Users) or Positive reviews
          const scoreA = (a.ccu || 0) + (a.positive || 0);
          const scoreB = (b.ccu || 0) + (b.positive || 0);
          return scoreB - scoreA;
        })
        .slice(0, 24)
        .map(game => ({
          id: game.appid,
          name: game.name,
          price: parseInt(game.price || "0") * 16000,
          is_free: game.price === "0",
          large_capsule_image: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`
        }));
        
      return NextResponse.json({ items, corrected: false });
    } catch (err) {
      console.error('SteamSpy API error:', err);
      return NextResponse.json({ items: [] });
    }
  }

  try {
    // 1. Percobaan Pertama: Cari langsung ke Steam
    let res = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`);
    let data = await res.json();
    let items = (data.items || []).filter(item => !item.type || item.type === 'game');
    let isCorrected = false;
    let originalQuery = query;

    // 2. Jika tidak ada hasil (typo), coba panggil Gemini untuk memperbaiki query
    if (items.length === 0 && query.length > 2) {
      const corrected = await getCorrectedQuery(query);
      
      if (corrected && corrected.toLowerCase() !== query.toLowerCase()) {
        const resRetry = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(corrected)}&l=english&cc=US`);
        if (resRetry.ok) {
          const dataRetry = await resRetry.json();
          const filteredItems = (dataRetry.items || []).filter(item => !item.type || item.type === 'game');
          if (filteredItems.length > 0) {
            items = filteredItems;
            isCorrected = true;
          }
        }
      }
    }

    return NextResponse.json({ 
      items, 
      corrected: isCorrected, 
      originalQuery: isCorrected ? originalQuery : null 
    });
  } catch (error) {
    console.error('Error in Steam Game Search API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
