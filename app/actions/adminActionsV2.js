'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, where, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';

// ═══════════════════════════════════════════════
// 📝 ACTIVITY LOG SYSTEM
// ═══════════════════════════════════════════════

/**
 * Log an admin action for audit trail.
 */
export async function logAdminActivity({ adminName, adminEmail, action, detail, module }) {
  try {
    await addDoc(collection(db, 'admin_activity_logs'), {
      adminName: adminName || 'Unknown',
      adminEmail: adminEmail || '',
      action,
      detail,
      module: module || 'general',
      timestamp: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Log Activity Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch activity logs with optional filtering.
 */
export async function getActivityLogs(limitCount = 50) {
  try {
    const q = query(
      collection(db, 'admin_activity_logs'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    const logs = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
    return { success: true, data: logs };
  } catch (error) {
    console.error("Fetch Activity Logs Error:", error);
    return { success: false, data: [], error: error.message };
  }
}

// ═══════════════════════════════════════════════
// 🔔 NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════

/**
 * Create a notification for admin.
 */
export async function createNotification({ title, message, type, link }) {
  try {
    await addDoc(collection(db, 'admin_notifications'), {
      title,
      message,
      type: type || 'info', // info, warning, success, error
      link: link || '',
      read: false,
      timestamp: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetch unread notifications.
 */
export async function getNotifications(limitCount = 20) {
  try {
    const q = query(
      collection(db, 'admin_notifications'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    const notifications = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
    const unreadCount = notifications.filter(n => !n.read).length;
    return { success: true, data: notifications, unreadCount };
  } catch (error) {
    return { success: false, data: [], unreadCount: 0, error: error.message };
  }
}

/**
 * Mark notification as read.
 */
export async function markNotificationRead(notifId) {
  try {
    await updateDoc(doc(db, 'admin_notifications', notifId), { read: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsRead() {
  try {
    const q = query(collection(db, 'admin_notifications'), where('read', '==', false));
    const snap = await getDocs(q);
    const updates = snap.docs.map(d => updateDoc(doc(db, 'admin_notifications', d.id), { read: true }));
    await Promise.all(updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════
// 🗓️ SCHEDULER / EVENTS SYSTEM
// ═══════════════════════════════════════════════

/**
 * Create a scheduled event.
 */
export async function createScheduledEvent({ title, description, eventType, scheduledDate, color }) {
  try {
    await addDoc(collection(db, 'scheduled_events'), {
      title,
      description: description || '',
      eventType: eventType || 'maintenance', // maintenance, update, event, reminder
      scheduledDate,
      color: color || '#ffe600',
      status: 'upcoming', // upcoming, active, completed, cancelled
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all scheduled events.
 */
export async function getScheduledEvents() {
  try {
    const snap = await getDocs(collection(db, 'scheduled_events'));
    const events = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      scheduledDate: d.data().scheduledDate || '',
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || ''
    }));
    return { success: true, data: events };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Update a scheduled event.
 */
export async function updateScheduledEvent(eventId, updates) {
  try {
    await updateDoc(doc(db, 'scheduled_events', eventId), updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a scheduled event.
 */
export async function deleteScheduledEvent(eventId) {
  try {
    await deleteDoc(doc(db, 'scheduled_events', eventId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════
// 🎮 GAME REQUEST MANAGER
// ═══════════════════════════════════════════════

/**
 * Fetch all game requests.
 */
export async function getGameRequests() {
  try {
    const q = query(collection(db, 'game_requests'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const requests = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
    return { success: true, data: requests };
  } catch (error) {
    // Fallback without orderBy if index doesn't exist
    try {
      const fallbackSnap = await getDocs(collection(db, 'game_requests'));
      const fallbackData = fallbackSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
      }));
      fallbackData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return { success: true, data: fallbackData };
    } catch (err2) {
      return { success: false, data: [], error: err2.message };
    }
  }
}

/**
 * Update game request status.
 */
export async function updateGameRequestStatus(requestId, status, adminNote) {
  try {
    await updateDoc(doc(db, 'game_requests', requestId), {
      status,
      adminNote: adminNote || '',
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════
// 📊 ADVANCED ANALYTICS (Time Series)
// ═══════════════════════════════════════════════

/**
 * Get analytics data grouped by day for charts.
 */
export async function getAnalyticsTimeSeries() {
  try {
    const snap = await getDocs(collection(db, 'siteAnalytics'));
    const allLogs = snap.docs.map(d => d.data());

    // Group by day
    const dailyMap = {};
    const deviceMap = { Mobile: 0, Desktop: 0, Tablet: 0, Unknown: 0 };
    const hourlyMap = {};
    const browserMap = {};

    allLogs.forEach(log => {
      const ts = log.timestamp?.toDate?.() || new Date();
      const dayKey = ts.toISOString().split('T')[0]; // YYYY-MM-DD
      const hourKey = ts.getHours();

      // Daily counts
      if (!dailyMap[dayKey]) dailyMap[dayKey] = { date: dayKey, views: 0, uniqueIPs: new Set() };
      dailyMap[dayKey].views++;
      if (log.ip) dailyMap[dayKey].uniqueIPs.add(log.ip);

      // Device breakdown
      const platform = log.platform || 'Unknown';
      if (platform.toLowerCase().includes('mobile')) deviceMap.Mobile++;
      else if (platform.toLowerCase().includes('tablet')) deviceMap.Tablet++;
      else if (platform.toLowerCase().includes('desktop') || platform.toLowerCase().includes('windows') || platform.toLowerCase().includes('mac') || platform.toLowerCase().includes('linux')) deviceMap.Desktop++;
      else deviceMap.Unknown++;

      // Hourly distribution
      hourlyMap[hourKey] = (hourlyMap[hourKey] || 0) + 1;

      // Browser stats
      const ua = log.userAgent || '';
      let browser = 'Other';
      if (ua.includes('Chrome') && !ua.includes('Edge')) browser = 'Chrome';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
      else if (ua.includes('Edge')) browser = 'Edge';
      else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
      browserMap[browser] = (browserMap[browser] || 0) + 1;
    });

    // Convert dailyMap to sorted array
    const dailyData = Object.values(dailyMap)
      .map(d => ({ date: d.date, views: d.views, uniqueVisitors: d.uniqueIPs.size }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days

    // Convert hourly to array
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      count: hourlyMap[i] || 0
    }));

    // Convert browser to array
    const browserData = Object.entries(browserMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      success: true,
      data: {
        dailyData,
        deviceMap,
        hourlyData,
        browserData,
        totalAllTime: allLogs.length
      }
    };
  } catch (error) {
    console.error("Analytics Time Series Error:", error);
    return { success: false, data: null, error: error.message };
  }
}

// ═══════════════════════════════════════════════
// 📋 KANBAN / TASK BOARD
// ═══════════════════════════════════════════════

/**
 * Fetch all tasks.
 */
export async function getTasks() {
  try {
    const snap = await getDocs(collection(db, 'admin_tasks'));
    const tasks = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Create a task.
 */
export async function createTask({ title, description, priority, status, assignee }) {
  try {
    await addDoc(collection(db, 'admin_tasks'), {
      title,
      description: description || '',
      priority: priority || 'medium', // low, medium, high, urgent
      status: status || 'todo', // todo, in_progress, done
      assignee: assignee || '',
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update a task.
 */
export async function updateTask(taskId, updates) {
  try {
    await updateDoc(doc(db, 'admin_tasks', taskId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a task.
 */
export async function deleteTask(taskId) {
  try {
    await deleteDoc(doc(db, 'admin_tasks', taskId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════
// ⚙️ SYSTEM HEALTH & PERFORMANCE
// ═══════════════════════════════════════════════

/**
 * Get system health metrics.
 */
export async function getSystemHealth() {
  try {
    const startTime = Date.now();

    // Test Firestore read speed
    const testSnap = await getDocs(query(collection(db, 'users'), limit(1)));
    const firestoreLatency = Date.now() - startTime;

    // Get collection sizes
    const [usersSnap, analyticsSnap, votesSnap, gamesSnap, contactSnap, newsSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'siteAnalytics')),
      getDocs(collection(db, 'forumVotes')),
      getDocs(collection(db, 'game_stats')),
      getDocs(collection(db, 'contact_messages')),
      getDocs(collection(db, 'launcherNews'))
    ]);

    return {
      success: true,
      data: {
        firestoreLatency,
        status: firestoreLatency < 500 ? 'healthy' : firestoreLatency < 2000 ? 'warning' : 'critical',
        collections: {
          users: usersSnap.size,
          siteAnalytics: analyticsSnap.size,
          forumVotes: votesSnap.size,
          game_stats: gamesSnap.size,
          contact_messages: contactSnap.size,
          launcherNews: newsSnap.size
        },
        totalDocuments: usersSnap.size + analyticsSnap.size + votesSnap.size + gamesSnap.size + contactSnap.size + newsSnap.size,
        checkedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      data: { status: 'critical', firestoreLatency: -1, collections: {}, totalDocuments: 0 },
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════
// 📦 BACKUP / EXPORT
// ═══════════════════════════════════════════════

/**
 * Export all data from a collection as JSON.
 */
export async function exportCollection(collectionName) {
  try {
    const snap = await getDocs(collection(db, collectionName));
    const data = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      // Serialize timestamps
      ...(d.data().timestamp ? { timestamp: d.data().timestamp?.toDate?.()?.toISOString() || '' } : {}),
      ...(d.data().createdAt ? { createdAt: d.data().createdAt?.toDate?.()?.toISOString() || '' } : {}),
    }));
    return { success: true, data, count: data.length };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
}

// ═══════════════════════════════════════════════
// 🎨 ADMIN SETTINGS / THEME
// ═══════════════════════════════════════════════

/**
 * Get admin dashboard settings (theme preferences etc).
 */
export async function getAdminSettings() {
  try {
    const docRef = doc(db, 'admin_settings', 'dashboard');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { success: true, data: snap.data() };
    }
    // Return defaults
    return {
      success: true,
      data: {
        theme: 'light',
        accentColor: '#ffe600',
        sidebarDensity: 'comfortable',
        language: 'id'
      }
    };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Save admin dashboard settings.
 */
export async function saveAdminSettings(settings) {
  try {
    await setDoc(doc(db, 'admin_settings', 'dashboard'), {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
