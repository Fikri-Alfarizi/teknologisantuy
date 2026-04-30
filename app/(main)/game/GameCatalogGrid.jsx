'use client';

import { useState, useMemo } from 'react';
import GameDownloadButton from './GameDownloadButton';

export default function GameCatalogGrid({ games, hideFilters = false, isSidebar = false }) {
  const [sizeFilter, setSizeFilter] = useState('all'); // all, light (<10GB), medium (10-50GB), heavy (>50GB)

  const parseSizeGB = (sizeStr) => {
    if (!sizeStr) return 0;
    const s = sizeStr.toUpperCase().replace(',', '.');
    if (s.includes('MB')) return parseFloat(s) / 1024;
    if (s.includes('GB')) return parseFloat(s);
    if (s.includes('TB')) return parseFloat(s) * 1024;
    return 0;
  };

  const filteredGames = useMemo(() => {
    if (hideFilters) return games; // Skip filtering logic if filters are hidden
    return games.filter(game => {
      if (sizeFilter === 'all') return true;
      const sizeGB = parseSizeGB(game.size);
      if (sizeFilter === 'light') return sizeGB < 10 && sizeGB > 0;
      if (sizeFilter === 'medium') return sizeGB >= 10 && sizeGB <= 50;
      if (sizeFilter === 'heavy') return sizeGB > 50;
      return true;
    });
  }, [games, sizeFilter, hideFilters]);

  const reportLink = async (gameId, gameTitle) => {
    if (confirm(`Laporkan link mati untuk game "${gameTitle}"?`)) {
      try {
        await fetch('/api/report-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId, gameTitle })
        });
        alert('Laporan berhasil dikirim ke Admin. Terima kasih!');
      } catch (err) {
        alert('Gagal mengirim laporan.');
      }
    }
  };

  return (
    <div>
      {/* FILTER BAR */}
      {!hideFilters && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#8f98a0', fontSize: '14px', fontWeight: 'bold' }}><i className="fa-solid fa-filter"></i> Filter Ukuran:</span>
          <button onClick={() => setSizeFilter('all')} className={`filter-btn ${sizeFilter === 'all' ? 'active' : ''}`}>Semua</button>
          <button onClick={() => setSizeFilter('light')} className={`filter-btn ${sizeFilter === 'light' ? 'active' : ''}`}>Ringan (&lt;10 GB)</button>
          <button onClick={() => setSizeFilter('medium')} className={`filter-btn ${sizeFilter === 'medium' ? 'active' : ''}`}>Sedang (10-50 GB)</button>
          <button onClick={() => setSizeFilter('heavy')} className={`filter-btn ${sizeFilter === 'heavy' ? 'active' : ''}`}>Berat (&gt;50 GB)</button>
        </div>
      )}

      {filteredGames.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', opacity: 0.6 }}>
          <i className="fa-solid fa-folder-open" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
          <h3>Tidak ada game yang sesuai filter</h3>
        </div>
      )}

      <div className={isSidebar ? "" : "showcase-grid"} style={isSidebar ? { display: 'grid', gridTemplateColumns: '1fr', gap: '24px' } : { gap: '24px', border: 'none', background: 'transparent' }}>
        {filteredGames.map((item) => (
          <div 
            key={item.id} 
            className="showcase-card game-card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              border: '2px solid rgba(255,255,255,0.08)', 
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Size Badge */}
            <div style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 2,
              background: 'var(--blue)', color: 'white',
              border: '2px solid #000', borderRadius: '24px',
              padding: '4px 12px', fontSize: '12px', fontWeight: '800',
              boxShadow: '2px 2px 0px #000'
            }}>
              <i className="fa-solid fa-hard-drive"></i> {item.size}
            </div>

            {/* Game Cover */}
            <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
              {item.image ? (
                <img src={item.image} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-image" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
                </div>
              )}
            </div>
            
            <div className="sc-body" style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <span className="sc-tag" style={{ alignSelf: 'flex-start' }}><i className="fa-regular fa-calendar" style={{ marginRight: 6 }}></i> {item.timestamp}</span>
              <h3 style={{ margin: '12px 0 8px', fontSize: '16px', lineHeight: '1.4' }}>{item.title}</h3>
              
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '11.5px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ opacity: 0.6 }}>Password:</span> <strong style={{ color: 'var(--yellow)' }}>{item.password}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>Link:</span>{" "}
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>
                    {(() => {
                      try { return new URL(item.link).hostname; } catch { return "Download Link"; }
                    })()}
                  </a>
                </div>
              </div>

              {/* REPORT LINK BTN */}
              <button 
                onClick={() => reportLink(item.id, item.title)}
                style={{ 
                  background: 'transparent', border: 'none', color: '#8f98a0', 
                  fontSize: '11px', textAlign: 'left', marginBottom: '12px', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' 
                }}
              >
                <i className="fa-solid fa-triangle-exclamation"></i> Lapor Link Mati
              </button>
              
               <GameDownloadButton game={item} style={{
                marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px 16px', background: 'var(--yellow)',
                border: '2px solid #000', borderRadius: '8px',
                color: 'var(--bg)', textDecoration: 'none',
                fontWeight: '800', fontSize: '16px', width: '100%',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.5)', transition: 'all 0.2s ease'
              }} className="game-download-btn">
                <i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i> Download Sekarang
              </GameDownloadButton>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .filter-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
        }
        .filter-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        .filter-btn.active {
          background: var(--yellow);
          color: #000;
          border-color: var(--yellow);
        }
      `}</style>
    </div>
  );
}
