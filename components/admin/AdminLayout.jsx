'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children, activeTab = 'dashboard' }) {
  const { userProfile, signOut } = useAuth();
  const router = useRouter();
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-secret-portal';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: `/${adminPath}` },
    { id: 'users', label: 'Manajemen User', icon: 'groups', href: `/${adminPath}/users` },
    { id: 'feedback', label: 'Feedback & Suara', icon: 'forum', href: `/${adminPath}/feedback` },
    { id: 'news', label: 'Manajemen Berita', icon: 'newspaper', href: `/${adminPath}/news` },
    { id: 'game-manager', label: 'Kelola Game', icon: 'sports_esports', href: `/${adminPath}/game-manager` },
    { id: 'analytics-detail', label: 'Analitik Lanjut', icon: 'analytics', href: `/${adminPath}/analytics-detail` },
    { id: 'contact-inbox', label: 'Kontak Masuk', icon: 'inbox', href: `/${adminPath}/contact-inbox` },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const activeTabLabel = navItems.find(item => item.id === activeTab)?.label || 'Dashboard';

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[59] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen bg-[#f7f9fb] text-[#191c1e] overflow-hidden">

        {/* ═══ LEFT SIDEBAR ═══ */}
        <aside className={`
          fixed lg:relative top-0 left-0 h-screen w-64 flex-shrink-0 flex flex-col z-[60]
          bg-[#eceef0] border-r border-[#464555]/20 p-6
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Brand */}
          <Link href={`/${adminPath}`} className="flex items-center gap-3 mb-10 px-2 cursor-pointer transition-transform hover:scale-105 no-underline">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] rounded-xl flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-xl">rocket_launch</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#191c1e] leading-none" style={{ fontFamily: 'Manrope, sans-serif' }}>TS Control</h1>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#464555]/60 mt-1">Admin Panel</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto hide-scrollbar pb-6">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm no-underline
                    ${isActive
                      ? 'bg-white text-[#4f46e5] shadow-sm font-semibold'
                      : 'text-[#191c1e]/70 hover:bg-white hover:shadow-sm font-medium'
                    }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-6 pb-2 px-4">
              <span className="text-[10px] font-bold text-[#464555]/40 uppercase tracking-[0.1em]">Sistem</span>
            </div>

            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-[#191c1e]/70 hover:bg-white hover:shadow-sm rounded-lg transition-all font-medium text-sm no-underline"
            >
              <span className="material-symbols-outlined text-xl">language</span>
              <span>Lihat Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#93000a] rounded-lg transition-all font-medium text-sm"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>Keluar</span>
            </button>
          </nav>

          {/* Bottom Card */}
          <div className="mt-auto bg-[#1e293b] rounded-2xl p-5 relative overflow-hidden group shadow-lg">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#3525cd]/40 rounded-full blur-2xl group-hover:bg-[#3525cd]/60 transition-all" />
            <p className="text-white text-xs font-medium mb-1 opacity-80 relative z-10">TS Admin Panel</p>
            <h4 className="text-white text-lg mb-4 font-bold relative z-10" style={{ fontFamily: 'Manrope, sans-serif' }}>Akses VIP Aktif</h4>
            <div className="w-full py-2.5 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white rounded-xl text-sm font-bold shadow-lg text-center relative z-10">
              System Online
            </div>
          </div>
        </aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* Top Header */}
          <header className="flex justify-between items-center px-4 md:px-8 py-5 bg-[#f7f9fb] z-40 border-b border-[#e6e8ea]/50 flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* Mobile Hamburger */}
              <button
                className="lg:hidden w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#464555] hover:bg-[#e6e8ea] transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[#191c1e]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {activeTabLabel}
                </h2>
                <p className="text-xs md:text-sm text-[#464555] font-medium opacity-70">{today}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              {/* Search (Hidden mobile) */}
              <div className="relative group hidden md:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555] group-focus-within:text-[#3525cd] transition-colors text-xl">search</span>
                <input
                  className="bg-white border-none rounded-2xl py-3 pl-10 pr-4 w-56 lg:w-64 text-sm shadow-sm focus:ring-2 focus:ring-[#3525cd]/20 transition-all outline-none"
                  placeholder="Cari data..."
                  type="text"
                />
              </div>
              {/* Notification */}
              <button className="w-10 h-10 md:w-12 md:h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center text-[#464555] hover:bg-[#e6e8ea] hover:text-[#3525cd] transition-colors relative">
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-2.5 h-2.5 bg-[#ba1a1a] border-2 border-white rounded-full" />
              </button>
              {/* Profile */}
              <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-[#464555]/30 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-none group-hover:text-[#3525cd] transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {userProfile?.displayName || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-[#464555] font-bold uppercase tracking-wider mt-1">Super Admin</p>
                </div>
                <img
                  alt="User Profile"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-[#3525cd]/30 transition-all"
                  src={userProfile?.photoURL || "https://ui-avatars.com/api/?name=Admin&background=e2dfff&color=3525cd&rounded=true"}
                />
              </div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 overflow-y-auto hide-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
