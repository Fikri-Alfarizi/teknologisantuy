export const metadata = {
  title: "Tentang Kami - Teknologi Santuy",
  description: "Berkenalan dengan visi, misi, dan perjalanan komunitas Teknologi Santuy.",
};

export default function AboutPage() {
  return (
    <>
      {/* ══ HERO ABOUT ══ */}
      <section className="hero" style={{ padding: '120px 0 60px', minHeight: 'auto', display: 'flex', alignItems: 'center', background: 'var(--deep-blue)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero-eyebrow reveal from-bottom" style={{ display: 'inline-flex' }} suppressHydrationWarning>
            <i className="fa-solid fa-users"></i> Siapa Kami?
          </div>
          <h1 className="hero-title reveal from-bottom stagger-1" style={{ fontSize: '3.5rem', margin: '20px 0' }} suppressHydrationWarning>
            Tentang <span className="accent">Teknologi Santuy</span>
          </h1>
          <p className="hero-sub reveal from-bottom stagger-2" style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.1rem', opacity: 0.9 }} suppressHydrationWarning>
            Berawal dari keresahan mencari link download game yang dipenuhi iklan dan jebakan malware, kami bangkit memberikan ekosistem digital yang bersih, jujur, santai, dan tanpa ribet untuk semua orang kelangan.
          </p>
        </div>
      </section>

      {/* ══ ABOUT FULL CONTENT ══ */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="about-grid" style={{ alignItems: 'center', gap: '60px' }}>
            
            <div className="about-stats-grid" style={{ order: 2 }}>
              <div className="stat-box reveal scale-in stagger-1" suppressHydrationWarning>
                <div className="stat-num" style={{ fontSize: '3rem' }}>7.6K+</div>
                <div className="stat-lbl" style={{ opacity: 0.8 }}>YouTube Subscribers</div>
              </div>
              <div className="stat-box yellow-box reveal scale-in stagger-2" suppressHydrationWarning>
                <div className="stat-num" style={{ fontSize: '3rem' }}>1K+</div>
                <div className="stat-lbl" style={{ fontWeight: 800 }}>Member Discord</div>
              </div>
              <div className="stat-box yellow-box reveal scale-in stagger-3" suppressHydrationWarning>
                <div className="stat-num" style={{ fontSize: '3rem' }}>200K+</div>
                <div className="stat-lbl" style={{ fontWeight: 800 }}>Total Views Channel</div>
              </div>
              <div className="stat-box reveal scale-in stagger-4" suppressHydrationWarning>
                <div className="stat-num" style={{ fontSize: '3rem' }}>100%</div>
                <div className="stat-lbl" style={{ opacity: 0.8 }}>Aman & Tanpa Iklan Pop-up</div>
              </div>
            </div>

            <div style={{ order: 1 }}>
              <div className="section-eyebrow reveal from-bottom" suppressHydrationWarning><i className="fa-solid fa-bullseye"></i> Visi & Misi Kami</div>
              <h2 className="section-title reveal from-bottom stagger-1" suppressHydrationWarning>Misi Solusi Digital <span className="mark">Anti Ribet</span></h2>
              <p className="section-desc reveal from-bottom stagger-2" style={{ marginBottom: '30px', fontSize: '1.05rem', lineHeight: 1.6 }} suppressHydrationWarning>
                Kami membangun tempat nongkrong virtual di mana siapapun—dari user awam hingga pro—bisa belajar menyelesaikan eror PC sendiri, mencari komponen rakitan, dan menikmati rilis game PC/Android berkualitas tanpa pusing.
              </p>
              
              <ul className="about-list">
                <li className="reveal from-left stagger-1" suppressHydrationWarning>
                  <div className="icon"><i className="fa-solid fa-shield-halved"></i></div>
                  <div>
                    <h4>Keamanan File Nomor Satu</h4>
                    <p>Menjadikan setiap link tutorial dan game bebas dari adware atau popup berbahaya. Kami menggunakan server handal seperti GoFile & Google Drive.</p>
                  </div>
                </li>
                <li className="reveal from-left stagger-2" suppressHydrationWarning>
                  <div className="icon"><i className="fa-solid fa-bolt"></i></div>
                  <div>
                    <h4>Bahasa Manusia, Bukan Teknis</h4>
                    <p>Setiap troubleshooting dan blog ditulis/divideo secara langsung padat jelas untuk konsumsi yang cepat dicerna.</p>
                  </div>
                </li>
                <li className="reveal from-left stagger-3" suppressHydrationWarning>
                  <div className="icon"><i className="fa-solid fa-people-group"></i></div>
                  <div>
                    <h4>Solidaritas Komunitas Aktif</h4>
                    <p>Lewat Discord, setiap ada keluhan PC crash, lag game, atau error instalasi pasti dibantu jawab oleh admin & puluhan tech-enthusiast lain setiap hari.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section className="section section-alt" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="section-eyebrow reveal from-bottom" style={{ display: 'inline-flex', marginBottom: '16px' }} suppressHydrationWarning><i className="fa-solid fa-handshake"></i> Terbuka Untuk Umum</div>
          <h2 className="section-title reveal from-bottom stagger-1" style={{ fontSize: '2.5rem' }} suppressHydrationWarning>Mari Bergabung Bersama Kami!</h2>
          <p className="section-desc reveal from-bottom stagger-2" style={{ margin: '0 auto 40px', maxWidth: '600px', fontSize: '1.1rem' }} suppressHydrationWarning>
            Jangan merakit komponen, main game, atau memecahkan error PC sendirian. Jadilah bagian dari keluarga besar Teknologi Santuy sekarang.
          </p>
          <div className="hero-buttons reveal from-bottom stagger-3" style={{ justifyContent: 'center' }} suppressHydrationWarning>
            <a href="https://discord.gg/9WqXnkrGZJ" target="_blank" rel="noopener noreferrer" className="btn btn-discord" style={{ padding: '16px 32px', fontSize: '18px' }}>
              <i className="fa-brands fa-discord"></i> Mulai Nongkrong Ke Discord
            </a>
            <a href="https://youtube.com/@TeknologiSantuy" target="_blank" rel="noopener noreferrer" className="btn btn-youtube" style={{ padding: '16px 32px', fontSize: '18px' }}>
              <i className="fa-brands fa-youtube"></i> Tonton YouTube Kami
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
