'use client';

export default function GameDownloadButton({ game, className, style, children }) {
  const handleClick = async (e) => {
    // We don't prevent default because we want the link to open in new tab
    // However, we trigger the tracking API asynchronously
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
      href={game.link} 
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
