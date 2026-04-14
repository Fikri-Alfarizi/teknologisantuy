export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Lazy load bot functions
    const { initializeBot } = await import('../../../lib/bot-functions.js');
    
    // Initialize/start the bot
    const client = await initializeBot();
    
    // Return a safe subset of the client info
    // JSON.stringify fails on the full client due to BigInts and circular refs
    const result = client ? {
      tag: client.user.tag,
      id: client.user.id,
      guilds: client.guilds.cache.size,
      status: 'online'
    } : { status: 'offline' };
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Bot initialization started',
      bot: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Bot start error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
