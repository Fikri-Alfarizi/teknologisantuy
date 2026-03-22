/**
 * Comments system — ported from Circus: lib/comments/*.ts
 * Firestore collection: comments/{id}
 * Supports threaded replies up to depth 2
 */
import { db } from '../firebase';
import {
  collection, doc, getDocs, deleteDoc, query, where, orderBy, increment, serverTimestamp, writeBatch,
} from 'firebase/firestore';

/**
 * Create a comment (mirrors Circus createComment).
 * Supports threaded nesting with parentId and depth.
 */
export async function createComment(user, communityId, postId, postTitle, commentText, depth, parentId) {
  if (depth > 2) {
    throw new Error('Maximum comment depth reached. You cannot reply to this comment.');
  }

  const batch = writeBatch(db);
  const commentDocRef = doc(collection(db, 'comments'));

  const newComment = {
    id: commentDocRef.id,
    creatorId: user.uid,
    creatorDisplayText: user.displayName || user.email?.split('@')[0] || 'Anonymous',
    communityId,
    postId,
    postTitle,
    text: commentText,
    createdAt: serverTimestamp(),
    depth,
  };

  if (parentId) {
    newComment.parentId = parentId;
  }

  batch.set(commentDocRef, newComment);

  // Update post comment count
  const postDocRef = doc(db, 'posts', postId);
  batch.update(postDocRef, { numberOfComments: increment(1) });

  await batch.commit();
  return newComment;
}

/**
 * Get all comments for a post (mirrors Circus getComments).
 */
export async function getComments(postId) {
  const commentsQuery = query(
    collection(db, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(commentsQuery);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Delete a comment and decrement post comment count.
 */
export async function deleteComment(comment) {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'comments', comment.id));
  batch.update(doc(db, 'posts', comment.postId), { numberOfComments: increment(-1) });
  await batch.commit();
}

/**
 * Build a threaded comment tree from a flat list.
 */
export function buildCommentTree(comments) {
  const map = {};
  const roots = [];

  comments.forEach(c => { map[c.id] = { ...c, children: [] }; });
  comments.forEach(c => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}
