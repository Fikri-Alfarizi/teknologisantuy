'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserCommunitySnippets } from '@/lib/forum/communities';
import {
  FaFire,
  FaComments,
  FaUsers,
  FaGamepad,
  FaDesktop,
  FaMobileScreenButton,
  FaRobot,
  FaLightbulb,
  FaTriangleExclamation,
  FaQuestion,
  FaGlobe,
  FaPlus,
} from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa';

const categories = [
  { id: 'general', label: 'General Discussion', icon: FaComments, color: '#F7931E' },
  { id: 'game-pc', label: 'PC Game', icon: FaDesktop, color: '#FFD60A' },
  { id: 'game-mobile', label: 'Mobile Game', icon: FaMobileScreenButton, color: '#19D3F3' },
  { id: 'emulator', label: 'Emulator', icon: FaRobot, color: '#00D084' },
  { id: 'tips-trick', label: 'Tips & Trick', icon: FaLightbulb, color: '#FB5607' },
  { id: 'bug-report', label: 'Bug Report', icon: FaTriangleExclamation, color: '#EE4540' },
  { id: 'faq', label: 'FAQ', icon: FaQuestion, color: '#9D5BD2' },
];

export default function ForumSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [communitySnippets, setCommunitySnippets] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      getUserCommunitySnippets(user.uid).then(setCommunitySnippets);
    } else {
      setCommunitySnippets([]);
    }
  }, [user]);

  return (
    <aside className="forum-sidebar">
      <style jsx>{`
        .forum-sidebar {
          width: 280px;
          background: var(--off-white);
          border-right: var(--bw) solid var(--black);
          padding: 24px 0;
          height: calc(100vh - 140px);
          overflow-y: auto;
          position: sticky;
          top: 140px;
          z-index: 10;
        }
        .sidebar-section { margin-bottom: 28px; padding: 0 16px; }
        .sidebar-title {
          font-size: 11px; font-weight: 900;
          color: rgba(0,0,0,0.5); text-transform: uppercase;
          letter-spacing: 1.5px; margin-bottom: 10px; padding-left: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .sidebar-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; margin-bottom: 6px;
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-sm);
          color: var(--black); text-decoration: none;
          font-size: 13px; font-weight: 700;
          transition: all 0.15s; cursor: pointer;
        }
        .sidebar-link:hover {
          transform: translate(-2px, -2px);
          box-shadow: var(--bs); background: var(--yellow);
        }
        .sidebar-link.active {
          background: var(--yellow);
          transform: translate(2px, 2px); box-shadow: none;
        }
        .sidebar-icon {
          width: 20px; display: flex; align-items: center;
          justify-content: center; font-size: 16px;
        }
        .sidebar-link-label {
          flex: 1; display: flex; align-items: center;
          justify-content: space-between;
        }

        .community-link {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 14px; margin-bottom: 4px;
          background: transparent; border: 2px solid transparent;
          color: var(--black); text-decoration: none;
          font-size: 13px; font-weight: 700;
          transition: all 0.15s; cursor: pointer;
        }
        .community-link:hover {
          background: var(--yellow); border-color: var(--black);
        }
        .community-link.active {
          background: var(--yellow); border-color: var(--black);
          font-weight: 900;
        }
        .community-icon {
          width: 24px; height: 24px;
          background: var(--blue-mid);
          border: 2px solid var(--black);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 900; color: white;
        }

        .create-community-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; margin-bottom: 6px;
          width: 100%;
          background: var(--yellow);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-sm);
          color: var(--black);
          font-size: 12px; font-weight: 900;
          cursor: pointer; text-transform: uppercase;
          transition: all 0.15s; text-decoration: none;
        }
        .create-community-btn:hover {
          transform: translate(2px, 2px); box-shadow: none;
        }

        @media (max-width: 1024px) { .forum-sidebar { width: 240px; } }
        @media (max-width: 768px) {
          .forum-sidebar {
            width: 100%; height: auto;
            border-right: none;
            border-bottom: var(--bw) solid var(--black);
            position: relative; top: 0;
            padding: 16px 0; overflow: visible;
          }
        }
      `}</style>

      {/* Feed */}
      <div className="sidebar-section">
        <div className="sidebar-title"><FaFire size={12} /> Feed</div>
        <Link href="/forum" className={`sidebar-link ${pathname === '/forum' ? 'active' : ''}`}>
          <div className="sidebar-icon" style={{ color: '#FF6B35' }}><FaFire /></div>
          <div className="sidebar-link-label"><span>Home</span></div>
        </Link>
        <Link href="/forum/communities" className={`sidebar-link ${pathname === '/forum/communities' ? 'active' : ''}`}>
          <div className="sidebar-icon" style={{ color: '#19D3F3' }}><FaGlobe /></div>
          <div className="sidebar-link-label"><span>Communities</span></div>
        </Link>
      </div>

      {/* My Communities */}
      {user && communitySnippets.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-title"><FaUsers size={12} /> My Communities</div>
          {communitySnippets.map(snippet => (
            <Link
              key={snippet.communityId}
              href={`/forum/community/${snippet.communityId}`}
              className={`community-link ${pathname?.includes(`/forum/community/${snippet.communityId}`) ? 'active' : ''}`}
            >
              <div className="community-icon">{snippet.communityId[0]?.toUpperCase()}</div>
              <span>c/{snippet.communityId}</span>
              {snippet.isAdmin && <span style={{ fontSize: 10, color: '#FF6B35', fontWeight: 900 }}>MOD</span>}
            </Link>
          ))}
        </div>
      )}

      {/* Create Community */}
      {user && (
        <div className="sidebar-section">
          <Link href="/forum/create-community" className="create-community-btn">
            <FaPlus size={12} /> Create Community
          </Link>
        </div>
      )}

      {/* Categories (kept from original) */}
      <div className="sidebar-section">
        <div className="sidebar-title"><FaGamepad size={12} /> Topics</div>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={`/forum/community/${cat.id}`}
              className={`community-link ${pathname?.includes(`/forum/community/${cat.id}`) ? 'active' : ''}`}
            >
              <div className="sidebar-icon" style={{ color: cat.color }}><Icon /></div>
              <span>{cat.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
