'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function CanIRunItChecker({ appId, gameName }) {
  const { userProfile, updateUserProfile } = useAuth();
  
  const [specs, setSpecs] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null); // { canRun: 'YES'|'NO'|'MAYBE', message: '' }
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userProfile && userProfile.pcSpecs) {
      setSpecs(userProfile.pcSpecs);
    }
  }, [userProfile]);

  const handleCheck = async () => {
    if (!specs.trim()) {
      setError('Silakan masukkan spesifikasi PC kamu terlebih dahulu.');
      return;
    }
    
    setError('');
    setIsChecking(true);
    setResult(null);

    // Save specs to user profile if logged in and it changed
    if (userProfile && specs !== userProfile.pcSpecs) {
      try {
        await updateUserProfile({ pcSpecs: specs });
      } catch (e) {
        console.error('Failed to save specs', e);
      }
    }

    try {
      const res = await fetch('/api/can-i-run-it', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, gameName, pcSpecs: specs })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
      
      setResult(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="can-i-run-it-box">
      <div className="ciri-header">
        <i className="fa-solid fa-microchip"></i> 
        <span>AI Spec Checker: <strong>Can I Run It?</strong></span>
      </div>

      <div className="ciri-body">
        {(!specs || isEditing) ? (
          <div className="ciri-input-area">
            <p>Masukkan spesifikasi PC/Laptop kamu (Prosesor, RAM, VGA):</p>
            <input 
              type="text" 
              placeholder="Contoh: Intel Core i5, 8GB RAM, GTX 1650" 
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="ciri-input"
            />
            <button onClick={handleCheck} disabled={isChecking} className="ciri-btn">
              {isChecking ? <><i className="fa-solid fa-spinner fa-spin"></i> Mengecek...</> : 'Cek Sekarang'}
            </button>
            {error && <div className="ciri-error">{error}</div>}
          </div>
        ) : (
          <div className="ciri-result-area">
            <div className="ciri-saved-specs">
              <span className="label">Spek Kamu:</span> {specs}
              <button onClick={() => setIsEditing(true)} className="ciri-edit-btn">Edit</button>
            </div>
            
            {result ? (
              <div className={`ciri-result-card ${result.canRun.toLowerCase()}`}>
                <div className="ciri-result-icon">
                  {result.canRun === 'YES' && <i className="fa-solid fa-circle-check"></i>}
                  {result.canRun === 'NO' && <i className="fa-solid fa-triangle-exclamation"></i>}
                  {result.canRun === 'MAYBE' && <i className="fa-solid fa-circle-question"></i>}
                </div>
                <div className="ciri-result-text">
                  <h4>{result.canRun === 'YES' ? 'BISA DIMAININKAN!' : result.canRun === 'NO' ? 'TIDAK KUAT' : 'MUNGKIN BISA'}</h4>
                  <p>{result.message}</p>
                </div>
              </div>
            ) : (
              <button onClick={handleCheck} disabled={isChecking} className="ciri-btn mt-10">
                {isChecking ? <><i className="fa-solid fa-spinner fa-spin"></i> AI Sedang Menganalisis...</> : 'Cek Apakah PC Saya Kuat?'}
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .can-i-run-it-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(102, 192, 244, 0.3);
          border-radius: 4px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .ciri-header {
          background: rgba(102, 192, 244, 0.1);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(102, 192, 244, 0.2);
          color: #66c0f4;
          font-weight: bold;
        }
        .ciri-body {
          padding: 16px;
        }
        .ciri-input-area p {
          color: #acb2b8;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .ciri-input {
          width: 100%;
          background: rgba(0,0,0,0.5);
          border: 1px solid #3a3f45;
          color: #fff;
          padding: 10px;
          border-radius: 3px;
          margin-bottom: 12px;
          font-family: inherit;
        }
        .ciri-input:focus {
          outline: none;
          border-color: #66c0f4;
        }
        .ciri-btn {
          background: linear-gradient(to right, #47bfff 5%, #1a44c2 60%);
          background-position: 25%;
          background-size: 330% 100%;
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 2px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ciri-btn:hover:not(:disabled) {
          background-position: 0%;
        }
        .ciri-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ciri-error {
          color: #ff6b6b;
          font-size: 12px;
          margin-top: 8px;
        }
        .ciri-saved-specs {
          background: rgba(255,255,255,0.05);
          padding: 8px 12px;
          border-radius: 3px;
          font-size: 13px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ciri-saved-specs .label {
          color: #8f98a0;
          margin-right: 8px;
        }
        .ciri-edit-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #8f98a0;
          padding: 4px 12px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 11px;
        }
        .ciri-edit-btn:hover {
          color: #fff;
          border-color: #fff;
        }
        .mt-10 {
          margin-top: 12px;
        }
        .ciri-result-card {
          margin-top: 16px;
          padding: 16px;
          border-radius: 4px;
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .ciri-result-card.yes {
          background: rgba(163, 255, 0, 0.1);
          border: 1px solid rgba(163, 255, 0, 0.3);
        }
        .ciri-result-card.no {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
        }
        .ciri-result-card.maybe {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        .ciri-result-icon {
          font-size: 32px;
        }
        .ciri-result-card.yes .ciri-result-icon { color: #a3ff00; }
        .ciri-result-card.no .ciri-result-icon { color: #ff6b6b; }
        .ciri-result-card.maybe .ciri-result-icon { color: #ffc107; }
        
        .ciri-result-text h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }
        .ciri-result-card.yes .ciri-result-text h4 { color: #a3ff00; }
        .ciri-result-card.no .ciri-result-text h4 { color: #ff6b6b; }
        .ciri-result-card.maybe .ciri-result-text h4 { color: #ffc107; }
        
        .ciri-result-text p {
          margin: 0;
          color: #e5e4dc;
          font-size: 13px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
