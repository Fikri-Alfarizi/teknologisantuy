export default function Features() {
  return (
    <>
      <section className="section section-alt">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 40 }}>
            <div className="section-eyebrow reveal from-bottom" style={{ display: 'inline-flex' }} suppressHydrationWarning>
              <i className="fa-solid fa-star"></i> Keunggulan
            </div>
            <h2 className="section-title reveal from-bottom stagger-1" suppressHydrationWarning>
              Kenapa Pilih <span className="mark">Teknologi Santuy?</span>
            </h2>
            <p className="section-desc reveal from-bottom stagger-2" suppressHydrationWarning>
              Bukan cuma kata-kata. Ini value nyata yang bakal kamu rasakan.
            </p>
          </div>
          <div className="features-grid reveal from-bottom stagger-3" suppressHydrationWarning>
            <div className="feature-card">
              <div className="fc-num">01</div>
              <div className="fc-icon"><i className="fa-solid fa-fire"></i></div>
              <h3>Game Gratis Tanpa Ribet</h3>
              <p>Direct link, cloud cepat, bebas iklan jebakan. Download langsung main tanpa drama.</p>
            </div>
            <div className="feature-card">
              <div className="fc-num">02</div>
              <div className="fc-icon"><i className="fa-solid fa-bolt"></i></div>
              <h3>Tutorial Cepat &amp; Jelas</h3>
              <p>Fix error DLL, DirectX, VCRedist dalam hitungan menit. Panduan screenshot lengkap.</p>
            </div>
            <div className="feature-card">
              <div className="fc-num">03</div>
              <div className="fc-icon"><i className="fa-solid fa-screwdriver-wrench"></i></div>
              <h3>Support Problem PC</h3>
              <p>Tanya di Discord, dibantu komunitas &amp; admin responsif. Gratis, cepat, jelas.</p>
            </div>
            <div className="feature-card" style={{ borderRight: 'none' }}>
              <div className="fc-num">04</div>
              <div className="fc-icon"><i className="fa-solid fa-rotate"></i></div>
              <h3>Update Game Terbaru</h3>
              <p>Koleksi selalu diperbarui setiap minggu. Tidak ketinggalan rilis terbaru.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="container" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
        <div className="stats-bar reveal from-bottom" suppressHydrationWarning>
          <div className="stats-bar-item">
            <span className="big" data-target="7600" data-suf="+">7.6K+</span>
            <span className="lbl"><i className="fa-brands fa-youtube" style={{ color: 'var(--yellow)' }}></i> Subscribers</span>
          </div>
          <div className="stats-bar-item">
            <span className="big" data-target="200000" data-suf="+">200K+</span>
            <span className="lbl"><i className="fa-solid fa-eye" style={{ color: 'var(--yellow)' }}></i> Total Views</span>
          </div>
          <div className="stats-bar-item">
            <span className="big" data-target="50" data-suf="+">50+</span>
            <span className="lbl"><i className="fa-solid fa-file-lines" style={{ color: 'var(--yellow)' }}></i> Artikel</span>
          </div>
          <div className="stats-bar-item">
            <span className="big" data-target="1000" data-suf="+">1K+</span>
            <span className="lbl"><i className="fa-brands fa-discord" style={{ color: 'var(--yellow)' }}></i> Member Discord</span>
          </div>
        </div>
      </div>
    </>
  );
}
