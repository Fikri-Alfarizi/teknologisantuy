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
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e6e8ea] border-t-[#4f46e5] rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#464555]">Menarik data dari Discord...</p>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Kelola <span className="text-[#4f46e5]">Katalog Game</span>
          </h2>
          <p className="text-xs font-medium text-[#464555]/60 mt-1">{games.length} game dari Discord</p>
        </div>
        <button 
          onClick={fetchData}
          className="px-4 py-2.5 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">sync</span>
          Sinkronisasi Ulang
        </button>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {games.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 bg-white rounded-3xl shadow-sm p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-[#464555]/10 mb-4 block">sports_esports</span>
            <p className="font-bold text-[#464555]/50" style={{ fontFamily: 'Manrope, sans-serif' }}>Tidak ada game ditemukan di channel Discord.</p>
          </div>
        )}
        
        {games.map(game => {
          const gameStats = stats[game.id] || { clicks: 0 };
          const hasOverride = !!overrides[game.id];
          const displayData = { ...game, ...(overrides[game.id] || {}) };

          return (
            <div key={game.id} className="bg-white rounded-3xl shadow-sm p-5 relative hover:shadow-md transition-all border border-transparent hover:border-[#e6e8ea] group">
              {hasOverride && (
                <span className="absolute -top-2.5 right-5 px-3 py-1 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white rounded-full text-[9px] font-bold uppercase tracking-wider shadow-md z-10">
                  Override Aktif
                </span>
              )}
              
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f7f9fb] flex-shrink-0 border border-[#e6e8ea]">
                  <img src={displayData.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold mb-2 leading-tight line-clamp-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{displayData.title}</h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-[#4f46e5]/10 text-[#4f46e5] rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">bar_chart</span>
                      {gameStats.clicks} klik
                    </span>
                    <span className="px-2.5 py-1 bg-[#f7f9fb] text-[#464555] rounded-lg text-[10px] font-bold border border-[#e6e8ea]">
                      {displayData.size}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(game)} className="flex-1 py-2.5 bg-[#f7f9fb] hover:bg-[#e6e8ea] border border-[#e6e8ea] rounded-xl text-xs font-bold transition-colors">
                  Edit Detail
                </button>
                {hasOverride && (
                  <button onClick={() => handleReset(game.id)} className="py-2.5 px-3 bg-[#ffdad6]/50 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-xl transition-colors" title="Reset ke asli Discord">
                    <span className="material-symbols-outlined text-base">undo</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingGame && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#e6e8ea]">
              <h3 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Edit Informasi Game</h3>
              <button onClick={() => setEditingGame(null)} className="text-[#464555] hover:text-[#191c1e] transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Judul Game</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Ukuran</label>
                  <input type="text" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})}
                    className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Password</label>
                  <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Link Download</label>
                <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Link Gambar Cover</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
              </div>

              <div className="flex gap-3 mt-2 pt-4 border-t border-[#e6e8ea]">
                <button type="submit"
                  className="flex-1 py-3 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  Simpan & Update
                </button>
                <button type="button" onClick={() => setEditingGame(null)}
                  className="py-3 px-6 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-bold hover:bg-[#e6e8ea] transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
