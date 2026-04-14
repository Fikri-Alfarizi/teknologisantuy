import './config/env.js';
import client from './config/discord.js';
import { loadCommands } from './commands/index.js';
import { loadEvents } from './events/index.js';
import { startPresence } from './utils/presence.js';
import gameService from './services/game.service.js';
// Import Firebase database
import { botSettings } from './db/firebase-db.js';

// Global flag to prevent multiple initializations
let isInitialized = false;

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
        console.log('✅ Bot initialization complete');

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

        const client = await initializeBot();
        if (!client) {
            return { success: false, reason: 'bot_not_initialized', task: taskName };
        }

        switch (taskName) {
            case 'news':
                const { checkAndPostNews } = await import('./services/news.service.js');
                await checkAndPostNews(client);
                break;

            case 'passive-income':
                const { distributePassiveIncome } = await import('./cron/passiveIncome.js');
                await distributePassiveIncome(client);
                break;

            case 'daily-alarm':
                const { sendDailyAlarm } = await import('./cron/dailyAlarm.js');
                await sendDailyAlarm(client);
                break;

            case 'autochat-morning':
                const { runAutoChat: runAutoChatMorning } = await import('./services/autochat.service.js');
                await runAutoChatMorning(client, 'Pagi');
                break;

            case 'autochat-noon':
                const { runAutoChat: runAutoChatNoon } = await import('./services/autochat.service.js');
                await runAutoChatNoon(client, 'Siang');
                break;

            case 'autochat-afternoon':
                const { runAutoChat: runAutoChatAfternoon } = await import('./services/autochat.service.js');
                await runAutoChatAfternoon(client, 'Sore');
                break;

            case 'autochat-evening':
                const { runAutoChat: runAutoChatEvening } = await import('./services/autochat.service.js');
                await runAutoChatEvening(client, 'Malam');
                break;

            case 'game-sync':
                await gameService.syncAllGuilds(client);
                break;

            default:
                throw new Error(`Unknown task: ${taskName}`);
        }

        console.log(`✅ Scheduled task '${taskName}' completed successfully`);
        return { success: true, task: taskName };

    } catch (error) {
        console.error(`❌ Scheduled task '${taskName}' failed:`, error);
        throw error;
    }
}

// For local development
if (process.env.NODE_ENV !== 'production' || process.argv[2] === 'local') {
    initializeBot().catch(console.error);
}

export default initializeBot;