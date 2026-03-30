import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const res = await fetch('https://store.steampowered.com/api/featuredcategories/?l=english&cc=ID', {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Steam' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Steam featured:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
