import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('vercel')
    .setDescription('Cek status bot di mesin Vercel (Owner Only)');

export async function execute(interaction) {
    // Only allow server owner or bot owner
    if (interaction.user.id !== interaction.guild.ownerId && !interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: '❌ Anda tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
    }

    // Check if we are running in the Vercel environment
    const isVercel = process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV;
    
    const sent = await interaction.reply({ 
        content: `🔍 **Mengecek status instance...** (${isVercel ? 'Mode Vercel' : 'Mode Standby/Railway'})`, 
        fetchReply: true 
    });

    const embed = {
        color: isVercel ? 0x000000 : 0x007bff,
        title: isVercel ? '▲ VERCEL INSTANCE ACTIVE' : '🚂 RAILWAY/STANDBY INSTANCE',
        description: isVercel 
            ? 'Menyala abangku! Bot ini merespon langsung dari **Vercel Serverless Function**.' 
            : 'Bot ini berjalan di **Railway / Local Machine**. Instance Vercel mungkin sedang tertidur atau perintah "dicuri" oleh koneksi ini.',
        fields: [
            { name: 'Environment', value: `\`${isVercel ? (process.env.NEXT_PUBLIC_VERCEL_ENV || 'production') : 'Railway/Local'}\``, inline: true },
            { name: 'Region', value: `\`${process.env.VERCEL_REGION || 'Global'}\``, inline: true },
            { name: 'Memory DB', value: `\`${process.env.VERCEL ? 'Active' : 'N/A'}\``, inline: true }
        ],
        author: {
            name: interaction.client.user.username,
            icon_url: interaction.client.user.displayAvatarURL()
        },
        footer: { text: `Diagnostic Tools • ${new Date().toLocaleString('id-ID')}` },
    };

    await interaction.editReply({ content: '', embeds: [embed] });
}
