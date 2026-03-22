import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Teknologi Santuy',
  description: 'Kebijakan privasi resmi Teknologi Santuy.',
};

export default function PrivacyPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: '#ffe600',
        border: '4px solid #000',
        padding: '40px 30px',
        boxShadow: '12px 12px 0 #000',
        color: '#000',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: '950', 
          textTransform: 'uppercase', 
          margin: '0 0 20px 0',
          letterSpacing: '-1px',
          lineHeight: '1'
        }}>
          Privacy Policy
        </h1>
        
        <div style={{ 
          background: '#000', 
          color: '#ffe600', 
          display: 'inline-block', 
          padding: '8px 16px', 
          fontWeight: '900',
          fontSize: '18px',
          textTransform: 'uppercase',
          marginBottom: '30px'
        }}>
          Belum di Implementasikan
        </div>

        <p style={{ fontSize: '16px', fontWeight: '600', opacity: 0.8, marginBottom: '40px' }}>
          Halaman ini sedang dalam tahap penyusunan legalitas resmi. Silakan cek kembali dalam waktu dekat.
        </p>

        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: '#000',
          color: '#fff',
          padding: '14px 24px',
          textDecoration: 'none',
          fontWeight: '900',
          fontSize: '14px',
          textTransform: 'uppercase',
          border: 'none',
          boxShadow: '4px 4px 0 #555',
          transition: 'all 0.1s'
        }}>
          <span style={{ fontSize: '18px' }}>←</span> Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
