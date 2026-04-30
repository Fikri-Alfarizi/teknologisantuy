import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to');
  const name = searchParams.get('name');

  if (!to || !name) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  // Get base URL to construct the absolute destination URL
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  const targetUrl = `${baseUrl}/download?to=${encodeURIComponent(to)}&name=${encodeURIComponent(name)}`;
  
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
