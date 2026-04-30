import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { gameId, gameTitle } = await req.json();

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID required' }, { status: 400 });
    }

    await addDoc(collection(db, 'broken_links'), {
      gameId,
      gameTitle,
      reportedAt: serverTimestamp(),
      status: 'pending' // pending, fixing, fixed
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reporting link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
