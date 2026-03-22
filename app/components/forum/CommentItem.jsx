'use client';

import { useState } from 'react';
import { FaReply, FaTrash } from 'react-icons/fa6';

/**
 * CommentItem — ported from Circus CommentItem.tsx
 * Renders a single comment with reply/delete actions and recursively renders children.
 */
export default function CommentItem({ comment, userId, onReply, onDelete, depth = 0 }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp?.seconds ? timestamp.seconds * 1000 : timestamp);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply?.(replyText.trim(), comment.id, (comment.depth || 0) + 1);
    setReplyText('');
    setShowReplyInput(false);
  };

  const canReply = (comment.depth || 0) < 2;

  return (
    <div className="comment-item-wrapper" style={{ marginLeft: depth > 0 ? 24 : 0 }}>
      <style jsx>{`
        .comment-item-wrapper {
          border-left: ${depth > 0 ? '3px solid var(--yellow)' : 'none'};
          padding-left: ${depth > 0 ? '16px' : '0'};
          margin-bottom: 12px;
        }
        .comment-card {
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-sm);
          padding: 16px 20px;
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .comment-author {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .avatar {
          width: 28px; height: 28px;
          background: var(--yellow);
          border: 2px solid var(--black);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900;
        }
        .author-name { font-weight: 800; font-size: 13px; color: var(--black); }
        .comment-time { font-size: 11px; color: rgba(0,0,0,0.4); }
        .comment-text {
          font-size: 14px;
          color: rgba(0,0,0,0.8);
          line-height: 1.6;
          white-space: pre-wrap;
          margin-bottom: 10px;
        }
        .actions {
          display: flex;
          gap: 6px;
        }
        .action-btn {
          padding: 4px 10px;
          background: var(--off-white);
          border: 2px solid transparent;
          cursor: pointer;
          color: rgba(0,0,0,0.4);
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s;
        }
        .action-btn:hover { border-color: var(--black); color: var(--black); }
        .action-btn.del:hover { color: #EE4540; }

        .reply-box {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }
        .reply-input {
          flex: 1;
          padding: 10px 12px;
          border: var(--bw) solid var(--black);
          background: var(--off-white);
          font-size: 13px;
          font-family: inherit;
          font-weight: 600;
        }
        .reply-input:focus { outline: none; box-shadow: var(--bs-sm); }
        .reply-submit {
          padding: 10px 18px;
          background: var(--yellow);
          border: var(--bw) solid var(--black);
          font-weight: 900;
          font-size: 12px;
          cursor: pointer;
          text-transform: uppercase;
        }
        .reply-submit:hover { transform: translate(2px,2px); box-shadow: none; }
      `}</style>

      <div className="comment-card">
        <div className="comment-header">
          <div className="comment-author">
            <div className="avatar">{comment.creatorDisplayText?.[0]?.toUpperCase() || '?'}</div>
            <span className="author-name">{comment.creatorDisplayText}</span>
            <span className="comment-time">{formatTime(comment.createdAt)}</span>
          </div>
          <div className="actions">
            {canReply && (
              <button className="action-btn" onClick={() => setShowReplyInput(!showReplyInput)}>
                <FaReply size={10} /> Reply
              </button>
            )}
            {userId === comment.creatorId && (
              <button className="action-btn del" onClick={() => onDelete?.(comment)}>
                <FaTrash size={10} /> Delete
              </button>
            )}
          </div>
        </div>

        <div className="comment-text">{comment.text}</div>

        {showReplyInput && (
          <div className="reply-box">
            <input
              className="reply-input"
              placeholder={`Reply to ${comment.creatorDisplayText}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
            />
            <button className="reply-submit" onClick={handleSubmitReply}>Reply</button>
          </div>
        )}
      </div>

      {/* Nested children */}
      {comment.children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          userId={userId}
          onReply={onReply}
          onDelete={onDelete}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
