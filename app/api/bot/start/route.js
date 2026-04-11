import { NextResponse } from 'next/server';
import { initializeBot } from '../../../bot/src/vercel-bot.js';

// Global variable to track if bot is running
let botStarted = false;
let botClient = null;

export async function GET() {
    try {
        if (botStarted && botClient) {
            return NextResponse.json({
                status: 'running',
                message: 'Bot is already running',
                uptime: process.uptime()
            });
        }

        // Initialize the bot for Vercel
        botClient = await initializeBot();
        botStarted = true;

        return NextResponse.json({
            status: 'started',
            message: 'Bot initialization completed successfully',
            client_id: botClient.user.id,
            username: botClient.user.username
        });

    } catch (error) {
        console.error('Failed to start bot:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}