'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LauncherPromo() {
  return (
    <section className="section section-alt" style={{ padding: '80px 0' }}>
      <div className="container" style={{ padding: '0 5%' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap-reverse', // On mobile, image goes on top
          background: 'linear-gradient(135deg, #0c1621, #0a0a0a)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Left Text */}
          <div style={{ 
            flex: '1 1 400px', 
            padding: '60px 8%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            zIndex: 2
          }}>
            <div style={{ 
              display: 'inline-block', 
              background: 'rgba(27, 246, 121, 0.15)', 
              color: '#1bf679', 
              padding: '8px 16px', 
              borderRadius: '24px', 
              fontSize: '12px', 
              fontWeight: '800', 
              marginBottom: '20px',
              letterSpacing: '1px',
              width: 'fit-content',
              textTransform: 'uppercase'
            }}>
              <i className="fa-solid fa-crown" style={{ marginRight: '6px' }}></i> Eksklusif Project
            </div>
            <h2 style={{ 
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', 
              fontWeight: 900, 
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '24px',
              textTransform: 'uppercase'
            }}>
              EA SPORTS<br/>FC™ 26 LAUNCHER
            </h2>
            <p style={{ 
              color: '#ccc', 
              fontSize: '1.1rem', 
              lineHeight: 1.6, 
              marginBottom: '40px'
            }}>
              Ubah pengalaman PES 2017 kamu menjadi Next-Gen! Kami membangun ulang UI/UX sehingga identik dengan sensasi visual EA FC 26, lengkap dengan instalasi 1-klik otomatis. Anti-ribet, ringan, dan revolusioner.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/launcher" className="ea-btn-green" style={{
                background: '#1bf679',
                color: '#000',
                padding: '16px 36px',
                borderRadius: '30px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'transform 0.2s, background 0.2s',
                textTransform: 'uppercase',
                boxShadow: '0 10px 20px rgba(27,246,121,0.2)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#14d265'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#1bf679'; }}
              >
                <i className="fa-solid fa-rocket"></i> Lihat Detail Launcher
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div style={{ 
            flex: '1.2 1 400px', 
            minHeight: '400px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Image 
              src="/launcher/cover_launcher_v.2.2.jpg" 
              alt="EA FC 26 Launcher Preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority={false}
            />
            {/* Gradient Overlay for seamless blending with text block */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, bottom: 0, width: '30%',
              background: 'linear-gradient(to right, #0c1621 0%, rgba(12,22,33,0) 100%)',
              zIndex: 1
            }} className="hide-on-mobile"></div>
            
            {/* Mobile bottom gradient (since it stacks with image on top) */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0, height: '30%',
              background: 'linear-gradient(to top, #0c1621 0%, rgba(12,22,33,0) 100%)',
              zIndex: 1
            }} className="show-on-mobile"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @media (min-width: 769px) {
          .show-on-mobile { display: none; }
        }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </section>
  );
}
