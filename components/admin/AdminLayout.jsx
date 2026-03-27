'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { FaTachometerAlt, FaUsers, FaCommentAlt, FaSignOutAlt, FaRocket, FaGlobe, FaNewspaper, FaGamepad, FaChartBar, FaEnvelope } from 'react-icons/fa';

export default function AdminLayout({ children, activeTab = 'dashboard' }) {
  const { userProfile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-secret-portal';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, href: `/${adminPath}` },
    { id: 'users', label: 'Managemen User', icon: <FaUsers />, href: `/${adminPath}/users` },
    { id: 'feedback', label: 'Feedback & Suara', icon: <FaCommentAlt />, href: `/${adminPath}/feedback` },
    { id: 'news', label: 'Manajemen Berita', icon: <FaNewspaper />, href: `/${adminPath}/news` },
    { id: 'game-manager', label: 'Kelola Game', icon: <FaGamepad />, href: `/${adminPath}/game-manager` },
    { id: 'analytics-detail', label: 'Analitik Lanjut', icon: <FaChartBar />, href: `/${adminPath}/analytics-detail` },
    { id: 'contact-inbox', label: 'Kontak Masuk', icon: <FaEnvelope />, href: `/${adminPath}/contact-inbox` },
  ];

  return (
    <div suppressHydrationWarning style={{ display: 'flex', height: '100vh', background: '#f4f6f9', overflow: 'hidden' }}>
      {/* Sidebar - AdminLTE Inspired but Neobrutalist borders */}
      <aside style={{
        width: isSidebarOpen ? '250px' : '0',
        background: '#343a40',
        color: '#c2c7d0',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '4px solid #000',
        overflow: 'hidden',
        zIndex: 100
      }}>
        <div style={{ padding: '20px', background: '#212529', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#ffe600', padding: '8px', border: '2px solid #000', borderRadius: '4px' }}>
             <FaRocket size={20} color="#000" />
          </div>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: '16px', letterSpacing: '0.5px' }}>TS DASHBOARD</span>
        </div>

        <div style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={userProfile?.photoURL || 'https://ui-avatars.com/api/?name=Admin'} style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #fff' }} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{userProfile?.displayName || 'Administrator'}</span>
        </div>

        <nav style={{ flex: 1, padding: '10px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
             {navItems.map(item => (
               <li key={item.id}>
                  <Link href={item.href} style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', 
                    background: activeTab === item.id ? '#ffe600' : 'transparent', 
                    color: activeTab === item.id ? '#000' : '#fff', 
                    textDecoration: 'none', 
                    borderRadius: '4px', fontWeight: 800, fontSize: '14px',
                    border: activeTab === item.id ? '2px solid #000' : 'none',
                    transition: '0.2s'
                  }}>
                    {item.icon} {item.label}
                  </Link>
               </li>
             ))}
          </ul>
        </nav>

        <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
           <Link href="/" style={{ 
             display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', 
             color: '#c2c7d0', textDecoration: 'none', fontSize: '13px', fontWeight: 600 
           }}>
             <FaGlobe /> Lihat Website
           </Link>
           <button onClick={signOut} style={{ 
             width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', 
             background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '13px', fontWeight: 700 
           }}>
             <FaSignOutAlt /> Log Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Navbar */}
        <header style={{ 
          background: '#fff', height: '57px', borderBottom: '2px solid #000', 
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: '15px' 
        }}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
             <i className="fa-solid fa-bars"></i>
          </button>
          <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 800, textTransform: 'uppercase' }}>Teknologi Santuy Control Center v1.0</h1>
        </header>

        {/* Content Section */}
        <main style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
           {children}
        </main>
      </div>
    </div>
  );
}
