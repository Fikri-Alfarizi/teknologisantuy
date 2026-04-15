'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeDownloadUrl } from '../lib/url-obfuscator';
import { Shield, Download, AlertTriangle, CheckCircle2, Loader2, Gamepad2, Share2, Bookmark, Zap, Cpu, MessageCircle, TrendingUp, Eye, Heart, MessageSquare } from 'lucide-react';
import Script from 'next/script';

// Component for Adsterra Ads
function AdsterraAd({ id, width, height, slotId }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = document.getElementById(slotId);
    if (container && !container.hasChildNodes()) {
      const atOptions = document.createElement('script');
      atOptions.innerHTML = `
        atOptions = {
          'key' : '${id}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      const script = document.createElement('script');
      script.src = `https://www.highperformanceformat.com/${id}/invoke.js`;
      
      container.appendChild(atOptions);
      container.appendChild(script);
    }
  }, [id, width, height, slotId]);

  return <div id={slotId} className="flex justify-center overflow-hidden rounded-lg" />;
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const [gameName, setGameName] = useState('Memuat Game...');
  const [targetUrl, setTargetUrl] = useState('');
  const [gameGenre, setGameGenre] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Mengamankan koneksi...');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const token = searchParams.get('to');
    const name = searchParams.get('name');
    const genre = searchParams.get('genre') || 'Gaming';

    if (token) {
      setTargetUrl(decodeDownloadUrl(token));
      if (name) setGameName(name);
      setGameGenre(genre);

      // Keep URL params intact for security - countdown resets on refresh
      // User can't share this link productively since countdown restarts
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setProgress(((10 - (countdown - 1)) / 10) * 100);

        if (countdown === 8) setStatusText('Mengecek integritas file...');
        if (countdown === 6) setStatusText('Menghubungkan ke Mirror Server...');
        if (countdown === 4) setStatusText('Bypass proteksi link...');
        if (countdown === 2) setStatusText('Menyiapkan file unduhan...');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
      setStatusText('Link Verifikasi Berhasil!');
      setProgress(100);
    }
  }, [countdown]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = window.document.documentElement.scrollTop;
      const height = window.document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="download-page">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --on-background: #1a1c1e;
          --background: #f9f9fc;
          --surface-dim: #dadadc;
          --surface-container: #eeeef0;
          --primary: #003063;
          --secondary: #bc0000;
          --surface: #f9f9fc;
          --surface-container-lowest: #ffffff;
          --on-surface: #1a1c1e;
          --outline: #737782;
          --surface-container-low: #f3f3f6;
          --surface-container-high: #e8e8ea;
          --on-primary: #ffffff;
          --primary-fixed: #d6e3ff;
          --outline-variant: #c2c6d2;
          --surface-variant: #e2e2e5;
          --on-surface-variant: #424751;
        }
        html, body, #__next { min-height: 100%; }
        body { background-color: var(--background); color: var(--on-background); font-family: 'Inter', sans-serif; line-height: 1.5; }
        img { max-width: 100%; display: block; }
        a { text-decoration: none; color: inherit; }
        .container { max-width: 1280px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
        @media (min-width: 768px) { .container { padding-left: 1.5rem; padding-right: 1.5rem; } }
        .fixed-header { position: fixed; top: 0; left: 0; width: 100%; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); box-shadow: 0 1px 2px rgba(0,0,0,0.05); z-index: 50; }
        .nav-bar { display: flex; justify-content: space-between; align-items: center; height: 64px; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.025em; color: var(--primary); }
        .nav-links { display: none; }
        @media (min-width: 768px) { .nav-links { display: flex; align-items: center; gap: 2rem; } .nav-link { font-size: 0.875rem; font-weight: 600; transition: opacity 0.2s; } .nav-link-active { color: var(--secondary); font-weight: 700; border-bottom: 2px solid var(--secondary); padding-bottom: 0.25rem; } }
        .icon-group { display: flex; align-items: center; gap: 0.5rem; }
        .icon-btn { font-size: 1.5rem; color: var(--primary); background: transparent; border: none; cursor: pointer; padding: 0.5rem; border-radius: 9999px; transition: opacity 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .progress-bar-container { position: fixed; top: 64px; left: 0; width: 100%; height: 4px; background-color: var(--surface-container); z-index: 50; }
        .progress-fill { height: 100%; width: 0%; background-color: var(--secondary); transition: width 0.2s ease; }
        .two-columns { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) { .two-columns { grid-template-columns: 1fr 320px; gap: 3rem; } }
        .article-card { background: var(--surface-container-lowest); border-radius: 0.75rem; overflow: hidden; }
        .tag { display: inline-block; background: rgba(188, 0, 0, 0.1); color: var(--secondary); font-weight: 700; font-size: 0.7rem; letter-spacing: 0.05em; text-transform: uppercase; padding: 0.125rem 0.5rem; border-radius: 0.25rem; margin-bottom: 1rem; }
        .article-title { font-size: 1.875rem; font-weight: 900; color: var(--primary); line-height: 1.2; margin-bottom: 1.5rem; }
        @media (min-width: 768px) { .article-title { font-size: 3rem; } }
        .author-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.5rem 0; border-top: 1px solid rgba(194, 198, 210, 0.15); border-bottom: 1px solid rgba(194, 198, 210, 0.15); }
        .author-info { display: flex; align-items: center; gap: 0.75rem; }
        .avatar { width: 2.5rem; height: 2.5rem; background-color: var(--primary-fixed); border-radius: 9999px; overflow: hidden; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .share-buttons { display: flex; gap: 0.5rem; }
        .icon-round { width: 2.25rem; height: 2.25rem; display: flex; align-items: center; justify-content: center; background-color: var(--surface); border-radius: 0.5rem; transition: all 0.2s; cursor: pointer; color: var(--primary); }
        .icon-round:hover { background-color: var(--primary); color: white; }
        .featured-img { width: 100%; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .featured-img img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .caption { margin-top: 0.5rem; font-size: 0.75rem; color: var(--outline); font-style: italic; text-align: center; }
        @media (min-width: 768px) { .caption { text-align: left; } }
        .article-body { font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.625; color: var(--on-background); }
        @media (min-width: 768px) { .article-body { font-size: 1.125rem; } }
        .drop-cap::first-letter { float: left; font-family: 'Inter', sans-serif; font-weight: 800; font-size: 4rem; line-height: 1; padding-right: 0.75rem; color: var(--primary); }
        .article-body h2 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.5rem; color: var(--primary); margin: 2rem 0 1rem; }
        .article-body h3 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.25rem; color: var(--primary); margin: 1.5rem 0 0.75rem; }
        .blockquote-wrapper { position: relative; margin: 2rem 0; padding-left: 1.5rem; }
        @media (min-width: 768px) { .blockquote-wrapper { padding-left: 2rem; } }
        .blockquote-border { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background-color: var(--secondary); border-radius: 2px; }
        .blockquote-text { font-size: 1.25rem; font-style: italic; color: var(--primary); line-height: 1.35; font-weight: 500; }
        @media (min-width: 768px) { .blockquote-text { font-size: 1.5rem; } }
        .check-list { list-style: none; margin-top: 1rem; margin-bottom: 1rem; }
        .check-list li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
        .section-title { font-weight: 800; color: var(--primary); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .related-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 640px) { .related-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px) { .related-grid { grid-template-columns: repeat(3, 1fr); } }
        .related-card img { border-radius: 0.5rem; transition: transform 0.3s; }
        .related-card h5 { font-weight: 700; font-size: 0.875rem; margin-top: 0.5rem; }
        .comment-area { background-color: var(--surface); border-radius: 0.75rem; padding: 1.5rem; }
        .comment-input { width: 100%; background: white; border: none; border-radius: 0.5rem; padding: 1rem; font-size: 0.875rem; resize: vertical; }
        .btn-primary { background-color: var(--primary); color: white; font-weight: 700; font-size: 0.75rem; padding: 0.5rem 1.5rem; border-radius: 0.375rem; border: none; cursor: pointer; }
        .sidebar-ad { background: white; border: 1px solid rgba(194, 198, 210, 0.3); border-radius: 0.5rem; padding: 0.5rem; text-align: center; min-height: 280px; display: flex; align-items: center; justify-content: center; }
        .popular-list a { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; }
        .popular-number { font-size: 1.875rem; font-weight: 900; color: #c2c6d2; transition: color 0.2s; }
        .footer { background-color: #e8e8ea; margin-top: 3rem; padding: 2.5rem 1.5rem; }
        @media (min-width: 768px) { .footer { padding: 3rem 2rem; } }
        .footer-content { max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        @media (min-width: 768px) { .footer-content { flex-direction: row; justify-content: space-between; } }
        .newsletter { background-color: var(--primary); color: white; border-radius: 0.75rem; padding: 2rem; position: relative; overflow: hidden; }
        .newsletter-input { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 0.5rem; padding: 0.5rem 1rem; width: 100%; color: white; }
        .newsletter-btn { background-color: var(--secondary); font-weight: 900; font-size: 0.7rem; letter-spacing: 0.1em; border: none; border-radius: 0.5rem; padding: 0.625rem; color: white; width: 100%; cursor: pointer; }
        @media (min-width: 768px) { .sidebar-sticky { position: sticky; top: 90px; } }
        .inline-ad { display: flex; justify-content: center; margin: 2.5rem 0; padding: 1.5rem 0; border-top: 1px solid #e8e8ea; border-bottom: 1px solid #e8e8ea; background: linear-gradient(135deg, #f3f4f6 0%, #f9f9fc 100%); border-radius: 0.75rem; }
        .ad-label { text-align: center; font-size: 0.65rem; color: #999; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .fixed-widget { display: none; }
        @media (min-width: 1024px) { .fixed-widget { display: block; } }
        .download-widget { animation: slideIn 0.5s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @media (max-width: 1024px) { .download-widget { position: static; width: 100% !important; margin: 1.5rem 0; right: auto !important; top: auto !important; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <header className="fixed-header">
        <div className="container">
          <div className="nav-bar">
            <div className="logo">TEKNOLOGI SANTUY</div>
            <div className="nav-links">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/" className="nav-link nav-link-active">Download</Link>
              <Link href="/game" className="nav-link">Game</Link>
              <Link href="/" className="nav-link">Tutorial</Link>
              <Link href="/" className="nav-link">Tips</Link>
            </div>
            <div className="icon-group">
              <button className="icon-btn material-symbols-outlined">search</button>
              <button className="icon-btn material-symbols-outlined" style={{ display: 'none' }}>account_circle</button>
              <button className="icon-btn material-symbols-outlined">menu</button>
            </div>
          </div>
        </div>
      </header>

      <div className="progress-bar-container">
        <div className="progress-fill" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <div className="download-widget" style={{ position: 'fixed', right: '1.5rem', top: '6rem', zIndex: 40, width: '340px', display: 'block' }}>
        <div style={{ background: '#ffffff', borderRadius: '1.25rem', overflow: 'hidden', border: '2px solid #003063', boxShadow: '0 10px 40px rgba(0, 48, 99, 0.2)' }}>
          <div style={{ background: 'linear-gradient(135deg, #003063 0%, #004080 100%)', color: 'white', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Gamepad2 className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>🔒 Verifikasi Aman</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}>{gameName}</div>
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {!isReady ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto', marginBottom: '1rem' }}>
                    <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#003063" strokeWidth="8" strokeDasharray={`${(progress / 100) * 282.7} 282.7`} style={{ transition: 'stroke-dasharray 0.3s ease' }} />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#003063' }}>{countdown}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>detik</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f0f4ff', border: '1px solid #d6e3ff', borderRadius: '0.75rem', padding: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#003063', fontWeight: 600, marginBottom: '0.5rem' }}>📖 Tip Sementara Menunggu:</div>
                  <div style={{ fontSize: '0.8rem', color: '#1a1c1e', lineHeight: 1.4 }}>
                    {countdown > 7 && "💡 Gunakan bandwidth stabil untuk download optimal"}
                    {countdown <= 7 && countdown > 4 && "⚡ File sudah compressed untuk kecepatan maksimal"}
                    {countdown <= 4 && countdown > 1 && "✅ Hampir siap! Pastikan storage cukup"}
                    {countdown <= 1 && "🎮 Sebentar lagi link download aktif..."}
                  </div>
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Shield className="w-4 h-4" /> Proses Verifikasi Keamanan...
                  </div>
                </div>

                <p style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>"{statusText}"</p>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', border: '2px solid #d1fae5', borderRadius: '0.85rem', padding: '0.85rem', marginBottom: '1.25rem' }}>
                  <CheckCircle2 className="w-6 h-6 text-green-600" style={{ animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534' }}>✅ Verifikasi Berhasil!</span>
                </div>

                <div style={{ background: '#fff8f0', border: '1px solid #fed7aa', borderRadius: '0.75rem', padding: '0.85rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>⏱️ Link berlaku 30 menit</div>
                </div>

                <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #003063 0%, #004080 100%)', color: 'white', fontWeight: 700, padding: '1.1rem 1rem', borderRadius: '0.85rem', fontSize: '0.95rem', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0, 48, 99, 0.3)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                  <Download className="w-5 h-5" /> MULAI DOWNLOAD
                </a>

                <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.75rem', textAlign: 'center' }}>Klik untuk menuju ke server download</p>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="container" style={{ marginTop: '5rem', paddingBottom: '3rem' }}>
        <div className="inline-ad">
          <div style={{ width: '100%', textAlign: 'center' }}>
            <div className="ad-label">— Iklan —</div>
            <div style={{ background: '#ffffff', border: '1px solid #c2c6d2', borderRadius: '0.5rem', padding: '0.75rem', minWidth: '300px', textAlign: 'center', display: 'inline-block' }}>
              <Script id="ad-top" strategy="afterInteractive">
                {`atOptions = { 'key' : 'dc9dac060d8897a73c73d316590a3e03', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };`}
              </Script>
              <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/dc9dac060d8897a73c73d316590a3e03/invoke.js" />
            </div>
          </div>
        </div>

        <div className="two-columns">
          <article className="article-card">
            <header style={{ padding: '2rem', borderBottom: '1px solid #e8e8ea' }}>
              <span className="tag">KOMUNITAS</span>
              <h1 className="article-title">Bergabung Discord Teknologi Santuy: Akses Unlimited Game & Support 24/7</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #7289da, #5b7db8)' }} />
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Komunitas Teknologi Santuy</p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>15 April 2026 • Bergabunglah dengan 1000+ Member</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href="https://discord.gg/adMaSMC4sc" target="_blank" rel="noopener noreferrer" className="icon-round" style={{ background: '#7289da', color: 'white', textDecoration: 'none' }}><MessageCircle className="w-5 h-5" /></a>
                  <button className="icon-round"><Bookmark className="w-5 h-5" /></button>
                </div>
              </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', padding: '2rem' }}>
              <div>
                <div className="featured-img">
                  <img src="https://i.ibb.co.com/9Px8M49/TEKNologi-santuy.png" alt="Teknologi Santuy Discord Community" />
                </div>
                <p className="caption">Komunitas gaming & teknologi terbesar di Indonesia. Join sekarang dan akses unlimited benefits. (Sumber: Teknologi Santuy Official)</p>
              </div>
              <div style={{ minHeight: '320px', background: 'white', borderRadius: '1rem', border: '1px solid rgba(194, 198, 210, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div>
                  <Script id="ad-sidebar-top" strategy="afterInteractive">
                    {`atOptions = { 'key' : '136aa22e44a04ff3d80d1888c11e7ecd', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };`}
                  </Script>
                  <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/136aa22e44a04ff3d80d1888c11e7ecd/invoke.js" />
                </div>
              </div>
            </div>

            <div className="article-body" style={{ padding: '0 2rem 2rem' }}>
              <p className="drop-cap">Server Discord Teknologi Santuy bukan sekadar tempat download game biasa. Ini adalah ekosistem digital yang dirancang khusus untuk gamer dan tech-enthusiast yang ingin hidup santai, jelas, dan tanpa ribet. Dengan lebih dari 1.000 member aktif, kami menciptakan komunitas yang solid di mana setiap pertanyaan dijawab dalam hitungan menit.</p>
              <p>Bergabung berarti mendapatkan akses ke ratusan game PC/Android gratis, launcher eksklusif, troubleshooting real-time, dan networking dengan sesama gamer profesional. Jangan tergesa, ambil keputusan yang tepat. Scroll dan lihat sendiri mengapa ribuan orang memilih Teknologi Santuy.</p>

              <h2>Akses Game Unlimited dan Launcher Eksklusif</h2>
              <p>Semuanya dimulai dengan koleksi game terlengkap tanpa iklan jebakan. Member Discord mendapatkan akses early-bird ke koleksi game terbaru, beserta launcher custom eksklusif seperti EA FC 26 ULTIMATE—modifikasi PES 2017 yang terlihat seperti game next-gen. Download langsung, install 1-klik, langsung main tanpa drama setup rumit.</p>

              <p>Tidak hanya itu. Setiap minggu ada update game baru, skin eksklusif, dan tools gratis yang tidak dipublikasikan di channel utama. Member VIP bahkan dapat early access 48 jam sebelum public release.</p>

              <div className="inline-ad" style={{ background: '#f3f4f6', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="ad-label">⭐ Rekomendasi Partner</div>
                <div>
                  <Script id="ad-mid" strategy="afterInteractive">
                    {`atOptions = { 'key' : 'dc9dac060d8897a73c73d316590a3e03', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };`}
                  </Script>
                  <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/dc9dac060d8897a73c73d316590a3e03/invoke.js" />
                </div>
              </div>

              <h2>Support 24/7 dari Expert dan Tech Enthusiast</h2>
              <p>PC kamu crash? Game lag berlebihan? DLL error yang bikin pusing? Jangan cari di Google lagi. Cukup post di channel support Discord kami, dalam 5-15 menit admin dan puluhan member expert akan membantu troubleshoot langsung—dengan screenshot, video tutorial, dan solusi step-by-step yang mudah diikuti.</p>

              <p>Yang biasanya butuh 3-4 jam searching di forum kompleks, atau malah uang untuk beli solusi berbayar, di sini gratis dan jauh lebih cepat. Komunitas kami terdiri dari IT profesional, game developer, dan tech-enthusiast yang passionate membantu sesama member.</p>

              <div className="blockquote-wrapper">
                <div className="blockquote-border"></div>
                <blockquote className="blockquote-text">"Sebelumnya saya habiskan 2 minggu cari solusi error yang aneh. Setelah join Discord Teknologi Santuy, dalam 10 menit sudah solved. Support nya real human, bukan bot!"</blockquote>
                <cite style={{ display: 'block', marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#737782' }}>— Rafa T., Member Discord (3+ bulan)</cite>
              </div>

              <h2>Keuntungan Eksklusif Member Discord</h2>
              <ul className="check-list">
                <li><span className="material-symbols-outlined" style={{ color: '#bc0000' }}>check_circle</span><span>Early access game terbaru dan launcher eksklusif sebelum public release</span></li>
                <li><span className="material-symbols-outlined" style={{ color: '#bc0000' }}>check_circle</span><span>Troubleshooting gratis 24/7 dari expert—PC crash, lag, driver, semuanya dibantu</span></li>
                <li><span className="material-symbols-outlined" style={{ color: '#bc0000' }}>check_circle</span><span>Komunitas 1000+ member aktif untuk networking, tips, dan diskusi teknologi real-time</span></li>
                <li><span className="material-symbols-outlined" style={{ color: '#bc0000' }}>check_circle</span><span>Tutorial premium dan cara setup optimal dari install OS hingga overclock GPU</span></li>
                <li><span className="material-symbols-outlined" style={{ color: '#bc0000' }}>check_circle</span><span>Giveaway eksklusif dan rewards untuk member setia termasuk game key dan donasi hardware</span></li>
              </ul>

              <h2>Mengapa Ribuan Orang Sudah Bergabung</h2>
              <p>Karena Teknologi Santuy tidak hanya menjual produk. Kami membangun ekosistem untuk orang-orang yang lelah dengan kompleksitas. Download game tanpa khawatir malware, fix error tanpa modal besar, dan punya support system yang nyata dan responsif.</p>

              <p style={{ background: '#fff8f0', border: '1px solid #fed7aa', borderRadius: '0.75rem', padding: '1rem', marginTop: '1.5rem' }}>
                <strong style={{ color: '#92400e' }}>Penawaran Terbatas:</strong> Bergabung sekarang dan dapatkan akses unlimited ke semua konten eksklusif. Link diaktifkan setelah verifikasi dalam waktu kurang dari 5 menit.
              </p>
            </div>

            <div style={{ padding: '0 2rem 2rem', borderTop: '1px solid #e8e8ea' }}>
              <div className="section-title"><span style={{ width: '4px', height: '24px', background: '#bc0000', display: 'inline-block' }}></span> KONTEN TERKAIT</div>
              <div className="related-grid">
                <a href="https://discord.gg/adMaSMC4sc" target="_blank" rel="noopener noreferrer" className="related-card" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#7289da', color: 'white', borderRadius: '0.5rem', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>→</div>
                  <h5 style={{ color: '#003063' }}>Bergabung Discord Server Sekarang</h5>
                </a>
                <a href="#" className="related-card">
                  <div style={{ background: '#f3f4f6', borderRadius: '0.5rem', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>∴</div>
                  <h5>Game Gratis Terbaru Setiap Minggu</h5>
                </a>
                <a href="#" className="related-card">
                  <div style={{ background: '#f3f4f6', borderRadius: '0.5rem', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>?</div>
                  <h5>Support PC Error dan Troubleshooting Gratis</h5>
                </a>
              </div>
            </div>

            <div className="comment-area" style={{ padding: '2rem', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%)', border: '2px solid #d6e3ff' }}>
              <h4 style={{ fontWeight: 800, color: '#003063', marginBottom: '1rem' }}>Siap Bergabung dengan Komunitas Kami?</h4>
              <p style={{ marginBottom: '1.5rem', color: '#424751', lineHeight: 1.6 }}>
                Jangan tunda lagi. Bergabung sekarang dan rasakan sendiri mengapa 1000+ member memilih Teknologi Santuy. Gratis, aman, dan support responsif 24/7.
              </p>
              <a href="https://discord.gg/adMaSMC4sc" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#7289da', color: 'white', fontWeight: 700, padding: '0.95rem 1.5rem', borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.95rem' }}>
                Buka Discord dan Bergabung Sekarang
              </a>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', fontStyle: 'italic' }}>
                Verifikasi instant • Chat dengan expert • Download unlimited konten
              </p>
            </div>
          </article>

          <aside className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="sidebar-ad">
              <div>
                <Script id="ad-sidebar-2" strategy="afterInteractive">
                  {`atOptions = { 'key' : '136aa22e44a04ff3d80d1888c11e7ecd', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };`}
                </Script>
                <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/136aa22e44a04ff3d80d1888c11e7ecd/invoke.js" />
              </div>
            </div>

            <div>
              <div className="section-title"><span style={{ width: '4px', height: '20px', background: '#bc0000', display: 'inline-block' }}></span> POPULER</div>
              <div className="popular-list">
                <a href="#"><span className="popular-number">01</span><h4 style={{ fontWeight: 700, fontSize: '0.875rem' }}>Bitcoin Tembus Rekor Baru, Investor Lokal Mulai Agresif</h4></a>
                <a href="#"><span className="popular-number">02</span><h4 style={{ fontWeight: 700, fontSize: '0.875rem' }}>Cara Mengaktifkan Fitur AI Baru di Smartphone Anda</h4></a>
                <a href="#"><span className="popular-number">03</span><h4 style={{ fontWeight: 700, fontSize: '0.875rem' }}>Elon Musk Kunjungi Jakarta, Bahas Investasi Starlink</h4></a>
                <a href="#"><span className="popular-number">04</span><h4 style={{ fontWeight: 700, fontSize: '0.875rem' }}>Kementerian Kominfo Siapkan Regulasi Baru Konten AI</h4></a>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid rgba(194, 198, 210, 0.3)', borderRadius: '0.5rem', padding: '1rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontWeight: 800, color: '#003063', fontSize: '0.85rem', marginBottom: '1rem' }}>REKOMENDASI SPONSOR</h3>
              <div id="container-48133abeb7c91d73ea045430da0d0442" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
              <Script async data-cfasync="false" src="https://pl29153574.profitablecpmratenetwork.com/48133abeb7c91d73ea045430da0d0442/invoke.js" />
            </div>

            <div style={{ background: '#f3f3f6', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, color: '#003063' }}>KATEGORI</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                <a style={{ background: 'white', padding: '0.375rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }} href="#">Teknologi</a>
                <a style={{ background: 'white', padding: '0.375rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }} href="#">Bisnis</a>
                <a style={{ background: 'white', padding: '0.375rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }} href="#">Gaya Hidup</a>
                <a style={{ background: 'white', padding: '0.375rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }} href="#">Otomotif</a>
              </div>
            </div>

            <div className="newsletter">
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Intisari Digital</h3>
              <p style={{ fontSize: '0.75rem', margin: '0.5rem 0' }}>Dapatkan update teknologi mingguan langsung di inbox Anda.</p>
              <input type="email" id="newsEmail" placeholder="Email Anda" className="newsletter-input" style={{ marginBottom: '0.75rem' }} />
              <button id="subscribeBtn" className="newsletter-btn">LANGGANAN</button>
            </div>
          </aside>
        </div>

        <div className="inline-ad" style={{ marginTop: '2rem' }}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <div className="ad-label">— Iklan —</div>
            <div style={{ background: '#ffffff', border: '1px solid #c2c6d2', borderRadius: '0.5rem', padding: '0.75rem', minWidth: '300px', textAlign: 'center', display: 'inline-block' }}>
              <Script id="ad-bottom" strategy="afterInteractive">
                {`atOptions = { 'key' : 'dc9dac060d8897a73c73d316590a3e03', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };`}
              </Script>
              <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/dc9dac060d8897a73c73d316590a3e03/invoke.js" />
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div>
            <div style={{ fontWeight: 800, color: '#003063' }}>TEKNOLOGI SANTUY</div>
            <p style={{ color: '#64748b', fontSize: '0.7rem' }}>© 2024 Portal Game & Teknologi Indonesia</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ fontSize: '0.7rem' }}>About</a>
            <a href="#" style={{ fontSize: '0.7rem' }}>Privacy</a>
            <a href="#" style={{ fontSize: '0.7rem' }}>Contact</a>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', color: '#64748b' }}>
            <span style={{ cursor: 'pointer' }}>f</span>
            <span style={{ cursor: 'pointer' }}>𝕏</span>
            <span style={{ cursor: 'pointer' }}>▶</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col gap-4 items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <span className="text-slate-400 font-medium animate-pulse">Memuat halaman...</span>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  );
}
