import { NextResponse } from 'next/server';
import { botSettings } from '../../../lib/bot-db.js';

export async function GET() {
    try {
        const settings = await botSettings.get();
        return NextResponse.json({
            success: true,
            settings: settings
        });
    } catch (error) {
        console.error('Error getting bot settings:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, settings } = body;

        if (action === 'toggle') {
            const success = await botSettings.toggleEnabled();
            const newSettings = await botSettings.get();

            return NextResponse.json({
                success: success,
                settings: newSettings,
                message: newSettings.enabled ? 'Bot diaktifkan' : 'Bot dinonaktifkan'
            });
        }

        if (action === 'update' && settings) {
            const success = await botSettings.update(settings);
            const newSettings = await botSettings.get();

            return NextResponse.json({
                success: success,
                settings: newSettings,
                message: 'Settings berhasil diupdate'
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Invalid action'
        }, { status: 400 });

    } catch (error) {
        console.error('Error updating bot settings:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}