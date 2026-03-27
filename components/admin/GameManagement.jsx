'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  query,
  orderBy
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
      // 1. Fetch from Discord via our API
      const res = await fetch('/api/gemini'); // Using the existing cached site data API
      const siteData = await res.json();
      const discordGames = siteData.games || [];

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

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="game-mgmt">
      <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ margin: 0 }}>Kelola Katalog Game</h2>
        <button onClick={fetchData} className="refresh-btn">
          <i className="fa-solid fa-sync"></i> Refresh Data
        </button>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {games.map(game => {
          const gameStats = stats[game.id] || { clicks: 0 };
          const hasOverride = !!overrides[game.id];
          const displayData = { ...game, ...(overrides[game.id] || {}) };

          return (
            <div key={game.id} className="admin-game-card" style={{
              background: 'rgba(255,255,255,0.05)',
              border: hasOverride ? '1px solid var(--yellow)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '20px',
              position: 'relative'
            }}>
              {hasOverride && (
                <span style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'var(--yellow)', color: '#000', fontSize: '10px',
                  padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold'
                }}>OVERRIDDEN</span>
              )}
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <img src={displayData.image} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <h4 style={{ margin: '0 0 5px', fontSize: '14px' }}>{displayData.title}</h4>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>
                    <i className="fa-solid fa-chart-line"></i> {gameStats.clicks} klik
                  </div>
                </div>
              </div>

              <div className="actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(game)} style={{
                  flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer'
                }}>Edit Data</button>
                {hasOverride && (
                  <button onClick={() => handleReset(game.id)} style={{
                    padding: '8px 12px', background: 'rgba(255,0,0,0.1)', border: 'none', borderRadius: '6px', color: '#ff6b6b', cursor: 'pointer'
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
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="modal-content" style={{
            background: '#1a202c', width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '32px',
            border: '2px solid var(--yellow)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0 }}>Edit Info Game</h3>
            <p style={{ opacity: 0.6, fontSize: '12px', marginBottom: '24px' }}>ID: {editingGame.id}</p>
            
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Judul Game</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Ukuran (ex: 10.5 GB)</label>
                <input type="text" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Link Download</label>
                <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
              </div>
              <div className="form-group">
                <label>URL Gambar</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="submit" style={{
                  flex: 1, padding: '12px', background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
                }}>Simpan Perubahan</button>
                <button type="button" onClick={() => setEditingGame(null)} style={{
                  padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'
                }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-group { margin-bottom: 16px; }
        label { display: block; margin-bottom: 6px; font-size: 13px; opacity: 0.8; }
        input { 
          width: 100%; padding: 10px 14px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 8px; color: #fff; outline: none;
        }
        input:focus { border-color: var(--yellow); }
        .refresh-btn {
          padding: 8px 16px; background: var(--yellow); color: #000; border: none; border-radius: 8px;
          font-weight: bold; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;
        }
      `}</style>
    </div>
  );
}
