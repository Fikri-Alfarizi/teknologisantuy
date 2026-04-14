import { verifyKey, InteractionType, InteractionResponseType } from 'discord-interactions';

export const runtime = 'nodejs';

// Hardcoded fallback for reliability
const PUBLIC_KEY = 'd8d93e679ad87a4785e45f148a40dc946610157e9d0cd94276430399626e0223';

export async function GET() {
    return new Response('Interactions endpoint is active! 🚀', { status: 200 });
}

export async function POST(request) {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    
    // Read raw body
    const bodyText = await request.text();

    if (!signature || !timestamp || !bodyText) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Verify signature as fast as possible
    const isValidRequest = verifyKey(
        bodyText,
        signature,
        timestamp,
        process.env.DISCORD_PUBLIC_KEY || PUBLIC_KEY
    );

    if (!isValidRequest) {
        return new Response('Invalid request signature', { status: 401 });
    }

    const interaction = JSON.parse(bodyText);

    // ⚡ PRIORITY 1: Handle PING (Must be extremely fast for Discord verification)
    if (interaction.type === InteractionType.PING) {
        return new Response(JSON.stringify({ type: InteractionResponseType.PONG }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    }

    // ⚡ PRIORITY 2: Handle Commands
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        const { name } = interaction.data;

        try {
            // Lazy load registry ONLY when a command is actually called
            const { commands } = await import('../../../../bot/src/commands/registry.js');
            const command = commands.find(c => c.data.name === name);

            if (!command) {
                return new Response(JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: "❌ Command not found on Vercel." }
                }), { headers: { 'Content-Type': 'application/json' } });
            }

            let responseData = { content: "⌛..." };
            const mockInteraction = {
                user: interaction.member?.user || interaction.user,
                member: interaction.member,
                guildId: interaction.guild_id,
                options: {
                    getString: (n) => interaction.data.options?.find(o => o.name === n)?.value,
                    getInteger: (n) => interaction.data.options?.find(o => o.name === n)?.value,
                    getBoolean: (n) => interaction.data.options?.find(o => o.name === n)?.value,
                    getUser: (n) => {
                        const id = interaction.data.options?.find(o => o.name === n)?.value;
                        return interaction.data.resolved?.users?.[id];
                    },
                },
                reply: async (data) => {
                    responseData = typeof data === 'string' ? { content: data } : data;
                },
                editReply: async (data) => {
                    responseData = typeof data === 'string' ? { content: data } : data;
                }
            };

            await command.execute(mockInteraction);

            // Serialize embeds if any
            if (responseData.embeds) {
                responseData.embeds = responseData.embeds.map(e => e.toJSON ? e.toJSON() : e);
            }

            return new Response(JSON.stringify({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: responseData
            }), { headers: { 'Content-Type': 'application/json' } });

        } catch (error) {
            return new Response(JSON.stringify({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: `❌ Interaction Error: ${error.message}` }
            }), { headers: { 'Content-Type': 'application/json' } });
        }
    }

    return new Response('Unsupported interaction', { status: 400 });
}
