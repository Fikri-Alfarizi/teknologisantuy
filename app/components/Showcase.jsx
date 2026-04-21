"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Showcase() {
  const [filter, setFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    // Fetch posts on client side to avoid hydration issues
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blogger-posts?limit=6');
        
        if (!response.ok) {
          throw new Error(`API response status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Invalid response format');
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('❌ Error fetching posts:', error.message);
        setError(error.message);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Transform posts dari Blogger ke format yang cocok untuk display
  const contentItems = posts.map((post, index) => ({
    cat: post.cat.toLowerCase().includes('game') ? 'game' : post.cat.toLowerCase().includes('tutorial') ? 'tutorial' : 'tips',
    thumb: post.thumb,
    icon: post.icon,
    color: 'var(--white)',
    title: post.title,
    desc: post.desc,
    tag: post.cat,
    url: post.url,
    image: post.image,
    col: index % 3 === 2,
    row: index >= 3
  }));

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="showcase-header-row">
          <div>
            <div className="section-eyebrow reveal from-bottom" suppressHydrationWarning><i className="fa-solid fa-images"></i> Konten Kami</div>
            <h2 className="section-title reveal from-bottom stagger-1" suppressHydrationWarning>Preview Konten <span className="mark">Terbaru</span></h2>
          </div>
          <div className="showcase-tabs reveal from-right" suppressHydrationWarning>
            <button suppressHydrationWarning className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Semua</button>
            <button suppressHydrationWarning className={`tab-btn ${filter === 'game' ? 'active' : ''}`} onClick={() => setFilter('game')}>Game</button>
            <button suppressHydrationWarning className={`tab-btn ${filter === 'tutorial' ? 'active' : ''}`} onClick={() => setFilter('tutorial')}>Tutorial</button>
            <button suppressHydrationWarning className={`tab-btn ${filter === 'tips' ? 'active' : ''}`} onClick={() => setFilter('tips')}>Tips</button>
          </div>
        </div>
        <div className="showcase-grid reveal from-bottom" suppressHydrationWarning>
          {error && (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              backgroundColor: '#fee', 
              borderRadius: '8px',
              color: '#c00',
              border: '1px solid #f99'
            }}>
              <p><strong>⚠️ Error loading content:</strong> {error}</p>
              <p style={{ fontSize: '0.9em', marginTop: '0.5rem' }}>Check browser console for details</p>
            </div>
          )}
          {isLoading && !error && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>Memuat konten...</p>
          )}
          {!isLoading && !error && contentItems.length === 0 && (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '3rem 2rem',
              color: 'rgba(255,255,255,.5)',
              fontSize: '15px'
            }}>
              <i className="fa-solid fa-box-open" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,.2)' }}></i>
              Tidak ada konten yang tersedia saat ini
            </div>
          )}
          {!isLoading && !error && contentItems.length > 0 && contentItems.filter(item => filter === 'all' || filter === item.cat).length === 0 && (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '3rem 2rem',
              color: 'rgba(255,255,255,.5)',
              fontSize: '15px'
            }}>
              <i className="fa-solid fa-filter-circle-xmark" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,.2)' }}></i>
              Tidak ada konten untuk kategori ini
            </div>
          )}
          {!error && contentItems.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-card"
              style={{
                display: (filter === 'all' || filter === item.cat) ? 'block' : 'none',
                borderRight: item.col ? 'none' : undefined,
                borderBottom: item.row ? 'none' : undefined,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div 
                className={`sc-thumb ${item.thumb}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  height: 'auto',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {item.image ? (
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <i className={`fa-solid ${item.icon}`} style={{ color: item.color, fontSize: '3em', position: 'relative', zIndex: 1 }}></i>
                )}
              </div>
              <div className="sc-body">
                <span className="sc-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
