'use client';

import React, { useState, useEffect } from 'react';
import { getAnalyticsStats } from '@/app/actions/adminActions';
import { FaGlobe, FaDesktop, FaMobileAlt, FaLink, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function AnalyticsDetail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    log.path?.toLowerCase().includes(filter.toLowerCase()) ||
    log.referrer?.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div style={{ padding: '40px', fontWeight: 800 }}>Loading Traffic Data...</div>;

  return (
    <div style={{ color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '4px solid #000', paddingBottom: '20px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '28px', textTransform: 'uppercase', letterSpacing: '-1px' }}>
          Analitik <span style={{ background: 'var(--yellow)', padding: '0 10px', border: '3px solid #000' }}>Pengunjung Detail</span>
        </h2>
        <div style={{ display: 'flex', gap: '15px' }}>
           <input 
             type="text" 
             placeholder="Cari IP, Negara, atau Path..." 
             value={filter}
             onChange={e => setFilter(e.target.value)}
             style={{ 
               padding: '10px 15px', border: '3px solid #000', fontWeight: 800, outline: 'none', width: '250px'
             }}
           />
           <button onClick={fetchLogs} style={{ 
             padding: '10px 20px', background: '#000', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '5px 5px 0 var(--yellow)'
           }}>Refresh</button>
        </div>
      </div>

      <div style={{ background: '#fff', border: '4px solid #000', boxShadow: '12px 12px 0 #000', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#eee', borderBottom: '4px solid #000' }}>
              <tr>
                <th style={thStyle}>Waktu</th>
                <th style={thStyle}>Informasi Pengunjung</th>
                <th style={thStyle}>Lokasi</th>
                <th style={thStyle}>Halaman (Path)</th>
                <th style={thStyle}>Sumber (Referrer)</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '2px solid #000', background: i % 2 === 0 ? '#fff' : '#f9f9f9', fontSize: '13px' }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
                      <FaClock size={12} /> {new Date(log.timestamp || Date.now()).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 900, marginBottom: '4px' }}>IP: {log.ip || 'Hidden'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#666' }}>
                      {log.platform === 'Mobile' ? <FaMobileAlt /> : <FaDesktop />} {log.platform}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                       <FaMapMarkerAlt color="#ff1744" /> {log.country || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '11px', marginLeft: '22px' }}>{log.city || '-'}</div>
                  </td>
                  <td style={tdStyle}>
                    <code style={{ background: 'var(--yellow)', padding: '2px 6px', border: '1px solid #000' }}>{log.path}</code>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '11px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.referrer}>
                      <FaLink size={10} style={{ marginRight: '5px' }} /> {log.referrer || 'Direct'}
                    </div>
                  </td>
                </tr>
              ))}
              {currentLogs.length === 0 && (
                <tr>
                   <td colSpan="5" style={{ padding: '60px', textAlign: 'center', fontWeight: 800 }}>Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#eee', borderTop: '4px solid #000' }}>
          <div style={{ fontWeight: 800, fontSize: '14px' }}>
            Menampilkan {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} log
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{ padding: '8px 16px', background: currentPage === 1 ? '#ccc' : '#fff', border: '3px solid #000', fontWeight: 900, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              &laquo; Prev
            </button>
            <div style={{ padding: '8px 16px', background: 'var(--yellow)', border: '3px solid #000', fontWeight: 900 }}>
              {currentPage} / {totalPages}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{ padding: '8px 16px', background: currentPage === totalPages ? '#ccc' : '#fff', border: '3px solid #000', fontWeight: 900, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = { padding: '20px', fontWeight: 950, textTransform: 'uppercase', fontSize: '12px', borderRight: '2px solid #000' };
const tdStyle = { padding: '18px 20px', fontWeight: 700, borderRight: '1px solid #ddd' };
