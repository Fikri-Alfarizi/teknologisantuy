'use client';

import { useAuth } from '@/lib/auth-context';
import { notFound, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';
import FeedbackHistory from '@/components/admin/FeedbackHistory';
import NewsManagement from '@/components/admin/NewsManagement';
import GameManagement from '@/components/admin/GameManagement';
import AnalyticsDetail from '@/components/admin/AnalyticsDetail';
import ContactInbox from '@/components/admin/ContactInbox';
import ActivityLog from '@/components/admin/ActivityLog';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import GameRequestManager from '@/components/admin/GameRequestManager';
import Scheduler from '@/components/admin/Scheduler';
import TaskBoard from '@/components/admin/TaskBoard';
import SystemHealth from '@/components/admin/SystemHealth';
import BackupExport from '@/components/admin/BackupExport';
import AdminSettings from '@/components/admin/AdminSettings';
import NotificationSubscribers from '@/components/admin/NotificationSubscribers';
import { AdminSettingsProvider } from '@/components/admin/AdminSettingsContext';

export default function AdminSecretPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const secretPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-secret-portal';
  
  // params.adminPath is an array like ['secret-vault', 'users']
  const rootPath = params.adminPath[0];
  const subPath = params.adminPath[1] || 'dashboard';

  useEffect(() => {
    // 1. Verify URL matches secret path (case insensitive)
    if (rootPath?.toLowerCase() !== secretPath.toLowerCase()) {
      return; 
    }

    // 2. Wait for auth to load
    if (loading) return;

    // 3. Authorization check
    if (userProfile?.role === 'admin') {
      setIsAuthorized(true);
    } else {
      router.push('/');
    }
  }, [rootPath, secretPath, userProfile, loading, router]);

  // If root path doesn't match, show 404
  if (rootPath?.toLowerCase() !== secretPath.toLowerCase()) {
    return notFound();
  }

  if (loading || !isAuthorized) {
    return (
      <div suppressHydrationWarning style={{ 
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        background: '#1a202c', color: '#fff', fontFamily: 'sans-serif' 
      }}>
        <div suppressHydrationWarning style={{ textAlign: 'center' }}>
          <div suppressHydrationWarning className="spinner" style={{ 
            width: '40px', height: '40px', border: '4px solid #ffe600', 
            borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite',
            margin: '0 auto 15px' 
          }}></div>
          <p style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Memverifikasi Akses VIP...</p>
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Determine sub-component to render
  const renderContent = () => {
    switch (subPath.toLowerCase()) {
      // Original modules
      case 'users': return <UserManagement />;
      case 'feedback': return <FeedbackHistory />;
      case 'news': return <NewsManagement />;
      case 'game-manager': return <GameManagement />;
      case 'analytics-detail': return <AnalyticsDetail />;
      case 'notification-subs': return <NotificationSubscribers />;
      case 'contact-inbox': return <ContactInbox />;
      
      // NEW V2 modules
      case 'analytics-charts': return <AnalyticsCharts />;
      case 'activity-log': return <ActivityLog />;
      case 'game-requests': return <GameRequestManager />;
      case 'scheduler': return <Scheduler />;
      case 'task-board': return <TaskBoard />;
      case 'system-health': return <SystemHealth />;
      case 'backup': return <BackupExport />;
      case 'settings': return <AdminSettings />;
      
      default: return <AdminDashboard />;
    }
  };

  return (
    <AdminSettingsProvider>
      <AdminLayout activeTab={subPath}>
        {renderContent()}
      </AdminLayout>
    </AdminSettingsProvider>
  );
}
