'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function GameSearchBar({ initialQuery }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');
  const isFirstMount = useRef(true);
  
  // Sync internal state when URL search param changes from outside (e.g. Hapus Pencarian)
  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      if (query !== initialQuery) {
        if (query.trim().length > 0) {
          router.push(`${pathname}?search=${encodeURIComponent(query)}`);
        } else {
          router.push(pathname);
        }
      }
    }, 500); // 500ms debounce for real-time feel without spamming

    return () => clearTimeout(delayDebounceFn);
  }, [query, pathname, router, initialQuery]);

  return (
    <div style={{ marginBottom: '40px', marginTop: '-30px', position: 'relative', zIndex: 10 }}>
      <div style={{
        display: 'flex', maxWidth: '600px', margin: '0 auto',
        background: 'var(--yellow)', padding: '8px', 
        border: '3px solid var(--black)', boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
        borderRadius: '12px'
      }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama game (ex: Resident Evil)..."
          style={{
            flexGrow: 1, padding: '16px 20px', 
            border: '2px solid var(--black)', borderRadius: '8px',
            fontSize: '16px', fontWeight: 'bold', outline: 'none',
            background: '#ffffff', color: '#000000'
          }}
        />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px', background: 'var(--black)', color: 'var(--yellow)',
          border: '2px solid #000', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px',
          marginLeft: '8px'
        }}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
    </div>
  );
}
