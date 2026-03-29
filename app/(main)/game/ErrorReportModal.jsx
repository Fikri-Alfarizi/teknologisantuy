'use client';

import React, { useState } from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

export default function ErrorReportModal({ isOpen, onClose, game }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  if (!isOpen || !game) return null;

  const handleReport = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/game/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gameId: game.id, 
          title: game.title, 
          image: game.image, 
          link: game.link 
        })
      });
      
      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch(err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'var(--bg)', border: '4px solid #000', borderRadius: '12px',
          boxShadow: '10px 10px 0 var(--yellow)', maxWidth: '450px', width: '100%',
          overflow: 'hidden', position: 'relative', animation: 'scaleIn 0.2s ease-out'
        }}>
          
          <div style={{ background: 'var(--yellow)', padding: '16px', borderBottom: '4px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#000', fontSize: '18px', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaExclamationTriangle /> Verifikasi Link
            </h3>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#000' }}>
              <FaTimes />
            </button>
          </div>

          <div style={{ padding: '24px', color: '#fff', textAlign: 'center' }}>
            {status === 'success' ? (
              <div style={{ padding: '20px 0' }}>
                <FaCheck size={50} color="#00E676" style={{ marginBottom: '16px' }} />
                <h4 style={{ fontSize: '20px', fontWeight: 900 }}>Laporan Terkirim!</h4>
                <p style={{ opacity: 0.8, fontSize: '14px', marginTop: '8px' }}>Terima kasih, admin akan segera memperbaiki link tersebut.</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', lineHeight: '1.5' }}>
                  Apakah link download untuk game <strong style={{ color: 'var(--yellow)' }}>{game.title}</strong> tadi bermasalah atau mati?
                </p>
                
                {status === 'error' && (
                  <div style={{ padding: '10px', background: '#ff1744', color: '#fff', fontWeight: 'bold', borderRadius: '8px', marginBottom: '20px', border: '2px solid #000' }}>
                    Gagal mengirim laporan. Coba lagi.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={handleReport}
                    disabled={status === 'loading'}
                    style={{
                      padding: '14px', background: '#ff1744', color: '#fff',
                      border: '3px solid #000', borderRadius: '8px', fontWeight: 900,
                      fontSize: '15px', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '4px 4px 0 #000', opacity: status === 'loading' ? 0.7 : 1
                    }}
                  >
                    {status === 'loading' ? 'Mengirim Laporan...' : (
                      <><FaExclamationTriangle /> Ya, Link Error / Mati</>
                    )}
                  </button>
                  
                  <button 
                    onClick={onClose}
                    disabled={status === 'loading'}
                    style={{
                      padding: '14px', background: 'transparent', color: '#fff',
                      border: '3px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 800,
                      fontSize: '15px', cursor: 'pointer', opacity: status === 'loading' ? 0.5 : 1,
                      transition: 'border-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--yellow)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                  >
                    <FaCheck /> Tidak, Link Aman
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
