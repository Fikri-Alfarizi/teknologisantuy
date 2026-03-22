import Link from 'next/link';

export default function About() {
  return (
    <>
      <div className="divider"></div>

      {/* ══ TRUST MARQUEE ══ */}
      <div className="trust-section">
        <div className="marquee-track">
          <div className="trust-item"><i className="fa-brands fa-blogger"></i> Blogger</div>
          <div className="trust-item"><i className="fa-brands fa-youtube"></i> YouTube</div>
          <div className="trust-item"><i className="fa-brands fa-discord"></i> Discord</div>
          <div className="trust-item"><i className="fa-solid fa-gamepad"></i> PC Game</div>
          <div className="trust-item"><i className="fa-solid fa-mobile-screen"></i> Android</div>
          <div className="trust-item"><i className="fa-solid fa-screwdriver-wrench"></i> Tutorial</div>
          <div className="trust-item"><i className="fa-solid fa-bolt"></i> Anti Ribet</div>
          <div className="trust-item"><i className="fa-brands fa-instagram"></i> Instagram</div>
          {/* duplicate for seamless */}
          <div className="trust-item"><i className="fa-brands fa-blogger"></i> Blogger</div>
          <div className="trust-item"><i className="fa-brands fa-youtube"></i> YouTube</div>
          <div className="trust-item"><i className="fa-brands fa-discord"></i> Discord</div>
          <div className="trust-item"><i className="fa-solid fa-gamepad"></i> PC Game</div>
          <div className="trust-item"><i className="fa-solid fa-mobile-screen"></i> Android</div>
          <div className="trust-item"><i className="fa-solid fa-screwdriver-wrench"></i> Tutorial</div>
          <div className="trust-item"><i className="fa-solid fa-bolt"></i> Anti Ribet</div>
          <div className="trust-item"><i className="fa-brands fa-instagram"></i> Instagram</div>
        </div>
      </div>

      {/* ══ ABOUT ══ */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <div>
              <div className="section-eyebrow reveal from-bottom" suppressHydrationWarning><i className="fa-solid fa-info-circle"></i> Tentang Kami</div>
              <h2 className="section-title reveal from-bottom stagger-1" suppressHydrationWarning>Apa itu <span className="mark">Teknologi Santuy?</span></h2>
              <p className="section-desc reveal from-bottom stagger-2" suppressHydrationWarning>Platform digital untuk download game gratis, tutorial teknologi, dan tips santai sehari-hari. Kami hadir buat semua kalangan — dari pemula hingga yang udah pro.</p>
              <ul className="about-list">
                <li className="reveal from-left stagger-1" suppressHydrationWarning>
                  <div className="icon"><i className="fa-solid fa-gamepad"></i></div>
                  <div>
                    <h4>Game Gratis Tanpa Ribet</h4>
                    <p>PC, Android, dan emulator lengkap. Download langsung tanpa registrasi berbelit.</p>
                  </div>
                </li>
                <li className="reveal from-left stagger-2" suppressHydrationWarning>
                  <div className="icon"><i className="fa-solid fa-bolt"></i></div>
                  <div>
                    <h4>Tutorial Cepat &amp; Jelas</h4>
                    <p>Bahasa manusia, bukan kode-kode. Fix error dengan panduan step-by-step.</p>
                  </div>
                </li>
                <li className="reveal from-left stagger-3" suppressHydrationWarning>
                  <div className="icon"><i className="fa-solid fa-headset"></i></div>
                  <div>
                    <h4>Support Problem PC</h4>
                    <p>Komunitas Discord aktif siap bantu. Dari error DLL hingga driver crash.</p>
                  </div>
                </li>
              </ul>
              <div style={{ marginTop: '30px' }} className="reveal from-bottom stagger-3" suppressHydrationWarning>
                <Link href="/about" className="btn btn-outline-white" style={{ padding: '12px 24px', fontSize: '16px', color: 'var(--white)' }}>
                   Pelajari Selengkapnya <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </Link>
              </div>
            </div>

            <div className="about-stats-grid">
              <div className="stat-box reveal scale-in stagger-1" suppressHydrationWarning>
                <div className="stat-num">7.6K+</div>
                <div className="stat-lbl">Subscribers</div>
              </div>
              <div className="stat-box yellow-box reveal scale-in stagger-2" suppressHydrationWarning>
                <div className="stat-num">200K+</div>
                <div className="stat-lbl">Total Views</div>
              </div>
              <div className="stat-box reveal scale-in stagger-3" suppressHydrationWarning>
                <div className="stat-num">50+</div>
                <div className="stat-lbl">Artikel</div>
              </div>
              <div className="stat-box reveal scale-in stagger-4" suppressHydrationWarning>
                <div className="stat-num">1K+</div>
                <div className="stat-lbl">Member Discord</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
