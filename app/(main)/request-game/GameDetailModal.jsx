'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function GameDetailModal({ appId, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, success, error, limited
  const [requestCount, setRequestCount] = useState(0);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  useEffect(() => {
    if (!appId) return;
    
    setLoading(true);
    setRequestStatus('idle');
    setCheckingLimit(true);
    
    // 1. Fetch Game Details
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

    // 2. Fetch Request Limit status from Server (By IP)
    fetch('/api/game-request')
      .then(res => res.json())
      .then(data => {
        if (data.count !== undefined) {
          setRequestCount(data.count);
        }
        setCheckingLimit(false);
      })
      .catch(() => setCheckingLimit(false));

  }, [appId]);

  const handleRequestGame = async () => {
    if (!game || requestStatus === 'loading' || requestStatus === 'success') return;
    
    // Frontend Safety Check
    const maxLimit = isAuthenticated ? 2 : 1;
    if (requestCount >= maxLimit) {
      setRequestStatus('limited');
      return;
    }

    setRequestStatus('loading');
    
    try {
      const res = await fetch('/api/game-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game: {
            id: game.steam_appid,
            name: game.name,
            image: game.header_image
          },
          user: user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null
        })
      });

      const data = await res.json();

      if (res.ok) {
        setRequestStatus('success');
        if (data.newCount !== undefined) {
          setRequestCount(data.newCount);
        }
      } else {
        if (res.status === 403) {
          setRequestStatus('limited');
          if (data.newCount !== undefined) {
            setRequestCount(data.newCount);
          }
        } else {
          setRequestStatus('error');
        }
      }
    } catch(err) {
      setRequestStatus('error');
    }
  };

  if (!appId) return null;

  // Logic Determinator for Button
  const maxLimit = isAuthenticated ? 2 : 1;
  const isLimitReached = requestCount >= maxLimit;

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
                   
                   {/* LIMIT WARNING BANNER */}
                   {!checkingLimit && !isLimitReached && (
                     <div className="limit-info-badge">
                        <i className="fa-solid fa-info-circle"></i> Sisa Limit Request: <strong>{maxLimit - requestCount}x</strong> {isAuthenticated ? '(Bonus Login Aktit)' : '(Guest)'}
                     </div>
                   )}

                   {requestStatus === 'idle' && (
                     <>
                        {isLimitReached ? (
                           isAuthenticated ? (
                              <div className="steam-alert-warning limit-exhausted">
                                <i className="fa-solid fa-lock"></i> <strong>LIMIT TERCAPAI:</strong> Anda telah menghabiskan kuota request game seumur hidup (2x) untuk perangkat/IP ini. Terimakasih telah menggunakan layanan kami.
                              </div>
                           ) : (
                              <div className="limit-cta-box">
                                 <div className="steam-alert-warning">
                                   <i className="fa-solid fa-triangle-exclamation"></i> <strong>LIMIT GUEST TERCAPAI:</strong> Anda hanya memiliki 1x kesempatan request sebagai Guest.
                                 </div>
                                 <Link href="/auth/login" className="steam-login-reward-btn">
                                    LOGIN UNTUK DAPAT +1 REQUEST LAGI
                                 </Link>
                              </div>
                           )
                        ) : (
                           <button className="steam-btn-request" onClick={handleRequestGame} disabled={checkingLimit}>
                              <i className="fa-solid fa-paper-plane"></i> {checkingLimit ? 'MENGECEK LIMIT...' : 'REQUEST GAME INI'}
                           </button>
                        )}
                     </>
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
                   {requestStatus === 'limited' && (
                     <div className="steam-alert-error">
                        <i className="fa-solid fa-circle-exclamation"></i> Gagal: Maaf, limit request untuk perangkat/IP Anda sudah habis.
                     </div>
                   )}
                   {requestStatus === 'error' && (
                     <div className="steam-alert-error">
                        <i className="fa-solid fa-circle-exclamation"></i> Gagal mengirim request. Silakan coba lagi nanti.
                     </div>
                   )}
                </div>

                <div className="request-legal-notice">
                   <p>⚠️ <strong>Kebijakan Penggunaan:</strong> Penyalahgunaan sistem request atau tindakan akses ilegal terhadap infrastruktur Teknologi Santuy dapat dijerat dengan <strong>Pasal 30 & 32 UU ITE</strong>. Gunakan layanan ini dengan bijak.</p>
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

      <style jsx>{`
        .limit-info-badge {
           display: inline-flex;
           align-items: center;
           gap: 8px;
           background: rgba(255, 255, 255, 0.05);
           padding: 6px 12px;
           border-radius: 4px;
           font-size: 13px;
           color: #738895;
           margin-bottom: 20px;
        }
        .limit-info-badge strong {
           color: #66c0f4;
        }
        .limit-exhausted {
           background: rgba(255, 0, 0, 0.1) !important;
           border: 1px solid rgba(255, 0, 0, 0.3) !important;
           color: #ff6b6b !important;
        }
        .limit-cta-box {
           display: flex;
           flex-direction: column;
           gap: 15px;
        }
        .steam-login-reward-btn {
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 14px;
           background: linear-gradient(90deg, #66c0f4 0%, #4b619b 100%);
           color: white;
           text-decoration: none;
           font-weight: bold;
           border-radius: 4px;
           text-transform: uppercase;
           letter-spacing: 1px;
           transition: 0.3s;
           box-shadow: 0 4px 15px rgba(102, 192, 244, 0.3);
        }
        .steam-login-reward-btn:hover {
           background: linear-gradient(90deg, #4b619b 0%, #66c0f4 100%);
           transform: translateY(-2px);
        }
        .request-legal-notice {
           margin-top: 30px;
           padding: 15px;
           background: rgba(0,0,0,0.2);
           border-left: 4px solid #cc0000;
           font-size: 13px;
           color: #888;
           line-height: 1.6;
        }
        .request-legal-notice strong {
           color: #aaa;
        }
      `}</style>
    </div>
  );
}
