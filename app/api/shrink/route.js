import { NextResponse } from 'next/server';
import { decodeDownloadUrl } from '../../lib/url-obfuscator';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to');
  const name = searchParams.get('name');

  if (!to || !name) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  // Decode the obfuscated URL token to get the actual original download link
  const targetUrl = decodeDownloadUrl(to);

  if (!targetUrl) {
    return new NextResponse('Invalid token', { status: 400 });
  }
  
  // API token must be stored privately in Vercel environment variables
  const apiToken = process.env.SHRINKME_API_TOKEN;
  
  if (!apiToken) {
    console.warn('SHRINKME_API_TOKEN is not configured. Falling back to direct link.');
    return NextResponse.redirect(targetUrl);
  }

  try {
    const shrinkApiUrl = `https://shrinkme.io/api?api=${apiToken}&url=${encodeURIComponent(targetUrl)}&format=text`;
    const response = await fetch(shrinkApiUrl);
    const shortUrl = await response.text();

    if (shortUrl && shortUrl.startsWith('http')) {
      return NextResponse.redirect(shortUrl);
    } else {
      console.error('ShrinkMe API error or invalid response:', shortUrl);
      // Fallback to direct link if API fails
      return NextResponse.redirect(targetUrl);
    }
  } catch (error) {
    console.error('Failed to contact ShrinkMe API:', error);
    // Fallback to direct link if network error
    return NextResponse.redirect(targetUrl);
  }
}
