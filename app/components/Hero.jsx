export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hero-eyebrow reveal from-bottom" suppressHydrationWarning><i className="fa-solid fa-bolt"></i> Update harian tersedia!</div>
            <h1 className="hero-title reveal from-bottom stagger-1" suppressHydrationWarning>
              Download <span className="accent">Game Gratis</span><br />
              &amp; Tutorial<br />Teknologi
            </h1>
            <p className="hero-sub reveal from-bottom stagger-2" suppressHydrationWarning>
              Solusi digital santai tanpa ribet. Game PC, Android, emulator, tutorial error, tips teknologi — semua gratis buat kamu.
            </p>
            <div className="hero-btns reveal from-bottom stagger-3" suppressHydrationWarning>
              <a href="/blog" className="btn btn-yellow">
                <i className="fa-solid fa-newspaper"></i> Kunjungi Blog
              </a>
              <a href="https://discord.gg/dJzbq53jXH" className="btn btn-outline-white">
                <i className="fa-brands fa-discord"></i> Join Discord
              </a>
            </div>
          </div>

          <div className="hero-visual reveal from-right" suppressHydrationWarning>
            <div className="hero-monitor" style={{ padding: 0, overflow: 'hidden' }}>
              <video 
                src="/hero_video.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 0 }}
              ></video>
            </div>
            <div className="hero-badge b1"><i className="fa-solid fa-users"></i> 7.6K+ Subscribers</div>
            <div className="hero-badge b2"><i className="fa-solid fa-fire"></i> Update Harian</div>
          </div>
        </div>
      </div>
    </section>
  );
}
