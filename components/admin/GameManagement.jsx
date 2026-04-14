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
  const [filterSearch, setFilterSearch] = useState('');
  const [filterOption, setFilterOption] = useState('all');
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
    <div className="game-mgmt" style={{ color: '#000' }}>
      <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '4px solid #000', paddingBottom: '20px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '28px', textTransform: 'uppercase', letterSpacing: '-1px', color: '#000' }}>
          Kelola <span style={{ background: 'var(--yellow)', padding: '0 10px', border: '3px solid #000' }}>Katalog Game</span>
        </h2>
        <button onClick={fetchData} className="refresh-btn">
          <i className="fa-solid fa-rotate"></i> Sinkronisasi Ulang
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Cari nama game..." 
          value={filterSearch}
          onChange={e => setFilterSearch(e.target.value)}
          style={{ flex: '1 1 300px', padding: '12px 18px', border: '4px solid #000', fontSize: '15px', fontWeight: 800, outline: 'none' }}
        />
        <select 
          value={filterOption} 
          onChange={e => setFilterOption(e.target.value)}
          style={{ padding: '12px 18px', border: '4px solid #000', fontSize: '15px', fontWeight: 800, outline: 'none', background: '#fff', cursor: 'pointer' }}
        >
          <option value="all">Semua Game</option>
          <option value="override">Override Aktif</option>
          <option value="original">Original Discord</option>
          <option value="most_clicked">Paling Banyak Diklik</option>
        </select>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
        {(() => {
          const filteredGames = games.filter(game => {
            const displayData = { ...game, ...(overrides[game.id] || {}) };
            const searchMatch = displayData.title.toLowerCase().includes(filterSearch.toLowerCase());
            if (!searchMatch) return false;

            if (filterOption === 'override' && !overrides[game.id]) return false;
            if (filterOption === 'original' && overrides[game.id]) return false;

            return true;
          }).sort((a, b) => {
            if (filterOption === 'most_clicked') {
              const clicksA = stats[a.id]?.clicks || 0;
              const clicksB = stats[b.id]?.clicks || 0;
              return clicksB - clicksA;
            }
            return 0; // Default order
          });

          if (filteredGames.length === 0) {
            return (
              <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', background: '#fff', border: '4px solid #000', boxShadow: '12px 12px 0 #000' }}>
                 <p style={{ fontWeight: 950, textTransform: 'uppercase', fontSize: '18px' }}>Tidak ada game ditemukan.</p>
              </div>
            );
          }

          return filteredGames.map(game => {
          const gameStats = stats[game.id] || { clicks: 0 };
          const hasOverride = !!overrides[game.id];
          const displayData = { ...game, ...(overrides[game.id] || {}) };

          return (
            <div key={game.id} className="admin-game-card" style={{
              background: '#fff',
              border: '4px solid #000',
              padding: '25px',
              position: 'relative',
              boxShadow: '10px 10px 0 #000'
            }}>
              {hasOverride && (
                <span style={{
                  position: 'absolute', top: '-18px', right: '18px',
                  background: 'var(--yellow)', color: '#000', fontSize: '11px',
                  padding: '5px 12px', border: '3px solid #000', fontWeight: '950', textTransform: 'uppercase', zIndex: 10
                }}>Override Aktif</span>
              )}
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '90px', height: '90px', border: '4px solid #000', borderRadius: '4px', overflow: 'hidden', background: '#eee', flexShrink: 0 }}>
                  <img src={displayData.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 950, lineHeight: 1.2, textTransform: 'uppercase' }}>{displayData.title}</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div className="stat-pill">
                       <i className="fa-solid fa-chart-line"></i> {gameStats.clicks} klik
                    </div>
                    <div className="stat-pill" style={{ background: '#fff' }}>
                       {displayData.size}
                    </div>
                  </div>
                </div>
              </div>

              <div className="actions" style={{ marginTop: '25px', display: 'flex', gap: '12px' }}>
                <button onClick={() => handleEdit(game)} style={{
                  flex: 1, padding: '12px', background: '#fff', border: '4px solid #000', 
                  fontWeight: 950, color: '#000', cursor: 'pointer', boxShadow: '4px 4px 0 #000',
                  textTransform: 'uppercase', fontSize: '13px'
                }}>Edit Detail</button>
                {hasOverride && (
                  <button onClick={() => handleReset(game.id)} style={{
                    padding: '12px 18px', background: '#ff6b6b', border: '4px solid #000', 
                    color: '#000', cursor: 'pointer', boxShadow: '4px 4px 0 #000'
                  }} title="Reset ke asli Discord">
                    <i className="fa-solid fa-undo"></i>
                  </button>
                )}
              </div>
            </div>
          );
        })})()}
      </div>

      {editingGame && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="modal-content" style={{
            background: '#fff', width: '100%', maxWidth: '600px', padding: '40px',
            border: '4px solid #000', maxHeight: '90vh', overflowY: 'auto', boxShadow: '15px 15px 0px var(--yellow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '4px solid #000', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0, fontWeight: 950, fontSize: '22px', textTransform: 'uppercase' }}>Edit Informasi Game</h3>
              <button onClick={() => setEditingGame(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px', fontWeight: 900 }}>&times;</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
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

              <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                <button type="submit" style={{
                  flex: 1, padding: '16px', background: 'var(--yellow)', color: '#000', border: '4px solid #000', 
                   fontWeight: 950, cursor: 'pointer', boxShadow: '6px 6px 0px #000', textTransform: 'uppercase'
                }}>Simpan & Update Website</button>
                <button type="button" onClick={() => setEditingGame(null)} style={{
                  padding: '16px 30px', background: '#eee', color: '#000', border: '4px solid #000', 
                   fontWeight: 950, cursor: 'pointer', boxShadow: '6px 6px 0px #000', textTransform: 'uppercase'
                }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-group { margin-bottom: 5px; }
        label { display: block; margin-bottom: 10px; font-size: 14px; font-weight: 950; color: #000; textTransform: uppercase; }
        input { 
          width: 100%; padding: 14px 18px; background: #fff; border: 4px solid #000; 
          border-radius: 0; color: #000; outline: none; font-weight: 800;
        }
        input:focus { background: #fff; border-color: var(--yellow); }
        .refresh-btn {
          padding: 12px 24px; background: #fff; color: #000; border: 4px solid #000;
          font-weight: 950; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 12px;
          box-shadow: 6px 6px 0px #000; transition: 0.1s; text-transform: uppercase;
        }
        .refresh-btn:active { transform: translate(3px, 3px); box-shadow: 3px 3px 0px #000; }
        .stat-pill {
          background: var(--yellow); color: #000; font-size: 11px; font-weight: 950; text-transform: uppercase;
          padding: 5px 12px; border: 3px solid #000;
        }
        .spinner-small {
          width: 40px; height: 40px; border: 6px solid #000; border-top-color: var(--yellow);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
