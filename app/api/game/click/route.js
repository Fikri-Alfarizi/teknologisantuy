import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { gameId, title } = await request.json();

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    const docRef = doc(db, 'game_stats', gameId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        clicks: increment(1),
        last_clicked: new Date().toISOString(),
        title: title || docSnap.data().title // Keep title sync
      });
    } else {
      await setDoc(docRef, {
        clicks: 1,
        last_clicked: new Date().toISOString(),
        title: title || 'Unknown Game'
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
