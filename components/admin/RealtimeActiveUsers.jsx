'use client';

import React, { useState, useEffect } from 'react';
import { getActiveUsersCount } from '@/app/actions/adminActions';

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
    
    fetchActive(); 
    const interval = setInterval(fetchActive, 10000); // 10 Detik Update
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold backdrop-blur-sm flex items-center gap-2 border border-white/10 shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      {activeUsers} Live
    </div>
  );
}
