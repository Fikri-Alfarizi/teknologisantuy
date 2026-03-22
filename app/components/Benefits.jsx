export default function Benefits() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="docs-grid">
            <div>
              <div className="section-eyebrow reveal from-bottom" suppressHydrationWarning><i className="fa-solid fa-list-check"></i> Cara Pakai</div>
              <h2 className="section-title reveal from-bottom stagger-1" suppressHydrationWarning>Apa yang <span className="mark">Kamu Dapat?</span></h2>
              <p className="section-desc reveal from-bottom stagger-2" style={{ marginBottom: 32 }} suppressHydrationWarning>
                Semua konten dirancang mudah diakses — tanpa daftar, tanpa bayar, langsung pakai.
              </p>
              <div className="steps-list">
                <div className="step-item reveal from-left stagger-1" suppressHydrationWarning>
                  <div className="step-num">1</div>
                  <div>
                    <h4>Kunjungi Blog</h4>
                    <p>Buka blog Teknologi Santuy dan jelajahi ratusan konten game, launcher eksklusif, dan tips teknologi terbaru.</p>
                  </div>
                </div>
                <div className="step-item reveal from-left stagger-2" suppressHydrationWarning>
                  <div className="step-num">2</div>
                  <div>
                    <h4>Pilih Kategori</h4>
                    <p>Browse berdasar kategori — Game, Launcher, atau Tips. Semua tersusun rapi dan mudah dicari.</p>
                  </div>
                </div>
                <div className="step-item reveal from-left stagger-3" suppressHydrationWarning>
                  <div className="step-num">3</div>
                  <div>
                    <h4>Download atau Ikuti Panduan</h4>
                    <p>Langsung download game atau gunakan launcher eksklusif kami secara gratis.</p>
                  </div>
                </div>
                <div className="step-item reveal from-left stagger-4" suppressHydrationWarning>
                  <div className="step-num">4</div>
                  <div>
                    <h4>Gabung Discord untuk Support</h4>
                    <p>Ada pertanyaan? Discord kami aktif 24/7 dengan komunitas yang ramah dan admin responsif.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="benefit-panel reveal from-right" suppressHydrationWarning>
              <div className="benefit-panel-header">
                <i className="fa-solid fa-box-open"></i> Tersedia di Teknologi Santuy
              </div>
              <div className="benefit-row">
                <div className="benefit-icon"><i className="fa-solid fa-gamepad"></i></div>
                <div><span>Download Game Gratis</span><small>PC, Android &amp; Emulator</small></div>
                <div className="arr"><i className="fa-solid fa-chevron-right"></i></div>
              </div>
              <div className="benefit-row">
                <div className="benefit-icon"><i className="fa-solid fa-book"></i></div>
                <div><span>Project Eksklusif</span><small>Launcher Custom EA FC 26</small></div>
                <div className="arr"><i className="fa-solid fa-chevron-right"></i></div>
              </div>
              <div className="benefit-row">
                <div className="benefit-icon"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                <div><span>Solusi Error &amp; Bug</span><small>Windows, Driver, Software</small></div>
                <div className="arr"><i className="fa-solid fa-chevron-right"></i></div>
              </div>
              <div className="benefit-row">
                <div className="benefit-icon"><i className="fa-solid fa-comments"></i></div>
                <div><span>Komunitas Discord</span><small>1000+ member aktif</small></div>
                <div className="arr"><i className="fa-solid fa-chevron-right"></i></div>
              </div>
              <div className="benefit-row">
                <div className="benefit-icon"><i className="fa-solid fa-tv"></i></div>
                <div><span>Video Tutorial YouTube</span><small>7.6K+ subscribers</small></div>
                <div className="arr"><i className="fa-solid fa-chevron-right"></i></div>
              </div>
              <div className="benefit-row">
                <div className="benefit-icon"><i className="fa-solid fa-bolt"></i></div>
                <div><span>Update Harian</span><small>Konten baru setiap hari</small></div>
                <div className="arr"><i className="fa-solid fa-chevron-right"></i></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-block reveal from-bottom" suppressHydrationWarning>
            <h2 className="archivo-black">Jangan Ketinggalan Update!</h2>
            <p>Bergabung bersama ribuan gamer dan tech enthusiast yang sudah merasakan manfaatnya.</p>
            <div className="cta-btns">
              <a href="/blog" className="btn btn-blue">
                <i className="fa-solid fa-newspaper"></i> Kunjungi Blog Sekarang
              </a>
              <a href="https://discord.gg/dJzbq53jXH" className="btn btn-white">
                <i className="fa-brands fa-discord"></i> Gabung Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
