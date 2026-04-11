import { NextResponse } from 'next/server';

// Lazy load bot functions to avoid build-time module resolution
async function runTask(taskName) {
    try {
        const { runScheduledTask } = await import('../../../lib/bot-functions.js');
        return await runScheduledTask(taskName);
    } catch (error) {
        console.error('Task execution failed:', error);
        return { success: false, error: error.message, task: taskName };
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const task = searchParams.get('task');

    if (!task) {
        return NextResponse.json({ error: 'Task parameter required' }, { status: 400 });
    }

    const result = await runTask(task);
    return NextResponse.json(result);
}