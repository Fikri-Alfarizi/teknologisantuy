"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function LauncherNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, 'launcherNews'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedNews = [];
        querySnapshot.forEach((doc) => {
          fetchedNews.push({ id: doc.id, ...doc.data() });
        });
        
        // If empty, supply some dummy data temporarily so UI doesn't look totally blank before admin adds real news
        if (fetchedNews.length === 0) {
          setNews([
            { id: 'dummy-1', title: 'Welcome to the New Launcher News Section', readTime: '2 MIN READ', type: 'ANNOUNCEMENT', excerpt: 'Admin can now add news dynamically via the dashboard. This is a placeholder article.', createdAt: new Date() }
          ]);
        } else {
          setNews(fetchedNews);
        }
      } catch (error) {
        console.error("Error fetching launcher news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div style={{ padding: '60px 5% 80px', minHeight: '80vh', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, margin: 0, textTransform: 'uppercase', color: '#fff' }}>Latest<span style={{color: '#1bf679'}}>.</span></h2>
          <p style={{ color: '#888', marginTop: 12, fontSize: '1.1rem' }}>Pembaruan resmi, patch notes, dan log developer.</p>
        </div>
      </div>

      {loading ? (
        <div className="ea-news-grid" style={{ padding: 0 }}>
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} style={{ background: '#1a1a1a', borderRadius: 12, height: 380, animation: 'pulse 1.5s infinite ease-in-out' }} />
          ))}
        </div>
      ) : (
        <div className="ea-news-grid" style={{ padding: 0 }}>
          {news.map((item) => (
            <Link key={item.id} href={`/launcher/news/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="ea-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="ea-card-img" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: item.coverImage ? `url(${item.coverImage}) center/cover` : 'linear-gradient(135deg, #162432, #0a0f16, #1bf679)',
                  position: 'relative'
                }}>
                  {!item.coverImage && <i className="fa-solid fa-newspaper" style={{ fontSize: '4rem', color: '#1bf679', opacity: 0.3 }}></i>}
                  
                  {/* Category Badge over image */}
                  <div style={{ 
                    position: 'absolute', top: 16, left: 16, 
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                    padding: '4px 12px', borderRadius: 4,
                    fontSize: 10, fontWeight: 800, color: '#1bf679', letterSpacing: 1
                  }}>
                    {item.type || 'NEWS'}
                  </div>
                </div>
                
                <div className="ea-card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: 1 }}>{item.readTime || '5 MIN READ'}</span>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '12px 0', lineHeight: 1.3, color: '#fff' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.5, marginBottom: 20, flex: 1 }}>
                    {item.excerpt || 'Find out everything you need to know about the latest updates directly from the developer desk.'}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', color: '#1bf679', fontWeight: 800, fontSize: 13 }}>
                    READ ARTICLE <i className="fa-solid fa-arrow-right" style={{ marginLeft: 8 }}></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        .ea-card:hover .fa-arrow-right {
          transform: translateX(5px);
          transition: transform 0.3s;
        }
        .fa-arrow-right {
          transition: transform 0.3s;
        }
      `}} />
    </div>
  );
}
