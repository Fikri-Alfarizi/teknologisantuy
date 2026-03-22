import React, { useState, useEffect } from 'react';

export default function LauncherFeatures() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "THE CLUB IS YOURS",
      desc: "Play your way with an overhauled gameplay experience powered by community feedback, Manager Live Challenges that bring dynamic storylines to the new season, and Archetypes inspired by greats of the game.",
      image: "/launcher/features/2.jpg"
    },
    {
      title: "NEXT-GEN ATHLETIC REALISM",
      desc: "Experience breathtaking stadium atmosphere and hyper-realistic player models. Every match feels like a live broadcast with enhanced lighting and turf degradation algorithms.",
      image: "/launcher/features/3.jpg"
    },
    {
      title: "UNRESTRICTED MULTIPLAYER MODS",
      desc: "Easily install community mods, facepacks, and custom kits with our completely automated anti-ribet launcher. Modding your Master League journey has never been this accessible.",
      image: "/launcher/features/4.jpg"
    },
    {
      title: "CLOUDSYNC GLOBAL ROSTERS",
      desc: "Keep your squad up to date with the latest 2026 global transfers. Formations, player stats, and elite club strategies are synchronized dynamically before kickoff.",
      image: "/launcher/features/5.jpg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const features = [
    {
      title: "OVERHAULED UI/UX, INSPIRED BY EA FC 26",
      desc: "Desain antarmuka (UI) sepenuhnya direkonstruksi menyerupai hirarki visual EA SPORTS FC™ 26. Navigasi sangat halus, responsif, dan memanjakan mata. Kami memastikan setiap ruang menu, transisi, dan interaksi terasa identik dengan sensasi game aslinya untuk imersi maksimal.",
      image: "https://drop-assets.ea.com/images/20bYTiyLR8hjpst7WOruQi/c8d8a7ebe79bdb7dde9defb0147a11d7/FC26_Rev_Neuer_Gameplay_16x9.jpg?im=AspectCrop=(16,9),xPosition=0.5,yPosition=0.5;Resize=(2560)&q=80"
    },
    {
      title: "PLAY YOUR WAY WITH 1-CLICK ANTI-RIBET SETUP",
      desc: "Satu kali klik, langsung main. Launcher cerdas kami secara otomatis mengatur hirarki file, instalasi registry, mod, dan penyesuaian database tanpa campur tangan manual. Tidak perlu lagi dipusingkan memindahkan file .cpk atau memodifikasi dpfilelist generator.",
      image: "https://drop-assets.ea.com/images/38KPvJkmt87CQ4QEDcdsrG/548bb708b526d0981f8eac4dd4c595fa/FC26_Rev_Musiala_Gameplay_16x9.jpg?im=AspectCrop=(16,9),xPosition=0.5,yPosition=0.5;Resize=(2560)&q=80"
    },
    {
      title: "CRAFT THE PERFECT GOAL WITH ULTRA-LIGHT CORE",
      desc: "Menggunakan perpaduan core engine PES 2017 murni yang terkenal sangat ramah untuk PC/Laptop kentang. Dapatkan frame-rate 60+ FPS dan gameplay yang mulus tanpa sedikitpun mengorbankan kualitas grafis berkat optimasi script eksklusif kami.",
      image: "https://drop-assets.ea.com/images/6vOqtTlihMFZMgQWakZNVY/93892e54e4f5fa0c3c10d393a58256de/FC26_Zlatan_Archetype_Lores_Clean_16x9.jpg?im=AspectCrop=(16,9),xPosition=0.5572916666666666,yPosition=0.47962962962962963;Resize=(2560)&q=80"
    },
    {
      title: "LATEST 2026 ROSTERS, KITS & GLOBAL TRANSFERS",
      desc: "Sepenuhnya di-update secara real-time berdasarkan pergerakan transfer pemain musim 2025/2026 global terkini. Nikmati presisi formasi terbaru, atribut akurat, wajah fotorealistis (facepacks), dan koleksi jersey resolusi ultra (4K) dari seluruh klub elit Eropa.",
      image: "https://drop-assets.ea.com/images/3tGdbsLcRXbmbXL5sPvJOt/cbc95075c21af9888c01639cdbe11907/FC26_FUT-Featured-Image_16x9.jpg?im=AspectCrop=(16,9),xPosition=0.2,yPosition=0.1736111111111111;Resize=(2560)&q=80"
    },
    {
      title: "IMMERSIVE MASTER LEAGUE REVOLUTION",
      desc: "Rasakan sensasi menjadi manajer seutuhnya dengan perombakan total pada mode legendaris Master League. Cutscene emosional baru, sistem ekonomi dinamis, dan grafis ruang konferensi pers interaktif memberikan lapisan kedalaman karir yang tak tertandingi.",
      image: "https://drop-assets.ea.com/images/2OiswZIkuSnHFY7fLFQezL/95ef5c5101cd4ecbbe672def1f6d9fe6/FC26_Rev_LuisHenrique_Careers_16x9.jpg?im=AspectCrop=(16,9),xPosition=0.5,yPosition=0.5;Resize=(2560)&q=80"
    },
    {
      title: "REAL-TIME SERVER CLOUD FIXES & SYNC",
      desc: "Launcher secara cerdas melacak pembaruan dari server cloud pribadi kami. Dapatkan perbaikan bug krusial, database mingguan, wajah pemain spontan, serta fitur eksperimental secara sekejap matap tanpa perlu direpotkan dengan mengunduh file patch raksasa.",
      image: "https://drop-assets.ea.com/images/2KVQq4lSBcPUJct6DEjdic/c06c2dc0e4ffc9a213fd1e8d8a7c2e72/FC26_Rev_Stadium_Clubs_16x9.jpg?im=AspectCrop=(16,9),xPosition=0.5,yPosition=0.5;Resize=(2560)&q=80"
    }
  ];

  return (
    <div style={{ padding: '60px 5% 80px', minHeight: '80vh', maxWidth: 1400, margin: '0 auto' }}>
      
      {/* 🌟 New Dynamic Slider Hero Section 🌟 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '60px', 
        marginBottom: '100px',
        flexWrap: 'wrap' 
      }}>
        {/* Left Side: Animated Text Overlay */}
        <div style={{ flex: '1 1 400px', padding: '20px 0' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 900, 
            marginBottom: '24px', 
            lineHeight: 1.1,
            textTransform: 'uppercase',
            color: '#fff',
            transition: 'opacity 0.5s'
          }}>
            {slides[currentSlide].title}
          </h1>
          <p style={{ 
            color: '#ccc', 
            fontSize: '1.2rem', 
            lineHeight: 1.6, 
            marginBottom: '40px',
            maxWidth: '90%'
          }}>
            {slides[currentSlide].desc}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                style={{ 
                  width: '50px', 
                  height: '4px', 
                  background: currentSlide === idx ? '#1bf679' : '#333',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Right Side: Crossfading Hero Images */}
        <div style={{ 
          flex: '1.5 1 500px', 
          position: 'relative', 
          aspectRatio: '16/9', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}>
          {slides.map((slide, idx) => (
            <img 
              key={idx}
              src={slide.image}
              alt={slide.title}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: currentSlide === idx ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: currentSlide === idx ? 2 : 1
              }}
            />
          ))}
        </div>
      </div>

      {/* 🌟 Grid Feature Section 🌟 */}
      <h2 style={{ 
        fontSize: '1.4rem', 
        fontWeight: 900, 
        marginBottom: '60px', 
        textAlign: 'center',
        letterSpacing: '1px',
        color: '#fff'
      }}>
        EA SPORTS FC™ 26 Features
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '40px 32px' 
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              width: '100%', 
              aspectRatio: '16/9', 
              borderRadius: '6px', 
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              background: '#222'
            }}>
              <img 
                src={f.image} 
                alt={f.title} 
                className="hover-zoom"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover', 
                  transition: 'transform 0.5s ease'
                }} 
              />
            </div>
            <div style={{ padding: '4px 0' }}>
              <h3 style={{ 
                fontSize: '1.15rem', 
                fontWeight: 900, 
                marginBottom: '12px', 
                lineHeight: 1.3,
                color: '#fff',
                textTransform: 'uppercase'
              }}>
                {f.title}
              </h3>
              <p style={{ 
                color: '#e0e0e0', 
                fontSize: '0.95rem', 
                lineHeight: 1.6,
                fontWeight: 400
              }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html:`
        .hover-zoom:hover {
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
}
