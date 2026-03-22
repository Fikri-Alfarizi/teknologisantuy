'use client';

import Link from 'next/link';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { FaComments, FaShareNodes, FaBookmark, FaTrash, FaRegBookmark } from 'react-icons/fa6';

/**
 * PostItem — ported from Circus PostItem.tsx
 * Displays a post card with vote section, body/image, and action bar.
 */
export default function PostItem({
  post,
  userVoteValue = 0,
  onVote,
  onDelete,
  onSelect,
  isCreator = false,
  homePage = false,
}) {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp?.seconds ? timestamp.seconds * 1000 : timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="post-item" onClick={() => onSelect?.(post)}>
      <style jsx>{`
        .post-item {
          display: flex;
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs);
          transition: all 0.15s;
          cursor: pointer;
        }
        .post-item:hover {
          transform: translate(-3px, -3px);
          box-shadow: 8px 8px 0 var(--black);
        }

        .vote-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 16px 14px;
          background: var(--off-white);
          border-right: var(--bw) solid var(--black);
          min-width: 56px;
        }
        .vote-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          background: transparent;
          border: 2px solid transparent;
          cursor: pointer;
          color: rgba(0,0,0,0.3);
          transition: all 0.15s;
          font-size: 13px;
        }
        .vote-btn:hover { color: var(--black); background: var(--yellow); border-color: var(--black); }
        .vote-btn.upvoted { color: #FF6B35; }
        .vote-btn.downvoted { color: #3b82f6; }
        .vote-score {
          font-size: 16px; font-weight: 900; color: var(--black); line-height: 1;
        }

        .post-content {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .post-top {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(0,0,0,0.5);
          font-weight: 600;
        }
        .community-link {
          font-weight: 900;
          color: var(--black);
          text-decoration: none;
        }
        .community-link:hover { color: var(--blue-mid); }

        .post-title {
          font-size: 18px;
          font-weight: 900;
          color: var(--black);
          line-height: 1.3;
          margin: 0;
        }
        .post-body {
          font-size: 14px;
          color: rgba(0,0,0,0.65);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-image {
          max-height: 300px;
          width: 100%;
          object-fit: cover;
          border: 2px solid var(--black);
        }

        .action-bar {
          display: flex;
          gap: 4px;
          margin-top: 4px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          color: rgba(0,0,0,0.4);
          transition: all 0.15s;
        }
        .action-btn:hover { background: var(--off-white); color: var(--black); }
        .action-btn.delete:hover { color: #EE4540; }

        @media (max-width: 768px) {
          .post-content { padding: 14px; }
          .post-title { font-size: 16px; }
          .vote-section { padding: 12px 10px; }
        }
      `}</style>

      {/* Vote */}
      <div className="vote-section" onClick={(e) => e.stopPropagation()}>
        <button
          className={`vote-btn ${userVoteValue === 1 ? 'upvoted' : ''}`}
          onClick={(e) => { e.stopPropagation(); onVote?.(post, 1); }}
        ><FaArrowUp /></button>
        <span className="vote-score">{post.voteStatus || 0}</span>
        <button
          className={`vote-btn ${userVoteValue === -1 ? 'downvoted' : ''}`}
          onClick={(e) => { e.stopPropagation(); onVote?.(post, -1); }}
        ><FaArrowDown /></button>
      </div>

      {/* Content */}
      <div className="post-content">
        <div className="post-top">
          {homePage && (
            <>
              <Link href={`/forum/community/${post.communityId}`} className="community-link" onClick={(e) => e.stopPropagation()}>
                c/{post.communityId}
              </Link>
              <span>•</span>
            </>
          )}
          <span>Posted by {post.creatorUsername}</span>
          <span>•</span>
          <span>{formatTime(post.createTime)}</span>
        </div>

        <h3 className="post-title">{post.title}</h3>

        {post.body && <p className="post-body">{post.body}</p>}
        {post.imageURL && <img src={post.imageURL} alt="Post" className="post-image" />}

        <div className="action-bar">
          <button className="action-btn">
            <FaComments /> {post.numberOfComments || 0} Comments
          </button>
          <button className="action-btn"><FaShareNodes /> Share</button>
          {isCreator && (
            <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); onDelete?.(post); }}>
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
