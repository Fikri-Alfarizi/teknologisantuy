'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GameDetailModal({ appId, onClose }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, success, error
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  useEffect(() => {
    if (!appId) return;
    
    setLoading(true);
    setRequestStatus('idle');
    
    fetch(`/api/steam/details?appid=${appId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setGame(data);
        } else {
          console.error("Game details error:", data.error);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [appId]);

  const handleRequestGame = async () => {
    if (!game) return;
    
    setRequestStatus('loading');
    
    const gameLink = `https://store.steampowered.com/app/${game.steam_appid}/`;
    const messageContent = `**🎮 NEW GAME REQUEST!**\n\n**Title:** ${game.name}\n**Steam Link:** ${gameLink}\n**Requested on:** Teknologi Santuy Game Store`;

    try {
      const res = await fetch('/api/discord/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent,
          username: "TS Game Store",
          avatar_url: game.header_image || "https://teknologisantuy.vercel.app/logo.png"
        })
      });

      if (res.ok) {
        setRequestStatus('success');
      } else {
        setRequestStatus('error');
      }
    } catch(err) {
      setRequestStatus('error');
    }
  };

  if (!appId) return null;

  return (
    <div className="steam-modal-overlay">
      <div className="steam-modal-backdrop" onClick={onClose}></div>
      <div className="steam-modal-content custom-scrollbar">
        <button className="steam-modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {loading ? (
          <div className="steam-modal-loader">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Loading Game Details...</p>
          </div>
        ) : game ? (
          <>
            <div className="steam-modal-header" style={{backgroundImage: `url(${game.background_raw || game.background})`}}>
              <div className="sm-header-overlay">
                 <h2 className="sm-title">{game.name}</h2>
                 <div className="sm-meta">
                   {game.developers && <span><i className="fa-solid fa-code"></i> {game.developers.join(', ')}</span>}
                   {game.release_date && !game.release_date.coming_soon && <span><i className="fa-regular fa-calendar-days"></i> {game.release_date.date}</span>}
                 </div>
              </div>
            </div>

            <div className="steam-modal-body">
              <div className="sm-main-col">
                {/* Media Gallery */}
                {game.screenshots && game.screenshots.length > 0 && (
                  <div className="sm-gallery">
                     <div className="sm-gallery-main" style={{ position: 'relative' }}>
                        <Image 
                          src={game.screenshots[activeScreenIndex].path_full} 
                          alt="Screenshot" 
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          priority
                          style={{ objectFit: 'contain' }}
                        />
                     </div>
                     <div className="sm-gallery-thumbs">
                        {game.screenshots.slice(0, 5).map((shot, idx) => (
                           <div 
                             key={shot.id} 
                             className={`sm-thumb ${idx === activeScreenIndex ? 'active' : ''}`}
                             onClick={() => setActiveScreenIndex(idx)}
                             style={{ position: 'relative', overflow: 'hidden' }}
                           >
                              <Image 
                                src={shot.path_thumbnail} 
                                alt={`Thumb ${idx}`} 
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                           </div>
                        ))}
                     </div>
                  </div>
                )}

                <div className="sm-description" dangerouslySetInnerHTML={{ __html: game.short_description }}></div>
                
                <div className="sm-request-box">
                   <h3>Ingin Mainkan Game Ini Secara Gratis?</h3>
                   <p>Klik tombol di bawah untuk request game ini agar admin Teknologi Santuy segera mengupload link download-nya ke server Discord.</p>
                   
                   {requestStatus === 'idle' && (
                     <button className="steam-btn-request" onClick={handleRequestGame}>
                        <i className="fa-solid fa-paper-plane"></i> REQUEST GAME INI
                     </button>
                   )}
                   {requestStatus === 'loading' && (
                     <button className="steam-btn-request loading" disabled>
                        <i className="fa-solid fa-circle-notch fa-spin"></i> MENGIRIM REQUEST...
                     </button>
                   )}
                   {requestStatus === 'success' && (
                     <div className="steam-alert-success">
                        <i className="fa-solid fa-circle-check"></i> Request Berhasil Dikirim! Admin akan segera memproses. Silakan cek channel #request-game di Discord kami.
                     </div>
                   )}
                   {requestStatus === 'error' && (
                     <div className="steam-alert-error">
                        <i className="fa-solid fa-circle-exclamation"></i> Gagal mengirim request. Silakan coba lagi nanti.
                     </div>
                   )}
                </div>

                {game.pc_requirements && (game.pc_requirements.minimum || game.pc_requirements.recommended) && (
                  <div className="sm-sys-req">
                    <h3>System Requirements (PC)</h3>
                    <div className="sm-req-grid">
                      {game.pc_requirements.minimum && (
                        <div className="sm-req-col" dangerouslySetInnerHTML={{ __html: game.pc_requirements.minimum }}></div>
                      )}
                      {game.pc_requirements.recommended && (
                        <div className="sm-req-col" dangerouslySetInnerHTML={{ __html: game.pc_requirements.recommended }}></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="sm-side-col">
                 <div style={{ position: 'relative', width: '100%', aspectRatio: '460/215', marginBottom: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                    <Image 
                      src={game.header_image} 
                      alt="Header" 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                 </div>
                 
                 <div className="sm-sidebar-card">
                   <div className="sm-detail-row">
                      <span>Harga Asli Steam:</span>
                      <strong>{game.is_free ? 'Free to Play' : (game.price_overview ? `Rp ${(game.price_overview.initial/100).toLocaleString('id-ID')}` : 'TBA')}</strong>
                   </div>
                   
                   <div className="sm-detail-row tags-row">
                      <span>Genres:</span>
                      <div className="steam-tags">
                        {game.genres && game.genres.map(g => (
                          <span key={g.id} className="steam-tag">{g.description}</span>
                        ))}
                      </div>
                   </div>

                   <div className="sm-detail-row">
                     <span>Platforms:</span>
                     <div className="steam-platforms lg">
                        {game.platforms?.windows && <i className="fa-brands fa-windows"></i>}
                        {game.platforms?.mac && <i className="fa-brands fa-apple"></i>}
                        {game.platforms?.linux && <i className="fa-brands fa-linux"></i>}
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="steam-modal-error">Failed to load game details.</div>
        )}
      </div>
    </div>
  );
}
