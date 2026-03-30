import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { content, username, avatar_url } = await req.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const webhookUrl = process.env.DISCORD_REQUEST_WEBHOOK;
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL missing' }, { status: 500 });
    }

    // Default to an anonymous profile if not authenticated
    const finalUsername = username || `Guest_${Math.floor(Math.random() * 10000)}`;
    const finalAvatar = avatar_url || `https://ui-avatars.com/api/?name=${finalUsername}&background=random`;

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content.trim(),
        username: finalUsername,
        avatar_url: finalAvatar,
      }),
    });

    if (!res.ok) {
      console.error("Failed to send webhook:", await res.text());
      return NextResponse.json({ error: 'Failed to send message' }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
