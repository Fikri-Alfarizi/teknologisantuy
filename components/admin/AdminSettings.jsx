'use client';

import React, { useState, useEffect } from 'react';
import { FaCog, FaPalette, FaCheck, FaGlobe, FaDesktop } from 'react-icons/fa';
import { useAdminSettings } from '@/components/admin/AdminSettingsContext';

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
  const { settings, updateSetting, loading, theme } = useAdminSettings();

  if (loading) return <div style={{ padding: '40px', fontWeight: 800 }}>Memuat Pengaturan...</div>;

  return (
    <div style={{ color: theme?.text || '#000', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: theme?.border || '3px solid #000', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCog /> Pengaturan <span style={{ background: settings?.accentColor || '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px', transition: '0.3s' }}>Dashboard</span>
        </h2>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaCheck color="#4caf50" /> Tersimpan Otomatis
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Appearance */}
        <SettingsSection title="🎨 Tampilan" description="Kustomisasi tampilan dashboard" theme={theme}>
          {/* Theme */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase', color: theme?.text }}>
              Mode Tema
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { id: 'light', label: '☀️ Light', desc: 'Mode terang' },
                { id: 'dark', label: '🌙 Dark', desc: 'Mode gelap' },
              ].map(t => (
                <button key={t.id} onClick={() => updateSetting('theme', t.id)} style={{
                  flex: 1, padding: '16px', background: settings.theme === t.id ? (settings.accentColor || '#ffe600') : (theme?.bg || '#fff'),
                  border: settings.theme === t.id ? (theme?.border || '3px solid #000') : (theme?.borderLight || '2px solid #ddd'),
                  borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                  boxShadow: settings.theme === t.id ? '3px 3px 0 rgba(0,0,0,0.15)' : 'none',
                  transition: '0.2s', color: settings.theme === t.id ? '#000' : theme?.text
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{t.label.split(' ')[0]}</div>
                  <div style={{ fontWeight: 900, fontSize: '13px' }}>{t.label.split(' ')[1]}</div>
                  <div style={{ fontSize: '10px', color: settings.theme === t.id ? '#333' : theme?.textMuted, marginTop: '4px' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase', color: theme?.text }}>
              Warna Aksen
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ACCENT_COLORS.map(color => (
                <button key={color.value} onClick={() => updateSetting('accentColor', color.value)} style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: color.value, border: settings.accentColor === color.value ? '4px solid #fff' : (theme?.borderLight || '2px solid #ddd'),
                  cursor: 'pointer', position: 'relative',
                  boxShadow: settings.accentColor === color.value ? '0 0 0 3px #000, 3px 3px 0 rgba(0,0,0,0.4)' : 'none',
                  transition: '0.2s',
                  transform: settings.accentColor === color.value ? 'scale(1.1)' : 'scale(1)'
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
            <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase', color: theme?.text }}>
              Kepadatan Sidebar
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['compact', 'comfortable', 'spacious'].map(density => (
                <button key={density} onClick={() => updateSetting('sidebarDensity', density)} style={{
                  flex: 1, padding: '12px', borderRadius: '8px',
                  border: settings.sidebarDensity === density ? (theme?.border || '2px solid #000') : (theme?.borderLight || '2px solid #ddd'),
                  background: settings.sidebarDensity === density ? (settings.accentColor || '#ffe600') : (theme?.bg || '#fff'),
                  color: settings.sidebarDensity === density ? '#000' : theme?.text,
                  fontWeight: 800, fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase',
                  transition: '0.2s'
                }}>
                  {density}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* Language */}
        <SettingsSection title="🌐 Bahasa" description="Pengaturan bahasa dashboard" theme={theme}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { id: 'id', label: '🇮🇩 Bahasa Indonesia' },
              { id: 'en', label: '🇺🇸 English' },
            ].map(lang => (
              <button key={lang.id} onClick={() => updateSetting('language', lang.id)} style={{
                flex: 1, padding: '14px', borderRadius: '8px',
                border: settings.language === lang.id ? (theme?.border || '2px solid #000') : (theme?.borderLight || '2px solid #ddd'),
                background: settings.language === lang.id ? (settings.accentColor || '#ffe600') : (theme?.bg || '#fff'),
                color: settings.language === lang.id ? '#000' : theme?.text,
                fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                transition: '0.2s'
              }}>
                {lang.label}
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* Dashboard Behavior */}
        <SettingsSection title="⚙️ Perilaku Dashboard" description="Kontrol auto-refresh dan widget" theme={theme}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <ToggleRow label="Auto Refresh Data" value={settings.autoRefresh}
              onChange={v => updateSetting('autoRefresh', v)} theme={theme} />
            <ToggleRow label="Tampilkan System Health" value={settings.showSystemHealth}
              onChange={v => updateSetting('showSystemHealth', v)} theme={theme} />
            <ToggleRow label="Tampilkan Active Users" value={settings.showActiveUsers}
              onChange={v => updateSetting('showActiveUsers', v)} theme={theme} />

            {settings.autoRefresh && (
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
                  Interval Refresh (detik): {settings.refreshInterval}s
                </label>
                <input type="range" min="10" max="120" step="10" value={settings.refreshInterval}
                  onChange={e => updateSetting('refreshInterval', parseInt(e.target.value))}
                  style={{ width: '100%' }} />
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Info */}
        <div style={{
          background: theme?.hoverBg || '#f5f5f5', border: theme?.borderLight || '2px solid #ddd', borderRadius: '10px', padding: '20px',
          fontSize: '12px', color: theme?.textMuted || '#888', fontWeight: 600, textAlign: 'center'
        }}>
          <div style={{ fontWeight: 900, marginBottom: '8px', fontSize: '14px', color: theme?.text || '#333' }}>Teknologi Santuy Dashboard v2.0</div>
          Built with Next.js 16 • Firebase • Recharts<br />
          © 2026 Teknologi Santuy. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, description, children, theme }) {
  return (
    <div style={{
      background: theme?.contentBg || '#fff', border: theme?.border || '3px solid #000', borderRadius: '12px',
      padding: '24px', boxShadow: theme?.shadow || '4px 4px 0 rgba(0,0,0,0.06)'
    }}>
      <h3 style={{ margin: '0 0 4px', fontWeight: 900, fontSize: '16px', color: theme?.text }}>{title}</h3>
      <p style={{ margin: '0 0 20px', fontSize: '12px', color: theme?.textMuted || '#888', fontWeight: 600 }}>{description}</p>
      {children}
    </div>
  );
}

function ToggleRow({ label, value, onChange, theme }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: theme?.hoverBg || '#fafafa', borderRadius: '8px', border: theme?.borderLight || '1px solid #eee' }}>
      <span style={{ fontWeight: 800, fontSize: '13px', color: theme?.text }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        width: '48px', height: '26px', borderRadius: '13px', border: value ? '2px solid transparent' : '2px solid #ccc',
        background: value ? (theme?.success || '#4caf50') : (theme?.bg || '#ddd'), cursor: 'pointer', position: 'relative', transition: '0.3s'
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
