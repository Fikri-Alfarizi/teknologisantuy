'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInAsAnonymous, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setLocalError('');
      await signIn(email, password);
      router.push('/forum');
    } catch (err) {
      console.error("[DETIL ERROR LOGIN EMAIL]:", err, err.code, err.message);
      setLocalError(`Error [${err.code || 'UNKNOWN'}]: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setLocalError('');
      await signInWithGoogle();
      router.push('/forum');
    } catch (err) {
      console.error("[DETIL ERROR LOGIN GOOGLE]:", err, err.code, err.message);
      setLocalError(`Error [${err.code || 'UNKNOWN'}]: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      setIsLoading(true);
      setLocalError('');
      await signInAsAnonymous();
      router.push('/forum');
    } catch (err) {
      console.error("[DETIL ERROR LOGIN ANONIM]:", err, err.code, err.message);
      setLocalError(`Error [${err.code || 'UNKNOWN'}]: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <style jsx>{`
        .auth-page-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: var(--blue-base);
          position: relative;
        }
        
        .auth-page-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        :global(.back-button) {
          position: fixed !important;
          top: 30px !important;
          left: 30px !important;
          z-index: 1000 !important;
          background: var(--yellow) !important;
          color: var(--black) !important;
          border: 3px solid var(--black) !important;
          padding: 10px 20px !important;
          font-weight: 900 !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          text-decoration: none !important;
          box-shadow: 6px 6px 0 var(--black) !important;
          transition: all 0.1s !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          cursor: pointer !important;
        }

        :global(.back-button:visited), :global(.back-button:active), :global(.back-button:link) {
          color: var(--black) !important;
          text-decoration: none !important;
        }

        :global(.back-button:hover) {
          transform: translate(3px, 3px) !important;
          box-shadow: 3px 3px 0 var(--black) !important;
          background: #f5d800 !important;
          color: var(--black) !important;
        }

        .auth-container {
          background: var(--blue-dark);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-lg);
          border-radius: 0;
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
        }

        .auth-header {
          background: var(--yellow);
          border-bottom: var(--bw) solid var(--black);
          padding: 30px 24px;
          text-align: center;
          color: var(--black);
        }

        .brand-logo {
          height: 60px;
          width: auto;
          margin-bottom: 12px;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .auth-header h1 {
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }

        .auth-header p {
          font-size: 14px;
          font-weight: 600;
          opacity: 0.85;
        }

        .auth-body {
          padding: 30px 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          color: var(--white);
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
          display: block;
          text-shadow: 1px 1px 0 var(--black);
        }

        .input-group {
          display: flex;
          align-items: stretch;
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-sm);
          transition: transform 0.1s, box-shadow 0.1s;
          height: 48px;
        }

        .input-group:focus-within {
          transform: translate(3px, 3px);
          box-shadow: 1px 1px 0 var(--black);
        }

        .input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          background: var(--yellow);
          border-right: var(--bw) solid var(--black);
          color: var(--black);
          font-size: 16px;
        }

        .input-field {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0 16px;
          color: var(--black);
          font-size: 15px;
          font-weight: 600;
          width: 100%;
          outline: none;
        }

        .btn-primary {
          background: var(--yellow);
          color: var(--black);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs);
          padding: 14px 24px;
          font-weight: 800;
          font-size: 15px;
          text-transform: uppercase;
          transition: transform 0.1s, box-shadow 0.1s;
          width: 100%;
          margin-top: 10px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translate(3px, 3px);
          box-shadow: var(--bs-sm);
          background: #f5d800;
        }

        .btn-primary:disabled {
          opacity: 0.7;
          filter: grayscale(1);
        }

        .btn-secondary {
          background: var(--blue-mid);
          color: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs);
          padding: 12px 24px;
          font-weight: 700;
          font-size: 14px;
          transition: transform 0.1s, box-shadow 0.1s;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .btn-secondary:hover:not(:disabled) {
          transform: translate(3px, 3px);
          box-shadow: var(--bs-sm);
          background: var(--blue);
        }

        .btn-anon {
          background: var(--white);
          color: var(--black);
          margin-bottom: 0;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0;
        }

        .divider-line {
          flex: 1;
          height: var(--bw);
          background: var(--black);
        }

        .divider-text {
          color: var(--white);
          font-size: 13px;
          font-weight: 800;
          background: var(--black);
          padding: 4px 12px;
        }

        .link-text {
          color: var(--yellow);
          text-decoration: none;
          font-weight: 900;
        }

        .error-message {
          background: #ff5f57;
          border: var(--bw) solid var(--black);
          color: white;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .auth-footer {
          background: var(--blue-deeper);
          border-top: var(--bw) solid var(--black);
          padding: 20px 24px;
          text-align: center;
        }

        .auth-footer p {
          color: var(--white);
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>

      <Link href="/" className="back-button">
        <FaArrowLeft /> KEMBALI
      </Link>

      <div className="auth-container">
        <div className="auth-header">
          <img src="/logo.png" alt="Logo" className="brand-logo" />
          <h1>Teknologi Santuy</h1>
          <p>Bergabunglah dengan komunitas gamer & tech</p>
        </div>

        <div className="auth-body">
          {(localError || error) && (
            <div className="error-message">
              ⚠️ {localError || error}
            </div>
          )}

          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-group">
                <div className="input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group">
                <div className="input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Sedang Login...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-text">ATAU</div>
            <div className="divider-line"></div>
          </div>

          <div className="social-login">
            <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="btn-secondary">
              <FaGoogle /> Login dengan Google
            </button>

            <button type="button" onClick={handleAnonymousLogin} disabled={isLoading} className="btn-secondary btn-anon">
              <FaUser /> Login Anonim
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Belum punya akun?{' '}
            <Link href="/auth/signup" className="link-text">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}