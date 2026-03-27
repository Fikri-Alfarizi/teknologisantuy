'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc
} from 'firebase/firestore';

export default function GameManagement() {
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState({});
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    size: '',
    password: '',
    link: '',
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Fetch from Discord via our NEW admin API
      const res = await fetch('/api/game/all');
      const data = await res.json();
      const discordGames = data.games || [];

      // 2. Fetch stats from Firestore
      const statsSnap = await getDocs(collection(db, 'game_stats'));
      const statsMap = {};
      statsSnap.forEach(doc => {
        statsMap[doc.id] = doc.data();
      });

      // 3. Fetch overrides from Firestore
      const overridesSnap = await getDocs(collection(db, 'game_overrides'));
      const overridesMap = {};
      overridesSnap.forEach(doc => {
        overridesMap[doc.id] = doc.data();
      });

      setGames(discordGames);
      setStats(statsMap);
      setOverrides(overridesMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (game) => {
    const existing = overrides[game.id] || {};
    setEditingGame(game);
    setFormData({
      title: existing.title || game.title,
      size: existing.size || game.size,
      password: existing.password || game.password,
      link: existing.link || game.link,
      image: existing.image || game.image
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'game_overrides', editingGame.id), {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      setEditingGame(null);
      fetchData();
      alert('Data game berhasil diperbarui!');
    } catch (error) {
      console.error('Error saving override:', error);
      alert('Gagal menyimpan data.');
    }
  };

  const handleReset = async (gameId) => {
    if (confirm('Kembalikan ke data asli Discord?')) {
      try {
        await deleteDoc(doc(db, 'game_overrides', gameId));
        fetchData();
      } catch (error) {
        console.error('Error deleting override:', error);
      }
    }
  };

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <div className="spinner-small" style={{ margin: '0 auto 15px' }}></div>
      <p style={{ fontWeight: 600 }}>Menarik data dari Discord...</p>
    </div>
  );

  return (
    <div className="game-mgmt">
      <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ margin: 0, fontWeight: 900, fontSize: '24px', letterSpacing: '-0.5px' }}>Kelola Katalog Game</h2>
        <button onClick={fetchData} className="refresh-btn">
          <i className="fa-solid fa-rotate"></i> Sinkronisasi Ulang
        </button>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {games.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', background: '#fff', border: '4px solid #000', borderRadius: '12px' }}>
             <p style={{ fontWeight: 800 }}>Tidak ada game ditemukan di channel Discord.</p>
          </div>
        )}
        
        {games.map(game => {
          const gameStats = stats[game.id] || { clicks: 0 };
          const hasOverride = !!overrides[game.id];
          const displayData = { ...game, ...(overrides[game.id] || {}) };

          return (
            <div key={game.id} className="admin-game-card" style={{
              background: '#fff',
              border: '4px solid #000',
              borderRadius: '12px',
              padding: '20px',
              position: 'relative',
              boxShadow: hasOverride ? '8px 8px 0px var(--yellow)' : '8px 8px 0px rgba(0,0,0,0.1)'
            }}>
              {hasOverride && (
                <span style={{
                  position: 'absolute', top: '-15px', right: '15px',
                  background: '#000', color: 'var(--yellow)', fontSize: '10px',
                  padding: '4px 10px', border: '2px solid #000', borderRadius: '4px', fontWeight: '900'
                }}>OVERRIDE AKTIF</span>
              )}
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ width: '80px', height: '80px', border: '3px solid #000', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                  <img src={displayData.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 900, lineHeight: 1.2 }}>{displayData.title}</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div className="stat-pill">
                       <i className="fa-solid fa-chart-line"></i> {gameStats.clicks} klik
                    </div>
                    <div className="stat-pill" style={{ background: '#f0f0f0' }}>
                       {displayData.size}
                    </div>
                  </div>
                </div>
              </div>

              <div className="actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(game)} style={{
                  flex: 1, padding: '10px', background: '#fff', border: '3px solid #000', borderRadius: '8px', 
                  fontWeight: 900, color: '#000', cursor: 'pointer', boxShadow: '3px 3px 0px #000'
                }}>Edit Detail</button>
                {hasOverride && (
                  <button onClick={() => handleReset(game.id)} style={{
                    padding: '10px 15px', background: '#ff6b6b', border: '3px solid #000', borderRadius: '8px', 
                    color: '#000', cursor: 'pointer', boxShadow: '3px 3px 0px #000'
                  }} title="Reset ke asli Discord">
                    <i className="fa-solid fa-undo"></i>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editingGame && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="modal-content" style={{
            background: '#fff', width: '100%', maxWidth: '550px', borderRadius: '20px', padding: '32px',
            border: '4px solid #000', maxHeight: '90vh', overflowY: 'auto', boxShadow: '15px 15px 0px var(--yellow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '20px' }}>Edit Informasi Game</h3>
              <button onClick={() => setEditingGame(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Judul Game</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Ukuran</label>
                  <input type="text" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Link Download</label>
                  <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Link Gambar Cover</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '32px' }}>
                <button type="submit" style={{
                  flex: 1, padding: '14px', background: 'var(--yellow)', color: '#000', border: '3px solid #000', 
                  borderRadius: '10px', fontWeight: 900, cursor: 'pointer', boxShadow: '4px 4px 0px #000'
                }}>Simpan & Update Website</button>
                <button type="button" onClick={() => setEditingGame(null)} style={{
                  padding: '14px 24px', background: '#eee', color: '#000', border: '3px solid #000', 
                  borderRadius: '10px', fontWeight: 900, cursor: 'pointer', boxShadow: '4px 4px 0px #000'
                }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-group { margin-bottom: 5px; }
        label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 800; color: #000; }
        input { 
          width: 100%; padding: 12px 16px; background: #f9f9f9; border: 3px solid #000; 
          border-radius: 8px; color: #000; outline: none; font-weight: 600;
        }
        input:focus { background: #fff; border-color: var(--yellow); }
        .refresh-btn {
          padding: 10px 20px; background: #fff; color: #000; border: 3px solid #000; border-radius: 10px;
          font-weight: 900; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 10px;
          boxShadow: 4px 4px 0px #000; transition: 0.1s;
        }
        .refresh-btn:active { transform: translate(2px, 2px); boxShadow: 2px 2px 0px #000; }
        .stat-pill {
          background: #ffe600; color: #000; font-size: 12px; font-weight: 800;
          padding: 4px 10px; border: 2px solid #000; borderRadius: 20px;
        }
        .spinner-small {
          width: 30px; height: 30px; border: 4px solid #000; border-top-color: var(--yellow);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
