/**
 * Communities system — ported from Circus: lib/community/*.ts
 * Firestore collections:
 *   communities/{name} — community documents
 *   users/{uid}/communitySnippets/{name} — membership records
 */
import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs, query, where, orderBy, limit,
  runTransaction, writeBatch, increment, serverTimestamp,
} from 'firebase/firestore';

/**
 * Create a new community (mirrors Circus createCommunity).
 * Uses a transaction to check uniqueness atomically.
 */
export async function createCommunity(communityName, communityType, userId) {
  const communityDocRef = doc(db, 'communities', communityName);

  await runTransaction(db, async (transaction) => {
    const communityDoc = await transaction.get(communityDocRef);
    if (communityDoc.exists()) {
      throw new Error(`Sorry, community "${communityName}" already exists. Try another name.`);
    }

    // Create community
    transaction.set(communityDocRef, {
      creatorId: userId,
      createdAt: serverTimestamp(),
      numberOfMembers: 1,
      privacyType: communityType,
      adminIds: [userId],
    });

    // Create membership snippet on user
    transaction.set(
      doc(db, `users/${userId}/communitySnippets`, communityName),
      { communityId: communityName, isAdmin: true }
    );
  });
}

/**
 * Join a community (mirrors Circus joinCommunity).
 */
export async function joinCommunity(userId, communityId, communityImageURL, isAdmin = false) {
  const batch = writeBatch(db);

  const newSnippet = {
    communityId,
    imageURL: communityImageURL || '',
    isAdmin,
  };

  batch.set(doc(db, `users/${userId}/communitySnippets`, communityId), newSnippet);
  batch.update(doc(db, 'communities', communityId), { numberOfMembers: increment(1) });

  await batch.commit();
  return newSnippet;
}

/**
 * Leave a community (mirrors Circus leaveCommunity).
 */
export async function leaveCommunity(userId, communityId) {
  const batch = writeBatch(db);
  batch.delete(doc(db, `users/${userId}/communitySnippets`, communityId));
  batch.update(doc(db, 'communities', communityId), { numberOfMembers: increment(-1) });
  await batch.commit();
}

/**
 * Get community data by ID.
 */
export async function getCommunityData(communityId) {
  const communityDocRef = doc(db, 'communities', communityId);
  const snap = await getDoc(communityDocRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Get all public communities for browsing.
 */
export async function getCommunities(limitCount = 50) {
  const q = query(
    collection(db, 'communities'),
    orderBy('numberOfMembers', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get user's community snippets (which communities they've joined).
 */
export async function getUserCommunitySnippets(userId) {
  if (!userId) return [];
  const snippetsRef = collection(db, `users/${userId}/communitySnippets`);
  const snap = await getDocs(snippetsRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
