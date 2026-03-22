import React from 'react';

export default function LauncherCommunity() {
  return (
    <div style={{ padding: '60px 5% 80px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="ea-community-box">
        {/* Left Side: Text and Button */}
        <div className="ea-community-content">
          <h2 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 900, 
            marginBottom: '20px', 
            lineHeight: 1.1,
            color: '#fff',
            textTransform: 'uppercase'
          }}>
            JOIN THE<br/>COMMUNITY
          </h2>
          <p style={{ 
            color: '#ccc', 
            fontSize: '1.2rem', 
            lineHeight: 1.6, 
            marginBottom: '40px',
            maxWidth: '100%'
          }}>
            Bergabunglah dengan ribuan player lainnya di server Discord resmi Teknologi Santuy. Dapatkan update launcher instan, sampaikan laporan bug langsung ke developer, dan berpartisipasi dalam event eksklusif.
          </p>
          <div>
            <a 
              href="https://discord.gg/9WqXnkrGZJ" 
              target="_blank" 
              className="ea-btn-green" 
              style={{ 
                padding: '16px 40px', 
                fontSize: '1.2rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              <i className="fa-brands fa-discord" style={{ marginRight: '12px', fontSize: '1.4rem' }}></i> Join Discord Server
            </a>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="ea-community-img">
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .ea-community-box {
          display: flex;
          width: 100%;
          max-width: 1200px;
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }
        .ea-community-content {
          flex: 1 1 500px;
          padding: 60px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(135deg, #111, #1a1a1a);
        }
        .ea-community-img {
          flex: 1 1 400px;
          background: url("https://drop-assets.ea.com/images/2KVQq4lSBcPUJct6DEjdic/c06c2dc0e4ffc9a213fd1e8d8a7c2e72/FC26_Rev_Stadium_Clubs_16x9.jpg?im=AspectCrop=(16,9),xPosition=0.5,yPosition=0.5;Resize=(2560)&q=80") center/cover no-repeat;
          min-height: 500px;
        }
        @media (max-width: 900px) {
          .ea-community-box {
            flex-direction: column;
          }
          .ea-community-content {
            padding: 40px 24px;
            text-align: center;
          }
          .ea-community-img {
            min-height: 300px;
          }
        }
      `}} />
    </div>
  );
}
