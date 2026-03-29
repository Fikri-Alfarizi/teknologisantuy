import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { gameId, title, image, link } = body;

    const webhookUrl = process.env.DISCORD_REPORT_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_REPORT_WEBHOOK_URL is not configured.");
      return NextResponse.json({ success: false, error: 'Webhook not configured' }, { status: 500 });
    }

    // Format absolute URL for image if it's relative
    let absoluteImage = image || 'https://teknologisantuy.vercel.app/logo.png';
    if (absoluteImage.startsWith('/')) {
      absoluteImage = `https://teknologisantuy.vercel.app${absoluteImage}`;
    }

    const payload = {
      username: "TechSantuy Monitor",
      avatar_url: "https://teknologisantuy.vercel.app/logo.png",
      content: "<@&1391262973166682121> 🚨 **Ada Laporan Error Baru!**", // Optional ping role, can be empty
      embeds: [
        {
          title: "🚨 LAPORAN LINK GAME MATI/ERROR",
          color: 16711680, // Red
          fields: [
            {
              name: "🎮 Nama Game",
              value: title || 'Unknown',
              inline: false
            },
            {
              name: "🔗 Link Download (Dilaporkan)",
              value: link || 'N/A',
              inline: false
            },
            {
              name: "🆔 Game ID / Message ID",
              value: gameId || 'N/A',
              inline: true
            }
          ],
          thumbnail: {
            url: absoluteImage
          },
          footer: {
            text: "Teknologi Santuy Auto-Report System"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to send webhook:", errorText);
      return NextResponse.json({ success: false, error: 'Failed to send to Discord' }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report System Error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
