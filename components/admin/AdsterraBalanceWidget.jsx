'use client';

import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaSyncAlt, FaNetworkWired, FaExternalLinkAlt } from 'react-icons/fa';

export default function AdsterraBalanceWidget({ theme, accent }) {
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const extractBalance = (payload) => {
    if (!payload) return null;
    let data = payload;
    if (payload.data) data = payload.data;

    // Adsterra specific balance fields
    const candidates = [
      // Direct balance fields
      data.balance,
      data.balance_usd,
      data.balance_amount,
      data.available_balance,
      data.account_balance,
      data.usd_balance,
      data.amount,
      data.total_balance,
      data.sum,
      data.available,
      data.total,

      // Stats object
      data.stats?.balance,
      data.stats?.balance_usd,
      data.stats?.available_balance,
      data.stats?.account_balance,

      // Publisher object
      data.publisher?.balance,
      data.publisher?.balance_usd,
      data.publisher?.available_balance,

      // Account object
      data.account?.balance,
      data.account?.balance_usd,
      data.account?.available_balance,

      // Wallet object
      data.wallet?.balance,
      data.wallet?.balance_usd,
      data.wallet?.available_balance,

      // Profile object
      data.profile?.balance,
      data.profile?.balance_usd,
      data.profile?.available_balance,

      // Items array (if balance is in first item)
      data.items?.[0]?.balance,
      data.items?.[0]?.balance_usd,
      data.items?.[0]?.available_balance,

      // Check if the entire response is a number
      typeof data === 'number' ? data : null,

      // Check for string values that might contain numbers
      typeof data === 'string' ? parseFloat(data.replace(/[^0-9.-]+/g, '')) : null
    ];

    for (const value of candidates) {
      if (typeof value === 'number' && !Number.isNaN(value)) return value;
      if (typeof value === 'string' && value.trim() !== '') {
        const parsed = parseFloat(value.replace(/[^0-9.-]+/g, ''));
        if (!Number.isNaN(parsed)) return parsed;
      }
    }

    return null;
  };

  const fetchBalance = async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/adsterra/balance', { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok) {
        const errorMessage = payload?.error || payload?.message || `Adsterra HTTP ${payload?.status || response.status}`;
        throw new Error(errorMessage);
      }

      const extracted = extractBalance(payload.data || payload);
      setBalance(extracted);
      setLastUpdated(new Date());
      setStatus('connected');
    } catch (err) {
      setError(err?.message || 'Unable to connect to Adsterra');
      setStatus('error');
      setBalance(null);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const displayBalance = () => {
    if (status === 'loading') return 'Loading...';
    if (status === 'error') return 'N/A';
    if (balance === null) return '0.00';
    return `$${Number(balance).toFixed(2)}`;
  };

  return (
    <div style={{ marginTop: '16px', padding: '16px', borderRadius: '14px', background: theme?.contentBg || '#171a23', border: theme?.border || '3px solid #000' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: theme?.textMuted || '#9aa5ce', letterSpacing: '1px' }}>Adsterra Network</div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: theme?.text || '#fff' }}>Publisher API Balance</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: accent, fontWeight: 900 }}>
          <FaNetworkWired />
          <span style={{ fontSize: '12px' }}>{status === 'connected' ? 'Connected' : status === 'loading' ? 'Memuat...' : 'Terputus'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '12px', background: accent, color: '#000' }}>
          <FaDollarSign />
        </div>
        <div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: theme?.text || '#fff', lineHeight: 1 }}>{displayBalance()}</div>
          <div style={{ fontSize: '11px', color: theme?.textMuted || '#9aa5ce', marginTop: '4px' }}>Refresh setiap 30 detik</div>
        </div>
      </div>

      <div style={{ marginTop: '14px', fontSize: '12px', color: theme?.textMuted || '#9aa5ce', lineHeight: '1.5', minHeight: '40px' }}>
        {status === 'error' ? (
          <div>
            <strong style={{ color: '#ff6b6b' }}>Error:</strong> {error}
          </div>
        ) : (
          <div>
            {lastUpdated ? `Terakhir disinkronkan ${lastUpdated.toLocaleTimeString('id-ID')} pada ${lastUpdated.toLocaleDateString('id-ID')}` : 'Memuat data Adsterra...'}
          </div>
        )}
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={fetchBalance}
          style={{
            border: 'none', cursor: 'pointer', borderRadius: '10px', padding: '8px 12px', background: accent, color: '#000', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px'
          }}
        >
          <FaSyncAlt /> Refresh
        </button>
        <a
          href="https://panel.adsterra.com/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: accent, fontWeight: 700, fontSize: '12px'
          }}
        >
          Lihat panel <FaExternalLinkAlt size={12} />
        </a>
      </div>
    </div>
  );
}
