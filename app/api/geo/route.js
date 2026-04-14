export const runtime = 'edge';

export async function GET() {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      headers: {
        'User-Agent': 'TeknologiSantuy/1.0',
      },
    });

    if (!res.ok) {
      return Response.json(
        { ip: 'Unknown', country_name: 'Unknown', city: 'Unknown', country_code: '??' },
        { status: 200 }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { ip: 'Unknown', country_name: 'Unknown', city: 'Unknown', country_code: '??' },
      { status: 200 }
    );
  }
}
