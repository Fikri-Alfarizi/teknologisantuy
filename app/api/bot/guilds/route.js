export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path');

    if (path === 'server-stats') {
      // Lazy load guild service
      const { guildService } = await import('../../../lib/bot-db.js');
      
      // Get all guilds from Firebase
      const allGuilds = await guildService.getAll();
      
      const stats = {
        totalGuilds: allGuilds.length,
        guilds: allGuilds.map(guild => ({
          id: guild.id,
          name: guild.name || 'Unknown',
          memberCount: guild.memberCount || 0,
          prefix: guild.prefix || '!',
          language: guild.language || 'id'
        }))
      };

      return new Response(JSON.stringify({
        success: true,
        data: stats
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid path'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Guilds endpoint error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
