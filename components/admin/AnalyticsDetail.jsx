'use client';

import React, { useState, useEffect } from 'react';
import { getAnalyticsStats } from '@/app/actions/adminActions';

export default function AnalyticsDetail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const res = await getAnalyticsStats();
    if (res.success) {
      setLogs(res.data.allLogs || []);
    }
    setLoading(false);
  }

  const filteredLogs = logs.filter(log => 
    log.ip?.includes(filter) || 
    log.country?.toLowerCase().includes(filter.toLowerCase()) || 
    log.path?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e6e8ea] border-t-[#4f46e5] rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#464555]">Loading Traffic Data...</p>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Analitik <span className="text-[#4f46e5]">Pengunjung Detail</span>
          </h2>
          <p className="text-xs font-medium text-[#464555]/60 mt-1">{logs.length} total log tercatat</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]/50 text-xl">search</span>
            <input 
              type="text" 
              placeholder="Cari IP, Negara, atau Path..." 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full bg-[#f7f9fb] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all"
            />
          </div>
          <button 
            onClick={fetchLogs} 
            className="px-4 py-2.5 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-[#f7f9fb] text-xs font-bold text-[#464555] uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Waktu</th>
                <th className="p-4">Informasi Pengunjung</th>
                <th className="p-4">Lokasi</th>
                <th className="p-4">Halaman (Path)</th>
                <th className="p-4 pr-6">Sumber (Referrer)</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {filteredLogs.map((log, i) => (
                <tr key={i} className="border-b border-[#464555]/5 hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-2 text-xs text-[#464555]/70 font-semibold">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {new Date(log.timestamp || Date.now()).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-xs mb-1">IP: {log.ip || 'Hidden'}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#464555]/60 font-semibold">
                      <span className="material-symbols-outlined text-xs">{log.platform === 'Mobile' ? 'phone_android' : 'desktop_windows'}</span>
                      {log.platform}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <span className="text-[#ba1a1a]">📍</span> {log.country || 'Unknown'}
                    </div>
                    <div className="text-[10px] text-[#464555]/50 ml-5">{log.city || '-'}</div>
                  </td>
                  <td className="p-4">
                    <code className="bg-[#4f46e5]/10 text-[#4f46e5] px-2 py-1 rounded-lg text-[11px] font-bold">{log.path}</code>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="text-[11px] max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-[#464555]/70 font-semibold" title={log.referrer}>
                      <span className="material-symbols-outlined text-xs mr-1 align-middle">link</span>
                      {log.referrer || 'Direct'}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-sm text-[#464555]/50 font-semibold">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
