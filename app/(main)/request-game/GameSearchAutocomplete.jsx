'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function GameSearchAutocomplete({ onGameSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/game-search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data.items || []);
            setIsOpen(true);
          }
        } catch (e) {
          console.error("Failed to search:", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="steam-search" ref={wrapperRef}>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if(results.length > 0) setIsOpen(true); }}
        placeholder="Cari game di katalog Steam..."
        className="steam-search-input"
      />
      <div className="steam-search-icon">
        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-search"></i>}
      </div>

      {isOpen && results.length > 0 && (
        <div className="steam-search-dropdown">
          {results.map((game) => (
            <div 
              key={game.id} 
              className="steam-search-item"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
                if (onGameSelect) onGameSelect(game.id);
              }}
            >
              <div style={{ position: 'relative', width: '120px', height: '45px', overflow: 'hidden', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}>
                <Image 
                  src={game.tiny_image || `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/capsule_184x69.jpg`} 
                  alt={game.name} 
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="ss-item-info">
                <div className="ss-item-title">{game.name}</div>
                {game.price !== undefined && (
                  <div className="ss-item-price" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {(typeof game.price === 'object' ? (game.price.final || game.price.initial) : game.price) > 0 && (
                      <span style={{ textDecoration: 'line-through', color: '#737782', fontSize: '11px' }}>
                        Rp {((typeof game.price === 'object' ? (game.price.final || game.price.initial) : game.price) / 100).toLocaleString('id-ID')}
                      </span>
                    )}
                    <span style={{ color: '#a3ff00' }}>GRATIS</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
