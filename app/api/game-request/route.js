import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';

/**
 * Mendapatkan IP Client secara aman (Kompatibel Vercel)
 */
function getClientIp(headersList) {
  // Urutan prioritas header IP di Vercel/Next.js
  const xRealIp = headersList.get('x-real-ip');
  const xForwardedFor = headersList.get('x-forwarded-for');
  
  if (xRealIp) return xRealIp.trim();
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  return 'unknown-ip';
}

/**
 * GET: Cek status limit user berdasarkan IP
 */
export async function GET(req) {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  
  console.log(`[DEBUG] GET Request Limit Check - IP: ${ip}`);

  try {
    const logRef = doc(db, 'request_logs', ip);
    const logSnap = await getDoc(logRef);
    
    if (!logSnap.exists()) {
      return NextResponse.json({ allowed: true, count: 0, ip });
    }

    const data = logSnap.data();
    return NextResponse.json({ 
      allowed: true, 
      count: data.totalRequests || 0,
      ip
    });
  } catch (error) {
    console.error('[ERROR] Failure checking request limit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST: Proses request game (Simpan ke Firestore + Kirim ke Discord)
 */
export async function POST(req) {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const { game, user } = await req.json();

  console.log(`[DEBUG] POST Game Request Incoming - IP: ${ip}`);

  if (!game) {
    return NextResponse.json({ error: 'Game data is required' }, { status: 400 });
  }

  try {
    const logRef = doc(db, 'request_logs', ip);
    const logSnap = await getDoc(logRef);
    
    let currentCount = 0;
    let uids = [];

    if (logSnap.exists()) {
      const data = logSnap.data();
      currentCount = data.totalRequests || 0;
      uids = data.uids || [];
    }

    // Logic Validasi Limit di Server (HARD LOCK)
    const isLoggedIn = !!user?.uid;
    const maxLimitForThisUser = isLoggedIn ? 2 : 1;

    console.log(`[DEBUG] Validating Limit - IP: ${ip}, Count: ${currentCount}, LoggedIn: ${isLoggedIn}, MaxLimit: ${maxLimitForThisUser}`);

    if (currentCount >= maxLimitForThisUser) {
      console.warn(`[LIMIT] Rejected spam request from IP: ${ip}. Count: ${currentCount}`);
      return NextResponse.json({ 
        error: 'Limit reached', 
        message: isLoggedIn ? 'Limit (2x) tercapai.' : 'Limit Guest (1x) tercapai. Silakan Login!'
      }, { status: 403 });
    }

    // 1. Update Firestore (Atomic Increment for User Log)
    try {
      await setDoc(logRef, {
        totalRequests: increment(1),
        uids: isLoggedIn ? [...new Set([...uids, user.uid])] : uids,
        lastRequestAt: serverTimestamp(),
        lastGameRequested: game.name,
        ip: ip
      }, { merge: true });

      // Aggregate Game Request Count
      const gameDocRef = doc(db, 'requested_games', String(game.id));
      await setDoc(gameDocRef, {
        id: game.id,
        name: game.name,
        image: game.image,
        requestCount: increment(1),
        lastRequestedAt: serverTimestamp()
      }, { merge: true });

      // Create individual trackable request for Admin Dashboard
      await addDoc(collection(db, 'game_requests'), {
        gameId: game.id,
        gameName: game.name,
        gameImage: game.image,
        userId: isLoggedIn ? user.uid : 'guest',
        userName: isLoggedIn ? user.displayName : 'Guest',
        userEmail: isLoggedIn ? user.email : '',
        ip: ip,
        status: 'pending', // 'pending', 'in_progress', 'done', 'rejected'
        timestamp: serverTimestamp()
      });

    } catch (fsError) {
      console.warn('[WARNING] Failed to write request log to Firestore (continuing anyway):', fsError);
    }

    // 2. Kirim ke Discord
    const webhookUrl = process.env.DISCORD_REQUEST_WEBHOOK;
    if (!webhookUrl) throw new Error('Discord webhook URL not configured');

    const payload = {
      username: "TS Game Store",
      avatar_url: game.image || "https://teknologisantuy.vercel.app/logo.png",
      embeds: [
        {
          title: '🎮 NEW GAME REQUEST!',
          description: `**Title:** ${game.name}\n**Steam Link:** https://store.steampowered.com/app/${game.id}/\n**Requested on:** Teknologi Santuy Game Store`,
          color: 0x66c0f4, // Steam Blue color
          image: { url: game.image },
          footer: { text: "Teknologi Santuy - Automated Storefront" },
          timestamp: new Date().toISOString()
        }
      ]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log(`[SUCCESS] Game request processed for IP: ${ip}. New count: ${currentCount + 1}`);
    return NextResponse.json({ success: true, newCount: currentCount + 1 });

  } catch (error) {
    console.error('[ERROR] Processing game request failure:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
