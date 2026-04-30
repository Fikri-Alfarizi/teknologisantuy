'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Link from 'next/link';

export default function MyRequestsPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    
    const fetchMyRequests = async () => {
      try {
        const q = query(
          collection(db, 'game_requests'),
          where('userId', '==', user.uid)
        );
        const snap = await getDocs(q);
        const reqs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort manually to avoid index requirement
        reqs.sort((a, b) => {
           const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
           const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
           return timeB - timeA;
        });
        setRequests(reqs);
      } catch (err) {
        console.error('Failed to fetch user requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [user, authLoading]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'done': return <span className="status-badge done"><i className="fa-solid fa-check"></i> Sudah Diupload</span>;
      case 'in_progress': return <span className="status-badge progress"><i className="fa-solid fa-spinner fa-spin"></i> Sedang Diproses</span>;
      case 'rejected': return <span className="status-badge rejected"><i className="fa-solid fa-times"></i> Ditolak</span>;
      default: return <span className="status-badge pending"><i className="fa-solid fa-clock"></i> Menunggu Antrean</span>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="request-page-container">
        <div className="loading-state">
           <i className="fa-solid fa-circle-notch fa-spin fa-3x"></i>
           <p>Memuat riwayat request kamu...</p>
        </div>
        <style jsx>{`
          .request-page-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #1b2838; color: #fff; }
          .loading-state { text-align: center; color: #66c0f4; }
          .loading-state p { margin-top: 20px; font-weight: bold; }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="request-page-container">
        <div className="auth-required">
           <i className="fa-solid fa-lock fa-4x"></i>
           <h1>Akses Terbatas</h1>
           <p>Silakan login terlebih dahulu untuk melihat riwayat request game kamu.</p>
           <Link href="/auth/login" className="steam-btn">LOGIN SEKARANG</Link>
        </div>
        <style jsx>{`
          .request-page-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #1b2838; color: #fff; padding: 20px; }
          .auth-required { text-align: center; max-width: 400px; }
          .auth-required h1 { margin: 20px 0 10px; font-size: 28px; }
          .auth-required p { color: #8f98a0; margin-bottom: 30px; }
          .steam-btn { background: linear-gradient(to right, #47bfff 5%, #1a44c2 60%); padding: 12px 30px; border-radius: 2px; color: #fff; text-decoration: none; font-weight: bold; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="request-page-wrapper">
      <div className="container">
        <div className="page-header">
           <div className="header-text">
              <h1>RIWAYAT REQUEST GAME</h1>
              <p>Pantau status game yang telah kamu minta. Admin akan segera menguploadnya ke Discord!</p>
           </div>
           <Link href="/request-game" className="back-btn">
              <i className="fa-solid fa-arrow-left"></i> Kembali ke Katalog
           </Link>
        </div>

        <div className="user-progress-card">
           <div className="upc-header">
              <div className="upc-level">LEVEL {userProfile?.level || 1}</div>
              <div className="upc-xp">{userProfile?.xp || 0} XP</div>
           </div>
           <div className="upc-progress-bar">
              <div className="upc-progress-fill" style={{ width: `${(userProfile?.xp % 100) || 0}%` }}></div>
           </div>
           <p className="upc-footer">Dapatkan +50 XP setiap kali kamu me-request game baru!</p>
        </div>

        <div className="requests-grid">
           {requests.length === 0 ? (
             <div className="empty-state">
                <i className="fa-solid fa-ghost fa-4x"></i>
                <h2>Belum Ada Request</h2>
                <p>Kamu belum pernah me-request game apapun. Ayo cari game favoritmu!</p>
                <Link href="/request-game" className="steam-btn">Cari Game</Link>
             </div>
           ) : (
             requests.map(req => (
               <div key={req.id} className="request-card">
                  <div className="card-img">
                     <img src={req.gameImage || '/placeholder.jpg'} alt={req.gameName} />
                  </div>
                  <div className="card-info">
                     <h3>{req.gameName}</h3>
                     <span className="date">Diminta pada: {req.timestamp ? new Date(req.timestamp.toMillis()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru saja'}</span>
                     {req.adminNote && (
                       <div className="admin-note">
                          <strong>Pesan Admin:</strong> {req.adminNote}
                       </div>
                     )}
                  </div>
                  <div className="card-status">
                     {getStatusBadge(req.status)}
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

      <style jsx>{`
        .request-page-wrapper {
          background: #1b2838;
          background-image: radial-gradient(at top left, rgba(42, 71, 94, 0.4) 0%, rgba(27, 40, 56, 0) 60%);
          min-height: 100vh;
          color: #fff;
          padding: 60px 0;
        }
        .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
        .header-text h1 { font-size: 32px; font-weight: 800; color: #fff; margin: 0 0 10px; letter-spacing: 1px; }
        .header-text p { color: #8f98a0; margin: 0; font-size: 15px; }
        
        .back-btn { color: #66c0f4; text-decoration: none; font-size: 14px; font-weight: bold; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }

        .user-progress-card {
          background: rgba(102, 192, 244, 0.1);
          border: 1px solid rgba(102, 192, 244, 0.2);
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 30px;
        }
        .upc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .upc-level { font-size: 24px; font-weight: 900; color: #ffe600; letter-spacing: 1px; }
        .upc-xp { font-size: 14px; color: #8f98a0; font-weight: bold; }
        .upc-progress-bar { height: 12px; background: rgba(0,0,0,0.5); border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .upc-progress-fill { height: 100%; background: linear-gradient(to right, #ffe600, #ff9800); border-radius: 6px; transition: width 1s ease-in-out; }
        .upc-footer { margin-top: 12px; font-size: 12px; color: #66c0f4; font-style: italic; }

        .requests-grid { display: flex; flex-direction: column; gap: 16px; }
        
        .request-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding: 20px;
          gap: 24px;
          transition: transform 0.2s, background 0.2s;
        }
        .request-card:hover {
          background: rgba(0, 0, 0, 0.6);
          transform: translateX(5px);
          border-color: rgba(102, 192, 244, 0.3);
        }

        .card-img img { width: 180px; height: 85px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
        .card-info { flex: 1; }
        .card-info h3 { margin: 0 0 8px; font-size: 20px; color: #fff; }
        .card-info .date { display: block; color: #8f98a0; font-size: 13px; margin-bottom: 10px; }
        .admin-note { background: rgba(102, 192, 244, 0.1); border-left: 3px solid #66c0f4; padding: 8px 12px; font-size: 13px; color: #c6d4df; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          min-width: 160px;
          justify-content: center;
        }
        .status-badge.pending { background: rgba(255,152,0,0.1); color: #ffb74d; border: 1px solid rgba(255,152,0,0.3); }
        .status-badge.progress { background: rgba(33,150,243,0.1); color: #64b5f6; border: 1px solid rgba(33,150,243,0.3); }
        .status-badge.done { background: rgba(163, 255, 0, 0.1); color: #a3ff00; border: 1px solid rgba(163, 255, 0, 0.3); }
        .status-badge.rejected { background: rgba(244,67,54,0.1); color: #e57373; border: 1px solid rgba(244,67,54,0.3); }

        .empty-state { text-align: center; padding: 100px 0; color: #8f98a0; }
        .empty-state h2 { color: #fff; margin: 20px 0 10px; }
        .empty-state p { margin-bottom: 30px; }
        .steam-btn { background: linear-gradient(to right, #47bfff 5%, #1a44c2 60%); padding: 12px 30px; border-radius: 2px; color: #fff; text-decoration: none; font-weight: bold; cursor: pointer; border: none; }

        @media (max-width: 768px) {
          .request-card { flex-direction: column; align-items: flex-start; text-align: center; }
          .card-img img { width: 100%; height: auto; }
          .status-badge { width: 100%; }
          .page-header { flex-direction: column; align-items: center; text-align: center; gap: 20px; }
        }
      `}</style>
    </div>
  );
}
