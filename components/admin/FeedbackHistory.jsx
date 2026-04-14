'use client';

import React, { useEffect, useState } from 'react';
import { getAllVotes, deleteVote } from '@/app/actions/adminActions';

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

  if (loading && votes.length === 0) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e6e8ea] border-t-[#4f46e5] rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#464555]">Mengambil Data Suara...</p>
      </div>
    </div>
  );

  return (
    <div suppressHydrationWarning className="px-4 md:px-8 pb-8">
      {/* Filters Header */}
      <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-[#464555]/60 uppercase tracking-wider mr-2">Filter:</span>
          {[
            { key: 'all', label: 'Semua' },
            { key: 'setuju', label: 'Setuju' },
            { key: 'batal', label: 'Batal' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterChoice(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterChoice === f.key 
                  ? 'bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white shadow-md' 
                  : 'bg-[#f7f9fb] text-[#464555] hover:bg-[#e6e8ea]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]/50 text-xl">search</span>
          <input 
            type="text" 
            placeholder="Cari pesan atau ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f7f9fb] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-[#f7f9fb] text-xs font-bold text-[#464555] uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Pengirim</th>
                <th className="p-4">Suara</th>
                <th className="p-4">Saran / Masukan</th>
                <th className="p-4">Waktu</th>
                <th className="p-4 pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {filteredVotes.length > 0 ? filteredVotes.map((v, i) => (
                <tr key={v.id} className="border-b border-[#464555]/5 hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                        v.userId === 'anonymous' 
                          ? 'bg-[#e6e8ea] text-[#464555]' 
                          : 'bg-[#4f46e5]/10 text-[#4f46e5]'
                      }`}>
                        <span className="material-symbols-outlined text-lg">{v.userId === 'anonymous' ? 'person_off' : 'person'}</span>
                      </div>
                      <div>
                        <div className="font-bold text-xs">{v.userId === 'anonymous' ? 'TAMU' : 'USER'}</div>
                        <div className="text-[10px] text-[#464555]/50 font-semibold">{v.userId?.substring(0, 10)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                      v.vote 
                        ? 'bg-[#dcfce7] text-[#15803d]' 
                        : 'bg-[#ffdad6] text-[#93000a]'
                    }`}>
                      <span className="material-symbols-outlined text-xs">{v.vote ? 'thumb_up' : 'thumb_down'}</span>
                      {v.vote ? 'SETUJU' : 'BATAL'}
                    </span>
                  </td>
                  <td className="p-4 max-w-sm text-[#464555] text-sm">
                    {v.feedback || <em className="opacity-40">Tidak ada pesan</em>}
                  </td>
                  <td className="p-4 text-xs text-[#464555]/70 font-semibold">
                    {new Date(v.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 pr-6">
                    <button 
                      disabled={isMutating}
                      onClick={() => handleDelete(v.id)}
                      className="w-9 h-9 bg-[#ffdad6]/50 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-xl flex items-center justify-center transition-colors"
                      title="Hapus Feedback"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-sm text-[#464555]/50 font-semibold">
                    Belum ada data suara masuk
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
