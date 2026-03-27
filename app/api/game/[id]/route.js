import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request, { params }) {
  const { id } = await params;
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'Discord bot token not configured' }, { status: 500 });
  }

  try {
    // 1. Fetch override from Firestore first
    const overrideRef = doc(db, 'game_overrides', id);
    const overrideSnap = await getDoc(overrideRef);
    const overrideData = overrideSnap.exists() ? overrideSnap.data() : null;

    // 2. Fetch single message by ID from Discord
    const res = await fetch(
      `https://discord.com/api/v10/channels/1391274558514004019/messages/${id}`,
      {
        headers: { Authorization: `Bot ${token.replace(/"/g, '')}` },
        next: { revalidate: 60 }
      }
    );

    if (!res.ok && !overrideData) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    let game;
    if (res.ok) {
      const msg = await res.json();
      const content = msg.content;

      // Parse game data from message
      const gameMatch = content.match(/GAME\s*:\s*(.+)/i);
      const sizeMatch = content.match(/SIZE\s*:\s*(.+)/i);
      const passMatch = content.match(/PASSWORD\s*:\s*(.+)/i);
      const linkMatch = content.match(/https?:\/\/[^\s]+/i);

      const imageAttachment = msg.attachments?.find(att =>
        att.url && (att.content_type?.startsWith('image/') || att.url.match(/\.(jpeg|jpg|gif|png)$/i))
      );
      const embedImage = msg.embeds?.find(e => e.type === 'image' || e.image || e.thumbnail);
      let imgUrl = '/logo.png';
      if (imageAttachment) imgUrl = imageAttachment.url;
      else if (embedImage) imgUrl = embedImage.image?.url || embedImage.thumbnail?.url || embedImage.url || '/logo.png';
      if (imgUrl === '/logo.png') {
        const rawImgMatch = content.match(/https?:\/\/[^\s]+?\.(png|jpe?g|gif|webp)/i);
        if (rawImgMatch) imgUrl = rawImgMatch[0];
      }

      game = {
        id: msg.id,
        title: gameMatch ? gameMatch[1].trim() : 'Unknown Game',
        size: sizeMatch ? sizeMatch[1].trim() : 'N/A',
        password: passMatch ? passMatch[1].trim() : '-',
        link: linkMatch ? linkMatch[0].trim() : '#',
        image: imgUrl,
        timestamp: new Date(msg.timestamp).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        })
      };
    } else {
      // If discord fails but override exists
      game = { id, ...overrideData, timestamp: new Date().toLocaleDateString('id-ID') };
    }

    // Apply overrides
    if (overrideData) {
      game = { ...game, ...overrideData };
    }

    if (game.title === 'Unknown Game') {
      return NextResponse.json({ error: 'Invalid game data' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json({ error: 'Failed to fetch game data' }, { status: 500 });
  }
}
