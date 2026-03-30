import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const appid = searchParams.get('appid');

  if (!appid) {
    return NextResponse.json({ error: 'appid is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&l=english&cc=ID`, {
      next: { revalidate: 21600 } // Cache for 6 hours
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch game details' }, { status: res.status });
    }

    const data = await res.json();
    
    if (!data[appid] || !data[appid].success) {
      return NextResponse.json({ error: 'Game not found or invalid' }, { status: 404 });
    }

    return NextResponse.json(data[appid].data);
  } catch (error) {
    console.error('Error fetching Steam details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
