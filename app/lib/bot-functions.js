import { botSettings } from './bot-db.js';

// Global flag to prevent multiple initializations
let isInitialized = false;
let client = null;

export async function initializeBot() {
    if (isInitialized) {
        console.log('Bot already initialized');
        return client;
    }

    try {
        // Check if bot is enabled
        const settings = await botSettings.get();
        if (!settings.enabled) {
            console.log('Bot is disabled in settings');
            return null;
        }

        console.log('Initializing SantuyTL Discord Bot for Vercel...');

        // Dynamic imports to avoid bundling issues
        const { default: discordClient } = await import('../../bot/src/config/discord.js');
        const { loadCommands } = await import('../../bot/src/commands/index.js');
        const { loadEvents } = await import('../../bot/src/events/index.js');
        const { startPresence } = await import('../../bot/src/utils/presence.js');
        const { default: gameService } = await import('../../bot/src/services/game.service.js');

        client = discordClient;

        // Load commands and events
        await loadCommands(client);
        await loadEvents(client);

        // Login to Discord
        await client.login(process.env.DISCORD_BOT_TOKEN);

        // Wait for ready event
        await new Promise((resolve) => {
            client.once('ready', () => {
                console.log(`🔥 Bot is ready! Logged in as ${client.user.tag}`);
                resolve();
            });
        });

        // Start rotating presence
        startPresence(client);

        // Sync game cache
        await gameService.syncAllGuilds(client);

        isInitialized = true;
        return client;

    } catch (error) {
        console.error('❌ Failed to initialize bot:', error);
        throw error;
    }
}

export async function runScheduledTask(taskName) {
    try {
        // Check if bot is enabled
        const settings = await botSettings.get();
        if (!settings.enabled) {
            console.log('Bot is disabled, skipping scheduled task:', taskName);
            return { success: false, reason: 'bot_disabled', task: taskName };
        }

        const botClient = await initializeBot();
        if (!botClient) {
            return { success: false, reason: 'bot_not_initialized', task: taskName };
        }

        switch (taskName) {
            case 'news':
                const { checkAndPostNews } = await import('../../bot/src/services/news.service.js');
                await checkAndPostNews(botClient);
                break;

            case 'passive-income':
                const { distributePassiveIncome } = await import('../../bot/src/cron/passiveIncome.js');
                await distributePassiveIncome(botClient);
                break;

            case 'daily-alarm':
                const { sendDailyAlarm } = await import('../../bot/src/cron/dailyAlarm.js');
                await sendDailyAlarm(botClient);
                break;

            case 'autochat-morning':
                const { runAutoChat: runAutoChatMorning } = await import('../../bot/src/services/autochat.service.js');
                await runAutoChatMorning(botClient, 'Pagi');
                break;

            case 'autochat-noon':
                const { runAutoChat: runAutoChatNoon } = await import('../../bot/src/services/autochat.service.js');
                await runAutoChatNoon(botClient, 'Siang');
                break;

            case 'autochat-afternoon':
                const { runAutoChat: runAutoChatAfternoon } = await import('../../bot/src/services/autochat.service.js');
                await runAutoChatAfternoon(botClient, 'Sore');
                break;

            case 'autochat-evening':
                const { runAutoChat: runAutoChatEvening } = await import('../../bot/src/services/autochat.service.js');
                await runAutoChatEvening(botClient, 'Malam');
                break;

            case 'game-sync':
                const { default: gameSvc } = await import('../../bot/src/services/game.service.js');
                await gameSvc.syncAllGuilds(botClient);
                break;

            default:
                return { success: false, reason: 'unknown_task', task: taskName };
        }

        return { success: true, task: taskName };

    } catch (error) {
        console.error('❌ Scheduled task failed:', error);
        return { success: false, error: error.message, task: taskName };
    }
}