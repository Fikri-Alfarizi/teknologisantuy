'use client';

import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '@/app/actions/adminActionsV2';
import { FaHistory, FaSearch, FaFilter, FaUser, FaGamepad, FaNewspaper, FaCog, FaRobot, FaUsers, FaCommentAlt, FaDownload } from 'react-icons/fa';

const MODULE_ICONS = {
  'user': <FaUsers color="#007bff" />,
  'game': <FaGamepad color="#28a745" />,
  'news': <FaNewspaper color="#ff9800" />,
  'bot': <FaRobot color="#6f42c1" />,
  'feedback': <FaCommentAlt color="#e91e63" />,
  'settings': <FaCog color="#666" />,
  'general': <FaHistory color="#333" />,
};

const ACTION_COLORS = {
  'create': '#2e7d32',
  'update': '#1565c0',
  'delete': '#c62828',
  'toggle': '#f57f17',
  'export': '#6a1b9a',
  'login': '#00838f',
};

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const res = await getActivityLogs(100);
    if (res.success) setLogs(res.data);
    setLoading(false);
  }

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = filterModule === 'all' || log.module === filterModule;
    return matchSearch && matchModule;
  });

  const exportCSV = () => {
    const headers = ['Waktu', 'Admin', 'Modul', 'Aksi', 'Detail'];
    const rows = filteredLogs.map(l => [
      new Date(l.timestamp).toLocaleString('id-ID'),
      l.adminName,
      l.module,
      l.action,
      l.detail
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ padding: '40px', fontWeight: 800, textTransform: 'uppercase' }}>Memuat Activity Log...</div>;

  return (
    <div style={{ color: '#000' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #000', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaHistory /> Activity <span style={{ background: '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px' }}>Log</span>
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              placeholder="Cari aksi, admin..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '10px 14px 10px 36px', border: '2px solid #000', fontWeight: 700, outline: 'none', borderRadius: '6px', width: '220px' }}
            />
          </div>
          <select
            value={filterModule}
            onChange={e => setFilterModule(e.target.value)}
            style={{ padding: '10px 14px', border: '2px solid #000', fontWeight: 700, borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
          >
            <option value="all">Semua Modul</option>
            <option value="user">User</option>
            <option value="game">Game</option>
            <option value="news">News</option>
            <option value="bot">Bot</option>
            <option value="feedback">Feedback</option>
            <option value="settings">Settings</option>
          </select>
          <button onClick={exportCSV} style={{
            padding: '10px 16px', background: '#000', color: '#fff', border: 'none',
            borderRadius: '6px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '3px 3px 0 #ffe600'
          }}>
            <FaDownload /> CSV
          </button>
          <button onClick={fetchLogs} style={{
            padding: '10px 16px', background: '#ffe600', border: '2px solid #000',
            borderRadius: '6px', fontWeight: 800, cursor: 'pointer'
          }}>Refresh</button>
        </div>
      </div>

      {/* Timeline Style Log */}
      <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', overflow: 'hidden', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
        {filteredLogs.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', fontWeight: 800, color: '#999' }}>
            Belum ada aktivitas tercatat.
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredLogs.map((log, i) => (
              <div key={log.id} style={{
                padding: '16px 24px', borderBottom: '1px solid #f0f0f0',
                display: 'flex', alignItems: 'center', gap: '16px',
                background: i % 2 === 0 ? '#fff' : '#fcfcfc',
                transition: '0.1s'
              }}>
                {/* Icon */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#f5f5f5', border: '2px solid #eee',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {MODULE_ICONS[log.module] || MODULE_ICONS.general}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: '13px' }}>{log.adminName}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800,
                      background: ACTION_COLORS[log.action] || '#666', color: '#fff', textTransform: 'uppercase'
                    }}>{log.action}</span>
                    <span style={{
                      padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 700,
                      background: '#f5f5f5', color: '#666', textTransform: 'uppercase'
                    }}>{log.module}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.detail}
                  </div>
                </div>

                {/* Time */}
                <div style={{ fontSize: '11px', color: '#999', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', fontSize: '12px', color: '#999', fontWeight: 700, textAlign: 'right' }}>
        Menampilkan {filteredLogs.length} log
      </div>
    </div>
  );
}
