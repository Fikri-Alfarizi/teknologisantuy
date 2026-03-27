import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ games: [] });
  }

  try {
    const limit = 100;
    const url = `https://discord.com/api/v10/channels/1391274558514004019/messages?limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${token.replace(/"/g, '')}`
      },
      next: { revalidate: 0 } // No cache for admin
    });
    
    if (!res.ok) return NextResponse.json({ games: [] });
    
    const messages = await res.json();
    if (!messages) return NextResponse.json({ games: [] });
    
    const games = messages.map(msg => {
      const content = msg.content;
      const gameMatch = content.match(/GAME\s*:\s*(.+)/i);
      const sizeMatch = content.match(/SIZE\s*:\s*(.+)/i);
      const passMatch = content.match(/PASSWORD\s*:\s*(.+)/i);
      const linkMatch = content.match(/https?:\/\/[^\s]+/i);
      
      const imageAttachment = msg.attachments.find(att => att.url && (att.content_type?.startsWith('image/') || att.url.match(/\.(jpeg|jpg|gif|png)$/i)));
      const embedImage = msg.embeds ? msg.embeds.find(e => e.type === 'image' || e.image || e.thumbnail) : null;
      let imgUrl = '/logo.png';
      if (imageAttachment) imgUrl = imageAttachment.url;
      else if (embedImage) imgUrl = embedImage.image?.url || embedImage.thumbnail?.url || embedImage.url || '/logo.png';
      
      if (imgUrl === '/logo.png') {
        const rawImgMatch = content.match(/https?:\/\/[^\s]+?\.(png|jpe?g|gif|webp)/i);
        if (rawImgMatch) imgUrl = rawImgMatch[0];
      }

      return {
        id: msg.id,
        title: gameMatch ? gameMatch[1].trim() : 'Unknown Game',
        size: sizeMatch ? sizeMatch[1].trim() : 'N/A',
        password: passMatch ? passMatch[1].trim() : '-',
        link: linkMatch ? linkMatch[0].trim() : '#',
        image: imgUrl,
        timestamp: new Date(msg.timestamp).toISOString()
      };
    }).filter(g => g.title !== 'Unknown Game');
    
    return NextResponse.json({ games });
  } catch(e) {
    console.error("Error fetching admin games:", e);
    return NextResponse.json({ games: [] });
  }
}
