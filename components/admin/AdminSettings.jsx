'use client';

import React, { useState, useEffect } from 'react';
import { getAdminSettings, saveAdminSettings } from '@/app/actions/adminActionsV2';
import { FaCog, FaPalette, FaSave, FaCheck, FaGlobe, FaDesktop } from 'react-icons/fa';

const ACCENT_COLORS = [
  { name: 'Kuning', value: '#ffe600' },
  { name: 'Biru', value: '#339af0' },
  { name: 'Hijau', value: '#51cf66' },
  { name: 'Merah', value: '#ff6b6b' },
  { name: 'Ungu', value: '#cc5de8' },
  { name: 'Oranye', value: '#ff922b' },
  { name: 'Cyan', value: '#22b8cf' },
  { name: 'Pink', value: '#f06595' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    accentColor: '#ffe600',
    sidebarDensity: 'comfortable',
    language: 'id',
    autoRefresh: true,
    refreshInterval: 30,
    showSystemHealth: true,
    showActiveUsers: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getAdminSettings();
      if (res.success && res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await saveAdminSettings(settings);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert('Gagal menyimpan: ' + res.error);
    }
  }

  if (loading) return <div style={{ padding: '40px', fontWeight: 800 }}>Memuat Pengaturan...</div>;

  return (
    <div style={{ color: '#000', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #000', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCog /> Pengaturan <span style={{ background: '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px' }}>Dashboard</span>
        </h2>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '12px 24px', background: saved ? '#4caf50' : '#ffe600',
          border: '2px solid #000', borderRadius: '8px', fontWeight: 900,
          cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.1)', transition: '0.3s', color: saved ? '#fff' : '#000'
        }}>
          {saved ? <><FaCheck /> Tersimpan!</> : saving ? 'Menyimpan...' : <><FaSave /> Simpan</>}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Appearance */}
        <SettingsSection title="🎨 Tampilan" description="Kustomisasi tampilan dashboard">
          {/* Theme */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase' }}>
              Mode Tema
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { id: 'light', label: '☀️ Light', desc: 'Mode terang' },
                { id: 'dark', label: '🌙 Dark', desc: 'Mode gelap' },
              ].map(theme => (
                <button key={theme.id} onClick={() => setSettings({ ...settings, theme: theme.id })} style={{
                  flex: 1, padding: '16px', background: settings.theme === theme.id ? '#ffe600' : '#fff',
                  border: settings.theme === theme.id ? '3px solid #000' : '2px solid #ddd',
                  borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                  boxShadow: settings.theme === theme.id ? '3px 3px 0 rgba(0,0,0,0.1)' : 'none'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{theme.label.split(' ')[0]}</div>
                  <div style={{ fontWeight: 900, fontSize: '13px' }}>{theme.label.split(' ')[1]}</div>
                  <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{theme.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase' }}>
              Warna Aksen
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ACCENT_COLORS.map(color => (
                <button key={color.value} onClick={() => setSettings({ ...settings, accentColor: color.value })} style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: color.value, border: settings.accentColor === color.value ? '3px solid #000' : '2px solid #ddd',
                  cursor: 'pointer', position: 'relative',
                  boxShadow: settings.accentColor === color.value ? '2px 2px 0 rgba(0,0,0,0.2)' : 'none'
                }} title={color.name}>
                  {settings.accentColor === color.value && (
                    <FaCheck size={14} color="#000" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Density */}
          <div>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase' }}>
              Kepadatan Sidebar
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['compact', 'comfortable', 'spacious'].map(density => (
                <button key={density} onClick={() => setSettings({ ...settings, sidebarDensity: density })} style={{
                  flex: 1, padding: '12px', borderRadius: '8px',
                  border: settings.sidebarDensity === density ? '2px solid #000' : '2px solid #ddd',
                  background: settings.sidebarDensity === density ? '#ffe600' : '#fff',
                  fontWeight: 800, fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase'
                }}>
                  {density}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* Language */}
        <SettingsSection title="🌐 Bahasa" description="Pengaturan bahasa dashboard">
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { id: 'id', label: '🇮🇩 Bahasa Indonesia' },
              { id: 'en', label: '🇺🇸 English' },
            ].map(lang => (
              <button key={lang.id} onClick={() => setSettings({ ...settings, language: lang.id })} style={{
                flex: 1, padding: '14px', borderRadius: '8px',
                border: settings.language === lang.id ? '2px solid #000' : '2px solid #ddd',
                background: settings.language === lang.id ? '#ffe600' : '#fff',
                fontWeight: 800, fontSize: '13px', cursor: 'pointer'
              }}>
                {lang.label}
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* Dashboard Behavior */}
        <SettingsSection title="⚙️ Perilaku Dashboard" description="Kontrol auto-refresh dan widget">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <ToggleRow label="Auto Refresh Data" value={settings.autoRefresh}
              onChange={v => setSettings({ ...settings, autoRefresh: v })} />
            <ToggleRow label="Tampilkan System Health" value={settings.showSystemHealth}
              onChange={v => setSettings({ ...settings, showSystemHealth: v })} />
            <ToggleRow label="Tampilkan Active Users" value={settings.showActiveUsers}
              onChange={v => setSettings({ ...settings, showActiveUsers: v })} />

            {settings.autoRefresh && (
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
                  Interval Refresh (detik): {settings.refreshInterval}s
                </label>
                <input type="range" min="10" max="120" step="10" value={settings.refreshInterval}
                  onChange={e => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                  style={{ width: '100%' }} />
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Info */}
        <div style={{
          background: '#f5f5f5', border: '2px solid #ddd', borderRadius: '10px', padding: '20px',
          fontSize: '12px', color: '#888', fontWeight: 600, textAlign: 'center'
        }}>
          <div style={{ fontWeight: 900, marginBottom: '8px', fontSize: '14px', color: '#333' }}>Teknologi Santuy Dashboard v2.0</div>
          Built with Next.js 16 • Firebase • Recharts<br />
          © 2026 Teknologi Santuy. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, description, children }) {
  return (
    <div style={{
      background: '#fff', border: '3px solid #000', borderRadius: '12px',
      padding: '24px', boxShadow: '4px 4px 0 rgba(0,0,0,0.06)'
    }}>
      <h3 style={{ margin: '0 0 4px', fontWeight: 900, fontSize: '16px' }}>{title}</h3>
      <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#888', fontWeight: 600 }}>{description}</p>
      {children}
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fafafa', borderRadius: '8px', border: '1px solid #eee' }}>
      <span style={{ fontWeight: 800, fontSize: '13px' }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        width: '48px', height: '26px', borderRadius: '13px', border: '2px solid #000',
        background: value ? '#4caf50' : '#ddd', cursor: 'pointer', position: 'relative', transition: '0.3s'
      }}>
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '2px', left: value ? '24px' : '2px',
          transition: '0.3s', border: '1px solid #000'
        }}></div>
      </button>
    </div>
  );
}
