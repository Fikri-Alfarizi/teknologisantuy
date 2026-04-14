'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getDashboardStats, getAnalyticsStats, getGamePopularity } from '@/app/actions/adminActions';
import RealtimeActiveUsers from './RealtimeActiveUsers';

// Import chart secara dinamis agar tidak error saat SSR Next.js
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [botSettings, setBotSettings] = useState(null);
  const [botLoading, setBotLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          getDashboardStats(),
          getAnalyticsStats()
        ]);
        if (statsRes.success) setData(statsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Load Bot Settings
    async function loadBotSettings() {
      try {
        const response = await fetch('/api/bot/settings');
        const result = await response.json();
        if (result.success) setBotSettings(result.settings);
      } catch (err) {
        console.error("Bot Settings Load Error:", err);
      }
    }
    loadBotSettings();
  }, []);

  const toggleBot = async () => {
    setBotLoading(true);
    try {
      const response = await fetch('/api/bot/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' })
      });
      const result = await response.json();
      if (result.success) {
        setBotSettings(result.settings);
      }
    } catch (err) {
      console.error("Bot Toggle Error:", err);
    } finally {
      setBotLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  const { stats, latestFeedback, totalUsers } = data || { stats: { totalVotes: 0, yesVotes: 0, noVotes: 0, feedbackCount: 0 }, latestFeedback: [], totalUsers: 0 };
  const yesPercent = stats.totalVotes > 0 ? Math.round((stats.yesVotes / stats.totalVotes) * 100) : 0;
  
  // Data Chart Sumber Traffic
  const fbCount = analytics?.sources?.Facebook || 0;
  const igCount = analytics?.sources?.Instagram || 0;
  const directCount = (analytics?.sources?.Direct || 0) + (analytics?.sources?.Other || 0);
  
  const radialOptions = {
    chart: { type: 'radialBar', fontFamily: 'Inter, sans-serif' },
    plotOptions: {
      radialBar: {
        hollow: { size: '40%' },
        track: { background: '#f2f4f6', margin: 8 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '24px', fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: '#191c1e',
            show: true, formatter: function () { return analytics?.totalViews || 0; }
          }
        }
      }
    },
    colors: ['#4f46e5', '#E4405F', '#1877F2'], 
    labels: ['Direct', 'Instagram', 'Facebook'],
    stroke: { lineCap: 'round' }
  };

  return (
    <div className="flex w-full">
      {/* Konten Utama Kiri */}
      <div className="flex-1 px-8 pb-8 pr-[340px]">
        
        {/* Grid Widget */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Total Suara */}
          <div className="col-span-2 bg-primary-gradient p-8 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500"></div>
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <RealtimeActiveUsers />
            </div>
            <div className="relative z-10">
              <p className="text-white/80 text-xs font-bold mb-1 uppercase tracking-widest">Total Suara Terkumpul</p>
              <h3 className="text-5xl font-extrabold font-headline tracking-tight">{stats.totalVotes}</h3>
            </div>
          </div>

          {/* Card 2: Saran Masuk */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">mark_email_read</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">Updated</span>
            </div>
            <div className="mt-8">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Saran Masuk</p>
              <span className="text-2xl font-bold font-headline">{stats.feedbackCount}</span>
            </div>
          </div>

          {/* Card 3: User Terdaftar */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-tertiary-container/10 text-tertiary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">group</span>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">User Terdaftar</p>
              <span className="text-2xl font-bold font-headline">{totalUsers}</span>
            </div>
          </div>

          {/* Card 4: Persentase Pesaing / Setuju (Kombinasi User List Style) */}
          <div className="col-span-4 bg-surface-container-lowest p-8 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">Respon Komunitas (SETUJU)</p>
              <div className="flex items-end gap-3">
                 <h3 className="text-4xl font-bold font-headline">{yesPercent}%</h3>
                 <span className="text-primary font-bold mb-1">Mendukung Lanjut</span>
              </div>
            </div>
            <div className="w-1/2">
                <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-primary">Setuju: {stats.yesVotes}</span>
                    <span className="text-on-surface-variant">Batal: {stats.noVotes}</span>
                </div>
                <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary-gradient rounded-full transition-all duration-1000" style={{ width: `${yesPercent}%` }}></div>
                </div>
            </div>
          </div>
        </div>

        {/* Feedback List Table */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
             <h3 className="text-lg font-bold font-headline">💬 Feedback Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Status</th>
                  <th className="p-4">Pilihan</th>
                  <th className="p-4 w-1/2">Saran / Masukan</th>
                  <th className="p-4 pr-6">Waktu</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {latestFeedback.map((fb, i) => (
                  <tr key={fb.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 pl-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${fb.userId === 'anonymous' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary/10 text-primary'}`}>
                        {fb.userId === 'anonymous' ? 'TAMU' : 'PREMIUM'}
                      </span>
                    </td>
                    <td className="p-4">
                       <span className={`flex items-center gap-1.5 font-bold ${fb.vote ? 'text-primary' : 'text-error'}`}>
                          <span className="material-symbols-outlined text-[16px]">{fb.vote ? 'thumb_up' : 'thumb_down'}</span>
                          {fb.vote ? 'SETUJU' : 'BATAL'}
                       </span>
                    </td>
                    <td className="p-4 text-on-surface-variant">
                      {fb.feedback || <em className="opacity-50">Tidak ada pesan</em>}
                    </td>
                    <td className="p-4 pr-6 text-xs text-on-surface-variant/70">
                      {new Date(fb.timestamp).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar Kanan Statis di dalam Page */}
      <aside className="w-80 h-[calc(100vh-80px)] fixed right-0 top-[80px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.02)] p-8 border-l border-surface-container-high overflow-y-auto hide-scrollbar z-30">
        
        {/* Sumber Traffic (Chart) */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-headline">Sumber Traffic</h3>
          </div>
          <div className="bg-surface relative rounded-3xl p-6">
            <div className="flex justify-center -mt-4">
               {(typeof window !== 'undefined') && (
                  <ReactApexChart options={radialOptions} series={[directCount, igCount, fbCount]} type="radialBar" height={220} />
               )}
            </div>
            <div className="mt-2 space-y-4">
              <div className="flex justify-between items-center p-2 -mx-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]"></div>
                  <span className="text-xs font-semibold text-on-surface-variant">Direct/Lainnya</span>
                </div>
                <span className="text-xs font-bold">{directCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 -mx-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E4405F]"></div>
                  <span className="text-xs font-semibold text-on-surface-variant">Instagram</span>
                </div>
                <span className="text-xs font-bold">{igCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 -mx-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1877F2]"></div>
                  <span className="text-xs font-semibold text-on-surface-variant">Facebook</span>
                </div>
                <span className="text-xs font-bold">{fbCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Traffic Dunia (List) */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-headline">Traffic Dunia</h3>
          </div>
          <div className="bg-surface rounded-3xl p-6 space-y-5">
             {analytics?.countryData?.slice(0, 4).map((c, i) => {
                const percent = Math.round((c.count / (analytics.totalViews || 1)) * 100);
                return (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold border border-outline-variant/10">📍</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">{c.name}</span>
                        <span className="text-xs font-bold text-primary">{c.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary-gradient rounded-full" style={{width: `${percent}%`}}></div>
                      </div>
                    </div>
                  </div>
                )
             })}
          </div>
        </section>

        {/* Bot Controls - Styled Like Promo Card */}
        <section className="mt-8">
           <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                 <span className="material-symbols-outlined text-primary">smart_toy</span>
                 <h3 className="font-bold font-headline text-sm">Bot Control</h3>
              </div>
              
              <div className="bg-surface rounded-xl p-4 mb-4 flex justify-between items-center">
                 <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant">Status</p>
                    <p className={`text-xs font-bold ${botSettings?.enabled ? 'text-green-600' : 'text-error'}`}>
                       {botSettings ? (botSettings.enabled ? '🟢 AKTIF' : '🔴 NONAKTIF') : 'Memuat...'}
                    </p>
                 </div>
                 <button onClick={toggleBot} disabled={botLoading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${botSettings?.enabled ? 'bg-error hover:bg-on-error-container' : 'bg-primary hover:bg-primary-container'} ${botLoading ? 'opacity-50' : ''}`}
                 >
                    {botLoading ? 'Proses..' : (botSettings?.enabled ? 'Matikan' : 'Aktifkan')}
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => window.open('/api/bot/start', '_blank')} className="py-2 bg-surface hover:bg-surface-container-high text-xs font-bold rounded-lg transition-colors border border-outline-variant/10">Restart</button>
                 <button onClick={() => window.open('/api/bot/secret?action=list', '_blank')} className="py-2 bg-surface hover:bg-surface-container-high text-xs font-bold rounded-lg transition-colors border border-outline-variant/10">Log Data</button>
              </div>
           </div>
        </section>
      </aside>
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
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
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
