import { NextResponse } from 'next/server';
import { userService } from '../../../lib/bot-db.js';

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || 'users';

    try {
        if (path === 'users') {
            const { guild_id } = Object.fromEntries(searchParams);
            let guild;
            if (guild_id) {
                guild = await client.guilds.fetch(guild_id).catch(() => null);
            } else {
                guild = client.guilds.cache.first();
            }

            if (!guild) return NextResponse.json({ users: [] });

            await guild.members.fetch();
            const users = guild.members.cache
                .filter(member => !member.user.bot)
                .map(member => ({
                    id: member.user.id,
                    username: member.user.username,
                    discriminator: member.user.discriminator
                }));

            return NextResponse.json({ users });
        }

        if (path === 'user-stats') {
            const guild = client.guilds.cache.first();
            if (!guild) return NextResponse.json({ error: 'Guild not found' }, { status: 404 });

            await guild.members.fetch();
            const totalUsers = guild.members.cache.filter(m => !m.user.bot).size;
            const onlineUsers = guild.members.cache.filter(m =>
                !m.user.bot && ['online', 'idle', 'dnd'].includes(m.presence?.status)
            ).size;

            return NextResponse.json({
                total_users: totalUsers,
                online_users: onlineUsers,
                bot_users: guild.members.cache.filter(m => m.user.bot).size
            });
        }

        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });

    } catch (err) {
        console.error('Bot API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}