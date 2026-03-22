'use client';

import React, { useEffect, useState } from 'react';
import { getDashboardStats, getAnalyticsStats } from '@/app/actions/adminActions';
import { FaCheckCircle, FaTimesCircle, FaUsers, FaCommentDots, FaRocket, FaGlobe, FaFacebook, FaInstagram, FaLink } from 'react-icons/fa';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [statsRes, analyticsRes] = await Promise.all([
        getDashboardStats(),
        getAnalyticsStats()
      ]);

      if (statsRes.success) setData(statsRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div style={{ fontWeight: 800, textTransform: 'uppercase', color: '#666' }}>Syncing Data...</div>;

  const { stats, latestFeedback, totalUsers } = data;
  const yesPercent = stats.totalVotes > 0 ? Math.round((stats.yesVotes / stats.totalVotes) * 100) : 0;
  const noPercent = stats.totalVotes > 0 ? Math.round((stats.noVotes / stats.totalVotes) * 100) : 0;

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Stats Cards - Unified Yellow/White Palette */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
         <StatBox 
            title="Total Suara" count={stats.totalVotes} 
            icon={<FaCommentDots />} color="#ffe600" textColor="#000"
         />
         <StatBox 
            title="Saran Masuk" count={stats.feedbackCount} 
            icon={<FaCheckCircle />} color="#ffffff" textColor="#000"
         />
         <StatBox 
            title="User Terdaftar" count={totalUsers} 
            icon={<FaUsers />} color="#ffe600" textColor="#000"
         />
         <StatBox 
            title="Pesaing (%)" count={`${yesPercent}%`} 
            icon={<FaRocket />} color="#ffffff" textColor="#000"
         />
      </div>

      {/* Analytics Rows */}
      {/* Analytics Rows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
          {/* World Traffic Tracking */}
          <div style={{ background: '#fff', color: '#000', border: '4px solid #000', boxShadow: '10px 10px 0 #000', padding: '25px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 950, textTransform: 'uppercase', borderBottom: '3px solid #000', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#000' }}>
              <FaGlobe /> Traffic Dunia
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {analytics?.countryData.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
                  <span style={{ fontSize: '13px' }}>{c.name}</span>
                  <span style={{ background: '#000', color: '#fff', padding: '2px 8px', fontSize: '11px' }}>{c.count} Views</span>
                </div>
              )) || <p>Memuat data...</p>}
            </div>
          </div>

          {/* Source Breakdown */}
          <div style={{ background: '#fff', color: '#000', border: '4px solid #000', boxShadow: '10px 10px 0 #000', padding: '25px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 950, textTransform: 'uppercase', borderBottom: '3px solid #000', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#000' }}>
              🔗 Sumber Traffic
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <SourceBox icon={<FaFacebook color="#1877F2" />} label="Facebook" count={analytics?.sources.Facebook || 0} total={analytics?.totalViews || 1} color="#1877F2" />
               <SourceBox icon={<FaInstagram color="#E4405F" />} label="Instagram" count={analytics?.sources.Instagram || 0} total={analytics?.totalViews || 1} color="#E4405F" />
               <SourceBox icon={<FaLink color="#333" />} label="Direct / Other" count={(analytics?.sources.Direct || 0) + (analytics?.sources.Other || 0)} total={analytics?.totalViews || 1} color="#333" />
            </div>
          </div>

          {/* Top Pages */}
          <div style={{ background: '#fff', color: '#000', border: '4px solid #000', boxShadow: '10px 10px 0 #000', padding: '25px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 950, textTransform: 'uppercase', borderBottom: '3px solid #000', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#000' }}>
              📄 Top Pages
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analytics?.pageData.map((p, i) => (
                <div key={i} style={{ fontSize: '12px', fontWeight: 700, borderLeft: '3px solid #ffe600', paddingLeft: '10px', color: '#000' }}>
                  <div style={{ color: '#444', fontSize: '10px' }}>{p.path}</div>
                  <div>{p.count} Kunjungan</div>
                </div>
              ))}
            </div>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
         {/* Vote Breakdown */}
         <div style={{ background: '#fff', border: '4px solid #000', boxShadow: '12px 12px 0 #000', padding: '30px' }}>
            <h3 style={{ margin: '0 0 25px', fontSize: '16px', fontWeight: 950, textTransform: 'uppercase', borderBottom: '3px solid #000', paddingBottom: '12px', color: '#000' }}>📊 Respon Komunitas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
               <ProgressBar label="Lanjutkan (SETUJU)" percent={yesPercent} color="#ffe600" />
               <ProgressBar label="Jangan Dulu (BATAL)" percent={noPercent} color="#222" fontColor="#fff" />
            </div>
            <p style={{ marginTop: '30px', fontSize: '12px', color: '#000', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', background: '#ffe600', padding: '5px', border: '2px solid #000' }}>Total: {stats.totalVotes} Responden</p>
         </div>

         {/* Recent Feedback Table */}
         <div style={{ background: '#fff', border: '4px solid #000', boxShadow: '12px 12px 0 #000', overflow: 'hidden' }}>
            <div style={{ padding: '15px 25px', borderBottom: '4px solid #000', background: '#ffe600' }}>
               <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 950, textTransform: 'uppercase', color: '#000' }}>💬 Feedback Terbaru</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#eee', fontSize: '12px', fontWeight: 950, textTransform: 'uppercase', borderBottom: '2px solid #000', color: '#000' }}>
                     <tr>
                        <th style={{ padding: '18px 25px' }}>Status</th>
                        <th style={{ padding: '18px 25px' }}>Pilihan</th>
                        <th style={{ padding: '18px 25px' }}>Saran / Masukan</th>
                        <th style={{ padding: '18px 25px' }}>Waktu</th>
                     </tr>
                  </thead>
                  <tbody>
                     {latestFeedback.map((fb, i) => (
                        <tr key={fb.id} style={{ borderBottom: '2px solid #000', fontSize: '14px', background: i % 2 === 0 ? '#fff' : '#f9f9f9', color: '#000' }}>
                           <td style={{ padding: '18px 25px', fontWeight: 900 }}>
                              <span style={{ 
                                 padding: '4px 8px', background: fb.userId === 'anonymous' ? '#eee' : '#ffe600', 
                                 border: '1px solid #000', fontSize: '10px' 
                              }}>
                                 {fb.userId === 'anonymous' ? 'TAMU' : 'PREMIUM'}
                              </span>
                           </td>
                           <td style={{ padding: '18px 25px' }}>
                              <span style={{ 
                                 padding: '6px 12px', border: '2px solid #000',
                                 background: fb.vote ? '#ffe600' : '#000', color: fb.vote ? '#000' : '#fff', fontSize: '11px', fontWeight: 950, textTransform: 'uppercase'
                              }}>
                                 {fb.vote ? 'SETUJU' : 'BATAL'}
                              </span>
                           </td>
                           <td style={{ padding: '18px 25px', maxWidth: '400px', fontWeight: 700 }}>
                              {fb.feedback || <em style={{ opacity: 0.3 }}>Tidak ada pesan</em>}
                           </td>
                           <td style={{ padding: '18px 25px', color: '#000', fontSize: '12px', fontWeight: 800 }}>
                              {new Date(fb.timestamp).toLocaleString('id-ID')}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatBox({ title, count, icon, color, textColor = '#000' }) {
  return (
    <div style={{ 
      background: color, color: textColor, padding: '22px', border: '4px solid #000', 
      boxShadow: '10px 10px 0 #000', position: 'relative', overflow: 'hidden' 
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '32px', fontWeight: 950, letterSpacing: '-1.5px' }}>{count}</h3>
        <p style={{ margin: '8px 0 0', fontSize: '13px', textTransform: 'uppercase', fontWeight: 950, color: '#000' }}>{title}</p>
      </div>
      <div style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.12, fontSize: '80px', color: '#000' }}>
        {icon}
      </div>
    </div>
  );
}

function ProgressBar({ label, percent, color, fontColor = '#000' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 950, color: '#000' }}>
         <span>{label}</span>
         <span style={{ background: '#000', color: '#fff', padding: '2px 6px', fontSize: '11px' }}>{percent}%</span>
      </div>
      <div style={{ height: '16px', width: '100%', background: '#eee', border: '2px solid #000', overflow: 'hidden' }}>
         <div style={{ height: '100%', width: `${percent}%`, background: color }}></div>
      </div>
    </div>
  );
}

function SourceBox({ icon, label, count, total, color }) {
  const percent = Math.round((count / total) * 100);
  return (
    <div style={{ border: '2px solid #000', padding: '10px', display: 'flex', alignItems: 'center', gap: '15px', color: '#000' }}>
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 900, marginBottom: '4px', color: '#000' }}>
          <span>{label}</span>
          <span>{count}</span>
        </div>
        <div style={{ height: '6px', background: '#eee', border: '1px solid #000' }}>
          <div style={{ height: '100%', width: `${percent}%`, background: color }}></div>
        </div>
      </div>
    </div>
  );
}
