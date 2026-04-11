import { NextResponse } from 'next/server';
import { runScheduledTask } from '../../../lib/bot-functions.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const task = searchParams.get('task');

    if (!task) {
        return NextResponse.json({ error: 'Task parameter required' }, { status: 400 });
    }

    try {
        const result = await runScheduledTask(task);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Cron job failed:', error);
        return NextResponse.json({
            error: error.message,
            task
        }, { status: 500 });
    }
}