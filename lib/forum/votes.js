/**
 * Voting system — ported from Circus: lib/posts/handlePostVote.ts + getPostVotes.ts
 * Stores votes at: users/{uid}/postVotes/{voteId}
 * Aggregate score at: posts/{id}.voteStatus
 */
import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs, query, where, writeBatch,
} from 'firebase/firestore';

/**
 * Handle a vote on a post (mirrors Circus handlePostVote).
 * 3 scenarios: new vote, toggle off, switch direction.
 */
export async function handlePostVote(userId, post, vote, communityId, existingVote) {
  const batch = writeBatch(db);
  let voteChange = vote;
  let newVote = undefined;
  let voteIdToDelete = undefined;

  if (!existingVote) {
    // New vote
    const postVoteRef = doc(collection(db, 'users', `${userId}/postVotes`));
    newVote = {
      id: postVoteRef.id,
      postId: post.id,
      communityId,
      voteValue: vote,
    };
    batch.set(postVoteRef, newVote);
    voteChange = vote;
  } else {
    const postVoteRef = doc(db, 'users', `${userId}/postVotes/${existingVote.id}`);

    if (existingVote.voteValue === vote) {
      // Toggle off
      batch.delete(postVoteRef);
      voteChange = -vote;
      voteIdToDelete = existingVote.id;
    } else {
      // Switch direction
      batch.update(postVoteRef, { voteValue: vote });
      voteChange = 2 * vote;
      newVote = { ...existingVote, voteValue: vote };
    }
  }

  const postRef = doc(db, 'posts', post.id);
  batch.update(postRef, { voteStatus: (post.voteStatus || 0) + voteChange });
  await batch.commit();

  return { voteChange, newVote, voteIdToDelete };
}

/**
 * Get all of a user's votes for given post IDs (mirrors Circus getPostVotes).
 */
export async function getPostVotes(userId, postIds) {
  if (!userId || !postIds.length) return [];

  // Firestore 'in' queries limited to 30 items
  const chunks = [];
  for (let i = 0; i < postIds.length; i += 30) {
    chunks.push(postIds.slice(i, i + 30));
  }

  const allVotes = [];
  for (const chunk of chunks) {
    const votesQuery = query(
      collection(db, `users/${userId}/postVotes`),
      where('postId', 'in', chunk)
    );
    const snap = await getDocs(votesQuery);
    snap.docs.forEach(d => allVotes.push({ id: d.id, ...d.data() }));
  }

  return allVotes;
}

/**
 * Get votes for posts in a specific community.
 */
export async function getCommunityPostVotes(userId, communityId) {
  if (!userId) return [];
  const votesQuery = query(
    collection(db, `users/${userId}/postVotes`),
    where('communityId', '==', communityId)
  );
  const snap = await getDocs(votesQuery);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
