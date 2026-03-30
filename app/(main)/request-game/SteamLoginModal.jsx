'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function SteamLoginModal({ onLoginSuccess, onCancel }) {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      onLoginSuccess && onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onLoginSuccess && onLoginSuccess();
    } catch (err) {
      console.error('Google login error:', err);
      setError('Gagal login dengan Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="steam-login-overlay">
      <div className="steam-login-box">
        <h2 className="sl-title">MASUK KE AKUN ANDA</h2>
        <p className="sl-sub">Gunakan akun Teknologi Santuy untuk mendapatkan reward +1 request game.</p>
        
        <form className="sl-form" onSubmit={handleSubmit}>
          <div className="sl-input-group">
            <label>ALAMAT EMAIL</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukan email..."
              required
            />
          </div>
          
          <div className="sl-input-group">
            <label>KATA SANDI</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukan password..."
              required
            />
          </div>
          
          {error && <div className="sl-error">{error}</div>}
          
          <button type="submit" className="sl-btn-primary" disabled={loading}>
            {loading ? 'DITUNGGU...' : 'MASUK SEKARANG'}
          </button>
        </form>
        
        <div className="sl-divider">
          <span>ATAU</span>
        </div>
        
        <button 
          type="button" 
          className="sl-btn-google" 
          onClick={handleGoogleLogin} 
          disabled={loading}
        >
          <i className="fa-brands fa-google"></i> LANJUT DENGAN GOOGLE
        </button>
        
        <button type="button" className="sl-btn-cancel" onClick={onCancel}>
          BATALKAN
        </button>
      </div>

      <style jsx>{`
        .steam-login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
          animation: fadeIn 0.2s ease;
        }
        .steam-login-box {
          background: #171d25;
          padding: 40px;
          border-radius: 4px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
          border-top: 1px solid #1999ff;
          position: relative;
        }
        .sl-title {
          color: #fff;
          font-size: 24px;
          margin-bottom: 8px;
          font-weight: 200;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .sl-sub {
          color: #8f98a0;
          font-size: 13px;
          margin-bottom: 30px;
        }
        .sl-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sl-input-group label {
          display: block;
          color: #1999ff;
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .sl-input-group input {
          width: 100%;
          background: #32353c;
          border: 1px solid #000;
          padding: 12px;
          color: #fff;
          font-size: 14px;
          border-radius: 2px;
          transition: border-color 0.2s;
        }
        .sl-input-group input:focus {
          outline: none;
          border-color: #66c0f4;
        }
        .sl-btn-primary {
          background: linear-gradient(90deg, #06bfff 0%, #2d73ff 100%);
          border: none;
          padding: 14px;
          color: #fff;
          font-weight: bold;
          font-size: 15px;
          cursor: pointer;
          border-radius: 2px;
          text-transform: uppercase;
          transition: transform 0.1s, opacity 0.2s;
        }
        .sl-btn-primary:active {
          transform: scale(0.98);
        }
        .sl-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .sl-divider {
          text-align: center;
          margin: 30px 0;
          position: relative;
        }
        .sl-divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #32353c;
          z-index: 1;
        }
        .sl-divider span {
          background: #171d25;
          padding: 0 15px;
          color: #8f98a0;
          font-size: 12px;
          position: relative;
          z-index: 2;
        }
        .sl-btn-google {
          width: 100%;
          background: transparent;
          border: 1px solid #32353c;
          color: #fff;
          padding: 12px;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 2px;
          transition: background 0.2s;
        }
        .sl-btn-google:hover {
          background: rgba(255,255,255,0.05);
        }
        .sl-btn-cancel {
          width: 100%;
          background: transparent;
          border: none;
          color: #8f98a0;
          margin-top: 20px;
          font-size: 12px;
          cursor: pointer;
          text-decoration: underline;
        }
        .sl-error {
          color: #ff6b6b;
          font-size: 13px;
          background: rgba(255,107,107,0.1);
          padding: 10px;
          border-left: 3px solid #ff6b6b;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
