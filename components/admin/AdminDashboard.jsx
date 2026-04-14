'use client';

import React, { useEffect, useState } from 'react';
import { getDashboardStats, getAnalyticsStats, getGamePopularity } from '@/app/actions/adminActions';
import { getAnalyticsTimeSeries, getSystemHealth } from '@/app/actions/adminActionsV2';
import { FaCheckCircle, FaTimesCircle, FaUsers, FaCommentDots, FaRocket, FaGlobe, FaFacebook, FaInstagram, FaLink, FaGamepad, FaChartLine, FaRobot, FaToggleOn, FaToggleOff, FaHeartbeat, FaArrowUp, FaArrowDown, FaEye, FaDesktop, FaMobileAlt } from 'react-icons/fa';
import RealtimeActiveUsers from './RealtimeActiveUsers';

// Dynamic import for recharts (client-side only)
import dynamic from 'next/dynamic';
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Legend = dynamic(() => import('recharts').then(m => m.Legend), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(m => m.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(m => m.Line), { ssr: false });

const COLORS = ['#ffe600', '#333', '#ff6b6b', '#51cf66', '#339af0', '#cc5de8'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [botSettings, setBotSettings] = useState(null);
  const [botLoading, setBotLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, analyticsRes, timeSeriesRes, healthRes] = await Promise.all([
          getDashboardStats(),
          getAnalyticsStats(),
          getAnalyticsTimeSeries(),
          getSystemHealth()
        ]);

        if (statsRes.success) setData(statsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
        if (timeSeriesRes.success) setTimeSeries(timeSeriesRes.data);
        if (healthRes.success) setSystemHealth(healthRes.data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Load bot settings
  useEffect(() => {
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
        alert(result.message);
      }
    } catch (err) {
      console.error("Bot Toggle Error:", err);
    } finally {
      setBotLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '6px solid #000', borderTopColor: '#ffe600', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <div style={{ fontWeight: 800, textTransform: 'uppercase', color: '#000', fontSize: '16px', letterSpacing: '2px' }}>Loading Dashboard V2...</div>
      </div>
      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const { stats, latestFeedback, totalUsers } = data || { stats: { totalVotes: 0, yesVotes: 0, noVotes: 0, feedbackCount: 0 }, latestFeedback: [], totalUsers: 0 };
  const yesPercent = stats.totalVotes > 0 ? Math.round((stats.yesVotes / stats.totalVotes) * 100) : 0;
  const noPercent = stats.totalVotes > 0 ? Math.round((stats.noVotes / stats.totalVotes) * 100) : 0;

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#000' }}>

      {/* Row 1: Real-time + System Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {systemHealth && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', background: systemHealth.status === 'healthy' ? '#e8f5e9' : '#fff3e0',
              border: `2px solid ${systemHealth.status === 'healthy' ? '#4caf50' : '#ff9800'}`,
              borderRadius: '8px', fontSize: '12px', fontWeight: 800
            }}>
              <FaHeartbeat color={systemHealth.status === 'healthy' ? '#4caf50' : '#ff9800'} />
              <span>System: {systemHealth.status.toUpperCase()}</span>
              <span style={{ color: '#888' }}>• {systemHealth.firestoreLatency}ms</span>
              <span style={{ color: '#888' }}>• {systemHealth.totalDocuments} docs</span>
            </div>
          )}
        </div>
        <RealtimeActiveUsers />
      </div>

      {/* Row 2: Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard title="Total Suara" count={stats.totalVotes} icon={<FaCommentDots />} gradient="linear-gradient(135deg, #ffe600, #ffd000)" />
        <StatCard title="Saran Masuk" count={stats.feedbackCount} icon={<FaCheckCircle />} gradient="linear-gradient(135deg, #fff, #f5f5f5)" />
        <StatCard title="User Terdaftar" count={totalUsers} icon={<FaUsers />} gradient="linear-gradient(135deg, #ffe600, #ffb300)" />
        <StatCard title="Approval Rate" count={`${yesPercent}%`} icon={<FaRocket />} gradient="linear-gradient(135deg, #e8f5e9, #c8e6c9)" trend={yesPercent > 50 ? 'up' : 'down'} />
      </div>

      {/* Row 3: Traffic Chart + Device Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Traffic Trend Chart */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaChartLine color="#ffe600" /> Traffic Trend (30 Hari Terakhir)
          </h3>
          <div style={{ width: '100%', height: 250 }}>
            {timeSeries?.dailyData && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries.dailyData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffe600" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ffe600" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#333" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#333" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700, fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="#ffe600" strokeWidth={3} fill="url(#colorViews)" name="Total Views" />
                  <Area type="monotone" dataKey="uniqueVisitors" stroke="#333" strokeWidth={2} fill="url(#colorUnique)" name="Unique Visitors" />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Device Breakdown Pie */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaDesktop /> Device Breakdown
          </h3>
          <div style={{ width: '100%', height: 200 }}>
            {timeSeries?.deviceMap && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(timeSeries.deviceMap).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {Object.entries(timeSeries.deviceMap).filter(([_, v]) => v > 0).map(([name], idx) => (
                      <Cell key={name} fill={COLORS[idx % COLORS.length]} stroke="#000" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '6px', fontWeight: 700, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 800 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: World Traffic + Sources + Top Pages */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* World Traffic */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '13px', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            <FaGlobe /> Traffic Dunia
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics?.countryData.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', fontWeight: 900, color: '#666' }}>#{i + 1}</span>
                  <span style={{ fontSize: '13px' }}>{c.name}</span>
                </div>
                <span style={{ background: '#000', color: '#fff', padding: '3px 10px', fontSize: '11px', borderRadius: '4px', fontWeight: 800 }}>{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Breakdown */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '13px', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            🔗 Sumber Traffic
          </h3>
          <SourceBar icon={<FaFacebook color="#1877F2" />} label="Facebook" count={analytics?.sources?.Facebook || 0} total={analytics?.totalViews || 1} color="#1877F2" />
          <SourceBar icon={<FaInstagram color="#E4405F" />} label="Instagram" count={analytics?.sources?.Instagram || 0} total={analytics?.totalViews || 1} color="#E4405F" />
          <SourceBar icon={<FaLink color="#333" />} label="Direct / Other" count={(analytics?.sources?.Direct || 0) + (analytics?.sources?.Other || 0)} total={analytics?.totalViews || 1} color="#333" />
        </div>

        {/* Top Pages */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '13px', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            📄 Top Pages
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analytics?.pageData.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 700 }}>
                <span style={{ background: '#ffe600', border: '1px solid #000', padding: '1px 6px', fontSize: '10px', fontWeight: 900, borderRadius: '3px' }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#444', fontSize: '11px', fontWeight: 800 }}>{p.path}</div>
                  <div style={{ color: '#000', fontWeight: 900 }}>{p.count} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Hourly Distribution + Browser Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Hourly Traffic Chart */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '13px', fontWeight: 950, textTransform: 'uppercase' }}>
            ⏰ Distribusi Traffic Per Jam
          </h3>
          <div style={{ width: '100%', height: 200 }}>
            {timeSeries?.hourlyData && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeries.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fontWeight: 700 }} interval={2} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '6px', fontWeight: 700, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#ffe600" stroke="#000" strokeWidth={1} radius={[4, 4, 0, 0]} name="Kunjungan" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '13px', fontWeight: 950, textTransform: 'uppercase' }}>
            🌐 Browser Stats
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {timeSeries?.browserData?.slice(0, 5).map((b, i) => {
              const total = timeSeries.totalAllTime;
              const pct = total > 0 ? Math.round((b.value / total) * 100) : 0;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
                    <span>{b.name}</span>
                    <span>{pct}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: '4px', transition: '0.5s' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 6: Bot Control */}
      <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '28px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #eee', paddingBottom: '12px' }}>
          <FaRobot /> Kontrol Bot Discord
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fafafa', border: '2px solid #eee', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 900 }}>Status Bot</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px', fontWeight: 700 }}>
                {botSettings ? (botSettings.enabled ? '🟢 AKTIF' : '🔴 NONAKTIF') : 'Memuat...'}
              </div>
            </div>
            <button onClick={toggleBot} disabled={botLoading} style={{
              background: botSettings?.enabled ? '#ff4757' : '#2ed573',
              color: '#fff', border: '2px solid #000', padding: '10px 20px', borderRadius: '8px',
              fontWeight: 900, fontSize: '13px', cursor: botLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', opacity: botLoading ? 0.6 : 1,
              boxShadow: '3px 3px 0 rgba(0,0,0,0.15)'
            }}>
              {botLoading ? 'Memproses...' : (botSettings?.enabled ? '⏹ MATIKAN BOT' : '▶ AKTIFKAN BOT')}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <BotButton label="🔄 RESTART BOT" color="#007bff" onClick={() => window.open('/api/bot/start', '_blank')} />
            <BotButton label="🔐 SECRET URLS" color="#28a745" onClick={() => window.open('/api/bot/secret?action=list', '_blank')} />
            <BotButton label="📊 BOT STATS" color="#6f42c1" onClick={() => window.open('/api/bot/guilds?path=server-stats', '_blank')} />
          </div>
        </div>
      </div>

      {/* Row 7: Community Response + Feedback Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Vote Chart */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 950, textTransform: 'uppercase', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📊 Respon Komunitas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ProgressBar label="Lanjutkan (SETUJU)" percent={yesPercent} color="#ffe600" />
            <ProgressBar label="Jangan Dulu (BATAL)" percent={noPercent} color="#333" fontColor="#fff" />
          </div>
          <p style={{ marginTop: '20px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', background: '#ffe600', padding: '6px 12px', border: '2px solid #000', borderRadius: '6px' }}>Total: {stats.totalVotes} Responden</p>
        </div>

        {/* Feedback Table */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', overflow: 'hidden', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          <div style={{ padding: '14px 24px', borderBottom: '3px solid #000', background: '#ffe600' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 950, textTransform: 'uppercase' }}>💬 Feedback Terbaru</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#fafafa', fontSize: '11px', fontWeight: 950, textTransform: 'uppercase', borderBottom: '2px solid #eee' }}>
                <tr>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px' }}>Pilihan</th>
                  <th style={{ padding: '14px 20px' }}>Saran</th>
                  <th style={{ padding: '14px 20px' }}>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {latestFeedback.map((fb, i) => (
                  <tr key={fb.id} style={{ borderBottom: '1px solid #f0f0f0', fontSize: '13px', background: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 8px', background: fb.userId === 'anonymous' ? '#f0f0f0' : '#ffe600', border: '1px solid #ddd', fontSize: '10px', fontWeight: 900, borderRadius: '4px' }}>
                        {fb.userId === 'anonymous' ? 'TAMU' : 'PREMIUM'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '4px 10px', border: '2px solid #000', background: fb.vote ? '#ffe600' : '#000', color: fb.vote ? '#000' : '#fff', fontSize: '10px', fontWeight: 950, borderRadius: '4px' }}>
                        {fb.vote ? 'SETUJU' : 'BATAL'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', maxWidth: '300px', fontWeight: 700, fontSize: '12px' }}>
                      {fb.feedback || <em style={{ opacity: 0.3 }}>Tidak ada pesan</em>}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 800, color: '#888' }}>
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

// ── Sub Components ──

function StatCard({ title, count, icon, gradient, trend }) {
  return (
    <div style={{
      background: gradient, padding: '22px', border: '3px solid #000',
      borderRadius: '12px', position: 'relative', overflow: 'hidden',
      boxShadow: '5px 5px 0 rgba(0,0,0,0.08)', transition: 'transform 0.15s',
      cursor: 'default'
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 950, letterSpacing: '-1.5px' }}>{count}</h3>
          {trend && (
            <span style={{ fontSize: '12px', color: trend === 'up' ? '#2e7d32' : '#c62828' }}>
              {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
            </span>
          )}
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '11px', textTransform: 'uppercase', fontWeight: 900, color: '#333', letterSpacing: '0.5px' }}>{title}</p>
      </div>
      <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.08, fontSize: '70px', color: '#000' }}>
        {icon}
      </div>
    </div>
  );
}

function ProgressBar({ label, percent, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
        <span>{label}</span>
        <span style={{ background: '#000', color: '#fff', padding: '1px 6px', fontSize: '10px', borderRadius: '3px' }}>{percent}%</span>
      </div>
      <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '7px', overflow: 'hidden', border: '1px solid #ddd' }}>
        <div style={{ height: '100%', width: `${percent}%`, background: color, borderRadius: '7px', transition: '0.8s ease-out' }}></div>
      </div>
    </div>
  );
}

function SourceBar({ icon, label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ flex: 1, fontSize: '12px', fontWeight: 800 }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 900 }}>{count}</span>
      </div>
      <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: '0.5s' }}></div>
      </div>
    </div>
  );
}

function BotButton({ label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: color, color: '#fff', border: '2px solid #000',
      padding: '10px 16px', borderRadius: '8px', fontWeight: 800,
      fontSize: '12px', cursor: 'pointer', boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
      transition: '0.1s'
    }}>
      {label}
    </button>
  );
}
