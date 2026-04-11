import { NextResponse } from 'next/server';

// Function to generate random string
function generateRandomString(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to generate random domain-like string
function generateRandomDomain() {
    const prefixes = ['api', 'bot', 'service', 'web', 'app', 'data', 'system', 'core'];
    const suffixes = ['hub', 'center', 'node', 'server', 'gate', 'portal', 'link', 'net'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const random = generateRandomString(4);

    return `${prefix}-${random}-${suffix}`;
}

// Cache for daily URLs
let dailyUrls = [];
let lastGenerated = 0;

function generateDailyUrls() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Generate new URLs if it's been more than a day or first time
    if (now - lastGenerated > oneDay || dailyUrls.length === 0) {
        dailyUrls = [];
        for (let i = 0; i < 100; i++) {
            dailyUrls.push(generateRandomDomain());
        }
        lastGenerated = now;
        console.log('Generated new daily URLs:', dailyUrls.length);
    }

    return dailyUrls;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';

    try {
        const urls = generateDailyUrls();

        if (action === 'list') {
            return NextResponse.json({
                urls,
                count: urls.length,
                generated_at: new Date(lastGenerated).toISOString(),
                expires_at: new Date(lastGenerated + 24 * 60 * 60 * 1000).toISOString()
            });
        }

        if (action === 'random') {
            const randomUrl = urls[Math.floor(Math.random() * urls.length)];
            return NextResponse.json({
                url: randomUrl,
                index: urls.indexOf(randomUrl),
                total: urls.length
            });
        }

        if (action === 'validate') {
            const url = searchParams.get('url');
            if (!url) {
                return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
            }

            const isValid = urls.includes(url);
            return NextResponse.json({
                url,
                valid: isValid,
                expires_at: new Date(lastGenerated + 24 * 60 * 60 * 1000).toISOString()
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Secret URL API error:', error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'regenerate') {
            // Force regenerate URLs (admin only)
            dailyUrls = [];
            lastGenerated = 0;
            const newUrls = generateDailyUrls();

            return NextResponse.json({
                message: 'URLs regenerated',
                count: newUrls.length,
                generated_at: new Date(lastGenerated).toISOString()
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Secret URL API error:', error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}