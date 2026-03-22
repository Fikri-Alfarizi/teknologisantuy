'use client';

import Link from 'next/link';

export default function TutorialDetail() {
  // Bisa diganti dengan dynamic routing jika diperlukan
  const tutorial = {
    id: 1,
    cat: 'windows',
    icon: 'fa-laptop-code',
    title: 'Cara Mengatasi Error 0xc00007b',
    difficulty: 'Beginner',
    diffColor: 'var(--blue)',
    shortDesc: 'Sering muncul saat membuka game? Ini solusi lengkap AIO Runtimes & DirectX.',
    content: `
      <h2>Apa itu Error 0xc00007b?</h2>
      <p>Error 0xc00007b adalah salah satu error yang paling sering muncul saat menjalankan game atau aplikasi di Windows. Error ini biasanya terjadi karena:</p>
      <ul>
        <li>Library DirectX yang tidak lengkap atau tidak kompatibel</li>
        <li>Visual C++ Runtime yang sudah usang atau tidak terinstall</li>
        <li>File game yang corrupt atau tidak kompatibel dengan sistem</li>
        <li>Driver VGA yang tidak mendukung</li>
      </ul>

      <h2>Solusi 1: Install DirectX Terbaru</h2>
      <ol>
        <li>Download <strong>DirectX End-User Runtime</strong> dari website Microsoft official</li>
        <li>Extract file .exe yang sudah didownload</li>
        <li>Jalankan installer dan ikuti instruksi hingga selesai</li>
        <li>Restart komputer Anda</li>
        <li>Coba jalankan game yang error tadi</li>
      </ol>

      <h2>Solusi 2: Install Visual C++ Runtime (Rekomendasi)</h2>
      <p>Solusi ini paling sering berhasil mengatasi error 0xc00007b. Ikuti langkah berikut:</p>
      <ol>
        <li>Download <strong>AIO Runtimes</strong> dari situs lokal terpercaya</li>
        <li>Extract file .rar yang sudah didownload</li>
        <li>Jalankan file <code>install_all.bat</code> atau <code>InstallAll.bat</code> sebagai Administrator</li>
        <li>Tunggu proses instalasi hingga selesai (bisa memakan waktu 5-10 menit)</li>
        <li>Restart komputer</li>
        <li>Coba jalankan game lagi</li>
      </ol>

      <h2>Solusi 3: Update Driver VGA</h2>
      <p>Kadang error ini juga disebabkan oleh driver VGA yang outdated:</p>
      <ol>
        <li>Klik kanan <strong>Start Menu</strong> → <strong>Device Manager</strong></li>
        <li>Cari <strong>Display adapters</strong> dan expand</li>
        <li>Klik kanan kartu grafis Anda (Nvidia/AMD/Intel) → <strong>Update driver</strong></li>
        <li>Pilih <strong>Search automatically for updated driver software</strong></li>
        <li>Tunggu hingga selesai dan restart</li>
      </ol>

      <h2>Solusi 4: Compatibility Mode (Jika Masih Error)</h2>
      <ol>
        <li>Klik kanan file .exe game → <strong>Properties</strong></li>
        <li>Pilih tab <strong>Compatibility</strong></li>
        <li>Centang <strong>Run this program in compatibility mode for:</strong></li>
        <li>Pilih Windows 7 Service Pack 1 atau Windows 8</li>
        <li>Centang juga <strong>Run this program as an administrator</strong></li>
        <li>Klik <strong>Apply</strong> → <strong>OK</strong></li>
      </ol>

      <h2>Tips Tambahan</h2>
      <ul>
        <li><strong>Disable full-screen optimizations:</strong> Ada di tab Compatibility, bisa membantu mengatasi lag atau crash</li>
        <li><strong>Update Windows:</strong> Pastikan Windows Anda sudah update ke versi terbaru</li>
        <li><strong>Aman copy-paste:</strong> Jika masih error setelah semua solusi, coba download ulang game dari sumber terpercaya</li>
      </ul>

      <h2>Video Tutorial (Opsional)</h2>
      <p>Untuk visual guide yang lebih jelas, Anda bisa menonton video tutorial di channel YouTube kami dengan judul yang sama.</p>
    `
  };

  return (
    <>
      {/* ══ HERO DETAIL ══ */}
      <section className="hero" style={{ padding: '120px 0 60px', minHeight: 'auto', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div className="section-eyebrow reveal from-bottom" style={{ display: 'inline-flex', margin: 0 }} suppressHydrationWarning>
              <i className="fa-solid fa-arrow-left"></i>
            </div>
            <Link href="/launcher" style={{ color: 'var(--yellow)', textDecoration: 'none', fontWeight: '700' }}>
              Kembali ke Launcher
            </Link>
          </div>

          <div style={{
            display: 'inline-block',
            background: tutorial.diffColor,
            color: tutorial.diffColor === 'var(--yellow)' ? '#000' : '#fff',
            padding: '6px 14px',
            borderRadius: '24px',
            fontSize: '12px',
            fontWeight: '800',
            marginBottom: '20px'
          }}>
            {tutorial.difficulty}
          </div>

          <h1 className="hero-title reveal from-bottom stagger-1" style={{ fontSize: '3rem', margin: '20px 0' }} suppressHydrationWarning>
            {tutorial.title}
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', opacity: 0.8 }}>
            <span><i className="fa-solid fa-tag" style={{ marginRight: '8px' }}></i> {tutorial.cat.toUpperCase()}</span>
          </div>
        </div>
      </section>

      {/* ══ DETAIL CONTENT ══ */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '2px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '48px',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: '1.8'
            }}>
              <div dangerouslySetInnerHTML={{ __html: tutorial.content }} style={{
                fontSize: '1.1rem'
              }} />

              <style jsx>{`
                :global(h2) {
                  color: var(--yellow);
                  margin-top: 32px;
                  margin-bottom: 16px;
                  font-size: 1.6rem;
                  font-weight: 800;
                }
                :global(h3) {
                  color: #fff;
                  margin-top: 24px;
                  margin-bottom: 12px;
                  font-size: 1.3rem;
                }
                :global(p) {
                  margin-bottom: 16px;
                  opacity: 0.9;
                }
                :global(ul), :global(ol) {
                  margin-left: 20px;
                  margin-bottom: 16px;
                }
                :global(li) {
                  margin-bottom: 8px;
                  opacity: 0.85;
                }
                :global(strong) {
                  color: var(--yellow);
                  font-weight: 700;
                }
                :global(code) {
                  background: rgba(255,255,255,0.1);
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-family: 'Courier New', monospace;
                  color: var(--yellow);
                }
              `}</style>
            </div>

            {/* CTA Bawah */}
            <div style={{ textAlign: 'center', marginTop: '48px', padding: '32px', background: 'var(--deep-blue)', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '12px' }}>Masih Ada Pertanyaan?</h3>
              <p style={{ opacity: 0.8, marginBottom: '24px' }}>Tanyakan kepada komunitas di Discord kami, admin dan member siap membantu!</p>
              <a href="https://discord.gg/dJzbq53jXH" className="btn btn-yellow" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-discord"></i> Tanya di Discord
              </a>
            </div>

            {/* Suggested Tutorials */}
            <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ color: 'var(--yellow)', marginBottom: '24px', fontSize: '1.5rem' }}><i className="fa-solid fa-lightbulb" style={{ marginRight: '12px' }}></i>Tutorial Serupa Lainnya</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Install APK + OBB Manual di Android 14', cat: 'ANDROID', diff: 'Intermediate' },
                  { title: 'Optimasi Registry untuk Gaming', cat: 'OPTIMASI', diff: 'Expert' },
                  { title: 'Setting PPSSPP 60FPS Anti Lag', cat: 'EMULATOR', diff: 'Beginner' }
                ].map((item, i) => (
                  <Link key={i} href="/launcher" style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }} className="suggested-tutorial">
                    <div style={{ fontSize: '12px', color: 'var(--yellow)', marginBottom: '8px', fontWeight: '700' }}>
                      {item.cat}
                    </div>
                    <h4 style={{ marginBottom: '12px', lineHeight: '1.4' }}>{item.title}</h4>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                      Level: <strong>{item.diff}</strong>
                    </div>
                  </Link>
                ))}
              </div>

              <style jsx>{`
                .suggested-tutorial:hover {
                  background: rgba(255,255,255,0.08) !important;
                  border-color: var(--yellow) !important;
                  transform: translateY(-4px);
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
