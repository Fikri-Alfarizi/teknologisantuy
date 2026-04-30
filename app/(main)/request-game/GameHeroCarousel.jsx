'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
          <div className="steam-hero-img-col" style={{ position: 'relative' }}>
            <Image 
              src={headerImage} 
              alt={currentGame.name} 
              width={616}
              height={353}
              priority={true}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
          
          <div className="steam-hero-info-col">
            <h3 className="steam-hero-title">{currentGame.name}</h3>
            
            <div className="steam-hero-screenshots">
              {[1, 2, 3, 4].map((num) => (
                <div 
                  key={num} 
                  className="ss-thumb" 
                  style={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    backgroundImage: `none` // remove bg image if using Image component
                  }}
                >
                   <Image 
                     src={`https://cdn.akamai.steamstatic.com/steam/apps/${currentGame.id}/ss_${num}.jpg`}
                     alt={`Screenshot ${num}`}
                     fill
                     sizes="(max-width: 768px) 100vw, 33vw"
                     style={{ objectFit: 'cover' }}
                   />
                </div>
              ))}
            </div>

            <h4 className="steam-hero-reason">Now Available</h4>
            
            <div className="steam-hero-bottom">
               <div className="steam-platforms">
                 {currentGame.windows_available && <i className="fa-brands fa-windows"></i>}
                 {currentGame.mac_available && <i className="fa-brands fa-apple"></i>}
               </div>

              <div className="steam-hero-price-wrapper">
                <div className="steam-price-col" style={{ display: 'flex', alignItems: 'center' }}>
                  {currentGame.final_price > 0 && (
                    <span className="steam-original-price" style={{ textDecoration: 'line-through', color: '#737782', fontSize: '13px', marginRight: '8px' }}>
                      Rp {(currentGame.final_price/100).toLocaleString('id-ID')}
                    </span>
                  )}
                  <span className="steam-final-price" style={{ color: '#a3ff00', fontWeight: 'bold' }}>
                    GRATIS
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
