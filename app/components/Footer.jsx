import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', height: 42, width: 42 }}>
                <Image 
                  src="/logo.png" 
                  alt="TS Logo" 
                  width={42} 
                  height={42} 
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="brand-text" style={{ fontSize: 20 }}>Teknologi<br /><span>Santuy</span></div>
            </Link>
            <p className="footer-brand-desc">
              Platform digital terlengkap untuk download game gratis, tutorial IT, dan tips gadget harian. Santuy, jelas, anti ribet.
            </p>
            <div className="footer-social" style={{ marginTop: 20 }}>
              <a href="https://www.youtube.com/@TeknologiSantuy" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa-brands fa-youtube"></i></a>
              <a href="https://discord.gg/dJzbq53jXH" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa-brands fa-discord"></i></a>
              <a href="https://www.instagram.com/fikrialfrz/" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://teknologisantuy1.blogspot.com/" className="social-btn"><i className="fa-brands fa-blogger-b"></i></a>
            </div>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Navigasi</h4>
              <ul>
                <li><Link href="/"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> Home</Link></li>
                <li><Link href="/blog"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> Blog</Link></li>
                <li><Link href="/launcher"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> Launcher</Link></li>
                <li><Link href="/game"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> Game</Link></li>
                <li><Link href="/about"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> About</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Game</h4>
              <ul>
                <li><Link href="/game"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> PC Game</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><Link href="/about"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> About</Link></li>
                <li><Link href="/privacy"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> Privacy Policy</Link></li>
                <li><Link href="/disclaimer"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> Disclaimer</Link></li>
                <li><Link href="/contact"><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: 'var(--yellow)' }}></i> Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom" suppressHydrationWarning style={{ justifyContent: 'center' }}>
          <p style={{ textAlign: 'center' }}>© 2026 Teknologi Santuy. Official Website. Seluruh Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
