'use client';

import React, { useState, useEffect } from 'react';
import { getSystemHealth } from '@/app/actions/adminActionsV2';
import { FaHeartbeat, FaDatabase, FaSync, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaClock, FaServer } from 'react-icons/fa';

export default function SystemHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => { runCheck(); }, []);

  async function runCheck() {
    setLoading(true);
    const startTime = Date.now();
    const res = await getSystemHealth();
    const totalTime = Date.now() - startTime;
    if (res.success) {
      setHealth({ ...res.data, totalResponseTime: totalTime });
      setHistory(prev => [...prev.slice(-9), { time: new Date().toLocaleTimeString('id-ID'), latency: res.data.firestoreLatency, status: res.data.status }]);
    }
    setLoading(false);
  }

  const statusIcon = (status) => {
    if (status === 'healthy') return <FaCheckCircle color="#4caf50" size={20} />;
    if (status === 'warning') return <FaExclamationTriangle color="#ff9800" size={20} />;
    return <FaTimesCircle color="#f44336" size={20} />;
  };

  const statusColor = (status) => {
    if (status === 'healthy') return '#4caf50';
    if (status === 'warning') return '#ff9800';
    return '#f44336';
  };

  if (loading && !health) return <div style={{ padding: '40px', fontWeight: 800, textTransform: 'uppercase' }}>Running Health Check...</div>;

  return (
    <div style={{ color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #000', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaHeartbeat /> System <span style={{ background: '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px' }}>Health</span>
        </h2>
        <button onClick={runCheck} disabled={loading} style={{
          padding: '10px 20px', background: loading ? '#ccc' : '#000', color: '#fff',
          border: 'none', borderRadius: '6px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <FaSync className={loading ? 'spinning' : ''} /> {loading ? 'Checking...' : 'Run Check'}
        </button>
      </div>

      {health && (
        <>
          {/* Status Banner */}
          <div style={{
            background: '#fff', border: `3px solid ${statusColor(health.status)}`,
            borderRadius: '12px', padding: '28px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '20px',
            boxShadow: `0 4px 12px ${statusColor(health.status)}30`
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: `${statusColor(health.status)}15`, border: `3px solid ${statusColor(health.status)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {statusIcon(health.status)}
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 950, textTransform: 'uppercase', color: statusColor(health.status) }}>
                {health.status === 'healthy' ? 'All Systems Operational' : health.status === 'warning' ? 'Performance Degraded' : 'System Issues Detected'}
              </div>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 700, marginTop: '4px' }}>
                Last checked: {health.checkedAt ? new Date(health.checkedAt).toLocaleString('id-ID') : 'N/A'}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <MetricCard label="Firestore Latency" value={`${health.firestoreLatency}ms`}
              status={health.firestoreLatency < 500 ? 'good' : health.firestoreLatency < 2000 ? 'warn' : 'bad'} icon={<FaDatabase />} />
            <MetricCard label="Response Time" value={`${health.totalResponseTime || 0}ms`}
              status={(health.totalResponseTime || 0) < 3000 ? 'good' : 'warn'} icon={<FaClock />} />
            <MetricCard label="Total Documents" value={health.totalDocuments?.toLocaleString() || '0'}
              status="good" icon={<FaServer />} />
            <MetricCard label="Collections" value={Object.keys(health.collections || {}).length}
              status="good" icon={<FaDatabase />} />
          </div>

          {/* Collection Breakdown */}
          <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 18px', fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              📦 Collection Sizes
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {Object.entries(health.collections || {}).map(([name, size]) => (
                <div key={name} style={{
                  padding: '14px', background: '#fafafa', border: '2px solid #eee', borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#888', marginBottom: '4px' }}>
                    {name.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 950 }}>{size.toLocaleString()}</div>
                  <div style={{ height: '4px', background: '#eee', borderRadius: '2px', marginTop: '8px' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      width: `${Math.min((size / (health.totalDocuments || 1)) * 100, 100)}%`,
                      background: '#ffe600'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Check History */}
          {history.length > 0 && (
            <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 18px', fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                📈 Check History
              </h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px' }}>
                {history.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '100%', background: statusColor(h.status), borderRadius: '4px 4px 0 0',
                      height: `${Math.min(Math.max(h.latency / 20, 10), 80)}px`,
                      transition: '0.3s', border: '1px solid rgba(0,0,0,0.1)'
                    }}></div>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#999' }}>{h.latency}ms</span>
                    <span style={{ fontSize: '7px', fontWeight: 600, color: '#ccc' }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function MetricCard({ label, value, status, icon }) {
  const colors = {
    good: { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
    warn: { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
    bad: { bg: '#ffebee', border: '#f44336', text: '#c62828' },
  };
  const c = colors[status] || colors.good;
  return (
    <div style={{ background: c.bg, border: `2px solid ${c.border}`, borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
      <div style={{ color: c.text, marginBottom: '8px', fontSize: '20px' }}>{icon}</div>
      <div style={{ fontSize: '22px', fontWeight: 950, color: c.text }}>{value}</div>
      <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#888', marginTop: '4px' }}>{label}</div>
    </div>
  );
}
