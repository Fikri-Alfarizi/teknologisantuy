'use client';

import React, { useState, useEffect } from 'react';
import { getContactMessages, deleteContactMessage } from '@/app/actions/adminActions';

export default function ContactInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const res = await getContactMessages();
    if (res.success) setMessages(res.data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (confirm('Hapus pesan ini permanen?')) {
      const res = await deleteContactMessage(id);
      if (res.success) fetchMessages();
    }
  }

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e6e8ea] border-t-[#4f46e5] rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#464555]">Membuka Kotak Masuk...</p>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Kontak <span className="text-[#4f46e5]">Pesan Masuk</span>
          </h2>
          <p className="text-xs font-medium text-[#464555]/60 mt-1">{messages.length} pesan di inbox</p>
        </div>
        <button 
          onClick={fetchMessages}
          className="px-4 py-2.5 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh Inbox
        </button>
      </div>

      {/* Messages List */}
      <div className="flex flex-col gap-5">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition-all border border-transparent hover:border-[#e6e8ea]">
            {/* Message Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 pb-4 border-b border-[#e6e8ea]">
              <div className="flex gap-3 items-center">
                <div className="w-11 h-11 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] rounded-xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>{msg.name}</div>
                  <div className="text-xs text-[#464555]/60 font-semibold">{msg.email}</div>
                </div>
              </div>
              <div className="sm:text-right flex flex-col gap-1">
                <span className="inline-block px-3 py-1 bg-[#191c1e] text-white rounded-full text-[10px] font-bold w-fit sm:ml-auto">
                  {msg.subject || 'NO SUBJECT'}
                </span>
                <div className="text-[11px] text-[#464555]/60 font-semibold flex items-center gap-1 sm:justify-end">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {new Date(msg.timestamp).toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="text-sm text-[#464555] font-medium leading-relaxed whitespace-pre-wrap mb-5 pl-1">
              {msg.message}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <a 
                href={`mailto:${msg.email}?subject=RE: ${msg.subject}`} 
                className="px-4 py-2 bg-[#f7f9fb] hover:bg-[#e6e8ea] rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-[#e6e8ea] no-underline text-[#191c1e]"
              >
                <span className="material-symbols-outlined text-base">reply</span>
                Balas Lewat Email
              </a>
              <button 
                onClick={() => handleDelete(msg.id)}
                className="px-4 py-2 bg-[#ffdad6]/50 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Hapus
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-20 text-center">
            <span className="material-symbols-outlined text-6xl text-[#464555]/10 mb-4 block">inbox</span>
            <p className="font-bold text-[#464555]/50" style={{ fontFamily: 'Manrope, sans-serif' }}>Inbox Kosong.</p>
          </div>
        )}
      </div>
    </div>
  );
}
