/**
 * Posts CRUD — ported from Circus: lib/posts/*.ts
 * Firestore collection: posts/{id}
 */
import { db, storage } from '../firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, where, startAfter, serverTimestamp, increment, writeBatch,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Create a new post in a community (mirrors Circus createPost).
 */
export async function createPost(user, communityId, communityImageURL, postData, selectedFile) {
  const newPost = {
    communityId,
    communityImageURL: communityImageURL || '',
    creatorId: user.uid,
    creatorUsername: user.displayName || user.email?.split('@')[0] || 'Anonymous',
    title: postData.title,
    body: postData.body,
    numberOfComments: 0,
    voteStatus: 0,
    createTime: serverTimestamp(),
  };

  const postDocRef = await addDoc(collection(db, 'posts'), newPost);

  if (selectedFile) {
    const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
    await uploadString(imageRef, selectedFile, 'data_url');
    const downloadURL = await getDownloadURL(imageRef);
    await updateDoc(doc(db, 'posts', postDocRef.id), { imageURL: downloadURL });
  }

  return postDocRef.id;
}

/**
 * Get posts with pagination (mirrors Circus getPosts).
 */
export async function getPosts(communityId, communityIds, isGenericHome, lastVisible) {
  let postsQuery;
  const postsRef = collection(db, 'posts');

  if (communityId) {
    // Community-specific feed
    postsQuery = lastVisible
      ? query(postsRef, where('communityId', '==', communityId), orderBy('createTime', 'desc'), startAfter(lastVisible), limit(10))
      : query(postsRef, where('communityId', '==', communityId), orderBy('createTime', 'desc'), limit(10));
  } else if (communityIds?.length) {
    // Personalized home feed (subscribed communities)
    postsQuery = lastVisible
      ? query(postsRef, where('communityId', 'in', communityIds.slice(0,10)), orderBy('createTime', 'desc'), startAfter(lastVisible), limit(10))
      : query(postsRef, where('communityId', 'in', communityIds.slice(0,10)), orderBy('createTime', 'desc'), limit(10));
  } else {
    // Generic home feed (all public, sorted by votes)
    postsQuery = lastVisible
      ? query(postsRef, orderBy('voteStatus', 'desc'), startAfter(lastVisible), limit(10))
      : query(postsRef, orderBy('voteStatus', 'desc'), limit(10));
  }

  const snapshot = await getDocs(postsQuery);
  const posts = snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));

  const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
  return { posts, newLastVisible };
}

/**
 * Get a single post by ID.
 */
export async function getPost(postId) {
  const postRef = doc(db, 'posts', postId);
  const snap = await getDoc(postRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Delete a post (and its image if present).
 */
export async function deletePost(post) {
  if (post.imageURL) {
    try {
      const imageRef = ref(storage, `posts/${post.id}/image`);
      await deleteObject(imageRef);
    } catch (e) { /* image may not exist */ }
  }
  await deleteDoc(doc(db, 'posts', post.id));
}
