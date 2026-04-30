'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import SteamLoginModal from './SteamLoginModal';
import CanIRunItChecker from './CanIRunItChecker';

export default function GameDetailModal({ gameData, onClose }) {
  const { user, isAuthenticated, addXP } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, success, error, limited
  const [requestCount, setRequestCount] = useState(0);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  
  // New States for Flow
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const appId = gameData?.id;

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
    if (requestStatus === 'loading' || requestStatus === 'success') return;
    
    // Safety Check for Data
    const finalGameName = game?.name || gameData?.name || 'Unknown Game';
    const finalGameId = game?.steam_appid || gameData?.id;
    const finalGameImage = game?.header_image || gameData?.image || `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

    // Frontend Safety Check
    const maxLimit = isAuthenticated ? 2 : 1;
    if (requestCount >= maxLimit) {
      setRequestStatus('limited');
      return;
    }

    setRequestStatus('loading');
    setShowConfirm(false); // Hide confirm modal
    
    try {
      const res = await fetch('/api/game-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game: {
            id: finalGameId,
            name: finalGameName,
            image: finalGameImage
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
        // Reward Gamification XP!
        if (isAuthenticated && typeof addXP === 'function') {
          addXP(50); // Give 50 XP for making a request
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
                        <i className="fa-solid fa-info-circle"></i> Sisa Limit Request: <strong>{maxLimit - requestCount}x</strong> {isAuthenticated ? '(Member)' : '(Guest)'}
                     </div>
                   )}

                   {requestStatus === 'idle' && (
                     <>
                        {isLimitReached ? (
                           isAuthenticated ? (
                              <div className="steam-alert-warning limit-exhausted">
                                <i className="fa-solid fa-lock"></i> <strong>LIMIT TERCAPAI:</strong> Anda telah menghabiskan kuota request game seumur hidup (2x).
                              </div>
                           ) : (
                              <div className="limit-cta-box">
                                 <div className="steam-alert-warning">
                                   <i className="fa-solid fa-triangle-exclamation"></i> <strong>LIMIT GUEST TERCAPAI:</strong> Anda hanya memiliki 1x kesempatan request sebagai Guest.
                                 </div>
                                 <button onClick={() => setIsLoginOpen(true)} className="steam-login-link-btn">
                                    KLIK DISINI UNTUK MASUK & DAPAT +1 REQUEST LAGI
                                 </button>
                              </div>
                           )
                        ) : (
                           <button className="steam-btn-request" onClick={() => setShowConfirm(true)} disabled={checkingLimit}>
                              <i className="fa-solid fa-paper-plane"></i> {checkingLimit ? 'MENGECEK...' : 'REQUEST GAME INI'}
                           </button>
                        )}
                     </>
                   )}

                   {requestStatus === 'loading' && (
                     <button className="steam-btn-request loading" disabled>
                        <i className="fa-solid fa-circle-notch fa-spin"></i> MENGIRIM...
                     </button>
                   )}
                   {requestStatus === 'success' && (
                     <div className="steam-alert-success">
                        <i className="fa-solid fa-circle-check"></i> Request Berhasil! Cek Discord kami.
                     </div>
                   )}
                   {requestStatus === 'limited' && (
                     <div className="steam-alert-error">
                        <i className="fa-solid fa-circle-exclamation"></i> Limit tercapai.
                     </div>
                   )}
                   {requestStatus === 'error' && (
                     <div className="steam-alert-error">
                        <i className="fa-solid fa-circle-exclamation"></i> Gagal. Coba lagi nanti.
                     </div>
                   )}
                </div>

                {game.pc_requirements && (game.pc_requirements.minimum || game.pc_requirements.recommended) && (
                  <div className="sm-sys-req">
                    <h3>System Requirements (PC)</h3>
                    
                    <CanIRunItChecker appId={appId} gameName={game.name} />

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
                 <div style={{ position: 'relative', width: '100%', aspectRatio: '460/215', marginBottom: '20px', border: '1px solid #333' }}>
                    <Image 
                      src={game.header_image} 
                      alt="Header" 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                 </div>
                 
                 <div className="sm-sidebar-card">
                   <div className="sm-detail-row">
                      <span>Harga Steam:</span>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {game.price_overview && game.price_overview.initial > 0 && (
                          <span style={{ textDecoration: 'line-through', color: '#737782', fontSize: '13px', fontWeight: 'normal' }}>
                            Rp {(game.price_overview.initial/100).toLocaleString('id-ID')}
                          </span>
                        )}
                        <span style={{ color: '#a3ff00' }}>GRATIS</span>
                      </strong>
                   </div>
                   
                   <div className="sm-detail-row tags-row">
                      <span>Genres:</span>
                      <div className="steam-tags">
                        {game.genres && game.genres.map(g => (
                          <span key={g.id} className="steam-tag">{g.description}</span>
                        ))}
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="steam-modal-fallback">
             <div className="fallback-header">
                <h2>{gameData?.name || "Game Details Unavailable"}</h2>
                <p>Maaf, detail lengkap dari Steam API gagal dimuat. Namun Anda tetap bisa melakukan request.</p>
             </div>
             
             <div className="sm-request-box" style={{ margin: '40px auto', maxWidth: '500px' }}>
                <h3>Tetap Lanjutkan Request?</h3>
                <p>Klik tombol di bawah jika Anda ingin admin tetap mengecek game ini meskipun data visualnya tidak lengkap di sini.</p>
                
                {requestStatus === 'idle' && (
                   <button className="steam-btn-request" onClick={() => setShowConfirm(true)}>
                      <i className="fa-solid fa-paper-plane"></i> YA, TETAP REQUEST GAME INI
                   </button>
                )}
                
                {requestStatus === 'success' && (
                  <div className="steam-alert-success">
                     <i className="fa-solid fa-circle-check"></i> Request Berhasil! Kami mencatat request Anda.
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* CONFIRMATION OVERLAY */}
      {showConfirm && (
        <div className="confirm-overlay">
           <div className="confirm-box">
              <h3>KONFIRMASI REQUEST</h3>
              <p>Apakah Anda yakin ingin merequest <strong>{game?.name || gameData?.name}</strong> ke admin Teknologi Santuy?</p>
              <div className="confirm-btns">
                 <button className="confirm-yes" onClick={handleRequestGame}>YA, KIRIM</button>
                 <button className="confirm-no" onClick={() => setShowConfirm(false)}>BATAL</button>
              </div>
           </div>
        </div>
      )}

      {/* STEAM LOGIN MODAL INTEGRATION */}
      {isLoginOpen && (
        <SteamLoginModal 
          onLoginSuccess={() => {
            setIsLoginOpen(false);
            // Re-check limit automatically is handled by isAuthenticated in maxLimit calc
          }} 
          onCancel={() => setIsLoginOpen(false)}
        />
      )}

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
        .steam-login-link-btn {
           background: transparent;
           border: none;
           color: #66c0f4;
           text-decoration: underline;
           font-weight: bold;
           cursor: pointer;
           font-size: 14px;
           padding: 0;
           margin-top: 10px;
           transition: color 0.2s;
        }
        .steam-login-link-btn:hover {
           color: #fff;
        }
        .confirm-overlay {
           position: absolute;
           top: 0; left: 0; right: 0; bottom: 0;
           background: rgba(0,0,0,0.8);
           display: flex;
           align-items: center;
           justify-content: center;
           z-index: 1000;
           animation: fadeIn 0.2s;
        }
        .confirm-box {
           background: #1b2838;
           padding: 30px;
           border: 1px solid #66c0f4;
           border-radius: 4px;
           max-width: 400px;
           text-align: center;
        }
        .confirm-box h3 { color: #66c0f4; margin-bottom: 15px; }
        .confirm-btns { display: flex; gap: 15px; margin-top: 25px; justifyContent: center; }
        .confirm-yes, .confirm-no {
           padding: 10px 25px;
           border: none;
           border-radius: 2px;
           font-weight: bold;
           cursor: pointer;
        }
        .confirm-yes { background: #66c0f4; color: #fff; }
        .confirm-no { background: #3d4450; color: #fff; }
        
        .steam-modal-fallback {
           padding: 40px;
           text-align: center;
           min-height: 400px;
           display: flex;
           flex-direction: column;
           justify-content: center;
        }
        .fallback-header h2 { font-size: 28px; margin-bottom: 10px; }
        .fallback-header p { color: #8391a1; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
