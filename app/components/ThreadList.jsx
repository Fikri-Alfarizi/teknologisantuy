'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaFire, FaComments, FaClock } from 'react-icons/fa6';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { handleThreadVote } from '@/lib/forum-helpers';

export default function ThreadList({ threads = [], userVotes = {}, isLoading = false, userId = null }) {
  const [localVotes, setLocalVotes] = useState({});
  const [localScores, setLocalScores] = useState({});

  useEffect(() => {
    setLocalVotes(userVotes);
    const scores = {};
    threads.forEach((t) => { scores[t.id] = t.voteScore || 0; });
    setLocalScores(scores);
  }, [userVotes, threads]);

  const onVote = async (threadId, value) => {
    if (!userId) {
      alert('Login dulu untuk vote!');
      return;
    }
    // Optimistic update
    const currentVote = localVotes[threadId] || 0;
    let scoreDelta = 0;
    let newVote = 0;

    if (currentVote === value) {
      scoreDelta = -value;
      newVote = 0;
    } else if (currentVote === 0) {
      scoreDelta = value;
      newVote = value;
    } else {
      scoreDelta = value * 2;
      newVote = value;
    }

    setLocalVotes((prev) => ({ ...prev, [threadId]: newVote }));
    setLocalScores((prev) => ({ ...prev, [threadId]: (prev[threadId] || 0) + scoreDelta }));

    try {
      const result = await handleThreadVote(threadId, userId, value);
      setLocalScores((prev) => ({ ...prev, [threadId]: result.newScore }));
      setLocalVotes((prev) => ({ ...prev, [threadId]: result.userVote }));
    } catch (err) {
      console.error('Vote error:', err);
      // Revert
      setLocalVotes((prev) => ({ ...prev, [threadId]: currentVote }));
      setLocalScores((prev) => ({ ...prev, [threadId]: (prev[threadId] || 0) - scoreDelta }));
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  return (
    <div className="thread-list">
      <style jsx>{`
        .thread-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .thread-card {
          display: flex;
          gap: 0;
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs);
          transition: all 0.15s;
          position: relative;
        }

        .thread-card:hover {
          transform: translate(-3px, -3px);
          box-shadow: 8px 8px 0 var(--black);
        }

        /* Vote column */
        .vote-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 16px 14px;
          background: var(--off-white);
          border-right: var(--bw) solid var(--black);
          min-width: 60px;
        }

        .vote-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 2px solid transparent;
          cursor: pointer;
          font-size: 14px;
          color: rgba(0,0,0,0.3);
          transition: all 0.15s;
        }

        .vote-btn:hover {
          color: var(--black);
          background: var(--yellow);
          border-color: var(--black);
        }

        .vote-btn.upvoted {
          color: #FF6B35;
          font-weight: 900;
        }

        .vote-btn.downvoted {
          color: #3b82f6;
          font-weight: 900;
        }

        .vote-score {
          font-size: 18px;
          font-weight: 900;
          color: var(--black);
          line-height: 1;
        }

        /* Content area */
        .thread-body {
          flex: 1;
          padding: 20px 24px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 10px;
          cursor: pointer;
        }

        .thread-body:hover .thread-title {
          color: var(--blue-mid);
        }

        .thread-top-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .category-badge {
          display: inline-block;
          padding: 3px 10px;
          background: var(--blue-mid);
          border: 2px solid var(--black);
          font-size: 10px;
          font-weight: 900;
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(0,0,0,0.5);
        }

        .author-avatar {
          width: 22px;
          height: 22px;
          background: var(--yellow);
          border: 2px solid var(--black);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          color: var(--black);
        }

        .thread-title {
          font-size: 18px;
          font-weight: 900;
          color: var(--black);
          line-height: 1.3;
          transition: color 0.15s;
          margin: 0;
        }

        .thread-preview {
          font-size: 14px;
          color: rgba(0,0,0,0.6);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .thread-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 4px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(0,0,0,0.45);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border: 2px solid var(--black);
          font-size: 10px;
          font-weight: 900;
        }

        .badge.hot {
          background: #FF6B35;
          color: white;
        }

        .badge.pinned {
          background: var(--yellow);
          color: var(--black);
        }

        .badge.solved {
          background: #00D084;
          color: white;
        }

        /* Loading skeleton */
        .loading-skeleton {
          height: 140px;
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs);
          position: relative;
          overflow: hidden;
        }

        .loading-skeleton::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent);
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .empty-state {
          text-align: center;
          padding: 60px 24px;
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 900;
          color: var(--black);
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 14px;
          color: rgba(0,0,0,0.5);
        }

        @media (max-width: 768px) {
          .vote-col {
            padding: 12px 10px;
            min-width: 48px;
          }
          .thread-body {
            padding: 16px;
          }
          .thread-title {
            font-size: 16px;
          }
          .thread-meta {
            gap: 12px;
          }
        }
      `}</style>

      {isLoading ? (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="loading-skeleton"></div>
          ))}
        </>
      ) : threads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p className="empty-title">No threads found</p>
          <p className="empty-text">Be the first to start a discussion!</p>
        </div>
      ) : (
        threads.map((thread) => {
          const score = localScores[thread.id] ?? (thread.voteScore || 0);
          const userVote = localVotes[thread.id] || 0;
          const createdDate = thread.createdAt instanceof Date
            ? thread.createdAt
            : new Date(thread.createdAt);

          return (
            <div key={thread.id} className="thread-card">
              {/* Vote Column */}
              <div className="vote-col">
                <button
                  className={`vote-btn ${userVote === 1 ? 'upvoted' : ''}`}
                  onClick={() => onVote(thread.id, 1)}
                  title="Upvote"
                >
                  <FaArrowUp />
                </button>
                <span className="vote-score">{score}</span>
                <button
                  className={`vote-btn ${userVote === -1 ? 'downvoted' : ''}`}
                  onClick={() => onVote(thread.id, -1)}
                  title="Downvote"
                >
                  <FaArrowDown />
                </button>
              </div>

              {/* Content */}
              <Link href={`/forum/thread/${thread.id}`} className="thread-body">
                <div className="thread-top-row">
                  <span className="category-badge">{thread.category}</span>
                  <div className="author-info">
                    <div className="author-avatar">
                      {thread.authorName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span>{thread.authorName || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{formatTime(createdDate)}</span>
                  </div>
                </div>

                <h3 className="thread-title">{thread.title}</h3>

                <p className="thread-preview">
                  {thread.content?.substring(0, 200)}
                </p>

                <div className="thread-meta">
                  <div className="meta-item">
                    <FaComments /> {thread.replyCount || 0} replies
                  </div>
                  <div className="meta-item">
                    <FaClock /> {formatTime(createdDate)}
                  </div>
                  {thread.isPinned && (
                    <span className="badge pinned">📌 PINNED</span>
                  )}
                  {thread.isSolved && (
                    <span className="badge solved">✓ SOLVED</span>
                  )}
                  {thread.replyCount > 50 && (
                    <span className="badge hot"><FaFire size={10} /> HOT</span>
                  )}
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}
