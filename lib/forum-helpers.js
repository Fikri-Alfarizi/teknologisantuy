import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  increment,
  writeBatch,
  startAfter,
} from 'firebase/firestore';

// ═══════════════════════════════════════
// THREADS
// ═══════════════════════════════════════

/**
 * Create a new thread in Firestore.
 */
export async function createThread({ title, content, category, authorId, authorName, authorPhoto, imageURL }) {
  const threadsRef = collection(db, 'forum_threads');
  const docRef = await addDoc(threadsRef, {
    title,
    content,
    category: category || 'general',
    authorId,
    authorName: authorName || 'Anonymous',
    authorPhoto: authorPhoto || null,
    imageURL: imageURL || null,
    voteScore: 0,
    replyCount: 0,
    viewCount: 0,
    isPinned: false,
    isSolved: false,
    createdAt: serverTimestamp(),
    lastReplyAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Get threads with sorting and pagination.
 * @param {'hot'|'new'|'top'} sortBy
 * @param {number} pageSize
 * @param {object|null} lastDoc - last document snapshot for pagination
 */
export async function getThreads(sortBy = 'new', pageSize = 20, lastDoc = null) {
  const threadsRef = collection(db, 'forum_threads');

  let sortField = 'createdAt';
  let sortDir = 'desc';

  if (sortBy === 'hot') {
    sortField = 'lastReplyAt';
    sortDir = 'desc';
  } else if (sortBy === 'top') {
    sortField = 'voteScore';
    sortDir = 'desc';
  }

  let q;
  if (lastDoc) {
    q = query(threadsRef, orderBy(sortField, sortDir), startAfter(lastDoc), limit(pageSize));
  } else {
    q = query(threadsRef, orderBy(sortField, sortDir), limit(pageSize));
  }

  const snapshot = await getDocs(q);
  const threads = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    lastReplyAt: doc.data().lastReplyAt?.toDate?.() || new Date(),
    _snapshot: doc, // store for pagination
  }));

  return {
    threads,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === pageSize,
  };
}

/**
 * Get a single thread by ID.
 */
export async function getThreadById(threadId) {
  const threadRef = doc(db, 'forum_threads', threadId);
  const snap = await getDoc(threadRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    lastReplyAt: data.lastReplyAt?.toDate?.() || new Date(),
  };
}

/**
 * Delete a thread and its replies.
 */
export async function deleteThread(threadId) {
  const batch = writeBatch(db);

  // Delete all replies
  const repliesRef = collection(db, 'forum_threads', threadId, 'replies');
  const repliesSnap = await getDocs(repliesRef);
  repliesSnap.docs.forEach((d) => batch.delete(d.ref));

  // Delete all votes
  const votesRef = collection(db, 'forum_threads', threadId, 'votes');
  const votesSnap = await getDocs(votesRef);
  votesSnap.docs.forEach((d) => batch.delete(d.ref));

  // Delete the thread itself
  batch.delete(doc(db, 'forum_threads', threadId));
  await batch.commit();
}

/**
 * Increment view count for a thread.
 */
export async function incrementViewCount(threadId) {
  const threadRef = doc(db, 'forum_threads', threadId);
  await updateDoc(threadRef, { viewCount: increment(1) });
}

// ═══════════════════════════════════════
// VOTING
// ═══════════════════════════════════════

/**
 * Handle vote on a thread (upvote/downvote toggle).
 * @param {string} threadId
 * @param {string} userId
 * @param {1|-1} voteValue - 1 for upvote, -1 for downvote
 * @returns {{ newScore: number, userVote: number }}
 */
export async function handleThreadVote(threadId, userId, voteValue) {
  const voteRef = doc(db, 'forum_threads', threadId, 'votes', userId);
  const threadRef = doc(db, 'forum_threads', threadId);
  const voteSnap = await getDoc(voteRef);

  const batch = writeBatch(db);
  let scoreDelta = 0;
  let newUserVote = 0;

  if (voteSnap.exists()) {
    const existingVote = voteSnap.data().value;
    if (existingVote === voteValue) {
      // Toggle off: remove vote
      batch.delete(voteRef);
      scoreDelta = -voteValue;
      newUserVote = 0;
    } else {
      // Switch vote direction
      batch.update(voteRef, { value: voteValue });
      scoreDelta = voteValue * 2; // e.g., from -1 to +1 = +2
      newUserVote = voteValue;
    }
  } else {
    // New vote
    batch.set(voteRef, { value: voteValue, userId });
    scoreDelta = voteValue;
    newUserVote = voteValue;
  }

  batch.update(threadRef, { voteScore: increment(scoreDelta) });
  await batch.commit();

  // Get updated score
  const updatedThread = await getDoc(threadRef);
  return {
    newScore: updatedThread.data()?.voteScore || 0,
    userVote: newUserVote,
  };
}

/**
 * Get user's vote for a thread.
 */
export async function getUserVote(threadId, userId) {
  if (!userId) return 0;
  const voteRef = doc(db, 'forum_threads', threadId, 'votes', userId);
  const snap = await getDoc(voteRef);
  return snap.exists() ? snap.data().value : 0;
}

/**
 * Get all user votes for a list of threads (batch).
 */
export async function getUserVotesForThreads(threadIds, userId) {
  if (!userId || !threadIds.length) return {};
  const votes = {};
  // Firestore doesn't support batch gets across subcollections easily,
  // so we fetch individually (acceptable for <50 threads)
  await Promise.all(
    threadIds.map(async (id) => {
      votes[id] = await getUserVote(id, userId);
    })
  );
  return votes;
}

// ═══════════════════════════════════════
// REPLIES
// ═══════════════════════════════════════

/**
 * Create a reply to a thread (or to another reply for nesting).
 */
export async function createReply({ threadId, content, authorId, authorName, authorPhoto, parentReplyId }) {
  const repliesRef = collection(db, 'forum_threads', threadId, 'replies');
  const docRef = await addDoc(repliesRef, {
    content,
    authorId,
    authorName: authorName || 'Anonymous',
    authorPhoto: authorPhoto || null,
    parentReplyId: parentReplyId || null, // null = top-level reply
    likes: 0,
    createdAt: serverTimestamp(),
  });

  // Update thread reply count & lastReplyAt
  const threadRef = doc(db, 'forum_threads', threadId);
  await updateDoc(threadRef, {
    replyCount: increment(1),
    lastReplyAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Get all replies for a thread, organized for nesting.
 */
export async function getReplies(threadId) {
  const repliesRef = collection(db, 'forum_threads', threadId, 'replies');
  const q = query(repliesRef, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);

  const allReplies = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() || new Date(),
  }));

  // Build nested tree
  return buildReplyTree(allReplies);
}

/**
 * Build a nested reply tree from a flat list.
 */
function buildReplyTree(replies) {
  const map = {};
  const roots = [];

  replies.forEach((r) => {
    map[r.id] = { ...r, children: [] };
  });

  replies.forEach((r) => {
    if (r.parentReplyId && map[r.parentReplyId]) {
      map[r.parentReplyId].children.push(map[r.id]);
    } else {
      roots.push(map[r.id]);
    }
  });

  return roots;
}

/**
 * Delete a reply.
 */
export async function deleteReply(threadId, replyId) {
  const replyRef = doc(db, 'forum_threads', threadId, 'replies', replyId);
  await deleteDoc(replyRef);

  const threadRef = doc(db, 'forum_threads', threadId);
  await updateDoc(threadRef, { replyCount: increment(-1) });
}
