"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';

export default function NewsComments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth(); 

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const fetchComments = async () => {
    try {
      // Avoid orderBy here to prevent Firestore index requirements during initial setup
      const q = query(
        collection(db, 'newsComments'),
        where('articleId', '==', articleId)
      );
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort descending safely on client side
      fetched.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      setComments(fetched);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userProfile) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'newsComments'), {
        articleId,
        uid: userProfile.uid || 'anonymous',
        username: userProfile.username || userProfile.displayName || 'User',
        avatarUrl: userProfile.photoURL || userProfile.avatarUrl || '',
        text: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
      fetchComments(); // Refresh comments list
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeAgo = (timestamp) => {
    if (!timestamp || !timestamp.toMillis) return 'Just now';
    const seconds = Math.floor((new Date().getTime() - timestamp.toMillis()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="ea-comments-section">
      <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
        <i className="fa-solid fa-comments" style={{ color: '#1bf679' }}></i> 
        Discussion <span style={{ color: '#666', fontSize: '1.2rem' }}>({comments.length})</span>
      </h3>

      {userProfile ? (
        <form onSubmit={handlePostComment} style={{ display: 'flex', gap: 16, marginBottom: 48, background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: '50%', backgroundColor: '#333', flexShrink: 0,
            backgroundImage: userProfile.photoURL || userProfile.avatarUrl ? `url(${userProfile.photoURL || userProfile.avatarUrl})` : 'none',
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888'
          }}>
            {!(userProfile.photoURL || userProfile.avatarUrl) && <i className="fa-solid fa-user"></i>}
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the discussion..."
              rows={3}
              style={{
                width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: 8, padding: 16, color: '#fff', fontSize: '1rem', fontFamily: 'inherit',
                resize: 'vertical', outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1bf679'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
                style={{
                  background: newComment.trim() ? '#1bf679' : '#333',
                  color: newComment.trim() ? '#000' : '#666',
                  border: 'none', padding: '10px 24px', borderRadius: 50, fontWeight: 800,
                  cursor: newComment.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                  display: 'inline-flex', alignItems: 'center', gap: 8
                }}
              >
                {isSubmitting ? 'POSTING...' : 'POST COMMENT'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div style={{ 
          padding: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 12, marginBottom: 48, 
          textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' 
        }}>
          <i className="fa-solid fa-lock" style={{ fontSize: 24, color: '#666', marginBottom: 16 }}></i>
          <h4 style={{ fontSize: '1.2rem', marginBottom: 8, fontWeight: 700 }}>Login Required</h4>
          <p style={{ color: '#888', marginBottom: 0 }}>You must be logged in to participate in the discussion.</p>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div className="spinner" style={{ width: 30, height: 30, border: '3px solid #1bf679', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : comments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ display: 'flex', gap: 16 }}>
              <div style={{ 
                width: 40, height: 40, borderRadius: '50%', backgroundColor: '#222', flexShrink: 0,
                backgroundImage: comment.avatarUrl ? `url(${comment.avatarUrl})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666'
              }}>
                {!comment.avatarUrl && <i className="fa-solid fa-user" style={{ fontSize: 14 }}></i>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{comment.username}</span>
                  <span style={{ color: '#666', fontSize: '0.85rem', fontWeight: 600 }}>{timeAgo(comment.createdAt)}</span>
                </div>
                <div style={{ color: '#ccc', lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                  {comment.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
          <i className="fa-regular fa-comments" style={{ fontSize: 40, color: '#333', marginBottom: 16 }}></i>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
