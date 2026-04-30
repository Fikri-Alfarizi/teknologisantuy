'use client';

import { useState } from 'react';
import GameCard from '../request-game/GameCard';
import GameDetailModal from '../request-game/GameDetailModal';

export default function SteamFallbackGrid({ steamGames, searchQuery }) {
  const [selectedGame, setSelectedGame] = useState(null);

  if (!steamGames || steamGames.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', opacity: 0.6 }}>
        <i className="fa-solid fa-ghost" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
        <h3>Game tidak ditemukan di Discord maupun Steam :(</h3>
        <p>Coba gunakan kata kunci lain (contoh: GTA, Resident, dll).</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <i className="fa-brands fa-steam" style={{ fontSize: '32px', color: '#66c0f4', marginBottom: '12px' }}></i>
        <h3 style={{ fontSize: '20px', color: '#fff' }}>Game tidak ada di Discord, tapi kami menemukannya di Steam!</h3>
        <p style={{ color: '#8f98a0', fontSize: '14px' }}>Silakan Request game di bawah ini agar admin segera upload ke Discord.</p>
      </div>

      <div className="steam-grid">
        {steamGames.map(game => (
          <GameCard 
            key={game.id} 
            game={game} 
            onClick={() => setSelectedGame(game)} 
          />
        ))}
      </div>

      {selectedGame && (
        <GameDetailModal 
          gameData={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      )}
    </div>
  );
}
