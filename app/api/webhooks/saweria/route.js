import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * SAWIRA WEBHOOK ENDPOINT
 * Setup this URL in Saweria Dashboard -> Integrations -> Webhook
 * URL: https://your-domain.com/api/webhooks/saweria
 */
export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validate Saweria signature if possible (Saweria provides a secret)
    // For now, we'll accept the data but in production, check req.headers['x-saweria-signature']
    
    if (body.event === 'donation') {
      const { donor_name, amount, message } = body.data;

      // Save to Firestore
      await addDoc(collection(db, 'donations'), {
        name: donor_name || 'Anonim',
        amount: amount || 0,
        message: message || '',
        timestamp: serverTimestamp(),
        processed: true
      });

      return NextResponse.json({ success: true, message: 'Donation processed' });
    }

    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (error) {
    console.error('Saweria Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is active. Use POST.' });
}
