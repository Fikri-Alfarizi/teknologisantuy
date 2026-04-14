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

  return (
    <AdminSettingsContext.Provider value={{ settings, updateSetting, updateMultipleSettings, loading }}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  return useContext(AdminSettingsContext);
}
