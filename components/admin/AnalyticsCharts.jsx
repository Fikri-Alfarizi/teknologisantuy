'use client';

import React, { useState, useEffect } from 'react';
import { getAnalyticsTimeSeries } from '@/app/actions/adminActionsV2';
import { getAnalyticsStats } from '@/app/actions/adminActions';
import dynamic from 'next/dynamic';
import { FaChartArea, FaChartBar, FaChartPie, FaGlobe, FaSync, FaCalendarAlt } from 'react-icons/fa';

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

const COLORS = ['#ffe600', '#333', '#ff6b6b', '#51cf66', '#339af0', '#cc5de8', '#ff922b'];

export default function AnalyticsCharts() {
  const [timeSeries, setTimeSeries] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('traffic');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [tsRes, anRes] = await Promise.all([
        getAnalyticsTimeSeries(),
        getAnalyticsStats()
      ]);
      if (tsRes.success) setTimeSeries(tsRes.data);
      if (anRes.success) setAnalytics(anRes.data);
    } catch (err) {
      console.error("Analytics Charts Error:", err);
    }
    setLoading(false);
  }

  if (loading) return <div style={{ padding: '40px', fontWeight: 800, textTransform: 'uppercase' }}>Memuat Grafik Analitik...</div>;

  const countryChartData = analytics?.countryData?.map(c => ({ name: c.name, views: c.count })) || [];
  const sourceChartData = [
    { name: 'Facebook', value: analytics?.sources?.Facebook || 0 },
    { name: 'Instagram', value: analytics?.sources?.Instagram || 0 },
    { name: 'Direct', value: analytics?.sources?.Direct || 0 },
    { name: 'Lainnya', value: analytics?.sources?.Other || 0 },
  ].filter(s => s.value > 0);

  const tabs = [
    { id: 'traffic', label: 'Traffic Trend', icon: <FaChartArea /> },
    { id: 'country', label: 'Negara', icon: <FaGlobe /> },
    { id: 'hourly', label: 'Per Jam', icon: <FaCalendarAlt /> },
    { id: 'sources', label: 'Sumber', icon: <FaChartPie /> },
    { id: 'browser', label: 'Browser', icon: <FaChartBar /> },
  ];

  return (
    <div style={{ color: '#000' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #000', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaChartArea /> Grafik <span style={{ background: '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px' }}>& Trend</span>
        </h2>
        <button onClick={loadData} style={{
          padding: '10px 20px', background: '#000', color: '#fff', border: 'none',
          borderRadius: '6px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <FaSync /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <MiniCard label="Total Views" value={timeSeries?.totalAllTime || 0} color="#ffe600" />
        <MiniCard label="Hari Tercatat" value={timeSeries?.dailyData?.length || 0} color="#51cf66" />
        <MiniCard label="Negara" value={analytics?.countryData?.length || 0} color="#339af0" />
        <MiniCard label="Browser" value={timeSeries?.browserData?.length || 0} color="#cc5de8" />
      </div>

      {/* Chart Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveChart(tab.id)}
            style={{
              padding: '8px 18px', borderRadius: '8px',
              border: activeChart === tab.id ? '2px solid #000' : '2px solid #ddd',
              background: activeChart === tab.id ? '#ffe600' : '#fff',
              fontWeight: 800, fontSize: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: activeChart === tab.id ? '3px 3px 0 rgba(0,0,0,0.1)' : 'none',
              transition: '0.15s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Panel */}
      <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '28px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)', minHeight: '400px' }}>
        {activeChart === 'traffic' && (
          <>
            <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase' }}>📈 Traffic Harian (30 Hari Terakhir)</h3>
            <div style={{ width: '100%', height: 350 }}>
              {timeSeries?.dailyData && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries.dailyData}>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffe600" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#ffe600" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#339af0" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#339af0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={v => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} />
                    <Legend />
                    <Area type="monotone" dataKey="views" stroke="#ffe600" strokeWidth={3} fill="url(#grad1)" name="Total Views" />
                    <Area type="monotone" dataKey="uniqueVisitors" stroke="#339af0" strokeWidth={2} fill="url(#grad2)" name="Unique Visitors" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}

        {activeChart === 'country' && (
          <>
            <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase' }}>🌍 Traffic Per Negara</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fontWeight: 800 }} width={100} />
                  <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} />
                  <Bar dataKey="views" fill="#ffe600" stroke="#000" strokeWidth={1.5} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeChart === 'hourly' && (
          <>
            <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase' }}>⏰ Distribusi Traffic Per Jam</h3>
            <div style={{ width: '100%', height: 350 }}>
              {timeSeries?.hourlyData && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSeries.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fontWeight: 700 }} interval={1} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} />
                    <Bar dataKey="count" name="Kunjungan" radius={[4, 4, 0, 0]}>
                      {timeSeries.hourlyData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="#000" strokeWidth={1} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}

        {activeChart === 'sources' && (
          <>
            <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase' }}>🔗 Distribusi Sumber Traffic</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {sourceChartData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx]} stroke="#000" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sourceChartData.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '16px', height: '16px', background: COLORS[i], borderRadius: '4px', border: '2px solid #000', flexShrink: 0 }}></div>
                    <span style={{ fontWeight: 800, fontSize: '14px' }}>{s.name}</span>
                    <span style={{ fontWeight: 900, fontSize: '18px', marginLeft: 'auto' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeChart === 'browser' && (
          <>
            <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase' }}>🌐 Distribusi Browser</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={timeSeries?.browserData || []} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={2} dataKey="value">
                      {(timeSeries?.browserData || []).map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="#000" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '8px', fontWeight: 700 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {timeSeries?.browserData?.map((b, i) => {
                  const pct = timeSeries.totalAllTime > 0 ? Math.round((b.value / timeSeries.totalAllTime) * 100) : 0;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '13px', marginBottom: '4px' }}>
                        <span>{b.name}</span>
                        <span>{b.value} ({pct}%)</span>
                      </div>
                      <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: '5px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MiniCard({ label, value, color }) {
  return (
    <div style={{
      background: '#fff', border: '3px solid #000', borderRadius: '10px', padding: '18px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: color }}></div>
      <div style={{ fontSize: '26px', fontWeight: 950 }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#888', marginTop: '4px' }}>{label}</div>
    </div>
  );
}
