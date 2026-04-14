'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminSettings, saveAdminSettings } from '@/app/actions/adminActionsV2';

const AdminSettingsContext = createContext();

export function AdminSettingsProvider({ children }) {
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

  // Load settings on mount
  useEffect(() => {
    async function init() {
      try {
        const res = await getAdminSettings();
        if (res.success && res.data) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error("Failed to load admin settings:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Update setting immediately and save to firestore in background
  const updateSetting = async (key, value) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      // Save in background
      saveAdminSettings(updated).catch(err => console.error("Error saving setting:", err));
      return updated;
    });
  };

  const updateMultipleSettings = async (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveAdminSettings(updated).catch(err => console.error("Error saving settings:", err));
      return updated;
    });
  };

  // Compute theme tokens
  const isDark = settings.theme === 'dark';
  const themeTokens = {
    bg: isDark ? '#1a1b26' : '#f4f6f9', // Tokyo night dark or light gray
    contentBg: isDark ? '#24283b' : '#fff', // Lighter dark or pure white
    text: isDark ? '#c0caf5' : '#000', // Bright blueish text or pure black
    textMuted: isDark ? '#9aa5ce' : '#666',
    border: isDark ? '3px solid #15161e' : '3px solid #000', // Pitch black borders in dark mode
    borderLight: isDark ? '2px solid #292e42' : '2px solid #eee',
    borderColor: isDark ? '#15161e' : '#000',
    shadow: isDark ? '6px 6px 0 #15161e' : '6px 6px 0 rgba(0,0,0,0.08)',
    sidebarBg: isDark ? '#15161e' : '#1a1d23',
    cardBorder: isDark ? '3px solid #15161e' : '3px solid #000',
    hoverBg: isDark ? '#292e42' : '#f5f5f5',
    danger: isDark ? '#f7768e' : '#ff4757',
    success: isDark ? '#9ece6a' : '#2ed573',
  };

  return (
    <AdminSettingsContext.Provider value={{ settings, updateSetting, updateMultipleSettings, loading, theme: themeTokens }}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  return useContext(AdminSettingsContext);
}
