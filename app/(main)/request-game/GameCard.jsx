'use client';

export default function GameCard({ game, onClick }) {
  // If no main image, fallback to capsule
  const imageUrl = game.large_capsule_image || `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/header.jpg`;
  
  // Handling pricing logic loosely based on Steam API's typical response shape
  // Steam API might return price in cents
  const formattedPrice = game.price === 0 ? 'Free to Play' 
                       : game.price ? `Rp ${(game.price).toLocaleString('id-ID')}` 
                       : game.original_price ? `Rp ${(game.original_price/100).toLocaleString('id-ID')}` 
                       : '';

  const discountPercent = game.discount_percent || 0;

  return (
    <div className="steam-card" onClick={() => onClick && onClick(game.id)}>
      <div className="steam-card-img-wrapper">
        <img src={imageUrl} alt={game.name} className="steam-card-img" loading="lazy" />
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
            {discountPercent > 0 && (
              <div className="steam-discount-badge">-{discountPercent}%</div>
            )}
            <div className="steam-price-col">
              {discountPercent > 0 && <span className="steam-original-price">Rp {(game.original_price).toLocaleString('id-ID')}</span>}
              <span className="steam-final-price">{formattedPrice}</span>
            </div>
          </div>
        </div>
        
        {/* We place a pseudo-button here as per Steam style hover, or just a clear call to action */}
        <div className="steam-card-action">
          <span>REQUEST GAME</span>
        </div>
      </div>
    </div>
  );
}
