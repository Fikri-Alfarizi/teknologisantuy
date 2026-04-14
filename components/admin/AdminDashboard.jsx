'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getDashboardStats, getAnalyticsStats } from '@/app/actions/adminActions';
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
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#e6e8ea] border-t-[#4f46e5] rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#464555] animate-pulse">Memuat Dashboard...</p>
      </div>
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

  // Chart Customer Habits - adapted for page views
  const barOptions = {
    series: [{
      name: 'Pengunjung',
      data: (analytics?.countryData || []).slice(0, 7).map(c => c.count)
    }],
    chart: {
      type: 'bar',
      height: 220,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    colors: ['#4f46e5'],
    xaxis: {
      categories: (analytics?.countryData || []).slice(0, 7).map(c => c.name?.slice(0, 12) || '?'),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#777587', fontSize: '10px', fontWeight: 600 } }
    },
    yaxis: { show: false },
    grid: {
      borderColor: '#f2f4f6',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: function (val) { return val + " views" } }
    }
  };

  return (
    <div className="flex w-full">
      {/* ═══ MAIN LEFT ═══ */}
      <div className="flex-1 px-4 md:px-8 pb-8 lg:pr-[340px]">

        {/* ═══ STAT CARDS GRID ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 mt-4 md:mt-0">

          {/* Card 1: Total Suara (Hero Card) */}
          <div className="sm:col-span-2 bg-gradient-to-br from-[#4f46e5] to-[#2170e4] p-6 md:p-8 rounded-3xl text-white shadow-xl shadow-[#3525cd]/20 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500" />
            <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-2xl">how_to_vote</span>
              </div>
              <RealtimeActiveUsers />
            </div>
            <div className="relative z-10">
              <p className="text-white/80 text-xs font-bold mb-1 uppercase tracking-[0.1em]">Total Suara Terkumpul</p>
              <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>{stats.totalVotes.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 2: Saran Masuk */}
          <div className="bg-white p-5 md:p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-default border border-transparent hover:border-[#e6e8ea]">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#0058be]/10 text-[#0058be] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">mark_email_read</span>
              </div>
              <span className="px-2 py-1 bg-[#dcfce7] text-[#15803d] rounded-full text-[10px] font-bold">Updated</span>
            </div>
            <div className="mt-6 md:mt-8">
              <p className="text-[#464555] text-xs font-bold uppercase tracking-wider mb-1">Saran Masuk</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>{stats.feedbackCount}</span>
                <span className="text-[#16a34a] text-xs font-bold">pesan</span>
              </div>
            </div>
          </div>

          {/* Card 3: User Terdaftar */}
          <div className="bg-white p-5 md:p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-default border border-transparent hover:border-[#e6e8ea]">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#a44100]/10 text-[#a44100] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
              <span className="px-2 py-1 bg-[#dcfce7] text-[#15803d] rounded-full text-[10px] font-bold">Aktif</span>
            </div>
            <div className="mt-6 md:mt-8">
              <p className="text-[#464555] text-xs font-bold uppercase tracking-wider mb-1">User Terdaftar</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>{totalUsers}</span>
                <span className="text-[#16a34a] text-xs font-bold">akun</span>
              </div>
            </div>
          </div>

          {/* Card 4: Respon Komunitas (Full Width) */}
          <div className="sm:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[#464555] text-xs font-bold uppercase tracking-wider mb-2">Respon Komunitas (SETUJU)</p>
              <h3 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: 'Manrope, sans-serif' }}>{yesPercent}%</h3>
              <p className="text-sm text-[#464555] mt-1">Mendukung Lanjut</p>
              <div className="flex gap-4 mt-3 text-xs font-semibold">
                <span className="text-[#4f46e5]">✓ Setuju: {stats.yesVotes}</span>
                <span className="text-[#ba1a1a]">✗ Batal: {stats.noVotes}</span>
              </div>
            </div>
            {/* Mini bar chart */}
            <div className="hidden sm:flex h-16 w-32 items-end gap-1">
              {[0.3, 0.5, 0.7, 0.85, yesPercent / 100].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-colors hover:bg-[#4f46e5]"
                  style={{
                    height: `${Math.max(h * 100, 10)}%`,
                    backgroundColor: `rgba(79, 70, 229, ${0.15 + i * 0.2})`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 5: Progress Bar */}
          <div className="sm:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm">
            <p className="text-[#464555] text-xs font-bold uppercase tracking-wider mb-3">Persentase Dukungan</p>
            <div className="w-full h-3 bg-[#e6e8ea] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4f46e5] to-[#2170e4] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${yesPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-[#464555]">
              <span>0%</span>
              <span className="text-[#4f46e5]">{yesPercent}% Tercapai</span>
              <span>100%</span>
            </div>
          </div>

          {/* Chart: Traffic Per Negara */}
          <div className="sm:col-span-2 lg:col-span-4 bg-white p-5 md:p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Traffic Per Negara</h3>
              <span className="text-xs font-bold text-[#464555]/60">{analytics?.totalViews || 0} total views</span>
            </div>
            <div className="-ml-4">
              {typeof window !== 'undefined' && (
                <ReactApexChart options={barOptions} series={barOptions.series} type="bar" height={220} />
              )}
            </div>
          </div>
        </div>

        {/* ═══ FEEDBACK TABLE ═══ */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="p-5 md:p-6 border-b border-[#464555]/10 flex justify-between items-center">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="material-symbols-outlined text-lg align-middle mr-2 text-[#4f46e5]">chat_bubble</span>
              Feedback Terbaru
            </h3>
            <span className="text-xs font-bold text-[#464555]/50">{latestFeedback.length} pesan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-[#f7f9fb] text-xs font-bold text-[#464555] uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Status</th>
                  <th className="p-4">Pilihan</th>
                  <th className="p-4 w-1/2">Saran / Masukan</th>
                  <th className="p-4 pr-6">Waktu</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {latestFeedback.length > 0 ? latestFeedback.map((fb) => (
                  <tr key={fb.id} className="border-b border-[#464555]/5 hover:bg-[#f7f9fb] transition-colors">
                    <td className="p-4 pl-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${fb.userId === 'anonymous' ? 'bg-[#e6e8ea] text-[#464555]' : 'bg-[#4f46e5]/10 text-[#4f46e5]'}`}>
                        {fb.userId === 'anonymous' ? 'TAMU' : 'PREMIUM'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 font-bold ${fb.vote ? 'text-[#4f46e5]' : 'text-[#ba1a1a]'}`}>
                        <span className="material-symbols-outlined text-[16px]">{fb.vote ? 'thumb_up' : 'thumb_down'}</span>
                        {fb.vote ? 'SETUJU' : 'BATAL'}
                      </span>
                    </td>
                    <td className="p-4 text-[#464555]">
                      {fb.feedback || <em className="opacity-50">Tidak ada pesan</em>}
                    </td>
                    <td className="p-4 pr-6 text-xs text-[#464555]/70">
                      {new Date(fb.timestamp).toLocaleString('id-ID')}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm text-[#464555]">Tidak ada feedback terbaru.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT SIDEBAR ═══ */}
      <aside className="hidden lg:block w-80 h-[calc(100vh-76px)] fixed right-0 top-[76px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.02)] p-8 border-l border-[#e6e8ea] overflow-y-auto hide-scrollbar z-30">

        {/* Sumber Traffic (Chart) */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Sumber Traffic</h3>
            <button className="text-[#464555] hover:bg-[#f2f4f6] p-1 rounded-full transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">more_horiz</span>
            </button>
          </div>
          <div className="bg-[#f7f9fb] relative rounded-3xl p-6">
            <div className="flex justify-center -mt-4">
              {typeof window !== 'undefined' && (
                <ReactApexChart options={radialOptions} series={[directCount, igCount, fbCount]} type="radialBar" height={220} />
              )}
            </div>
            <div className="mt-2 flex flex-col gap-4">
              {/* Direct */}
              <div className="flex justify-between items-center cursor-pointer hover:bg-white p-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
                  <span className="text-xs font-semibold text-[#464555]">Direct/Lainnya</span>
                </div>
                <span className="text-xs font-bold">{directCount}</span>
              </div>
              {/* Instagram */}
              <div className="flex justify-between items-center cursor-pointer hover:bg-white p-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E4405F]" />
                  <span className="text-xs font-semibold text-[#464555]">Instagram</span>
                </div>
                <span className="text-xs font-bold">{igCount}</span>
              </div>
              {/* Facebook */}
              <div className="flex justify-between items-center cursor-pointer hover:bg-white p-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                  <span className="text-xs font-semibold text-[#464555]">Facebook</span>
                </div>
                <span className="text-xs font-bold">{fbCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Traffic Dunia (List) */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Traffic Dunia</h3>
            <button className="text-xs font-bold text-[#3525cd] px-3 py-1.5 bg-[#3525cd]/10 hover:bg-[#3525cd]/20 transition-colors rounded-full">
              Lihat Semua
            </button>
          </div>
          <div className="bg-[#f7f9fb] rounded-3xl p-6 flex flex-col gap-5">
            {(analytics?.countryData || []).slice(0, 4).map((c, i) => {
              const percent = Math.round((c.count / (analytics?.totalViews || 1)) * 100);
              return (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold border border-[#e6e8ea]/50">📍</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-[#464555] group-hover:text-[#191c1e] transition-colors">{c.name}</span>
                      <span className="text-xs font-bold text-[#3525cd]">{c.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#4f46e5] to-[#2170e4] rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bot Controls */}
        <section className="mt-8">
          <div className="bg-white border border-[#e6e8ea] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#4f46e5] text-xl">smart_toy</span>
              <h3 className="font-bold text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Bot Control</h3>
            </div>
            <div className="bg-[#f7f9fb] rounded-xl p-4 mb-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#464555]">Status</p>
                <p className={`text-xs font-bold ${botSettings?.enabled ? 'text-[#16a34a]' : 'text-[#ba1a1a]'}`}>
                  {botSettings ? (botSettings.enabled ? '🟢 AKTIF' : '🔴 NONAKTIF') : 'Memuat...'}
                </p>
              </div>
              <button onClick={toggleBot} disabled={botLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${botSettings?.enabled ? 'bg-[#ba1a1a] hover:bg-[#93000a]' : 'bg-[#3525cd] hover:bg-[#4f46e5]'} ${botLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {botLoading ? 'Proses..' : (botSettings?.enabled ? 'Matikan' : 'Aktifkan')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => window.open('/api/bot/start', '_blank')} className="py-2 bg-[#f7f9fb] hover:bg-[#e6e8ea] text-xs font-bold rounded-lg transition-colors border border-[#e6e8ea]">
                Restart
              </button>
              <button onClick={() => window.open('/api/bot/secret?action=list', '_blank')} className="py-2 bg-[#f7f9fb] hover:bg-[#e6e8ea] text-xs font-bold rounded-lg transition-colors border border-[#e6e8ea]">
                Log Data
              </button>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
