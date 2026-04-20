'use client';

import React, { useEffect, useState } from 'react';
import { getAllNotificationSubs } from '@/app/actions/adminActions';
import { FaBell, FaGlobe, FaDesktop, FaCalendarAlt, FaTrash, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

export default function NotificationSubscribers() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const res = await getAllNotificationSubs();
    if (res.success) {
      setSubs(res.data);
    }
    setLoading(false);
  }

  const filteredSubs = subs.filter(sub => 
    sub.ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ padding: '20px', fontWeight: 800 }}>Memuat Data Subscriber...</div>;

  return (
    <div className="notif-subs-page" style={{ color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '4px solid #000', paddingBottom: '20px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '28px', textTransform: 'uppercase', letterSpacing: '-1px' }}>
          Manajemen <span style={{ background: '#ffe600', padding: '0 10px', border: '3px solid #000' }}>Subscriber Notif</span>
        </h2>
        <div style={{ background: '#000', color: '#fff', padding: '8px 16px', fontWeight: 900, borderRadius: '4px', fontSize: '14px' }}>
          TOTAL: {subs.length}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '25px', position: 'relative' }}>
        <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
        <input 
          type="text" 
          placeholder="Cari IP, Negara, atau Kota..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%', padding: '15px 15px 15px 45px', border: '4px solid #000',
            fontSize: '15px', fontWeight: 800, outline: 'none', boxShadow: '6px 6px 0 rgba(0,0,0,0.05)'
          }}
        />
      </div>

      <div style={{ background: '#fff', border: '4px solid #000', boxShadow: '10px 10px 0 rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '4px solid #000', textAlign: 'left' }}>
                <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 950, textTransform: 'uppercase' }}>Informasi IP</th>
                <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 950, textTransform: 'uppercase' }}>Lokasi</th>
                <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 950, textTransform: 'uppercase' }}>Waktu Allow</th>
                <th style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 950, textTransform: 'uppercase' }}>Device / Browser</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((sub, i) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #eee', background: i % 2 === 0 ? 'transparent' : '#fcfcfc' }}>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ fontWeight: 900, fontSize: '14px', color: '#007bff' }}>{sub.ip}</div>
                    <div style={{ fontSize: '10px', color: '#999', fontWeight: 700 }}>IPv4/IPv6 Address</div>
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '13px' }}>
                      <FaMapMarkerAlt color="#ff4757" />
                      {sub.city}, {sub.country}
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '12px' }}>
                      <FaCalendarAlt color="#888" />
                      {new Date(sub.subscribedAt).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ 
                      fontSize: '11px', fontWeight: 700, color: '#555', 
                      maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px'
                    }}>
                      {sub.userAgent}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '50px', textAlign: 'center', fontWeight: 800, color: '#999' }}>
                    Data subscriber tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        th, td { text-align: left; }
      `}</style>
    </div>
  );
}
