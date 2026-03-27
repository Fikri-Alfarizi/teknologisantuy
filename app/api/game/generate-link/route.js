import { NextResponse } from 'next/server';

// Encode game ID into a random-looking token
function encodeGameId(gameId) {
  const salt = Array.from({ length: 8 }, () =>
    Math.random().toString(36).charAt(2)
  ).join('');
  const encoded = Buffer.from(`${salt}::${gameId}::${Date.now()}`).toString('base64url');
  return encoded;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('id');

  if (!gameId) {
    return NextResponse.json({ error: 'Game ID required' }, { status: 400 });
  }

  const token = encodeGameId(gameId);
  return NextResponse.json({ token, url: `/artikel/${token}` });
}
