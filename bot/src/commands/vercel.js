import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('vercel')
    .setDescription('Cek status bot di mesin Vercel (Owner Only)');

export async function execute(interaction) {
    // Only allow server owner or bot owner
    // This uses a fast check: user must be an administrator or the server owner.
    // For a stricter check, you can compare interaction.user.id with your specific ID.
    if (interaction.user.id !== interaction.guild.ownerId && !interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: '❌ Anda tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
    }

    // Check if we are running in the Vercel environment
    // Vercel automatically sets process.env.VERCEL = "1"
    const isVercel = process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV;
    
    if (!isVercel) {
        // If this is the Railway instance intercepting the command, it just ignores it silently.
        // This gives the Vercel instance the chance to respond.
        // If Vercel is dead, Discord will say "The application did not respond", proving Vercel is offline.
        return; 
    }

    // Only Vercel instance reaches here
    const sent = await interaction.reply({ content: '🔍 **Mengecek status Vercel...**', fetchReply: true });
    
    const embed = {
        color: 0x000000,
        title: '▲ **VERCEL INSTANCE ACTIVE**',
        description: 'Menyala abangku! Bot ini merespon langsung dari Vercel Serverless Function.',
        fields: [
            { name: 'Environment', value: `\`${process.env.NEXT_PUBLIC_VERCEL_ENV || 'production'}\``, inline: true },
            { name: 'Region', value: `\`${process.env.VERCEL_REGION || 'Unknown Node'}\``, inline: true },
        ],
        author: {
            name: interaction.client.user.username,
            icon_url: interaction.client.user.displayAvatarURL()
        },
        footer: { text: `Vercel Bot Status • ${new Date().toLocaleString('id-ID')}` },
    };

    await interaction.editReply({ content: '', embeds: [embed] });
}
