"use client";
import React, { useState } from 'react';
import LauncherOverview from '@/app/components/launcher/LauncherOverview';
import LauncherFeatures from '@/app/components/launcher/LauncherFeatures';
import LauncherNews from '@/app/components/launcher/LauncherNews';
import LauncherCommunity from '@/app/components/launcher/LauncherCommunity';

export default function EaFcLauncherShowcase() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="ea-showcase">
      <style dangerouslySetInnerHTML={{
        __html: `
        .ea-showcase {
          background-color: #111111;
          color: #ffffff;
          font-family: var(--font-space-grotesk), sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          padding-top: 40px;
          padding-bottom: 40px;
        }
        .ea-showcase * {
          box-sizing: border-box;
        }
        
        /* Sub Nav */
        .ea-subnav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 32px;
          background: rgba(30, 30, 30, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50px;
          position: sticky;
          top: 80px;
          z-index: 90;
          max-width: 1200px;
          margin: 0 auto 60px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        .ea-subnav-links {
          display: flex;
          gap: 24px;
          font-size: 14px;
          font-weight: 700;
        }
        .ea-subnav-links button {
          background: transparent;
          border: none;
          color: #ccc;
          font-family: inherit;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s, text-shadow 0.2s;
          padding: 8px 0;
          position: relative;
        }
        .ea-subnav-links button:hover { color: #fff; }
        .ea-subnav-links button.active {
          color: #1bf679;
          text-shadow: 0 0 10px rgba(27, 246, 121, 0.4);
        }
        .ea-subnav-links button.active::after {
          content: '';
          position: absolute;
          bottom: -17px;
          left: 0; right: 0;
          height: 3px;
          background: #1bf679;
        }
        .ea-btn-green {
          background-color: #1bf679;
          color: #000;
          padding: 12px 28px;
          border-radius: 50px;
          font-weight: 800;
          text-decoration: none;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s, background-color 0.2s;
          cursor: pointer;
        }
        .ea-btn-green:hover {
          background-color: #15cc63;
          transform: scale(1.02);
        }
        .ea-btn-outline {
          background-color: transparent;
          color: #fff;
          padding: 12px 28px;
          border-radius: 50px;
          font-weight: 800;
          text-decoration: none;
          border: 2px solid #fff;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.2s, color 0.2s;
          cursor: pointer;
        }
        .ea-btn-outline:hover {
          background-color: #fff;
          color: #000;
        }

        /* Hero */
        .ea-hero {
          display: flex;
          align-items: center;
          padding: 20px 5% 60px;
          gap: 60px;
        }
        .ea-hero-img {
          flex: 1.3;
          border-radius: 12px;
          background: url('/launcher/cover_launcher_v.2.2.jpg') center center / cover no-repeat;
          aspect-ratio: 16/9;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .ea-hero-content {
          flex: 1;
        }
        .ea-hero-title {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 24px;
        }
        .ea-hero-desc {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #ccc;
          margin-bottom: 32px;
          max-width: 500px;
        }
        
        /* Features */
        .ea-features {
          padding: 80px 5%;
          text-align: center;
        }
        .ea-features-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 40px;
        }
        .ea-features-showcase {
          max-width: 1200px;
          margin: 0 auto;
          background: #222;
          border-radius: 12px;
          height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop') center/cover;
          position: relative;
          box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
        }
        
        /* News Section */
        .ea-news-featured {
          margin: 0 5%;
          background: linear-gradient(90deg, #0a0f16, #162432);
          border: 1px solid #1bf679;
          border-radius: 12px;
          padding: 60px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .ea-news-content {
          position: relative;
          z-index: 2;
        }
        .ea-news-icon {
          opacity: 0.8;
          z-index: 1;
        }
        
        .ea-news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          padding: 20px 0;
        }
        .ea-card {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .ea-card:hover {
          transform: translateY(-5px);
        }
        .ea-card-img {
          height: 180px;
          background: linear-gradient(to bottom, #7400b8, #6930c3, #1bf679);
        }
        .ea-card-content {
          padding: 24px;
        }

        /* Footer CTA */
        .ea-club {
          display: flex;
          margin: 40px 5% 40px;
          gap: 40px;
        }
        .ea-club-img {
          flex: 1;
          background: url('/launcher/intro_launcher_v.2.2.jpg') center/cover no-repeat;
          border-radius: 12px;
          aspect-ratio: 16/9;
        }
        .ea-club-content {
          flex: 1;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Hamburger styling */
        .ea-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
        }
        .ea-subnav-header {
          display: flex; 
          align-items: center; 
          gap: 16px;
        }

        @media (max-width: 900px) {
          .ea-hero, .ea-club {
            flex-direction: column;
          }
          .ea-hero-img { width: 100%; height: 300px; }
          .ea-subnav { 
            flex-direction: column; 
            gap: 0; 
            border-radius: 16px; 
            padding: 16px; 
            margin: 20px 5% 20px; 
          }
          .ea-news-featured {
            flex-direction: column-reverse;
            padding: 40px 20px;
            text-align: center;
          }
          .ea-news-content {
            margin: 0 auto;
          }
          .ea-news-icon i {
            font-size: 8rem !important;
            margin-bottom: 20px;
          }
          .ea-subnav-header {
            width: 100%;
            justify-content: space-between;
          }
          .ea-hamburger {
            display: block;
          }
          .ea-subnav-links { 
            flex-direction: column;
            width: 100%;
            display: none;
            gap: 16px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255,255,255,0.1);
          }
          .ea-subnav-links.open {
            display: flex;
          }
          .ea-subnav > .ea-btn-green {
            display: none;
          }
          .ea-subnav.menu-open > .ea-btn-green {
            display: flex;
            margin-top: 16px;
            width: 100%;
            justify-content: center;
          }
          .ea-hero-title { font-size: 2.5rem; }
        }
      `}} />

      {/* Sub Nav */}
      <div className={`ea-subnav ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="ea-subnav-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <i className="fa-solid fa-futbol" style={{ fontSize: 24 }}></i>
            <span style={{ fontWeight: 900, fontSize: 18 }}>EA SPORTS FC™ 26</span>
          </div>
          <button className="ea-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
        <div className={`ea-subnav-links ${isMenuOpen ? 'open' : ''}`}>
          <button onClick={() => { setActiveTab('overview'); setIsMenuOpen(false); }} className={activeTab === 'overview' ? 'active' : ''}>Overview</button>
          <button onClick={() => { setActiveTab('features'); setIsMenuOpen(false); }} className={activeTab === 'features' ? 'active' : ''}>Features</button>
          <button onClick={() => { setActiveTab('news'); setIsMenuOpen(false); }} className={activeTab === 'news' ? 'active' : ''}>News</button>
          <button onClick={() => { setActiveTab('community'); setIsMenuOpen(false); }} className={activeTab === 'community' ? 'active' : ''}>Community</button>
        </div>
        <a href="https://pastelink.net/3n0lqhgl" target="_blank" className="ea-btn-green" style={{ padding: '8px 20px', fontSize: 13, alignSelf: 'center' }}>
          Download Sekarang
        </a>
      </div>

      {/* Tab Render Container */}
      <div className="ea-tab-content reveal scale-in">
        {activeTab === 'overview' && <LauncherOverview />}
        {activeTab === 'features' && <LauncherFeatures />}
        {activeTab === 'news' && <LauncherNews />}
        {activeTab === 'community' && <LauncherCommunity />}
      </div>

    </div>
  );
}
