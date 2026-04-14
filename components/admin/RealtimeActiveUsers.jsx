'use client';

import React, { useState, useEffect } from 'react';
import { getActiveUsersCount } from '@/app/actions/adminActions';
import { FaUserCircle } from 'react-icons/fa';

export default function RealtimeActiveUsers() {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await getActiveUsersCount();
        if (res && res.success) {
          setActiveUsers(res.count);
        }
      } catch(err) {
        console.error("Polling error:", err);
      }
    };
    
    fetchActive(); // Initial fetch
    const interval = setInterval(fetchActive, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#00E676', border: '4px solid #000', padding: '15px 20px',
      display: 'flex', alignItems: 'center', gap: '15px', color: '#000',
      boxShadow: '6px 6px 0 #000', minWidth: '220px', position: 'relative'
    }}>
      <FaUserCircle size={40} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '32px', fontWeight: 950, lineHeight: 1 }}>{activeUsers} <span style={{ fontSize: '10px', position: 'absolute', top: '10px', right: '10px' }}>🟢 LIVE</span></div>
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Pengguna Aktif</div>
      </div>
    </div>
  );
}
