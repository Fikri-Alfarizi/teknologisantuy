export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Lazy load to avoid build-time bundling
    const { botSettings } = await import('../../../lib/bot-db.js');
    
    const settings = await botSettings.get();
    
    return new Response(JSON.stringify({
      success: true,
      settings
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Bot settings GET error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const { botSettings } = await import('../../../lib/bot-db.js');
    const body = await request.json();
    const { action } = body;

    if (action === 'toggle') {
      await botSettings.toggleEnabled();
      const updatedSettings = await botSettings.get();
      
      return new Response(JSON.stringify({
        success: true,
        settings: updatedSettings,
        message: updatedSettings.enabled ? 'Bot diaktifkan' : 'Bot dimatikan'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid action'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Bot settings POST error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
