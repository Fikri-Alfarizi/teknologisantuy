import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { fetchBloggerPosts } from '@/lib/blogger';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Cache site data for 5 minutes
let cachedSiteData = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchDiscordGames() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(
      'https://discord.com/api/v10/channels/1391274558514004019/messages?limit=100',
      { headers: { Authorization: `Bot ${token.replace(/"/g, '')}` } }
    );
    if (!res.ok) return [];
    const messages = await res.json();
    return messages.map(msg => {
      const content = msg.content;
      const gameMatch = content.match(/GAME\s*:\s*(.+)/i);
      const sizeMatch = content.match(/SIZE\s*:\s*(.+)/i);
      const passMatch = content.match(/PASSWORD\s*:\s*(.+)/i);
      const linkMatch = content.match(/https?:\/\/[^\s]+/i);
      if (!gameMatch) return null;
      return {
        title: gameMatch[1].trim(),
        size: sizeMatch ? sizeMatch[1].trim() : 'N/A',
        password: passMatch ? passMatch[1].trim() : '-',
        link: linkMatch ? linkMatch[0].trim() : '#',
      };
    }).filter(Boolean);
  } catch { return []; }
}

async function getSiteData() {
  const now = Date.now();
  if (cachedSiteData && (now - cacheTime) < CACHE_DURATION) return cachedSiteData;

  // Add 3-second timeout for external API calls to prevent hanging
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000));
  
  try {
    const [games, blogPosts] = await Promise.race([
      Promise.all([
        fetchDiscordGames().catch(() => []),
        fetchBloggerPosts().catch(() => [])
      ]),
      timeoutPromise
    ]);
    cachedSiteData = { games, blogPosts };
    cacheTime = now;
    return cachedSiteData;
  } catch (err) {
    console.warn("Site data fetch timed out or failed, using empty context");
    return { games: [], blogPosts: [] };
  }
}

function buildSiteContext(siteData) {
  let ctx = '';
  if (siteData.games.length > 0) {
    ctx += '\n\n== DAFTAR GAME (Discord) ==\n';
    siteData.games.forEach((g, i) => {
      ctx += `${i + 1}. ${g.title} | Pwd: ${g.password} | Lnk: ${g.link}\n`;
    });
  }
  if (siteData.blogPosts.length > 0) {
    ctx += '\n\n== ARTIKEL BLOG ==\n';
    siteData.blogPosts.forEach((p, i) => {
      ctx += `${i + 1}. [${p.cat}] ${p.title}\n`;
    });
  }
  return ctx;
}

export async function POST(request) {
  try {
    const { message, stepContext, history, model, image } = await request.json();

    if (!message && !image) {
      return NextResponse.json({ error: 'Message or Image is required' }, { status: 400 });
    }

    const siteData = await getSiteData();
    const siteContext = buildSiteContext(siteData);

    const systemPrompt = `Kamu adalah asisten AI resmi Teknologi Santuy.
- Jawab santai, jelas, Bahasa Indonesia.
- Jangan ulangi info yang sudah diberikan di riwayat.
- Gunakan database game/blog di bawah untuk menjawab pertanyaan relevan.
- Berikan PASSWORD game jika ditanya dan ada di database.
- Jika ada gambar (image data), analisis gambar tersebut (biasanya itu screenshot error atau bukti instalasi).
- Gunakan markdown (**bold**, - list).

KONTEKS TUTORIAL: ${stepContext || 'Umum'}
${siteContext}
RIWAYAT: ${(history || []).map(m => `${m.role}: ${m.text}`).join('\n')}
`;

    const selectedModel = 'gemini-3-flash-preview';
    
    // Prepare parts for multimodal
    const parts = [{ text: systemPrompt + "\n\nPertanyaan User: " + message }];
    
    if (image) {
      parts.push(image);
    }

    // Using the user-specified ai.models.generateContent pattern
    const data = await ai.models.generateContent({
      model: selectedModel,
      contents: [{ role: 'user', parts }]
    });

    const reply = data.text || 'Maaf, saya tidak bisa memproses permintaan Anda saat ini.';
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('DEBUG: Gemini route error details:', error);
    // Return specific error message if available
    const errorMsg = error?.message || 'Gagal menghubungi Gemini AI';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
