'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaEye } from 'react-icons/fa';
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
    <div style={{ background: '#fff', color: '#333', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Manajemen Berita Launcher</h2>
        <button 
          onClick={() => openModal()}
          style={{ 
            background: '#ffe600', border: '2px solid #000', borderRadius: '4px', 
            padding: '8px 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', boxShadow: '2px 2px 0 #000', transition: 'all 0.1s' 
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = 'none'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '2px 2px 0 #000'; }}
        >
          <FaPlus /> Buat Berita Baru
        </button>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
        <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', color: '#212529', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Judul</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Kategori</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Waktu Baca</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Tanggal</th>
              <th style={{ padding: '12px 15px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}><div className="spinner" style={{ width: 30, height: 30, border: '3px solid #ffe600', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div><style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}}/></td></tr>
            ) : newsList.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada berita yang ditambahkan. Silakan klik "Buat Berita Baru".</td></tr>
            ) : (
              newsList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6', transition: 'background 0.2s', color: '#212529' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f3f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 15px' }}>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.excerpt || 'Tidak ada deskripsi singkat.'}</div>
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{ background: '#e9ecef', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>{item.type}</span>
                  </td>
                  <td style={{ padding: '12px 15px', fontWeight: 600 }}>{item.readTime}</td>
                  <td style={{ padding: '12px 15px', color: '#495057' }}>
                    {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : 'Baru saja'}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <Link href={`/launcher/news/${item.id}`} target="_blank" style={{ display: 'inline-block', background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', textDecoration: 'none' }} title="Preview Berita">
                      <FaEye />
                    </Link>
                    <button onClick={() => openModal(item)} style={{ background: '#e3f2fd', color: '#0d47a1', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }} title="Edit Berita">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: '#ffebee', color: '#b71c1c', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Hapus Berita">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', color: '#333', borderRadius: '8px', border: '2px solid #000', 
            boxShadow: '8px 8px 0 #000', width: '100%', maxWidth: '900px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{ padding: '15px 20px', borderBottom: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>{editingId ? 'Edit Berita' : 'Buat Berita Baru'}</h3>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: 4 }}><FaTimes /></button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <form id="newsForm" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Judul Artikel</label>
                  <input required placeholder="Contoh: Update Season 2 & Perubahan Database" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle} />
                </div>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Kategori (Type)</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={inputStyle}>
                      <option value="NEWS">NEWS</option>
                      <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                      <option value="PATCH NOTES">PATCH NOTES</option>
                      <option value="ROSTER UPDATE">ROSTER UPDATE</option>
                      <option value="DEV LOG">DEV LOG</option>
                      <option value="DEEP DIVE">DEEP DIVE</option>
                    </select>
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Estimasi Waktu Baca</label>
                    <input required placeholder="Contoh: 5 MIN READ" value={formData.readTime} onChange={e => setFormData({...formData, readTime: e.target.value})} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Deskripsi Singkat (Excerpt)</label>
                  <input required placeholder="Kalimat pendek yang tampil di kartu berita luar..." value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>URL Gambar Sampul (Opsional)</label>
                  <input placeholder="https://..." value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Konten Artikel HTML</label>
                  <div style={{ marginBottom: '10px', fontSize: '13px', color: '#495057', background: '#f8f9fa', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }}>
                    💡 <strong>Tips Render:</strong> Teks mendukung struktur HTML.
                    <ul style={{ margin: '5px 0 0', paddingLeft: '20px' }}>
                      <li><code>&lt;h2&gt;Sub-Judul Utama&lt;/h2&gt;</code> untuk section baru</li>
                      <li><code>&lt;p&gt;Paragraf anda...&lt;/p&gt;</code> untuk paragraf teks</li>
                      <li><code>&lt;ul&gt;&lt;li&gt;Poin 1&lt;/li&gt;&lt;/ul&gt;</code> untuk list/poin-poin (seperti patch notes)</li>
                      <li><code>&lt;img src="url" /&gt;</code> untuk menambahkan gambar dalam artikel</li>
                    </ul>
                  </div>
                  <textarea required placeholder="<p>Selamat datang di pembaruan season terbaru...</p>" rows={12} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{...inputStyle, resize: 'vertical', fontFamily: 'monospace'}} />
                </div>
              </form>
            </div>

            <div style={{ padding: '15px 20px', borderTop: '2px solid #000', display: 'flex', justifyContent: 'flex-end', gap: '15px', background: '#f8f9fa' }}>
              <button 
                type="button" onClick={closeModal} 
                style={{ padding: '10px 20px', background: '#fff', border: '2px solid #000', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button 
                form="newsForm" type="submit" disabled={loading}
                style={{ 
                  padding: '10px 20px', background: '#ffe600', border: '2px solid #000', borderRadius: '4px', 
                  fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <FaSave /> {loading ? 'Menyimpan...' : 'Simpan Artikel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px', border: '2px solid #ced4da', borderRadius: '4px',
  fontFamily: 'inherit', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box', color: '#000', backgroundColor: '#fff'
};
