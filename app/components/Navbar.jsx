"use client";
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, signOut } = useAuth();

  return (
    <>
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">
            <span><span className="tb-dot"></span> Live update aktif</span>
            <span style={{ marginLeft: 16, color: 'rgba(255,255,255,.35)' }}>|</span>
            <span style={{ marginLeft: 16 }}>Komunitas gaming &amp; teknologi #AntiRibet</span>
          </div>
          <div className="top-bar-links">
            <a href="https://teknologisantuy1.blogspot.com/"><i className="fa-brands fa-blogger-b"></i> Blog</a>
            <a href="https://www.youtube.com/@TeknologiSantuy"><i className="fa-brands fa-youtube"></i> YouTube</a>
            <a href="https://discord.gg/dJzbq53jXH"><i className="fa-brands fa-discord"></i> Discord</a>
            <a href="https://www.instagram.com/fikrialfrz/"><i className="fa-brands fa-instagram"></i> Instagram</a>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container" style={{ padding: 0, maxWidth: '100%' }}>
          <div className="nav-inner">
            <Link href="/" className="nav-brand" style={{ paddingLeft: 24 }}>
              <img src="/logo.png" alt="TS Logo" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
              <div className="brand-text">Teknologi<br /><span>Santuy</span></div>
            </Link>

            <ul className="nav-menu">
              <li><Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link></li>
              <li><Link href="/blog" className={pathname === '/blog' ? 'active' : ''}>Blog</Link></li>
              <li><Link href="/launcher" className={pathname === '/launcher' ? 'active' : ''}>Launcher</Link></li>
              <li><Link href="/game" className={pathname === '/game' ? 'active' : ''}>Game</Link></li>
              <li><Link href="/request-game" className={pathname === '/request-game' ? 'active' : ''}>Request Game</Link></li>
              <li><Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link></li>
              <li><Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
            </ul>

            <div className="nav-right" style={{ marginLeft: 'auto' }}>
              <a href="https://discord.gg/dJzbq53jXH" className="nav-right-btn">
                <i className="fa-brands fa-discord"></i> Discord
              </a>
              <div className="nav-avatar" tabIndex="0">
                {user ? (
                  <>
                    <img 
                      src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.displayName}`} 
                      alt="Avatar"
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div className="avatar-dropdown">
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: 12 }}>
                        <div style={{ fontWeight: 700 }}>{userProfile?.displayName}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)' }}>{userProfile?.email || 'Guest User'}</div>
                      </div>
                      <Link href="/forum"><i className="fa-solid fa-comment-dots"></i> Forum</Link>
                      <a href="#" onClick={(e) => { e.preventDefault(); router.push('/dashboard'); }}><i className="fa-solid fa-chart-pie"></i> Dashboard</a>
                      <a href="#" onClick={(e) => { e.preventDefault(); signOut(); }}><i className="fa-solid fa-right-from-bracket"></i> Logout</a>
                    </div>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-circle-user"></i>
                    <div className="avatar-dropdown">
                      <Link href="/auth/login"><i className="fa-solid fa-right-to-bracket"></i> Login</Link>
                      <Link href="/auth/signup"><i className="fa-solid fa-user-plus"></i> Register</Link>
                      <a href="#"><i className="fa-solid fa-user-secret"></i> Anonymous</a>
                      <a href="https://discord.gg/dJzbq53jXH"><i className="fa-brands fa-discord"></i> Discord</a>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button 
              className="hamburger-btn" 
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>

        <div 
          className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`} 
          onClick={() => setMobileNavOpen(false)}
        ></div>

        <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header">
            <span style={{ fontWeight: 900, fontSize: '18px', color: 'var(--yellow)' }}>MENU NAVIGASI</span>
            <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <Link href="/" onClick={() => setMobileNavOpen(false)}><i className="fa-solid fa-house"></i> Home</Link>
          <Link href="/blog" onClick={() => setMobileNavOpen(false)}><i className="fa-solid fa-file-pen"></i> Blog</Link>
          <Link href="/launcher" onClick={() => setMobileNavOpen(false)}><i className="fa-solid fa-rocket"></i> Launcher</Link>
          <Link href="/game" onClick={() => setMobileNavOpen(false)}><i className="fa-solid fa-gamepad"></i> Game</Link>
          <Link href="/request-game" onClick={() => setMobileNavOpen(false)}><i className="fa-solid fa-comments"></i> Request Game</Link>
          <Link href="/about" onClick={() => setMobileNavOpen(false)}><i className="fa-solid fa-info-circle"></i> About</Link>
          <Link href="/contact" onClick={() => setMobileNavOpen(false)}><i className="fa-solid fa-envelope"></i> Contact</Link>
          {user ? (
            <>
              <div style={{ borderTop: '2px solid var(--black)', marginTop: 16, paddingTop: 16, fontSize: 13, color: 'var(--white)' }}>
                <div style={{ fontWeight: 800 }}>{userProfile?.displayName}</div>
                <div style={{ fontSize: 11, color: '#B0BEC5' }}>{userProfile?.email || 'User Account'}</div>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); setMobileNavOpen(false); signOut(); }} style={{ color: '#ff6b6b', fontWeight: 800, marginTop: 10 }}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </a>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMobileNavOpen(false)} style={{ color: 'var(--yellow)', fontWeight: 800, borderTop: '2px solid var(--black)', marginTop: 16, paddingTop: 16 }}>
                <i className="fa-solid fa-right-to-bracket"></i> Login
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileNavOpen(false)} style={{ color: 'var(--yellow)', fontWeight: 800 }}>
                <i className="fa-solid fa-user-plus"></i> Register
              </Link>
            </>
          )}
          <a href="https://discord.gg/dJzbq53jXH" onClick={() => setMobileNavOpen(false)} style={{ color: 'var(--white)', background: '#5865F2', padding: '12px', textAlign: 'center', marginTop: '20px', border: '2px solid var(--black)', fontWeight: 800, display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <i className="fa-brands fa-discord"></i> Join Discord
          </a>
        </div>
      </nav>
    </>
  );
}
