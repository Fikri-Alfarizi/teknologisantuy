'use client';

import React, { useEffect, useState } from 'react';
import { getAllVotes, deleteVote } from '@/app/actions/adminActions';
import { FaTrash, FaFilter, FaSearch, FaCheck, FaTimes, FaUserAlt, FaUserSecret } from 'react-icons/fa';

export default function FeedbackHistory() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterChoice, setFilterChoice] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMutating, setIsMutating] = useState(false);

  const fetchVotes = async () => {
    setLoading(true);
    const result = await getAllVotes();
    if (result.success) {
      setVotes(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus feedback ini dari database? Tindakan ini permanen.")) return;
    setIsMutating(true);
    const result = await deleteVote(id);
    if (result.success) {
      fetchVotes();
    } else {
      alert("Gagal menghapus: " + result.error);
    }
    setIsMutating(false);
  };

  const filteredVotes = votes.filter(v => {
    const matchesSearch = v.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterChoice === 'all' || 
                          (filterChoice === 'setuju' && v.vote === true) || 
                          (filterChoice === 'batal' && v.vote === false);
    return matchesSearch && matchesFilter;
  });

  if (loading && votes.length === 0) return <div style={{ fontWeight: 800, textTransform: 'uppercase', color: '#666' }}>Mengambil Data Suara...</div>;

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      {/* Filters Header */}
      <div style={{ background: '#fff', border: '4px solid #000', boxShadow: '10px 10px 0 #000', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
         <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: '#ffe600', padding: '10px', border: '2px solid #000', fontWeight: 950, fontSize: '13px' }}>FILTER:</div>
            <button 
               onClick={() => setFilterChoice('all')}
               style={{ 
                  padding: '8px 15px', border: '2px solid #000', fontWeight: 800, cursor: 'pointer',
                  background: filterChoice === 'all' ? '#000' : '#fff', color: filterChoice === 'all' ? '#fff' : '#000'
               }}
            >
               SEMUA
            </button>
            <button 
               onClick={() => setFilterChoice('setuju')}
               style={{ 
                  padding: '8px 15px', border: '2px solid #000', fontWeight: 800, cursor: 'pointer',
                  background: filterChoice === 'setuju' ? '#ffe600' : '#fff', color: '#000'
               }}
            >
               SETUJU
            </button>
            <button 
               onClick={() => setFilterChoice('batal')}
               style={{ 
                  padding: '8px 15px', border: '2px solid #000', fontWeight: 800, cursor: 'pointer',
                  background: filterChoice === 'batal' ? '#eee' : '#fff', color: '#000'
               }}
            >
               BATAL
            </button>
         </div>

         <div style={{ position: 'relative', width: '300px' }}>
            <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
               type="text" 
               placeholder="Cari pesan atau ID..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               style={{ 
                  width: '100%', padding: '10px 15px 10px 45px', border: '3px solid #000', 
                  fontSize: '14px', fontWeight: 700, outline: 'none'
               }}
            />
         </div>
      </div>

      {/* Main Table */}
      <div style={{ background: '#fff', border: '4px solid #000', boxShadow: '12px 12px 0 #000', overflow: 'hidden' }}>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead style={{ background: '#000', color: '#fff' }}>
                  <tr style={{ fontSize: '12px', fontWeight: 950, textTransform: 'uppercase' }}>
                     <th style={{ padding: '18px 25px' }}>Pengirim</th>
                     <th style={{ padding: '18px 25px' }}>Suara</th>
                     <th style={{ padding: '18px 25px' }}>Saran / Masukan</th>
                     <th style={{ padding: '18px 25px' }}>Waktu</th>
                     <th style={{ padding: '18px 25px' }}>Aksi</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredVotes.length > 0 ? filteredVotes.map((v, i) => (
                     <tr key={v.id} style={{ borderBottom: '2px solid #000', background: i % 2 === 0 ? '#fff' : '#f9f9f9', color: '#000' }}>
                        <td style={{ padding: '15px 25px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ 
                                 width: '35px', height: '35px', border: '2px solid #000', borderRadius: '50%', 
                                 display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.userId === 'anonymous' ? '#eee' : '#ffe600' 
                              }}>
                                 {v.userId === 'anonymous' ? <FaUserSecret size={18} /> : <FaUserAlt size={16} />}
                              </div>
                              <div>
                                 <div style={{ fontWeight: 900, fontSize: '13px' }}>{v.userId === 'anonymous' ? 'TAMU' : 'USER'}</div>
                                 <div style={{ fontSize: '10px', color: '#888', fontWeight: 700 }}>{v.userId.substring(0, 10)}...</div>
                              </div>
                           </div>
                        </td>
                        <td style={{ padding: '15px 25px' }}>
                           <span style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              padding: '6px 12px', border: '2px solid #000', 
                              background: v.vote ? '#ffe600' : '#000', color: v.vote ? '#000' : '#fff',
                              fontSize: '11px', fontWeight: 950, textTransform: 'uppercase'
                           }}>
                              {v.vote ? < FaCheck /> : <FaTimes />} {v.vote ? 'SETUJU' : 'BATAL'}
                           </span>
                        </td>
                        <td style={{ padding: '15px 25px', maxWidth: '400px', fontWeight: 700, fontSize: '14px', lineHeight: '1.4' }}>
                           {v.feedback || <em style={{ opacity: 0.3 }}>Tidak ada pesan</em>}
                        </td>
                        <td style={{ padding: '15px 25px', fontSize: '12px', fontWeight: 800 }}>
                           {new Date(v.timestamp).toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '15px 25px' }}>
                           <button 
                              disabled={isMutating}
                              onClick={() => handleDelete(v.id)}
                              style={{ 
                                 background: '#fff', border: '2px solid #000', padding: '8px', 
                                 cursor: 'pointer', transition: '0.2s'
                              }}
                              title="Hapus Feedback"
                           >
                              <FaTrash color="#dc3545" />
                           </button>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan="5" style={{ padding: '80px', textAlign: 'center' }}>
                           <div style={{ opacity: 0.5, fontWeight: 900, textTransform: 'uppercase' }}>Belum ada data suara masuk</div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
