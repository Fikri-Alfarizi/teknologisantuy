"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import NewsComments from '@/app/components/launcher/NewsComments';

export default function LauncherNewsDetail({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (id === 'dummy-1') {
          setArticle({
            id: 'dummy-1',
            title: 'Welcome to the New Launcher News Section',
            content: '<p>Admin can now add news dynamically via the dashboard. This is a placeholder article demonstrating the layout and typography style.</p><h2>What to expect?</h2><p>Here you will see patch notes, community highlights, and deep dives into the EA SPORTS FC™ 26 engine for PES 2017. Features include database changes and massive enhancements on graphics directly from the creator.</p><ul><li>Server optimization and ping reductions</li><li>Sleek and highly optimized user interface</li><li>Free modifications directly integrated</li></ul><p>Enjoy standard communication below this article to talk with fellow members.</p>',
            coverImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop',
            readTime: '2 MIN READ',
            type: 'ANNOUNCEMENT',
            createdAt: new Date()
          });
          setLoading(false);
          return;
        }

        const docRef = doc(db, 'launcherNews', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #1bf679', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff' }}>
        <h2>Article Not Found</h2>
        <Link href="/launcher" className="ea-btn-green" style={{ marginTop: 20 }}>Back to Launcher</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#111', color: '#fff', minHeight: '100vh', paddingBottom: 100 }}>
      {/* ══ HERO DETAIL ══ */}
      <section style={{ 
        position: 'relative', 
        padding: '120px 5% 60px', 
        display: 'flex', 
        alignItems: 'end',
        minHeight: '60vh',
        background: article.coverImage ? `linear-gradient(to top, #111 5%, transparent), url(${article.coverImage}) center/cover no-repeat` : 'linear-gradient(to bottom, #162432, #111)'
      }}>
        {/* Dark overlay for text readability if cover image is bright */}
        {article.coverImage && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />}
        
        <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Link href="/launcher" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1bf679', textDecoration: 'none', fontWeight: 800, marginBottom: 24, fontSize: 14, letterSpacing: 1 }}>
            <i className="fa-solid fa-arrow-left"></i> BACK TO LAUNCHER
          </Link>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <span style={{ background: '#1bf679', color: '#000', padding: '4px 12px', borderRadius: 4, fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>
              {article.type || 'NEWS'}
            </span>
            <span style={{ color: '#ccc', fontSize: 11, fontWeight: 700, letterSpacing: 1, alignSelf: 'center' }}>
              {article.readTime || '5 MIN READ'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px 0', textTransform: 'uppercase', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            {article.title}
          </h1>
          
          <div style={{ color: '#bbb', fontSize: 13, fontWeight: 600 }}>
            Published on {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </section>

      {/* ══ CONTENT ══ */}
      <section style={{ padding: '0 5%' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.8, color: '#ddd' }}>
          <div className="ea-article-content" dangerouslySetInnerHTML={{ __html: article.content ? article.content.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '') : '' }} />
          
          {/* Comments Section */}
          <div style={{ marginTop: 80, paddingTop: 60, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <NewsComments articleId={id} />
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .ea-article-content h2 {
          color: #fff;
          font-size: 2rem;
          font-weight: 900;
          margin: 40px 0 20px;
        }
        .ea-article-content h3 {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 30px 0 16px;
        }
        .ea-article-content p {
          margin-bottom: 24px;
        }
        .ea-article-content img {
          max-width: 100%;
          border-radius: 12px;
          margin: 32px 0;
        }
        .ea-article-content a {
          color: #1bf679;
          text-decoration: none;
        }
        .ea-article-content a:hover {
          text-decoration: underline;
        }
        .ea-article-content ul, .ea-article-content ol {
          margin-left: 24px;
          margin-bottom: 24px;
        }
        .ea-article-content li {
          margin-bottom: 12px;
        }
        
        /* Optional: specific button style inside article */
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
      `}} />
    </div>
  );
}
