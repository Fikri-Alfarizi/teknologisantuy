import { NextResponse } from 'next/server';

const ADSTERRA_BASE_URLS = [
  'https://api3.adsterratools.com/publisher',
  'https://api.adsterra.com/v3/publisher',
  'https://api.adsterra.com/publisher'
];
const BALANCE_ENDPOINTS = [
  '/balance.json',
  '/stats.json',
  '/account.json',
  '/wallet.json',
  '/profile.json',
  '/earnings.json',
  '/publisher.json',
  '/balance',
  '/stats',
  '/account'
];

export async function GET() {
  const apiKey = process.env.ADSTERRA_API_KEY;
  console.log('Adsterra API Key loaded:', apiKey ? 'Yes' : 'No');
  if (!apiKey) {
    return NextResponse.json({ error: 'ADSTERRA_API_KEY environment variable is not configured.' }, { status: 400 });
  }

  let lastError = null;

  for (const baseUrl of ADSTERRA_BASE_URLS) {
    for (const endpoint of BALANCE_ENDPOINTS) {
      try {
        const url = `${baseUrl}${endpoint}`;
        console.log(`Trying Adsterra endpoint: ${url}`);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey,
            'Accept': 'application/json',
            'User-Agent': 'TeknologiSantuy-Dashboard/1.0'
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

        if (response.ok) {
          console.log(`Adsterra balance found at endpoint: ${url}`);
          return NextResponse.json({ success: true, data: payload, endpoint: url });
        }

        // If not found, try next endpoint
        if (response.status === 404) {
          console.log(`Adsterra endpoint ${url} returned 404, trying next...`);
          continue;
        }

        // For other errors, capture and try next
        const errorMessage = payload?.error || payload?.message || payload?.errors?.[0] || payload?.raw || `Adsterra returned HTTP ${response.status}`;
        console.log(`Adsterra endpoint ${url} returned error: ${errorMessage}`);
        lastError = { error: errorMessage, status: response.status, endpoint: url };
        continue;

      } catch (error) {
        console.log(`Network error for ${baseUrl}${endpoint}: ${error?.message || error}`);
        lastError = { error: `Network error for ${baseUrl}${endpoint}: ${error?.message || error}`, endpoint: `${baseUrl}${endpoint}` };
        continue;
      }
    }
  }

  // If all endpoints failed, return the last error
  console.error('All Adsterra balance endpoints failed. Last error:', lastError);
  return NextResponse.json(lastError || { error: 'All Adsterra balance endpoints failed' }, { status: 500 });
}
