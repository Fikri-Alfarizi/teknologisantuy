'use client';

import React, { useState, useEffect } from 'react';
import { getGameRequests, updateGameRequestStatus } from '@/app/actions/adminActionsV2';
import { FaGamepad, FaSearch, FaCheck, FaTimes, FaClock, FaSpinner, FaFilter } from 'react-icons/fa';

const STATUS_MAP = {
  'pending': { label: 'PENDING', color: '#ff9800', bg: '#fff3e0' },
  'in_progress': { label: 'IN PROGRESS', color: '#2196f3', bg: '#e3f2fd' },
  'done': { label: 'SELESAI', color: '#4caf50', bg: '#e8f5e9' },
  'rejected': { label: 'DITOLAK', color: '#f44336', bg: '#ffebee' },
};

export default function GameRequestManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  async function fetchRequests() {
    setLoading(true);
    const res = await getGameRequests();
    if (res.success) setRequests(res.data);
    setLoading(false);
  }

  async function handleStatusUpdate(requestId, newStatus) {
    const res = await updateGameRequestStatus(requestId, newStatus, editNote);
    if (res.success) {
      setEditingId(null);
      setEditNote('');
      fetchRequests();
    }
  }

  const filtered = requests.filter(r => {
    const matchSearch = r.gameName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || (r.status || 'pending') === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => !r.status || r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    done: requests.filter(r => r.status === 'done').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (loading) return <div style={{ padding: '40px', fontWeight: 800, textTransform: 'uppercase' }}>Memuat Game Requests...</div>;

  return (
    <div style={{ color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #000', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaGamepad /> Game <span style={{ background: '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px' }}>Requests</span>
        </h2>
        <button onClick={fetchRequests} style={{ padding: '10px 20px', background: '#ffe600', border: '2px solid #000', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'Semua' },
          { id: 'pending', label: 'Pending' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'done', label: 'Selesai' },
          { id: 'rejected', label: 'Ditolak' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setFilterStatus(tab.id)} style={{
            padding: '8px 16px', borderRadius: '8px',
            border: filterStatus === tab.id ? '2px solid #000' : '2px solid #ddd',
            background: filterStatus === tab.id ? '#ffe600' : '#fff',
            fontWeight: 800, fontSize: '12px', cursor: 'pointer',
            transition: '0.15s'
          }}>
            {tab.label} ({statusCounts[tab.id]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          placeholder="Cari nama game atau user..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '12px 14px 12px 40px', border: '2px solid #000', borderRadius: '8px', fontWeight: 700, outline: 'none' }}
        />
      </div>

      {/* Request Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: 800, color: '#999' }}>
            Tidak ada request ditemukan
          </div>
        ) : filtered.map(req => {
          const status = STATUS_MAP[req.status || 'pending'] || STATUS_MAP.pending;
          return (
            <div key={req.id} style={{
              background: '#fff', border: '3px solid #000', borderRadius: '12px',
              padding: '20px 24px', boxShadow: '4px 4px 0 rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontWeight: 950, fontSize: '16px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  🎮 {req.gameName || 'Unknown Game'}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>
                  Diminta oleh: <strong>{req.userName || req.userId || 'Anonymous'}</strong>
                </div>
                {req.message && (
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, marginTop: '6px', fontStyle: 'italic' }}>
                    "{req.message}"
                  </div>
                )}
                <div style={{ fontSize: '10px', color: '#999', marginTop: '6px', fontWeight: 700 }}>
                  {new Date(req.timestamp).toLocaleString('id-ID')}
                </div>
              </div>

              {/* Status Badge */}
              <span style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 900,
                background: status.bg, color: status.color, border: `2px solid ${status.color}`,
                textTransform: 'uppercase'
              }}>
                {status.label}
              </span>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(req.status !== 'done') && (
                  <button onClick={() => handleStatusUpdate(req.id, 'done')} style={{
                    padding: '8px 12px', background: '#e8f5e9', border: '2px solid #4caf50',
                    borderRadius: '6px', cursor: 'pointer', fontWeight: 800, fontSize: '11px', color: '#2e7d32'
                  }}>
                    <FaCheck /> Done
                  </button>
                )}
                {(req.status !== 'in_progress') && (
                  <button onClick={() => handleStatusUpdate(req.id, 'in_progress')} style={{
                    padding: '8px 12px', background: '#e3f2fd', border: '2px solid #2196f3',
                    borderRadius: '6px', cursor: 'pointer', fontWeight: 800, fontSize: '11px', color: '#1565c0'
                  }}>
                    <FaSpinner /> Progress
                  </button>
                )}
                {(req.status !== 'rejected') && (
                  <button onClick={() => handleStatusUpdate(req.id, 'rejected')} style={{
                    padding: '8px 12px', background: '#ffebee', border: '2px solid #f44336',
                    borderRadius: '6px', cursor: 'pointer', fontWeight: 800, fontSize: '11px', color: '#c62828'
                  }}>
                    <FaTimes /> Reject
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
