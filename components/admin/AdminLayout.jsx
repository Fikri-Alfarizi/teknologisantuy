'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children, activeTab = 'dashboard' }) {
  const { userProfile, signOut } = useAuth();
  const router = useRouter();
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-secret-portal';

  // Pemetaan menu Anda dengan ikon DealDock (Material Symbols)
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

  // Format tanggal untuk Header
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex h-screen bg-surface text-on-surface font-body overflow-hidden">
      
      {/* Sidebar Kiri */}
      <aside className="h-screen w-64 flex-shrink-0 bg-[#eceef0] flex flex-col p-6 border-r border-outline-variant/20 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer transition-transform hover:scale-105">
          <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-headline text-[#191c1e] leading-none">TS Control</h1>
            <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/60 mt-1">Analytics Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar pb-6">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <Link key={item.id} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm
                  ${isActive 
                    ? 'bg-white text-[#4f46e5] shadow-sm font-semibold' 
                    : 'text-[#191c1e]/70 hover:bg-white hover:shadow-sm'
                  }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 pb-2 px-4">
            <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em]">Sistem</span>
          </div>
          
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-[#191c1e]/70 hover:bg-white hover:shadow-sm rounded-lg transition-all font-medium text-sm">
            <span className="material-symbols-outlined">language</span>
            <span>Lihat Website</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-all font-medium text-sm">
            <span className="material-symbols-outlined">logout</span>
            <span>Keluar</span>
          </button>
        </nav>

        {/* Upgrade Card (Dipertahankan sesuai desain asli) */}
        <div className="mt-auto bg-slate-800 rounded-2xl p-5 relative overflow-hidden group shadow-lg">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/40 rounded-full blur-2xl group-hover:bg-primary/60 transition-all"></div>
          <p className="text-white text-xs font-medium mb-1 opacity-80">TS Admin Panel</p>
          <h4 className="text-white font-headline text-lg mb-4 font-bold">Akses VIP Aktif</h4>
          <div className="w-full py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-bold shadow-lg text-center">
            System Online
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="flex justify-between items-center px-8 py-6 bg-surface z-40">
          <div>
            <h2 className="text-2xl font-extrabold font-headline text-on-surface">
              {activeTabLabel}
            </h2>
            <p className="text-sm text-on-surface-variant font-medium opacity-70">{today}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
              <input className="bg-white border-none rounded-2xl py-3 pl-10 pr-4 w-64 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Cari data..." type="text"/>
            </div>
            <button className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-error border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold font-headline leading-none group-hover:text-primary transition-colors">
                  {userProfile?.displayName || 'Administrator'}
                </p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">Super Admin</p>
              </div>
              <img alt="User Profile" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary/30 transition-all" src={userProfile?.photoURL || "https://ui-avatars.com/api/?name=Admin&background=e2dfff&color=3525cd&rounded=true"}/>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
