'use client';

import { useState, useEffect } from 'react';

export default function GameHeroCarousel({ featuredGames, onGameSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = featuredGames?.slice(0, 10) || [];

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) {
    return (
      <div className="steam-hero-carousel-skeleton">
        {/* Skeleton loading state */}
      </div>
    );
  }

  const currentGame = items[currentIndex];
  // large_capsule_image or dynamic header
  const bgImage = `https://cdn.akamai.steamstatic.com/steam/apps/${currentGame.id}/page_bg_generated_v6b.jpg?t=1`;
  const headerImage = `https://cdn.akamai.steamstatic.com/steam/apps/${currentGame.id}/header.jpg`;

  return (
    <div className="steam-hero-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="steam-hero-overlay"></div>
      
      <div className="container steam-hero-container">
        <h2 className="steam-hero-eyebrow">FEATURED & RECOMMENDED</h2>
        
        <div className="steam-hero-main-card" onClick={() => onGameSelect && onGameSelect(currentGame.id)}>
          <div className="steam-hero-img-col">
            <img src={headerImage} alt={currentGame.name} />
          </div>
          
          <div className="steam-hero-info-col">
            <h3 className="steam-hero-title">{currentGame.name}</h3>
            
            {/* The steam API doesn't always return screenshots for featured unless it's full app detail.
                We can just show thumbnails built from appid to mimic Steam's auto-generated thumbnails. */}
            <div className="steam-hero-screenshots">
              <div className="ss-thumb" style={{backgroundImage: `url(https://cdn.akamai.steamstatic.com/steam/apps/${currentGame.id}/ss_1.jpg)`}}></div>
              <div className="ss-thumb" style={{backgroundImage: `url(https://cdn.akamai.steamstatic.com/steam/apps/${currentGame.id}/ss_2.jpg)`}}></div>
              <div className="ss-thumb" style={{backgroundImage: `url(https://cdn.akamai.steamstatic.com/steam/apps/${currentGame.id}/ss_3.jpg)`}}></div>
              <div className="ss-thumb" style={{backgroundImage: `url(https://cdn.akamai.steamstatic.com/steam/apps/${currentGame.id}/ss_4.jpg)`}}></div>
            </div>

            <h4 className="steam-hero-reason">Now Available</h4>
            
            <div className="steam-hero-bottom">
               <div className="steam-platforms">
                 {currentGame.windows_available && <i className="fa-brands fa-windows"></i>}
                 {currentGame.mac_available && <i className="fa-brands fa-apple"></i>}
               </div>

              <div className="steam-hero-price-wrapper">
                {currentGame.discount_percent > 0 && (
                  <div className="steam-discount-badge-lg">-{currentGame.discount_percent}%</div>
                )}
                <div className="steam-price-col">
                  {currentGame.discount_percent > 0 && <span className="steam-original-price">Rp {(currentGame.original_price/100).toLocaleString('id-ID')}</span>}
                  <span className="steam-final-price">
                    {currentGame.final_price === 0 ? 'Free to Play' : `Rp ${(currentGame.final_price/100).toLocaleString('id-ID')}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots nav */}
        <div className="steam-hero-dots">
          {items.map((_, idx) => (
            <button 
              key={idx} 
              className={`steam-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
