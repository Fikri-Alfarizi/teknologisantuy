'use client';

import { useState, useEffect } from 'react';
import GameHeroCarousel from './GameHeroCarousel';
import GameCard from './GameCard';
import GameSearchAutocomplete from './GameSearchAutocomplete';
import GameDetailModal from './GameDetailModal';
import SteamStoreNav from './SteamStoreNav';
import MyRequestsModal from './MyRequestsModal';
import { useAuth } from '@/lib/auth-context';

export default function GameStoreClient({ initialLeaderboard }) {
  const { user, isAuthenticated, signOut, userProfile } = useAuth();
  
  // States
  const [featuredData, setFeaturedData] = useState(null);
  const [activeTab, setActiveTab] = useState('new_releases');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isMyRequestsOpen, setMyRequestsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const [requestedGames, setRequestedGames] = useState([]);
  const [categoryGames, setCategoryGames] = useState([]);

  useEffect(() => {
    // Fetch Steam Data
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

    // Fetch Leaderboard Request Data from Firestore
    const fetchLeaderboard = async () => {
      try {
        const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const q = query(collection(db, 'requested_games'), orderBy('requestCount', 'desc'), limit(10));
        const snap = await getDocs(q);
        const reqGames = snap.docs.map(doc => ({
          ...doc.data(),
          isRequestedLeaderboard: true // Flag to identify these in UI
        }));
        setRequestedGames(reqGames);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleCategorySearch = async (category) => {
    setActiveTab('category_search');
    setCategoryName(category);
    setLoading(true);
    try {
      const res = await fetch(`/api/game-search?q=${encodeURIComponent(category)}&type=category`);
      const data = await res.json();
      setCategoryGames(data.items || []);
    } catch (err) {
      console.error(err);
      setCategoryGames([]);
    } finally {
      setLoading(false);
    }
  };

  const getTabItems = () => {
    if (activeTab === 'category_search') return categoryGames;
    if (activeTab === 'most_requested') return requestedGames;
    if (!featuredData) return [];
    switch (activeTab) {
      case 'top_sellers': return featuredData.top_sellers?.items || [];
      case 'new_releases': return featuredData.new_releases?.items || [];
      case 'specials': return featuredData.specials?.items || [];
      case 'coming_soon': return featuredData.coming_soon?.items || [];
      default: return [];
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  return (
    <div className="steam-store">
      <SteamStoreNav onSearch={handleCategorySearch} />
      <section className="steam-hero-section" style={{ paddingTop: '20px' }}>
        <GameHeroCarousel 
          featuredGames={featuredData?.top_sellers?.items} 
          onGameSelect={(id) => {
             const found = featuredData?.top_sellers?.items?.find(g => g.id === id);
             if (found) setSelectedGame(found);
             else setSelectedGame({ id });
          }} 
        />
      </section>

      <div className="container" style={{ padding: '40px 24px', position: 'relative', zIndex: 10, marginTop: '-30px' }}>
        <GameSearchAutocomplete onGameSelect={(id) => setSelectedGame({ id })} />
      </div>

      <section className="steam-store-main container">
        <h2 className="steam-section-title">
          {activeTab === 'category_search' ? `Browsing Category: ${categoryName}` : 'Browse Full Catalog'}
        </h2>
        
        <div className="steam-tabs">
          <button 
            className={`steam-tab ${activeTab === 'most_requested' ? 'active' : ''}`}
            onClick={() => setActiveTab('most_requested')}
          >
            <i className="fa-solid fa-fire"></i> Paling Banyak Direquest
          </button>
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
                onClick={() => handleGameSelect(item)} 
              />
            ))}
            {getTabItems().length === 0 && (
              <div className="steam-empty">Tidak ada game di kategori ini.</div>
            )}
          </div>
        )}
      </section>

      {selectedGame && (
        <GameDetailModal 
          gameData={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      )}
    </div>
  );
}
