import { NextResponse } from 'next/server';
import client from '../../../bot/src/config/discord.js';

async function getGuild(searchParams) {
    const guild_id = searchParams.get('guild_id');
    if (guild_id) {
        return await client.guilds.fetch(guild_id);
    }
    return process.env.DISCORD_GUILD_ID ? await client.guilds.fetch(process.env.DISCORD_GUILD_ID) : client.guilds.cache.first();
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || 'guilds';

    try {
        if (path === 'guilds') {
            const guilds = client.guilds.cache.map(guild => ({
                id: guild.id,
                name: guild.name,
                icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
                memberCount: guild.memberCount,
                ownerId: guild.ownerId
            }));
            return NextResponse.json({ guilds });
        }

        if (path === 'server-stats') {
            const guild = await getGuild(searchParams);
            if (!guild) return NextResponse.json({ error: 'No guild found' }, { status: 404 });

            await guild.members.fetch();
            const onlineCount = guild.members.cache.filter(member =>
                ['online', 'idle', 'dnd'].includes(member.presence?.status)
            ).size;

            await guild.channels.fetch();
            await guild.roles.fetch();

            return NextResponse.json({
                guild_id: guild.id,
                guild_name: guild.name,
                guild_icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
                member_count: guild.memberCount,
                online_count: onlineCount,
                boost_level: guild.premiumTier,
                boost_count: guild.premiumSubscriptionCount || 0,
                channel_count: guild.channels.cache.size,
                role_count: guild.roles.cache.size,
                created_at: guild.createdAt.toISOString()
            });
        }

        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });

    } catch (err) {
        console.error('Bot API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}