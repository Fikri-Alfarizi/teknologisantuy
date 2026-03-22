'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    const trackPageVisit = async () => {
      // Avoid tracking the same path multiple times in rapid succession (e.g. on re-renders)
      const currentFullUrl = window.location.href;
      if (lastTrackedPath.current === currentFullUrl) return;
      lastTrackedPath.current = currentFullUrl;

      try {
        // 1. Get Geolocation & IP info (using a free public API)
        let geoData = { ip: 'Unknown', country_name: 'Unknown', city: 'Unknown' };
        try {
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            geoData = await geoRes.json();
          }
        } catch (e) {
          console.warn("Geo-tracking blocked or failed:", e);
        }

        // 2. Identify Traffic Source
        const referrer = document.referrer || 'Direct';
        const fromParam = searchParams.get('from') || searchParams.get('utm_source') || null;
        
        // 3. Detect Platform
        const userAgent = window.navigator.userAgent;
        let platform = "Desktop";
        if (/mobile/i.test(userAgent)) platform = "Mobile";
        if (/tablet/i.test(userAgent)) platform = "Tablet";

        // 4. Log to Firestore
        await addDoc(collection(db, 'siteAnalytics'), {
          path: pathname,
          fullUrl: currentFullUrl,
          referrer: referrer,
          source: fromParam,
          ip: geoData.ip,
          country: geoData.country_name,
          city: geoData.city,
          countryCode: geoData.country_code || '??',
          platform: platform,
          userAgent: userAgent,
          timestamp: serverTimestamp(),
          sessionStarted: !sessionStorage.getItem('ts_session_active')
        });

        // Mark session as active in this browser tab
        sessionStorage.setItem('ts_session_active', 'true');

      } catch (err) {
        console.error("Analytics Error:", err);
      }
    };

    trackPageVisit();
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
