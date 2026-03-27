'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';

/**
 * Update a user's role in Firestore.
 */
export async function updateUserRole(userId, newRole) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
    return { success: true };
  } catch (error) {
    console.error("Update Role Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a user from Firestore.
 */
export async function deleteUser(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    return { success: true };
  } catch (error) {
    console.error("Delete User Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action to fetch aggregate data for the Admin Dashboard.
 * Retrieves total counts and recent activity from Firestore.
 */
export async function getDashboardStats() {
  try {
    // 1. Fetch Votes
    const votesSnap = await getDocs(collection(db, 'forumVotes'));
    const votes = votesSnap.docs.map(doc => doc.data());
    
    const stats = {
      totalVotes: votes.length,
      yesVotes: votes.filter(v => v.vote === true).length,
      noVotes: votes.filter(v => v.vote === false).length,
      feedbackCount: votes.filter(v => v.feedback && v.feedback.trim() !== '').length
    };

    // 2. Fetch Recent Feedback
    const qFeedback = query(
      collection(db, 'forumVotes'), 
      orderBy('timestamp', 'desc'), 
      limit(10)
    );
    const feedbackSnap = await getDocs(qFeedback);
    const latestFeedback = feedbackSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
    }));

    // 3. Fetch User Count
    const usersSnap = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnap.size;

    return { 
      success: true, 
      data: { stats, latestFeedback, totalUsers } 
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return { success: false, error: error.message };
  }
}
/**
 * Fetch all entries from the 'votes' collection.
 */
export async function getAllVotes() {
  try {
    const votesQuery = query(collection(db, 'votes'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(votesQuery);
    const votes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: votes };
  } catch (error) {
    console.error("Fetch Votes Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a specific vote entry from Firestore.
 */
export async function deleteVote(voteId) {
  try {
    const voteRef = doc(db, 'votes', voteId);
    await deleteDoc(voteRef);
    return { success: true };
  } catch (error) {
    console.error("Delete Vote Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all users for management table.
 */
export async function getAllUsers() {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const users = usersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    }));
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
/**
 * Aggregate Analytics Data for the Admin Dashboard.
 */
export async function getAnalyticsStats() {
  try {
    const snap = await getDocs(collection(db, 'siteAnalytics'));
    const allLogs = snap.docs.map(doc => doc.data());

    const totalViews = allLogs.length;
    const countries = {};
    const sources = {
      Facebook: 0,
      Instagram: 0,
      Direct: 0,
      Other: 0
    };
    const topPages = {};

    allLogs.forEach(log => {
      // Count Countries
      const c = log.country || 'Unknown';
      countries[c] = (countries[c] || 0) + 1;

      // Count Sources
      const s = log.source?.toLowerCase() || '';
      const r = log.referrer?.toLowerCase() || '';
      if (s.includes('facebook') || r.includes('facebook')) sources.Facebook++;
      else if (s.includes('instagram') || r.includes('instagram')) sources.Instagram++;
      else if (r === 'direct' || !r) sources.Direct++;
      else sources.Other++;

      // Count Pages
      const p = log.path || '/';
      topPages[p] = (topPages[p] || 0) + 1;
    });

    // Format for easier UI consumption: Sort and slice
    const countryData = Object.entries(countries)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const pageData = Object.entries(topPages)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { 
      success: true, 
      data: { totalViews, countryData, sources, pageData, allLogs: allLogs.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()) } 
    };
  } catch (error) {
    console.error("Analytics Fetch Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch game popularity based on click stats.
 */
export async function getGamePopularity() {
  try {
    const snap = await getDocs(collection(db, 'game_stats'));
    const stats = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => b.clicks - a.clicks);
    return { success: true, data: stats };
  } catch (error) {
    console.error("Game Popularity Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all contact messages.
 */
export async function getContactMessages() {
  try {
    const q = query(collection(db, 'contact_messages'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const messages = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
    }));
    return { success: true, data: messages };
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a contact message.
 */
export async function deleteContactMessage(id) {
  try {
    await deleteDoc(doc(db, 'contact_messages', id));
    return { success: true };
  } catch (error) {
    console.error("Delete Message Error:", error);
    return { success: false, error: error.message };
  }
}
