



import Link from 'next/link';
import GameSearchBar from '@/app/components/GameSearchBar';
import GameDownloadButton from './GameDownloadButton';
import ErrorReportClient from './ErrorReportClient';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function getDiscordGames(beforeCursor) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.error("DISCORD_BOT_TOKEN is missing!");
    return { games: [], nextCursor: null };
  }
  
  try {
    const limit = 30;
    let url = `https://discord.com/api/v10/channels/1391274558514004019/messages?limit=${limit}`;
    if (beforeCursor) {
      url += `&before=${beforeCursor}`;
    }

    const cleanToken = token.trim().replace(/"/g, '');
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${cleanToken}`
      },
      next: { revalidate: 60 } // Cache updates every 60 seconds
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch games from Discord:", errorText);
      return { games: [], nextCursor: null };
    }
    
    const messages = await res.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) return { games: [], nextCursor: null };
    
    // Fetch overrides from Firestore - GRACEFUL FAILURE
    let overrides = {};
    try {
      const overridesSnap = await getDocs(collection(db, 'game_overrides'));
      overridesSnap.forEach(doc => {
        overrides[doc.id] = doc.data();
      });
    } catch (fbErr) {
      console.warn("Firestore overrides failed:", fbErr.message);
    }

    // Parse messages
    const games = messages.map(msg => {
      const content = msg.content || "";
      const gameMatch = content.match(/GAME\s*[:\-]\s*(.+)/i);
      const sizeMatch = content.match(/SIZE\s*[:\-]\s*(.+)/i);
      const passMatch = content.match(/PASSWORD\s*[:\-]\s*(.+)/i);
      const linkMatch = content.match(/https?:\/\/[^\s]+/i);
      
      const imageAttachment = msg.attachments?.find(att => att.url && (att.content_type?.startsWith('image/') || att.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)));
      const embedImage = msg.embeds ? msg.embeds.find(e => e.type === 'image' || e.image || e.thumbnail) : null;
      let imgUrl = '/logo.png';
      if (imageAttachment) imgUrl = imageAttachment.url;
      else if (embedImage) imgUrl = embedImage.image?.url || embedImage.thumbnail?.url || embedImage.url || '/logo.png';
      
      if (imgUrl === '/logo.png') {
        const rawImgMatch = content.match(/https?:\/\/[^\s]+?\.(png|jpe?g|gif|webp)/i);
        if (rawImgMatch) imgUrl = rawImgMatch[0];
      }

      const baseData = {
        id: msg.id,
        title: gameMatch ? gameMatch[1].trim() : 'Unknown Game',
        size: sizeMatch ? sizeMatch[1].trim() : 'N/A',
        password: passMatch ? passMatch[1].trim() : '-',
        link: linkMatch ? linkMatch[0].trim() : '#',
        image: imgUrl,
        timestamp: new Date(msg.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      if (overrides[msg.id]) {
        return { ...baseData, ...overrides[msg.id] };
      }
      return baseData;
    }).filter(g => g.title !== 'Unknown Game' && g.link !== '#');
    
    const nextCursor = messages.length === limit ? messages[messages.length - 1].id : null;
    
    return { games, nextCursor };
  } catch(e) {
    console.error("Error fetching discord:", e);
    return { games: [], nextCursor: null };
  }
}

async function searchDiscordGames(query) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return [];
  
  let allGames = [];
  let before = null;
  let hasMore = true;
  let calls = 0;
  const cleanToken = token.trim().replace(/"/g, '');
  
  try {
    // recursively fetch up to 5 pages (500 messages max)
    while (hasMore && calls < 5) {
      calls++;
      let url = `https://discord.com/api/v10/channels/1391274558514004019/messages?limit=100`;
      if (before) url += `&before=${before}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bot ${cleanToken}` },
        next: { revalidate: 300 } 
      });
      
      if (!res.ok) break;
      const messages = await res.json();
      if (!messages || messages.length === 0) break;
      
      const parsed = messages.map(msg => {
        const content = msg.content || "";
        const gameMatch = content.match(/GAME\s*[:\-]\s*(.+)/i);
        const sizeMatch = content.match(/SIZE\s*[:\-]\s*(.+)/i);
        const passMatch = content.match(/PASSWORD\s*[:\-]\s*(.+)/i);
        const linkMatch = content.match(/https?:\/\/[^\s]+/i);
        
        const imageAttachment = msg.attachments?.find(att => att.url && (att.content_type?.startsWith('image/') || att.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)));
        const embedImage = msg.embeds ? msg.embeds.find(e => e.type === 'image' || e.image || e.thumbnail) : null;
        let imgUrl = '/logo.png';
        if (imageAttachment) imgUrl = imageAttachment.url;
        else if (embedImage) imgUrl = embedImage.image?.url || embedImage.thumbnail?.url || embedImage.url || '/logo.png';
        if (imgUrl === '/logo.png') {
          const rawImgMatch = content.match(/https?:\/\/[^\s]+?\.(png|jpe?g|gif|webp)/i);
          if (rawImgMatch) imgUrl = rawImgMatch[0];
        }

        return {
          id: msg.id,
          title: gameMatch ? gameMatch[1].trim() : 'Unknown Game',
          size: sizeMatch ? sizeMatch[1].trim() : 'N/A',
          password: passMatch ? passMatch[1].trim() : '-',
          link: linkMatch ? linkMatch[0].trim() : '#',
          image: imgUrl,
          timestamp: new Date(msg.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        };
      }).filter(g => g.title !== 'Unknown Game' && g.link !== '#');
      
      allGames = allGames.concat(parsed);
      before = messages[messages.length - 1].id;
      if (messages.length < 100) hasMore = false;
    }
    
    // Fetch overrides from Firestore - GRACEFUL FAILURE
    let overrides = {};
    try {
      const overridesSnap = await getDocs(collection(db, 'game_overrides'));
      overridesSnap.forEach(doc => {
        overrides[doc.id] = doc.data();
      });
    } catch (fErr) {
      console.warn("Firestore search overrides failed:", fErr.message);
    }

    // Perform local JSON text search
    const lowerQuery = query.toLowerCase();
    const searched = allGames.filter(g => g.title.toLowerCase().includes(lowerQuery) || g.size.toLowerCase().includes(lowerQuery));

    // Apply overrides to search results
    const mergedResults = searched.map(g => {
      if (overrides[g.id]) {
        return { ...g, ...overrides[g.id] };
      }
      return g;
    });

    return mergedResults;
  } catch (e) {
    console.error("Error deep searching discord:", e);
    return [];
  }
}

