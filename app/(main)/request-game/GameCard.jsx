'use client';

import Image from 'next/image';

export default function GameCard({ game, onClick }) {
  // If no main image, fallback to capsule
  const imageUrl = game.large_capsule_image || `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/header.jpg`;
  
  // Handling pricing logic loosely based on Steam API's typical response shape
  // Steam API might return price in cents
  let numericPrice = 0;
  if (typeof game.price === 'object' && game.price !== null) {
    numericPrice = game.price.final || game.price.initial || 0;
  } else if (typeof game.price === 'number') {
    numericPrice = game.price;
  } else if (game.original_price) {
    numericPrice = game.original_price;
  }

  const isFree = game.is_free || numericPrice === 0;
  
  const formattedPrice = isFree ? 'Free to Play' 
                       : numericPrice > 0 ? `Rp ${(numericPrice / 100).toLocaleString('id-ID')}` 
                       : '';

  const discountPercent = game.discount_percent || 0;

  return (
    <div className="steam-card" onClick={() => onClick && onClick(game.id)}>
      <div className="steam-card-img-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        <Image 
          src={imageUrl} 
          alt={game.name} 
          className="steam-card-img" 
          width={460}
          height={215}
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="steam-card-content">
        <h3 className="steam-card-title">{game.name}</h3>
        
        <div className="steam-card-bottom">
          <div className="steam-platforms">
            {game.windows_available && <i className="fa-brands fa-windows"></i>}
            {game.mac_available && <i className="fa-brands fa-apple"></i>}
            {game.linux_available && <i className="fa-brands fa-linux"></i>}
          </div>
          
          <div className="steam-card-pricing">
            {game.isRequestedLeaderboard ? (
              <div className="steam-price-col" style={{ display: 'flex', alignItems: 'center' }}>
                <span className="steam-final-price" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                  <i className="fa-solid fa-fire"></i> {game.requestCount || 1} Request
                </span>
              </div>
            ) : (
              <div className="steam-price-col" style={{ display: 'flex', alignItems: 'center' }}>
                {formattedPrice && formattedPrice !== 'Free to Play' && (
                  <span className="steam-original-price" style={{ textDecoration: 'line-through', color: '#737782', fontSize: '11px', marginRight: '6px' }}>{formattedPrice}</span>
                )}
                <span className="steam-final-price" style={{ color: '#a3ff00', fontWeight: 'bold' }}>GRATIS</span>
              </div>
            )}
          </div>
        </div>
        
        {/* We place a pseudo-button here as per Steam style hover, or just a clear call to action */}
        <div className="steam-card-action">
          <span>{game.isRequestedLeaderboard ? 'IKUT REQUEST (+1)' : 'REQUEST GAME'}</span>
        </div>
      </div>
    </div>
  );
}
