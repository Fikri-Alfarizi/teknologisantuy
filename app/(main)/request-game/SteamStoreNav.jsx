'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SteamStoreNav({ onSearch }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const categories = {
    genres: [
      { name: "Action", icon: "fa-solid fa-crosshairs" },
      { name: "Adventure", icon: "fa-solid fa-map" },
      { name: "Role-Playing", icon: "fa-solid fa-khanda" },
      { name: "Simulation", icon: "fa-solid fa-plane" },
      { name: "Strategy", icon: "fa-solid fa-chess-knight" },
      { name: "Sports & Racing", icon: "fa-solid fa-flag-checkered" }
    ],
    themes: [
      { name: "Anime", icon: "fa-solid fa-mask" },
      { name: "Horror", icon: "fa-solid fa-ghost" },
      { name: "Mystery & Detective", icon: "fa-solid fa-user-secret" },
      { name: "Sci-Fi & Cyberpunk", icon: "fa-solid fa-robot" },
      { name: "Space", icon: "fa-solid fa-rocket" }
    ],
    players: [
      { name: "Singleplayer", icon: "fa-solid fa-user" },
      { name: "Multiplayer", icon: "fa-solid fa-users" },
      { name: "Co-op", icon: "fa-solid fa-handshake" },
      { name: "MMO", icon: "fa-solid fa-globe" }
    ]
  };

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(category);
    } else {
      alert(`Mencari game dengan kategori: ${category}`);
    }
    setActiveMenu(null);
  };

  return (
    <div className="steam-nav-wrapper">
      <div className="steam-nav-bar">
        <div 
          className="steam-nav-item"
          onMouseEnter={() => setActiveMenu('store')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span>Your Store</span>
          {activeMenu === 'store' && (
            <div className="steam-dropdown simple-dropdown">
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Community Recommendations</a></li>
                <li><a href="#">Recently Viewed</a></li>
                <li><a href="#">Steam Curators</a></li>
              </ul>
            </div>
          )}
        </div>

        <div 
          className="steam-nav-item"
          onMouseEnter={() => setActiveMenu('new')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span>New & Noteworthy</span>
          {activeMenu === 'new' && (
            <div className="steam-dropdown simple-dropdown">
              <ul>
                <li><a href="#">Steam Replay</a></li>
                <li><a href="#">Top Sellers</a></li>
                <li><a href="#">Most Played</a></li>
                <li><a href="#">New Releases</a></li>
                <li><a href="#">Upcoming Releases</a></li>
              </ul>
            </div>
          )}
        </div>

        {/* MEGA MENU CATEGORIES */}
        <div 
          className="steam-nav-item"
          onMouseEnter={() => setActiveMenu('categories')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span>Categories</span>
          {activeMenu === 'categories' && (
            <div className="steam-dropdown mega-menu">
              <div className="mega-menu-content">
                <div className="mega-col">
                  <h4>SPECIAL SECTIONS</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Free to Play')}>Free to Play</a></li>
                    <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Demos')}>Demos</a></li>
                    <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Early Access')}>Early Access</a></li>
                    <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Steam Deck')}>Steam Deck</a></li>
                  </ul>
                </div>
                
                <div className="mega-col">
                  <h4>GENRES</h4>
                  <ul>
                    {categories.genres.map(c => (
                      <li key={c.name}>
                        <a href="#" onClick={(e) => handleCategoryClick(e, c.name)}>
                          <i className={c.icon}></i> {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mega-col">
                  <h4>THEMES</h4>
                  <ul>
                    {categories.themes.map(c => (
                      <li key={c.name}>
                        <a href="#" onClick={(e) => handleCategoryClick(e, c.name)}>
                          <i className={c.icon}></i> {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mega-col">
                  <h4>PLAYER SUPPORT</h4>
                  <ul>
                    {categories.players.map(c => (
                      <li key={c.name}>
                        <a href="#" onClick={(e) => handleCategoryClick(e, c.name)}>
                          <i className={c.icon}></i> {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="steam-nav-item">
          <span>Points Shop</span>
        </div>
        <div className="steam-nav-item">
          <span>News</span>
        </div>
        <div className="steam-nav-item">
          <span>Labs</span>
        </div>

        {/* SEARCH PLACEHOLDER FOR NAV */}
        <div className="steam-nav-search">
          <input type="text" placeholder="search" disabled />
          <button disabled><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
      </div>

      <style jsx>{`
        .steam-nav-wrapper {
          background: var(--steam-bg);
          padding: 0;
          position: relative;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          margin-bottom: -15px;
        }

        .steam-nav-bar {
          max-width: 980px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          background: linear-gradient(to right, rgba(35, 83, 138, 0.9) 0%, rgba(35, 83, 138, 0.4) 100%);
          height: 38px;
        }

        .steam-nav-item {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 15px;
          cursor: pointer;
          color: #e5e4dc;
          font-size: 13.5px;
          font-weight: 500;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          transition: background 0.2s;
        }

        .steam-nav-item:hover {
          background: linear-gradient(to bottom, #4f94c4, #2c5b84);
          color: #fff;
        }

        .steam-nav-search {
          margin-left: auto;
          display: flex;
          align-items: center;
          padding-right: 4px;
        }
        .steam-nav-search input {
          background: #316282;
          border: 1px solid rgba(0,0,0,0.3);
          border-radius: 3px;
          padding: 4px 8px;
          color: #fff;
          font-size: 13px;
          width: 180px;
          outline: none;
          box-shadow: inset 1px 1px 3px rgba(0,0,0,0.3);
        }
        .steam-nav-search button {
          background: #54a5d4;
          border: none;
          color: #fff;
          border-radius: 3px;
          width: 26px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 2px;
          cursor: not-allowed;
          opacity: 0.8;
        }

        /* Dropdown Common */
        .steam-dropdown {
          position: absolute;
          top: 38px;
          left: 0;
          background: #3a3f45;
          border-top: 2px solid #54a5d4;
          box-shadow: 0 12px 24px rgba(0,0,0,0.6);
          padding: 10px 0;
          z-index: 1000;
          min-width: 220px;
          animation: slideDown 0.15s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .simple-dropdown ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .simple-dropdown li a {
          display: block;
          padding: 8px 16px;
          color: #dcdedf;
          text-decoration: none;
          font-size: 13px;
          transition: background 0.1s;
        }
        .simple-dropdown li a:hover {
          background: #dcdedf;
          color: #2b2e33;
        }

        /* Mega Menu */
        .mega-menu {
          width: 800px;
          left: -150px;
          padding: 24px;
          background: #3a3f45;
          background-image: linear-gradient(to bottom, #3a3f45 0%, #202429 100%);
        }
        .mega-menu-content {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }
        .mega-col {
          flex: 1;
        }
        .mega-col h4 {
          color: #54a5d4;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 8px;
        }
        .mega-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .mega-col li a {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #acb2b8;
          text-decoration: none;
          font-size: 13px;
          padding: 6px 8px;
          border-radius: 3px;
          transition: all 0.1s;
        }
        .mega-col li a i {
          color: #66c0f4;
          width: 16px;
          text-align: center;
        }
        .mega-col li a:hover {
          background: #dcdedf;
          color: #2b2e33;
        }
        .mega-col li a:hover i {
          color: #2b2e33;
        }

        @media (max-width: 768px) {
          .steam-nav-bar {
            flex-wrap: wrap;
            height: auto;
          }
          .steam-nav-item {
            padding: 12px;
            width: 50%;
          }
          .steam-nav-search {
            display: none;
          }
          .mega-menu {
            width: 100vw;
            left: 0;
            position: fixed;
            top: auto;
            max-height: 80vh;
            overflow-y: auto;
          }
          .mega-menu-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