export const metadata = {
  title: "Download Game PC - Teknologi Santuy",
  description: "Katalog download game gratis hasil sinkronisasi langsung dari channel Discord kami.",
};

export default async function GamePage({ searchParams }) {
  // Await searchParams as required in Next 15
  const resolvedParams = await searchParams;
  const beforeCursor = resolvedParams?.before || null;
  const searchQuery = resolvedParams?.search || null;

  let games = [];
  let nextCursor = null;

  if (searchQuery) {
    games = await searchDiscordGames(searchQuery);
  } else {
    const freshData = await getDiscordGames(beforeCursor);
    games = freshData.games;
    nextCursor = freshData.nextCursor;
  }

  // Fallback Dummy Data if Discord fetch fails or channel is empty
  const displayGames = games.length > 0 ? games : [
    { id: '1', title: 'Sea of Thieves (v2.135.8227.0 + Co-op)', size: '117.8 GB', password: '-', link: '#', image: '/logo.png', timestamp: '12 Jan 2026' },
  ];

  return (
    <>
      {/* ══ HERO GAME ══ */}
      <section className="hero" style={{ padding: '120px 0 60px', minHeight: 'auto', display: 'flex', alignItems: 'center', background: 'var(--deep-blue)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero-eyebrow reveal from-bottom" style={{ display: 'inline-flex' }} suppressHydrationWarning>
            <i className="fa-brands fa-discord"></i> Auto-Synced with Discord
          </div>
          <h1 className="hero-title reveal from-bottom stagger-1" style={{ fontSize: '3rem', margin: '20px 0' }} suppressHydrationWarning>
            Games <span className="accent">&amp; Update Terbaru</span>
          </h1>
          <p className="hero-sub reveal from-bottom stagger-2" style={{ maxWidth: '600px', margin: '0 auto' }} suppressHydrationWarning>
            Katalog download seluruh game PC yang bersumber langsung secara otomatis dari server Discord resmi Teknologi Santuy.
          </p>
        </div>
      </section>

      {/* ══ GAME CATALOG GRID ══ */}
      <section className="section section-alt" style={{ paddingTop: 0 }}>
        <div className="container">

          {/* BRUTALIST SEARCH BAR */}
          <GameSearchBar initialQuery={searchQuery} />

          {searchQuery && (
            <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '-16px' }}>
              Menampilkan hasil pencarian untuk: <strong style={{ color: 'var(--yellow)' }}>"{searchQuery}"</strong>
              <Link href="/game" style={{ marginLeft: '12px', color: '#ff6b6b', textDecoration: 'underline' }}>Hapus Pencarian</Link>
            </div>
          )}
          {searchQuery && games.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', opacity: 0.6 }}>
              <i className="fa-solid fa-ghost" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
              <h3>Game tidak ditemukan :(</h3>
              <p>Coba gunakan kata kunci lain (contoh: GTA, Resident, dll).</p>
            </div>
          )}

          <div className="showcase-header-row">
            <div>
              <div className="section-eyebrow"><i className="fa-solid fa-cloud-arrow-down"></i> Katalog Unduhan</div>
              <h2 className="section-title">Semua <span className="mark">Koleksi Game</span></h2>
            </div>
            {games.length === 0 && (
              <div style={{ padding: '12px 24px', background: 'rgba(255,0,0,0.1)', border: '2px dashed red', borderRadius: '12px', color: '#ff6b6b', fontWeight: 'bold' }}>
                Menampilkan Data Mockup (Gagal menarik API Discord)
              </div>
            )}
            {games.length > 0 && (
              <div style={{ padding: '12px 24px', background: 'rgba(0,255,0,0.1)', border: '2px dashed #00ff00', borderRadius: '12px', color: '#00ff00', fontWeight: 'bold' }}>
                <i className="fa-solid fa-check-circle"></i> Live dari Discord
              </div>
            )}
          </div>
          
          <div className="showcase-grid" style={{ gap: '24px', border: 'none', background: 'transparent' }}>
            {displayGames.map((item) => (
              <div 
                key={item.id} 
                className="showcase-card game-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '2px solid rgba(255,255,255,0.08)', 
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Size Badge */}
                <div style={{
                  position: 'absolute', top: '16px', right: '16px', zIndex: 2,
                  background: 'var(--blue)', color: 'white',
                  border: '2px solid #000', borderRadius: '24px',
                  padding: '4px 12px', fontSize: '12px', fontWeight: '800',
                  boxShadow: '2px 2px 0px #000'
                }}>
                  <i className="fa-solid fa-hard-drive"></i> {item.size}
                </div>

                {/* Game Cover */}
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-image" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
                    </div>
                  )}
                </div>
                
                <div className="sc-body" style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <span className="sc-tag" style={{ alignSelf: 'flex-start' }}><i className="fa-regular fa-calendar" style={{ marginRight: 6 }}></i> {item.timestamp}</span>
                  <h3 style={{ margin: '12px 0 8px', fontSize: '16px', lineHeight: '1.4' }}>{item.title}</h3>
                  
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '8px', marginBottom: '24px', fontSize: '11.5px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ opacity: 0.6 }}>Password:</span> <strong style={{ color: 'var(--yellow)' }}>{item.password}</strong>
                    </div>
                    <div>
                      <span style={{ opacity: 0.6 }}>Link:</span>{" "}
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#fff", textDecoration: "underline" }}
                      >
                        {(() => {
                          try {
                            return new URL(item.link).hostname;
                          } catch {
                            return "Download Link";
                          }
                        })()}
                      </a>
                    </div>
                  </div>
                  
                   <GameDownloadButton game={item} style={{
                    marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '12px 16px', background: 'var(--yellow)',
                    border: '2px solid #000', borderRadius: '8px',
                    color: 'var(--bg)', textDecoration: 'none',
                    fontWeight: '800', fontSize: '16px', width: '100%',
                    boxShadow: '3px 3px 0px rgba(0,0,0,0.5)', transition: 'all 0.2s ease'
                  }} className="game-download-btn">
                    <i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i> Download Sekarang
                  </GameDownloadButton>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {!searchQuery && (
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '48px 0', alignItems: 'center' }}>
              {beforeCursor ? (
                <Link href="/game" style={{
                  padding: '12px 24px', background: 'var(--yellow)', border: '2px solid var(--black)',
                  color: 'var(--black)', fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px',
                  boxShadow: '3px 3px 0px rgba(0,0,0,0.5)', transition: 'transform 0.1s', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <i className="fa-solid fa-arrow-left"></i> Sebelumnya
                </Link>
              ) : (
                <div style={{
                  padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', borderRadius: '8px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <i className="fa-solid fa-arrow-left"></i> Sebelumnya
                </div>
              )}
              
              {nextCursor ? (
                <Link href={`/game?before=${nextCursor}`} style={{
                  padding: '12px 24px', background: 'var(--yellow)', border: '2px solid var(--black)',
                  color: 'var(--black)', fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px',
                  boxShadow: '3px 3px 0px rgba(0,0,0,0.5)', transition: 'transform 0.1s', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  Berikutnya <i className="fa-solid fa-arrow-right"></i>
                </Link>
              ) : (
                <div style={{
                  padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', borderRadius: '8px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  Berikutnya <i className="fa-solid fa-arrow-right"></i>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ERROR REPORT MODAL LISTENER */}
      <ErrorReportClient />
    </>
  );
}
