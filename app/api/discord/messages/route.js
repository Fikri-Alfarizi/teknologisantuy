import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent static caching
export const revalidate = 0; // Immediate refresh

export async function GET() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = '1385912786395336875';

  if (!token) {
    return NextResponse.json({ error: 'Discord Bot Token missing' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=50`, {
      headers: {
        Authorization: `Bot ${token.replace(/"/g, '')}`,
      },
      next: { revalidate: 3 } // Very short cache to support 3-second polling
    });

    if (!res.ok) {
      console.error('Failed to fetch Discord messages:', await res.text());
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: res.status });
    }

    const messages = await res.json();
    
    // Reverse messages to show oldest to newest (like a chat app)
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      author: {
        username: msg.author.username,
        avatar: msg.author.avatar 
          ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
          : 'https://cdn.discordapp.com/embed/avatars/0.png',
        bot: msg.author.bot
      },
      timestamp: msg.timestamp,
      attachments: msg.attachments.map(att => ({
        url: att.url,
        type: att.content_type,
        name: att.filename
      }))
    })).reverse();

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching discord messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
