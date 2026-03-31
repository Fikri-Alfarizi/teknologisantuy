import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const discordId = searchParams.get('discordId');

  if (!discordId) {
    return NextResponse.json({ error: 'Missing Discord ID' }, { status: 400 });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || 'https://botsantuytl-production-8d3d.up.railway.app';
    const fetchUrl = `${apiUrl}/api/user-stats/${discordId}`;
    console.log(`[BotSyncAPI] Fetching from ${fetchUrl}`);

    // Call Railway Bot API
    const res = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 0 } // no-cache
    });

    if (!res.ok) {
      console.error(`[BotSyncAPI] Failed fetching from Railway. Status: ${res.status}`);
      return NextResponse.json({ error: 'Failed to fetch bot data' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[BotSyncAPI] Exception:', error.message);
    return NextResponse.json({ error: 'Server bridge error' }, { status: 500 });
  }
}
