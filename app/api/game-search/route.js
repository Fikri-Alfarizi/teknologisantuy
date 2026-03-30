import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    const res = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`);
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Steam' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ items: data.items || [] });
  } catch (error) {
    console.error('Error in Steam Game Search API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
