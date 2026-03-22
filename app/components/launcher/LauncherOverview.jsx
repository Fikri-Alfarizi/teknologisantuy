import React from 'react';

export default function LauncherOverview() {
  return (
    <>
      {/* Hero Section */}
      <section className="ea-hero" style={{ padding: '40px 5% 80px' }}>
        <div className="ea-hero-img">
          {/* Mock image area representing the EA FC cover art / launcher UI */}
          <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'center', gap: 12, opacity: 0.6 }}>
            <i className="fa-brands fa-windows" style={{ fontSize: 24 }}></i>
            <i className="fa-brands fa-steam" style={{ fontSize: 24 }}></i>
          </div>
        </div>
        <div className="ea-hero-content">
          <h1 className="ea-hero-title">EA SPORTS<br />FC™ 26<br />LAUNCHER</h1>
          <p className="ea-hero-desc">
            The Ultimate Launcher for PES 2017. Experience next-gen gameplay powered by community feedback. Manage your database, rosters, and mods seamlessly in one pristine interface. The pitch is yours.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="https://pastelink.net/3n0lqhgl" target="_blank" className="ea-btn-green">
              Download Sekarang <i className="fa-solid fa-arrow-right"></i>
            </a>
            <a href="https://youtu.be/4cl_rnjFh_k?si=cUfql9Pms-CQp3bp" target="_blank" className="ea-btn-outline">
              Watch Trailer <i className="fa-regular fa-circle-play"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <section className="ea-features">
        <h2 className="ea-features-title">Features</h2>
        <div className="ea-features-showcase">
          {/* Dots placeholder */}
          <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1bf679' }}></div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></div>
          </div>
        </div>
        <div style={{ marginTop: 40, maxWidth: 800, margin: '40px auto 0' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 16 }}>OVERHAULED UI, POWERED BY PES 2017 ENGINE</h3>
          <p style={{ color: '#ccc', marginBottom: 24 }}>
            Play your custom EA SPORTS FC 26 with an unprecedented UI overhaul. Features auto-modding and seamless team selection right from the launcher. Designed by Fikri Al Farizi.
          </p>
        </div>
      </section>

      {/* Featured News */}
      <section style={{ padding: '40px 0' }}>
        <div className="ea-news-featured">
          <div className="ea-news-content" style={{ maxWidth: 400 }}>
            <span style={{ color: '#1bf679', fontWeight: 800, fontSize: 12, letterSpacing: 2 }}>EPISODE 01</span>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 900, margin: '20px 0', lineHeight: 1 }}>ANSWER<br />THE CALL</h2>
            <p style={{ color: '#ccc', marginBottom: 24 }}>New season updates are here. Check the patch notes and download the brand new database seamlessly.</p>
            <a href="#" className="ea-btn-outline" style={{ border: 'none', padding: 0 }}>
              Read Article <i className="fa-solid fa-arrow-right" style={{ color: '#1bf679' }}></i>
            </a>
          </div>
          {/* Decorative shapes */}
          <div className="ea-news-icon">
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '20rem', color: 'transparent', WebkitTextStroke: '2px #1bf679' }}></i>
          </div>
        </div>
      </section>

      {/* The Club is Yours (Footer CTA) */}
      <section className="ea-club">
        <div className="ea-club-img"></div>
        <div className="ea-club-content">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 20 }}>THE PITCH IS YOURS</h2>
          <p style={{ color: '#ccc', fontSize: '1.1rem', marginBottom: 32, lineHeight: 1.6 }}>
            Play EA SPORTS FC™ 26 Launcher with an unmatched gameplay experience. Join the community Discord to follow updates, report bugs, and unleash the true potential of your PES 2017 setup.
          </p>
          <div>
            <a href="https://discord.gg/9WqXnkrGZJ" target="_blank" className="ea-btn-green">
              Join Discord Server
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
