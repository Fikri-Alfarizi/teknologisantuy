'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

export default function NewsManagement() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'NEWS',
    readTime: '5 MIN READ',
    coverImage: '',
    excerpt: '',
    content: ''
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'launcherNews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNewsList(fetched);
    } catch (err) {
      console.error(err);
      // fallback manual sort client-side in case index error
      try {
          const fallbackSnap = await getDocs(collection(db, 'launcherNews'));
          const fallbackFetched = fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          fallbackFetched.sort((a,b) => (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0));
          setNewsList(fallbackFetched);
      } catch (err2) {
          console.error("Critical fetch error:", err2);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openModal = (article = null) => {
    if (article) {
      setEditingId(article.id);
      setFormData({
        title: article.title || '',
        type: article.type || 'NEWS',
        readTime: article.readTime || '5 MIN READ',
        coverImage: article.coverImage || '',
        excerpt: article.excerpt || '',
        content: article.content || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        type: 'PATCH NOTES',
        readTime: '5 MIN READ',
        coverImage: '',
        excerpt: '',
        content: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Update
        const ref = doc(db, 'launcherNews', editingId);
        await updateDoc(ref, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create - Use Title Slug for readable URL
        let baseSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (!baseSlug) baseSlug = 'news';
        const finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
        
        await setDoc(doc(db, 'launcherNews', finalSlug), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      closeModal();
      fetchNews();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan berita. (Check index atau console)');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini secara permanen?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'launcherNews', id));
      fetchNews();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus berita.');
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Manajemen Berita Launcher</h2>
          <p className="text-xs font-medium text-[#464555]/60 mt-1">{newsList.length} artikel dipublikasi</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-4 py-2.5 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Buat Berita Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-[#f7f9fb] text-xs font-bold text-[#464555] uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Judul</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Waktu Baca</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4 pr-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="w-8 h-8 border-3 border-[#e6e8ea] border-t-[#4f46e5] rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-sm text-[#464555]/50 font-semibold">
                    Belum ada berita yang ditambahkan. Silakan klik &quot;Buat Berita Baru&quot;.
                  </td>
                </tr>
              ) : (
                newsList.map((item) => (
                  <tr key={item.id} className="border-b border-[#464555]/5 hover:bg-[#f7f9fb] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-sm">{item.title}</div>
                      <div className="text-xs text-[#464555]/50 mt-1 max-w-[300px] truncate">{item.excerpt || 'Tidak ada deskripsi singkat.'}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-[#4f46e5]/10 text-[#4f46e5] rounded-full text-[10px] font-bold">{item.type}</span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-[#464555]">{item.readTime}</td>
                    <td className="p-4 text-xs text-[#464555]/70 font-semibold">
                      {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : 'Baru saja'}
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/launcher/news/${item.id}`} target="_blank" className="w-8 h-8 bg-[#dcfce7] hover:bg-[#a7f3d0] text-[#15803d] rounded-lg flex items-center justify-center transition-colors no-underline" title="Preview Berita">
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </Link>
                        <button onClick={() => openModal(item)} className="w-8 h-8 bg-[#dbeafe] hover:bg-[#bfdbfe] text-[#1d4ed8] rounded-lg flex items-center justify-center transition-colors" title="Edit Berita">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-[#ffdad6]/50 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg flex items-center justify-center transition-colors" title="Hapus Berita">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#e6e8ea] flex justify-between items-center bg-[#f7f9fb] rounded-t-3xl">
              <h3 className="font-bold text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>{editingId ? 'Edit Berita' : 'Buat Berita Baru'}</h3>
              <button type="button" onClick={closeModal} className="text-[#464555] hover:text-[#191c1e] transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1">
              <form id="newsForm" onSubmit={handleSave} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Judul Artikel</label>
                  <input required placeholder="Contoh: Update Season 2 & Perubahan Database" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Kategori (Type)</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all">
                      <option value="NEWS">NEWS</option>
                      <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                      <option value="PATCH NOTES">PATCH NOTES</option>
                      <option value="ROSTER UPDATE">ROSTER UPDATE</option>
                      <option value="DEV LOG">DEV LOG</option>
                      <option value="DEEP DIVE">DEEP DIVE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Estimasi Waktu Baca</label>
                    <input required placeholder="Contoh: 5 MIN READ" value={formData.readTime} onChange={e => setFormData({...formData, readTime: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Deskripsi Singkat (Excerpt)</label>
                  <input required placeholder="Kalimat pendek yang tampil di kartu berita luar..." value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                    className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">URL Gambar Sampul (Opsional)</label>
                  <input placeholder="https://..." value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} 
                    className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider mb-2">Konten Artikel HTML</label>
                  <div className="mb-3 text-xs text-[#464555]/70 bg-[#f7f9fb] p-3 rounded-xl border border-[#e6e8ea]">
                    💡 <strong>Tips Render:</strong> Teks mendukung struktur HTML.
                    <code className="ml-1 text-[#4f46e5]">&lt;h2&gt;</code>, <code className="text-[#4f46e5]">&lt;p&gt;</code>, <code className="text-[#4f46e5]">&lt;ul&gt;&lt;li&gt;</code>, <code className="text-[#4f46e5]">&lt;img&gt;</code>
                  </div>
                  <textarea required placeholder="<p>Selamat datang di pembaruan season terbaru...</p>" rows={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} 
                    className="w-full px-4 py-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all resize-y" />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#e6e8ea] flex justify-end gap-3 bg-[#f7f9fb] rounded-b-3xl">
              <button 
                type="button" onClick={closeModal} 
                className="px-5 py-2.5 bg-white border border-[#e6e8ea] rounded-xl text-xs font-bold hover:bg-[#e6e8ea] transition-colors"
              >
                Batal
              </button>
              <button 
                form="newsForm" type="submit" disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">save</span>
                {loading ? 'Menyimpan...' : 'Simpan Artikel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
