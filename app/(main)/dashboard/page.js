'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaWallet, FaGem, FaMedal, FaChartLine, FaCalendarAlt, FaDiscord } from 'react-icons/fa';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [botData, setBotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      fetchBotStats(session.user.id);
    }
  }, [session]);

  const fetchBotStats = async (discordId) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/bot-sync?discordId=${discordId}`);
      if (!res.ok) throw new Error('Data bot gagal dimuat');
      const data = await res.json();
      
      if (data.stats) setBotData(data.stats);
      else setError('Kamu belum mendaftar di database bot SantuyTL.');
    } catch (err) {
      setError('Terjadi kendala saat menghubungkan ke Server SantuyTL.');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="dash-loading">
        <div className="spinner"></div>
        <p>Memuat Panel...</p>
        <style jsx>{`
          .dash-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; color: #ffe600; font-weight: 900; text-transform: uppercase; font-size: 20px; letter-spacing: 2px; }
          .spinner { width: 40px; height: 40px; border: 6px solid #000; border-top-color: #ffe600; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // If Not Logged In
  if (status === "unauthenticated" || !session) {
    return (
      <div className="dash-auth-container">
        <div className="dash-locked-card">
          <FaDiscord className="discord-icon" />
          <h1>Akses Terkunci</h1>
          <p>Hubungkan akun Discord kamu untuk melihat Kartu Identitas, Koin, Level, dan XP dari Bot SantuyTL secara realtime.</p>
          <button onClick={() => signIn("discord")} className="btn-discord-login">
            LOGIN DENGAN DISCORD
          </button>
        </div>
        
        <style jsx>{`
          .dash-auth-container { display: flex; align-items: center; justify-content: center; min-height: 70vh; padding: 20px; font-family: sans-serif; }
          .dash-locked-card { background: #1e1f22; padding: 50px 40px; border: 4px solid #000; box-shadow: 12px 12px 0px #000; text-align: center; max-width: 500px; width: 100%; border-radius: 4px; }
          .discord-icon { color: #5865F2; font-size: 80px; margin: 0 auto 20px auto; display: block; }
          .dash-locked-card h1 { color: #fff; font-size: 32px; font-weight: 950; text-transform: uppercase; letter-spacing: -1px; margin: 0 0 15px 0; }
          .dash-locked-card p { color: #b5bac1; font-weight: 700; line-height: 1.6; margin: 0 0 30px 0; font-size: 15px; }
          .btn-discord-login { width: 100%; background: #5865F2; color: #fff; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 16px 24px; border: 2px solid #000; cursor: pointer; transition: all 0.2s; box-shadow: 4px 4px 0px #000; border-radius: 3px; }
          .btn-discord-login:hover { background: #4752C4; transform: translateY(-2px); box-shadow: 6px 6px 0px #000; }
        `}</style>
      </div>
    );
  }

  // MAIN DASHBOARD UI
  return (
    <div className="dash-wrapper">
      <div className="dash-container">
        <div className="dash-header">
          <h1><FaDiscord className="title-icon" /> User Dashboard</h1>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-logout">Logout Discord</button>
        </div>

        {loading ? (
           <div className="dash-loading-bar">Mencari Data Player...</div>
        ) : error ? (
           <div className="dash-error">{error}</div>
        ) : botData ? (
          <div className="dash-grid">
            
            {/* LEFT COLUMN - Identity */}
            <div className="dash-left">
              <div className="id-card neo-box">
                <div className="glow-effect"></div>
                <div className="neo-box-title">👤 Identity Card</div>
                <div className="id-card-content">
                  <img src={botData.avatar || session.user.image} alt={botData.username} className="user-avatar" />
                  <h3 className="user-name">{botData.username}</h3>
                  {botData.roles && botData.roles[0] && (
                    <div className="user-role">{botData.roles[0]}</div>
                  )}
                </div>
              </div>

              <div className="neo-box">
                <div className="neo-box-title">📅 Membership</div>
                <div className="member-date">
                  <FaCalendarAlt />
                  <span>Joined: {new Date(botData.joined_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="member-id">💳 ID: {botData.id} • SantuyTL System</div>
              </div>
            </div>

            {/* RIGHT COLUMN - Stats */}
            <div className="dash-right">
              
              <div className="neo-box">
                <div className="neo-box-title">💵 Economy</div>
                <div className="eco-grid">
                  <div className="stat-card">
                    <div className="stat-info">
                      <div className="stat-label">Cash</div>
                      <div className="stat-value text-green">RP {botData.coins?.toLocaleString('id-ID') || 0}</div>
                    </div>
                    <FaWallet className="stat-icon icon-green" />
                  </div>
                  <div className="stat-card">
                    <div className="stat-info">
                      <div className="stat-label">Asset</div>
                      <div className="stat-value text-purple">Top Secret</div>
                    </div>
                    <FaGem className="stat-icon icon-purple" />
                  </div>
                </div>
              </div>

              <div className="neo-box">
                <div className="neo-box-title">⚔️ Ranking & Progress</div>
                <div className="rank-grid">
                  <div className="stat-card rank-card">
                     <div className="rank-icon-box box-yellow"><FaMedal /></div>
                     <div>
                       <div className="stat-label">Level</div>
                       <div className="stat-value text-white">{botData.level || 0}</div>
                     </div>
                  </div>
                  <div className="stat-card rank-card">
                     <div className="rank-icon-box box-blue"><FaChartLine /></div>
                     <div>
                       <div className="stat-label">Total XP</div>
                       <div className="stat-value text-white">{botData.xp?.toLocaleString('id-ID') || 0}</div>
                     </div>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>📈 Level Progress</span>
                    <span className="text-yellow">{((botData.xp % 100) / 100) * 100}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${((botData.xp % 100) / 100) * 100}%` }}></div>
                    <div className="progress-bar-scanline"></div>
                  </div>
                  <p className="progress-footer">Need {100 - (botData.xp % 100)} XP to Level up!</p>
                </div>
              </div>

            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .dash-wrapper { min-height: 100vh; background: #2b2d31; color: #fff; padding: 40px 20px; font-family: 'Space Grotesk', sans-serif; }
        .dash-container { max-width: 900px; margin: 0 auto; }
        .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; border-bottom: 4px solid #1e1f22; padding-bottom: 20px; }
        .dash-header h1 { margin: 0; font-size: 32px; font-weight: 950; text-transform: uppercase; display: flex; align-items: center; gap: 12px; letter-spacing: -1px; }
        .title-icon { color: #5865F2; }
        .btn-logout { background: #dc2626; color: #fff; padding: 10px 20px; font-weight: 900; text-transform: uppercase; border: 2px solid #000; box-shadow: 3px 3px 0 #000; cursor: pointer; transition: 0.1s; }
        .btn-logout:hover { transform: translateY(-2px); box-shadow: 5px 5px 0 #000; background: #b91c1c; }

        .dash-loading-bar { background: #1e1f22; border: 4px solid #000; padding: 30px; text-align: center; color: #ffe600; font-weight: 900; font-size: 18px; text-transform: uppercase; }
        .dash-error { background: rgba(239,68,68,0.1); border: 2px solid #ef4444; color: #ef4444; padding: 20px; font-weight: 900; text-align: center; text-transform: uppercase; }

        .dash-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 24px; }
        .dash-left { display: flex; flex-direction: column; gap: 24px; }
        .dash-right { display: flex; flex-direction: column; gap: 24px; }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }

        .neo-box { background: #1e1f22; border: 4px solid #000; padding: 24px; position: relative; box-shadow: 6px 6px 0 rgba(0,0,0,0.5); border-radius: 4px; }
        .neo-box-title { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #80848e; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #313338; padding-bottom: 10px; }
        
        .id-card { overflow: hidden; }
        .glow-effect { position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: #ffe600; border-radius: 50%; opacity: 0.1; filter: blur(30px); }
        .id-card-content { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 1; }
        .user-avatar { width: 110px; height: 110px; border-radius: 50%; border: 4px solid #000; background: #2b2d31; padding: 4px; object-fit: cover; margin-bottom: 15px; }
        .user-name { margin: 0 0 10px 0; font-size: 26px; font-weight: 950; text-transform: uppercase; letter-spacing: -1px; }
        .user-role { background: rgba(88,101,242,0.15); border: 1px solid #5865F2; color: #c9cdfb; padding: 4px 12px; font-weight: 900; font-size: 11px; text-transform: uppercase; }

        .member-date { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 14px; margin-bottom: 15px; color: #dbdee1; }
        .member-id { margin-top: 15px; padding-top: 15px; border-top: 1px dashed #313338; font-size: 10px; color: #80848e; font-family: monospace; font-weight: 700; }

        .eco-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .rank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        @media (max-width: 500px) { .eco-grid, .rank-grid { grid-template-columns: 1fr; } }

        .stat-card { background: #2b2d31; border: 2px solid #000; padding: 16px; display: flex; align-items: center; justify-content: space-between; border-radius: 3px; }
        .stat-label { font-size: 11px; color: #80848e; font-weight: 900; text-transform: uppercase; margin-bottom: 4px; }
        .stat-value { font-size: 22px; font-weight: 950; letter-spacing: -1px; }
        .text-green { color: #4ade80; }
        .icon-green { color: #4ade80; opacity: 0.15; font-size: 36px; }
        .text-purple { color: #c084fc; }
        .icon-purple { color: #c084fc; opacity: 0.15; font-size: 36px; }
        .text-white { color: #fff; }

        .rank-card { justify-content: flex-start; gap: 16px; }
        .rank-icon-box { width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; font-size: 22px; border: 2px solid #000; border-radius: 4px; }
        .box-yellow { background: rgba(234,179,8,0.1); border-color: #eab308; color: #eab308; }
        .box-blue { background: rgba(59,130,246,0.1); border-color: #3b82f6; color: #3b82f6; }

        .progress-section { margin-top: 10px; }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: 900; text-transform: uppercase; color: #80848e; }
        .text-yellow { color: #ffe600; }
        .progress-bar-wrap { height: 24px; background: #2b2d31; border: 2px solid #000; position: relative; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: #ffe600; transition: 1s ease-out; }
        .progress-bar-scanline { position: absolute; inset: 0; background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjQiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjMpIi8+PC9zdmc+') repeat; opacity: 0.3; }
        .progress-footer { text-align: right; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #80848e; margin-top: 8px; }
      `}</style>
    </div>
  );
}
