"use client";
import { useState, useEffect } from 'react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blogger-posts?limit=50');
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) setPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = ['all', ...new Set(posts.map(p => p.cat.toLowerCase()))];

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(p => p.cat.toLowerCase() === filter);

  return (
    <>
      <section className="hero" style={{ padding: '120px 0 60px', minHeight: 'auto', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero-eyebrow reveal from-bottom" style={{ display: 'inline-flex' }} suppressHydrationWarning>
            <i className="fa-solid fa-newspaper"></i> Blog &amp; Artikel
          </div>
          <h1 className="hero-title reveal from-bottom stagger-1" style={{ fontSize: '3rem', margin: '20px 0' }} suppressHydrationWarning>
            Artikel &amp; <span className="accent">Update Terbaru</span>
          </h1>
          <p className="hero-sub reveal from-bottom stagger-2" style={{ maxWidth: '600px', margin: '0 auto' }} suppressHydrationWarning>
            Kumpulan artikel, rilis game terbaru, tutorial troubleshooting, dan tips keren yang diperbarui secara rutin eksklusif untuk komunitas Teknologi Santuy.
          </p>
        </div>
      </section>

      <section className="section section-alt" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Filter Tabs */}
          <div className="showcase-tabs reveal from-bottom" style={{ marginBottom: '24px' }} suppressHydrationWarning>
            {categories.map(cat => (
              <button
                key={cat}
                className={`tab-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,.5)' }}>Memuat artikel...</p>
          )}

          {/* Grid */}
          <div className="showcase-grid reveal from-bottom" style={{ boxShadow: 'none' }} suppressHydrationWarning>
            {!isLoading && filteredPosts.length === 0 && (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '3rem 2rem',
                color: 'rgba(255,255,255,.5)',
                fontSize: '15px'
              }}>
                <i className="fa-solid fa-filter-circle-xmark" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,.2)' }}></i>
                Tidak ada artikel untuk kategori ini
              </div>
            )}
            {filteredPosts.map((item, i) => (
              <a
                key={item.id || i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-card" 
                style={{ 
                  display: 'block', 
                  borderRight: (i % 3 === 2) ? 'none' : undefined, 
                  borderBottom: (Math.floor(i / 3) === Math.floor((filteredPosts.length - 1) / 3)) ? 'none' : undefined,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className={`sc-thumb ${item.thumb}`}
                  style={{
                    backgroundImage: item.image ? `url('${item.image}')` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    aspectRatio: '16/9',
                    height: 'auto'
                  }}
                >
                  {!item.image && (
                    <i className={`fa-solid ${item.icon}`} style={{ color: 'var(--white)', fontSize: '3em' }}></i>
                  )}
                </div>
                <div className="sc-body">
                  <span className="sc-tag">{item.cat}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
