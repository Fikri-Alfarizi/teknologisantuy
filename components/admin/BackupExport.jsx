'use client';

import React, { useState } from 'react';
import { exportCollection } from '@/app/actions/adminActionsV2';
import { FaFileExport, FaDownload, FaDatabase, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const COLLECTIONS = [
  { id: 'users', label: 'Users', icon: '👥', description: 'Semua data pengguna terdaftar' },
  { id: 'siteAnalytics', label: 'Site Analytics', icon: '📊', description: 'Log kunjungan website' },
  { id: 'forumVotes', label: 'Forum Votes', icon: '📝', description: 'Suara dan feedback komunitas' },
  { id: 'game_stats', label: 'Game Stats', icon: '🎮', description: 'Statistik klik game' },
  { id: 'contact_messages', label: 'Contact Messages', icon: '📧', description: 'Pesan kontak masuk' },
  { id: 'launcherNews', label: 'Launcher News', icon: '📰', description: 'Artikel berita launcher' },
  { id: 'game_overrides', label: 'Game Overrides', icon: '🔧', description: 'Override data game' },
  { id: 'game_requests', label: 'Game Requests', icon: '🎯', description: 'Permintaan game dari user' },
  { id: 'admin_activity_logs', label: 'Activity Logs', icon: '📋', description: 'Log aktivitas admin' },
  { id: 'admin_tasks', label: 'Tasks', icon: '✅', description: 'Task board items' },
  { id: 'scheduled_events', label: 'Scheduled Events', icon: '📅', description: 'Event terjadwal' },
  { id: 'admin_notifications', label: 'Notifications', icon: '🔔', description: 'Notifikasi admin' },
];

export default function BackupExport() {
  const [exporting, setExporting] = useState({});
  const [exported, setExported] = useState({});
  const [bulkExporting, setBulkExporting] = useState(false);

  async function handleExport(collectionId) {
    setExporting(prev => ({ ...prev, [collectionId]: true }));
    try {
      const res = await exportCollection(collectionId);
      if (res.success) {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${collectionId}-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setExported(prev => ({ ...prev, [collectionId]: res.count }));
      } else {
        alert('Export gagal: ' + res.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setExporting(prev => ({ ...prev, [collectionId]: false }));
  }

  async function handleBulkExport() {
    setBulkExporting(true);
    const allData = {};
    for (const col of COLLECTIONS) {
      try {
        const res = await exportCollection(col.id);
        if (res.success) {
          allData[col.id] = { count: res.count, data: res.data };
        }
      } catch (err) {
        allData[col.id] = { count: 0, data: [], error: err.message };
      }
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBulkExporting(false);
    alert('Full backup berhasil diunduh!');
  }

  return (
    <div style={{ color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #000', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaFileExport /> Backup <span style={{ background: '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px' }}>& Export</span>
        </h2>
        <button onClick={handleBulkExport} disabled={bulkExporting} style={{
          padding: '12px 24px', background: bulkExporting ? '#ccc' : '#000', color: '#fff',
          border: 'none', borderRadius: '8px', fontWeight: 900, cursor: bulkExporting ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px',
          boxShadow: '4px 4px 0 #ffe600'
        }}>
          {bulkExporting ? <><FaSpinner className="spin" /> Exporting...</> : <><FaDatabase /> FULL BACKUP</>}
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        background: '#fffde7', border: '2px solid #ffe600', borderRadius: '10px',
        padding: '16px 20px', marginBottom: '24px', fontSize: '13px', fontWeight: 700, color: '#333'
      }}>
        ⚠️ <strong>Backup Tip:</strong> Export data Anda secara berkala untuk mencegah kehilangan data. File akan diunduh dalam format JSON yang bisa diimpor kembali.
      </div>

      {/* Collection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {COLLECTIONS.map(col => (
          <div key={col.id} style={{
            background: '#fff', border: '3px solid #000', borderRadius: '12px',
            padding: '20px', boxShadow: '4px 4px 0 rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>{col.icon}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase' }}>{col.label}</div>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>{col.description}</div>
              </div>
            </div>

            {exported[col.id] !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#4caf50' }}>
                <FaCheckCircle /> {exported[col.id]} dokumen diekspor
              </div>
            )}

            <button onClick={() => handleExport(col.id)} disabled={exporting[col.id]} style={{
              padding: '10px', background: exporting[col.id] ? '#f0f0f0' : '#ffe600',
              border: '2px solid #000', borderRadius: '8px', fontWeight: 900, fontSize: '12px',
              cursor: exporting[col.id] ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              textTransform: 'uppercase', transition: '0.15s',
              boxShadow: exporting[col.id] ? 'none' : '2px 2px 0 rgba(0,0,0,0.1)'
            }}>
              {exporting[col.id] ? <><FaSpinner /> Exporting...</> : <><FaDownload /> Export JSON</>}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
