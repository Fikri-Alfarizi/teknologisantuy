'use client';

import { encodeDownloadUrl } from '../../lib/url-obfuscator';

export default function GameDownloadButton({ game, className, style, children }) {
  const downloadToken = encodeDownloadUrl(game.link);

  const handleClick = async (e) => {
    // Set sessionStorage to track for error reporting when user returns to this tab
    sessionStorage.setItem('lastDownloadedGame', JSON.stringify(game));
    
    // Trigger tracking API
    try {
      fetch('/api/game/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id, title: game.title })
      });
    } catch (err) {
      console.error('Click tracking failed:', err);
    }
  };

  return (
    <a 
      href={`/download?to=${downloadToken}&name=${encodeURIComponent(game.title)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className} 
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
