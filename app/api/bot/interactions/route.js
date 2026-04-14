import { verifyKey, InteractionType, InteractionResponseType } from 'discord-interactions';

export const runtime = 'nodejs';

export async function GET() {
    return new Response('Interactions endpoint is active! 🚀', { status: 200 });
}

export async function POST(request) {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    // Use ArrayBuffer for most reliable raw body reading on Vercel
    const rawBody = await request.arrayBuffer();
    const body = Buffer.from(rawBody);

    if (!signature || !timestamp || !body.length) {
        return new Response('Missing signature or body', { status: 401 });
    }

    const publicKey = process.env.DISCORD_PUBLIC_KEY || 'd8d93e679ad87a4785e45f148a40dc946610157e9d0cd94276430399626e0223';
    if (!publicKey) {
        console.error('❌ DISCORD_PUBLIC_KEY is missing!');
        return new Response('Server configuration error', { status: 500 });
    }

    const isValidRequest = verifyKey(
        body,
        signature,
        timestamp,
        publicKey
    );

    if (!isValidRequest) {
        console.warn('⚠️ Invalid request signature received from Discord. Check if DISCORD_PUBLIC_KEY matches.');
        return new Response('Bad request signature', { status: 401 });
    }

    const interaction = JSON.parse(body.toString());

    // Handle PING from Discord to verify interaction endpoint
    if (interaction.type === InteractionType.PING) {
        return new Response(JSON.stringify({ type: InteractionResponseType.PONG }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Handle Commands
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        const { name } = interaction.data;

        try {
            // Lazy load registry
            const { commands } = await import('../../../../bot/src/commands/registry.js');
            const command = commands.find(c => c.data.name === name);

            if (!command) {
                return new Response(JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: "❌ Command tidak ditemukan di Vercel instance." }
                }), { headers: { 'Content-Type': 'application/json' } });
            }

            // Mock Interaction Object to support discord.js syntax
            let responsePayload = { content: "⌛ Memproses..." };
            let hasReplied = false;

            const mockInteraction = {
                id: interaction.id,
                token: interaction.token,
                applicationId: interaction.application_id,
                type: interaction.type,
                user: interaction.member?.user || interaction.user,
                member: interaction.member,
                guildId: interaction.guild_id,
                channelId: interaction.channel_id,
                client: {
                    user: { tag: 'SantuyBot', id: interaction.application_id },
                    ws: { ping: 0 }
                },
                options: {
                    getString: (n) => interaction.data.options?.find(o => o.name === n)?.value,
                    getInteger: (n) => interaction.data.options?.find(o => o.name === n)?.value,
                    getBoolean: (n) => interaction.data.options?.find(o => o.name === n)?.value,
                    getUser: (n) => {
                        const id = interaction.data.options?.find(o => o.name === n)?.value;
                        return interaction.data.resolved?.users?.[id];
                    },
                    getMember: (n) => {
                        const id = interaction.data.options?.find(o => o.name === n)?.value;
                        return interaction.data.resolved?.members?.[id];
                    },
                    getRole: (n) => {
                        const id = interaction.data.options?.find(o => o.name === n)?.value;
                        return interaction.data.resolved?.roles?.[id];
                    },
                },
                reply: async (data) => {
                    responsePayload = typeof data === 'string' ? { content: data } : data;
                    hasReplied = true;
                },
                editReply: async (data) => {
                    responsePayload = typeof data === 'string' ? { content: data } : data;
                    hasReplied = true;
                },
                followUp: async (data) => {
                    // FollowUp would need real Discord API call via webhook, 
                    // but for sync response we just update payload
                    responsePayload = typeof data === 'string' ? { content: data } : data;
                },
                deferReply: async () => {
                    // Not easily supported in one-shot sync response without webhook
                    // We'll just ignore and wait for the real reply
                }
            };

            // Process command
            await command.execute(mockInteraction);

            // Clean up embeds and other discord.js specific objects
            if (responsePayload.embeds) {
                responsePayload.embeds = responsePayload.embeds.map(e => e.toJSON ? e.toJSON() : e);
            }

            return new Response(JSON.stringify({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: responsePayload
            }), {
                headers: { 'Content-Type': 'application/json' },
            });

        } catch (error) {
            console.error('Interaction Err:', error);
            return new Response(JSON.stringify({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: `❌ Error: ${error.message}` }
            }), { headers: { 'Content-Type': 'application/json' } });
        }
    }

    return new Response('Unknown interaction type', { status: 400 });
}
