export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Lazy load bot functions
    const { initializeBot } = await import('../../../lib/bot-functions.js');
    
    // Initialize/start the bot
    const result = await initializeBot();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Bot initialization started',
      result
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
