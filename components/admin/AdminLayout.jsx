'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useAdminSettings } from '@/components/admin/AdminSettingsContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/app/actions/adminActionsV2';
import {
  FaTachometerAlt, FaUsers, FaCommentAlt, FaSignOutAlt, FaRocket, FaGlobe,
  FaNewspaper, FaGamepad, FaChartBar, FaEnvelope, FaHistory, FaBell,
  FaCalendarAlt, FaClipboardList, FaCog, FaDatabase, FaHeartbeat,
  FaBars, FaTimes, FaChevronDown, FaChevronRight, FaSearch,
  FaPaintBrush, FaRobot, FaFileExport
} from 'react-icons/fa';

export default function AdminLayout({ children, activeTab = 'dashboard' }) {
  const { userProfile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(['overview', 'analytics', 'community', 'content', 'system']);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { settings } = useAdminSettings() || {};

  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-secret-portal';

  // Apply settings
  const themeBg = settings?.theme === 'dark' ? '#121212' : '#f4f6f9';
  const themeText = settings?.theme === 'dark' ? '#eee' : '#000';
  const contentBg = settings?.theme === 'dark' ? '#1e1e1e' : '#fff';
  const accent = settings?.accentColor || '#ffe600';
  
  const sidebarWidth = settings?.sidebarDensity === 'compact' ? '220px' : settings?.sidebarDensity === 'spacious' ? '300px' : '260px';
  const itemPadding = settings?.sidebarDensity === 'compact' ? '6px 10px' : settings?.sidebarDensity === 'spacious' ? '12px 16px' : '9px 12px 9px 14px';

  // Nav groups with collapsible sections
  const navGroups = [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, href: `/${adminPath}` },
      ]
    },
    {
      id: 'analytics',
      label: 'Analitik',
      items: [
        { id: 'analytics-detail', label: 'Analitik Lanjut', icon: <FaChartBar />, href: `/${adminPath}/analytics-detail` },
        { id: 'analytics-charts', label: 'Grafik & Trend', icon: <FaChartBar />, href: `/${adminPath}/analytics-charts` },
      ]
    },
    {
      id: 'community',
      label: 'Komunitas',
      items: [
        { id: 'users', label: 'Manajemen User', icon: <FaUsers />, href: `/${adminPath}/users` },
        { id: 'feedback', label: 'Feedback & Suara', icon: <FaCommentAlt />, href: `/${adminPath}/feedback` },
        { id: 'contact-inbox', label: 'Kontak Masuk', icon: <FaEnvelope />, href: `/${adminPath}/contact-inbox` },
      ]
    },
    {
      id: 'content',
      label: 'Konten',
      items: [
        { id: 'news', label: 'Manajemen Berita', icon: <FaNewspaper />, href: `/${adminPath}/news` },
        { id: 'game-manager', label: 'Kelola Game', icon: <FaGamepad />, href: `/${adminPath}/game-manager` },
        { id: 'game-requests', label: 'Game Requests', icon: <FaClipboardList />, href: `/${adminPath}/game-requests` },
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        { id: 'scheduler', label: 'Kalender & Event', icon: <FaCalendarAlt />, href: `/${adminPath}/scheduler` },
        { id: 'task-board', label: 'Task Board', icon: <FaClipboardList />, href: `/${adminPath}/task-board` },
      ]
    },
    {
      id: 'system',
      label: 'Sistem',
      items: [
        { id: 'activity-log', label: 'Activity Log', icon: <FaHistory />, href: `/${adminPath}/activity-log` },
        { id: 'system-health', label: 'System Health', icon: <FaHeartbeat />, href: `/${adminPath}/system-health` },
        { id: 'backup', label: 'Backup & Export', icon: <FaFileExport />, href: `/${adminPath}/backup` },
        { id: 'settings', label: 'Pengaturan', icon: <FaCog />, href: `/${adminPath}/settings` },
      ]
    }
  ];

  // Flatten all items for command palette search
  const allNavItems = navGroups.flatMap(g => g.items);

  // Fetch notifications
  useEffect(() => {
    async function loadNotifs() {
      try {
        const res = await getNotifications(15);
        if (res.success) {
          setNotifications(res.data);
          setUnreadCount(res.unreadCount);
        }
      } catch (err) {
        console.error("Notif Error:", err);
      }
    }
    loadNotifs();
    const interval = setInterval(loadNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setShowNotifPanel(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const filteredSearchItems = allNavItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div suppressHydrationWarning style={{ display: 'flex', height: '100vh', background: themeBg, color: themeText, overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: isSidebarOpen ? sidebarWidth : '0',
        minWidth: isSidebarOpen ? sidebarWidth : '0',
        background: '#1a1d23',
        color: '#c2c7d0',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: isSidebarOpen ? '3px solid #000' : 'none',
        overflow: 'hidden',
        zIndex: 100
      }}>
        {/* Logo Area */}
        <div style={{
          padding: '18px 20px',
          background: '#12141a',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: accent,
            padding: '8px',
            border: '2px solid #000',
            borderRadius: '8px',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.3)'
          }}>
            <FaRocket size={18} color="#000" />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: '14px', letterSpacing: '0.5px' }}>TS DASHBOARD</div>
            <div style={{ fontSize: '9px', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Teknologi Santuy</div>
          </div>
        </div>

        {/* Admin Profile */}
        <div style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <img
            src={userProfile?.photoURL || 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff'}
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${accent}` }}
            alt="Admin"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userProfile?.displayName || 'Administrator'}
            </div>
            <div style={{ fontSize: '10px', color: '#666', fontWeight: 600 }}>Super Admin</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
          {navGroups.map(group => (
            <div key={group.id} style={{ marginBottom: '4px' }}>
              <button
                onClick={() => toggleGroup(group.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px', background: 'none', border: 'none', color: '#666',
                  fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px',
                  cursor: 'pointer', borderRadius: '4px', transition: '0.2s'
                }}
              >
                <span>{group.label}</span>
                {expandedGroups.includes(group.id) ? <FaChevronDown size={8} /> : <FaChevronRight size={8} />}
              </button>

              {expandedGroups.includes(group.id) && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '2px 0 8px' }}>
                  {group.items.map(item => (
                    <li key={item.id}>
                      <Link href={item.href} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: itemPadding,
                        background: activeTab === item.id ? accent : 'transparent',
                        color: activeTab === item.id ? '#000' : '#b0b5bd',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontWeight: activeTab === item.id ? 900 : 600,
                        fontSize: '13px',
                        border: activeTab === item.id ? '2px solid #000' : '2px solid transparent',
                        transition: '0.15s',
                        boxShadow: activeTab === item.id ? '2px 2px 0 rgba(0,0,0,0.2)' : 'none'
                      }}>
                        <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px',
            color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
            borderRadius: '6px', transition: '0.15s'
          }}>
            <FaGlobe /> Lihat Website
          </Link>
          <button onClick={signOut} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px',
            background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer',
            fontSize: '13px', fontWeight: 700, borderRadius: '6px', textAlign: 'left'
          }}>
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{
          background: contentBg,
          height: '56px',
          borderBottom: settings?.theme === 'dark' ? '2px solid #333' : '2px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '15px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px',
            padding: '6px', borderRadius: '4px', color: themeText
          }}>
            {isSidebarOpen ? <FaBars /> : <FaBars />}
          </button>

          {/* Breadcrumb */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: themeText }}>
              Teknologi Santuy {settings?.language === 'en' ? 'Control Center' : 'Pusat Kontrol'}
            </span>
            <span style={{ fontSize: '10px', background: accent, color: '#000', padding: '2px 8px', border: '1px solid #000', fontWeight: 900, borderRadius: '3px' }}>v2.0</span>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', background: '#f5f5f5', border: '1px solid #ddd',
              borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#888', fontWeight: 600
            }}
          >
            <FaSearch size={11} /> <span>Cari...</span>
            <kbd style={{ fontSize: '10px', background: '#e8e8e8', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>Ctrl+K</kbd>
          </button>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px',
                padding: '8px', borderRadius: '6px', position: 'relative', color: '#555'
              }}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  background: '#ff4757', color: '#fff', fontSize: '9px', fontWeight: 900,
                  width: '16px', height: '16px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{unreadCount}</span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifPanel && (
              <div style={{
                position: 'absolute', top: '45px', right: 0, width: '360px',
                background: '#fff', border: '3px solid #000', boxShadow: '8px 8px 0 rgba(0,0,0,0.15)',
                borderRadius: '8px', zIndex: 200, maxHeight: '450px', overflow: 'hidden'
              }}>
                <div style={{
                  padding: '14px 18px', borderBottom: '2px solid #000',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#fafafa'
                }}>
                  <span style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase' }}>🔔 Notifikasi</span>
                  <button onClick={handleMarkAllRead} style={{
                    background: 'none', border: 'none', color: '#007bff',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                  }}>Tandai Semua Dibaca</button>
                </div>
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontWeight: 700, fontSize: '13px' }}>
                      Tidak ada notifikasi
                    </div>
                  ) : notifications.map(notif => (
                    <div key={notif.id} style={{
                      padding: '12px 18px', borderBottom: '1px solid #eee',
                      background: notif.read ? '#fff' : '#fffde7',
                      cursor: 'pointer', transition: '0.1s'
                    }} onClick={async () => {
                      if (!notif.read) {
                        await markNotificationRead(notif.id);
                        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                        setUnreadCount(prev => Math.max(0, prev - 1));
                      }
                    }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#000', marginBottom: '3px' }}>{notif.title}</div>
                      <div style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>{notif.message}</div>
                      <div style={{ fontSize: '10px', color: '#999', marginTop: '4px', fontWeight: 700 }}>
                        {new Date(notif.timestamp).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin avatar in header */}
          <img
            src={userProfile?.photoURL || 'https://ui-avatars.com/api/?name=A&background=000&color=fff'}
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${accent}` }}
            alt=""
          />
        </header>

        {/* Content Section */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: themeBg }}>
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      {commandPaletteOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)', zIndex: 9999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: '15vh'
          }}
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            style={{
              background: '#fff', width: '520px', borderRadius: '12px',
              border: '3px solid #000', boxShadow: '10px 10px 0 rgba(0,0,0,0.15)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '14px 18px', borderBottom: '2px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaSearch color="#999" />
              <input
                autoFocus
                placeholder="Cari halaman, fitur, atau aksi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: '15px',
                  fontWeight: 600, background: 'none', color: '#000'
                }}
              />
              <kbd style={{ fontSize: '10px', background: '#eee', padding: '2px 6px', borderRadius: '3px', fontWeight: 700, color: '#666' }}>ESC</kbd>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredSearchItems.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => { setCommandPaletteOpen(false); setSearchQuery(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 18px', textDecoration: 'none', color: '#333',
                    fontWeight: 700, fontSize: '14px', borderBottom: '1px solid #f5f5f5',
                    transition: '0.1s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fffde7'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: '#999', fontSize: '14px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              {filteredSearchItems.length === 0 && (
                <div style={{ padding: '30px', textAlign: 'center', color: '#999', fontWeight: 700 }}>
                  Tidak ditemukan
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        aside::-webkit-scrollbar { width: 4px; }
        aside::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        main::-webkit-scrollbar { width: 6px; }
        main::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
      `}</style>
    </div>
  );
}
