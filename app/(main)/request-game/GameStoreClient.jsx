'use client';

import { useState, useEffect } from 'react';
import GameHeroCarousel from './GameHeroCarousel';
import GameCard from './GameCard';
import GameSearchAutocomplete from './GameSearchAutocomplete';
import GameDetailModal from './GameDetailModal';

export default function GameStoreClient() {
  const [featuredData, setFeaturedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('top_sellers');
  const [selectedGameId, setSelectedGameId] = useState(null);

  useEffect(() => {
    fetch('/api/steam/featured')
      .then(res => res.json())
      .then(data => {
        setFeaturedData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Steam featured data:', err);
        setLoading(false);
      });
  }, []);

  const getTabItems = () => {
    if (!featuredData) return [];
    switch (activeTab) {
      case 'top_sellers': return featuredData.top_sellers?.items || [];
      case 'new_releases': return featuredData.new_releases?.items || [];
      case 'specials': return featuredData.specials?.items || [];
      case 'coming_soon': return featuredData.coming_soon?.items || [];
      default: return [];
    }
  };

  const handleGameSelect = (appId) => {
    setSelectedGameId(appId);
  };

  return (
    <div className="steam-store">
      <section className="steam-hero-section">
        <GameHeroCarousel 
          featuredGames={featuredData?.top_sellers?.items} 
          onGameSelect={handleGameSelect} 
        />
      </section>

      <div className="container" style={{ padding: '40px 24px', position: 'relative', zIndex: 10, marginTop: '-30px' }}>
        <GameSearchAutocomplete onGameSelect={handleGameSelect} />
      </div>

      <section className="steam-store-main container">
        <h2 className="steam-section-title">Browse Full Catalog</h2>
        
        <div className="steam-tabs">
          <button 
            className={`steam-tab ${activeTab === 'top_sellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('top_sellers')}
          >
            Top Sellers
          </button>
          <button 
            className={`steam-tab ${activeTab === 'new_releases' ? 'active' : ''}`}
            onClick={() => setActiveTab('new_releases')}
          >
            New Releases
          </button>
          <button 
            className={`steam-tab ${activeTab === 'specials' ? 'active' : ''}`}
            onClick={() => setActiveTab('specials')}
          >
            Specials & Discounts
          </button>
          <button 
            className={`steam-tab ${activeTab === 'coming_soon' ? 'active' : ''}`}
            onClick={() => setActiveTab('coming_soon')}
          >
            Coming Soon
          </button>
        </div>

        {loading ? (
          <div className="steam-store-loader">
            <i className="fa-solid fa-circle-notch fa-spin"></i> Loading Data from Steam API...
          </div>
        ) : (
          <div className="steam-grid">
            {getTabItems().map((item) => (
              <GameCard 
                key={item.id} 
                game={item} 
                onClick={handleGameSelect} 
              />
            ))}
            {getTabItems().length === 0 && (
              <div className="steam-empty">Tidak ada game di kategori ini.</div>
            )}
          </div>
        )}
      </section>

      {selectedGameId && (
        <GameDetailModal 
          appId={selectedGameId} 
          onClose={() => setSelectedGameId(null)} 
        />
      )}
    </div>
  );
}
