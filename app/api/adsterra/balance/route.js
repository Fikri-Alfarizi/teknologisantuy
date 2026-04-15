import { NextResponse } from 'next/server';

const ADSTERRA_API_URL = process.env.ADSTERRA_API_BASE_URL || 'https://api.adsterra.com/v3/balance';

export async function GET() {
  const apiKey = process.env.ADSTERRA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ADSTERRA_API_KEY environment variable is not configured.' }, { status: 400 });
  }

  try {
    const response = await fetch(ADSTERRA_API_URL, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json'
      },
      next: { revalidate: 0 }
    });

    const payloadText = await response.text();
    let payload;
    try {
      payload = payloadText ? JSON.parse(payloadText) : null;
    } catch (error) {
      payload = { raw: payloadText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Adsterra balance', status: response.status, data: payload },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    console.error('Adsterra balance fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error while fetching Adsterra balance.' }, { status: 500 });
  }
}
