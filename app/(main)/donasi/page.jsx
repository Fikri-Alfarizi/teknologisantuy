"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  Timestamp,
  getDocs,
  where
} from 'firebase/firestore';

const ALERT_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3";

const MEME_LIST = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJieHBobHh3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3cmVudmUmc2lkPWc/l0Hlx0N5lh6U/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJieHBobHh3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3cmVudmUmc2lkPWc/3o7abKhOpu0N82FmXC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamR6N3ZqY2E5ZzB6Z3ZqY2E5ZzB6Z3ZqY2E5ZzB6Z3ZqY2E5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif",
  "https://api.memegen.link/images/custom/_/ANTAP_MANTAP.png?background=https://i.imgflip.com/4/30t1mt.jpg",
];

const HISTORICAL_DONATIONS = [
  { name: "JOKOWISAYANGPRABOWO", amount: 10000, message: "semangat mimin", date: "2026-04-21T13:14:00" },
  { name: "Fahri", amount: 1000, message: "Beli", date: "2026-04-05T00:00:00" },
  { name: "Kolane_958", amount: 5000, message: "Mimin :) req:Space flight sim", date: "2025-10-09T00:00:00" },
  { name: "Kolane_958", amount: 10000, message: "kalau bisa cepetin up nya hehe", date: "2025-09-30T00:00:00" },
  { name: "Kolane_958", amount: 10000, message: "Req hello neighbor yang full ya mimin yang baik hati", date: "2025-09-28T00:00:00" },
  { name: "Agus lagi", amount: 15000, message: "Itu batlefield 4 nya jangan kasih ggl drive bang gw gak bisa dwonload, kasih link kyk meongclub ajh. request utama:WALPAPER ENGINE!!!👌", date: "2025-08-22T00:00:00" },
  { name: "Agus", amount: 20000, message: "Request game ini bang https://vt.tiktok.com/ZSSTCC9eT/", date: "2025-08-14T00:00:00" },
  { name: "dinky puppy", amount: 10000, message: "makasih miminnn btw forza ada kah xixixi", date: "2025-08-06T00:00:00" },
  { name: "Dinkypupy", amount: 10000, message: "Req game MOTOGP dong om:*", date: "2025-08-02T00:00:00" },
  { name: "Fauzi", amount: 1000, message: "Min bisa req Spongebob the cosmic shake", date: "2025-07-30T00:00:00" },
  { name: "escanor.", amount: 1000, message: "makasih ya bang , ini hari pertama", date: "2025-07-16T00:00:00" },
  { name: "klara", amount: 15000, message: "miminnnnnn, mau game haremmmm donggg 😋😭😭😭😭😊😊😊", date: "2025-07-06T00:00:00" },
  { name: "kiki", amount: 1000, message: "sukses", date: "2025-06-18T00:00:00" },
  { name: "Zainal", amount: 15000, message: "Ditunggu bang kiriman kode email untuk game DMC 5", date: "2025-06-07T00:00:00" },
  { name: "Fauzi", amount: 2000, message: "Semangat:)", date: "2025-05-21T00:00:00" },
  { name: "Fwyd", amount: 10000, message: "bg mau nanya, pas install pes 2016 muncul \".Net framework not occur\" cara mengatasinya gmn bg, terus usb nya ga kebaca jg", date: "2025-04-08T00:00:00" },
  { name: "salis", amount: 10000, message: "izin download game devil my cry 5 bang entar kalau bisa gw kirim lagi 20k", date: "2024-11-28T00:00:00" },
  { name: "Rafal", amount: 1000, message: "Halo", date: "2024-07-21T00:00:00" },
];

const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function DonasiPage() {
  const { user, userProfile } = useAuth();
  const [supporters, setSupporters] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seedStatus, setSeedStatus] = useState(null);
  
  const targetGoal = 150000;
  
  const audioRef = useRef(null);
  const isInitialLoad = useRef(true);
  const mountTime = useRef(Timestamp.now());

  const displaySupporters = supporters;
  const totalAmount = supporters.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const progressPercent = Math.min((totalAmount / targetGoal) * 100, 100);
  
  const videoDonations = displaySupporters.filter(s => s.videoId);
  const topSupporters = [...displaySupporters].sort((a,b) => b.amount - a.amount).slice(0, 3);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('seed') === 'true' && user) {
      handleSeedHistory();
    }
  }, [user]);

  const handleSeedHistory = async () => {
    setSeedStatus("Migrasi data saweran sedang berjalan...");
    let count = 0;
    try {
      const q = query(collection(db, 'donations'), where('source', '==', 'migration'), limit(1));
      const existing = await getDocs(q);
      if (!existing.empty) {
          setSeedStatus("Data history sudah ada sebelumnya. Migrasi dibatalkan.");
          return;
      }

      for (const don of HISTORICAL_DONATIONS) {
        await addDoc(collection(db, 'donations'), {
          name: don.name,
          amount: don.amount,
          message: don.message,
          timestamp: Timestamp.fromDate(new Date(don.date)),
          processed: true,
          source: 'migration'
        });
        count++;
      }
      setSeedStatus(`Sukses! ${count} data saweran lama berhasil dimuat.`);
    } catch (err) {
      console.error(err);
      setSeedStatus("Gagal memuat data: " + err.message);
    }
  };

  useEffect(() => {
    const qDonations = query(collection(db, 'donations'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribeDonations = onSnapshot(qDonations, (snapshot) => {
      const donationData = snapshot.docs.map(doc => {
        const data = doc.data();
        const msg = data.message || "";
        const ytId = getYoutubeId(msg);
        return {
          id: doc.id, ...data,
          formattedDate: data.timestamp?.toDate().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) || 'Baru',
          videoId: ytId
        };
      });
      setSupporters(donationData);
      setLoading(false);
      
      if (!isInitialLoad.current && snapshot.docChanges().length > 0) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" && change.doc.data().timestamp?.seconds > mountTime.current.seconds) {
            triggerCelebration({
              name: change.doc.data().name,
              amount: change.doc.data().amount,
              message: change.doc.data().message,
              meme: MEME_LIST[Math.floor(Math.random() * MEME_LIST.length)]
            });
          }
        });
      }
      isInitialLoad.current = false;
    });

    const qComments = query(collection(db, 'donation_comments'), orderBy('timestamp', 'asc'));
    const unsubscribeComments = onSnapshot(qComments, (snapshot) => {
      const commentMap = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!commentMap[data.donationId]) commentMap[data.donationId] = [];
        commentMap[data.donationId].push({ id: doc.id, ...data });
      });
      setComments(commentMap);
    });

    return () => { unsubscribeDonations(); unsubscribeComments(); };
  }, []);

  const triggerCelebration = (supporter) => {
    setCurrentAlert(supporter); setShowAlert(true);
    if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}); }
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setShowAlert(false), 6000);
  };

  const handleSendComment = async (donationId) => {
    if (!user) return alert("Silakan login untuk berkomentar!");
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, 'donation_comments'), {
        donationId, uid: user.uid, name: userProfile?.displayName || user.displayName || "User",
        photoURL: userProfile?.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${user.uid}`,
        text: newComment, timestamp: serverTimestamp()
      });
      setNewComment(""); setActiveCommentId(null);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="donation-dashboard">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Manrope:wght@200..800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        .donation-dashboard {
            --don-bg: #f5f6ff;
            --don-on-surf: #282f3f;
            --don-primary: #0057bd;
            --don-primary-dim: #004ca6;
            --don-on-primary: #f0f2ff;
            --don-pri-cont: #6e9fff;
            --don-on-pri-cont: #002150;
            --don-sec: #3a53b7;
            --don-sec-dim: #2c47ab;
            --don-on-sec: #f2f1ff;
            --don-sec-cont: #c7cfff;
            --don-on-sec-cont: #223ea2;
            --don-ter: #893c92;
            --don-ter-cont: #f199f7;
            --don-on-ter-cont: #5e106a;
            --don-surf: #f5f6ff;
            --don-surf-var: #d3dcf9;
            --don-surf-low: #edf0ff;
            --don-surf-high: #d3dcf9;
            --don-surf-lowest: #ffffff;
            --don-err: #b31b25;
            --don-out: #707789;
            --don-out-var: #a6adc1;

            --don-headline: 'Space Grotesk', sans-serif;
            --don-body: 'Manrope', sans-serif;
            
            --don-border: 2px solid var(--don-on-surf);
            --don-rd-md: 0.5rem;
            --don-rd-lg: 1rem;
            --don-rd-xl: 1.5rem;
            --don-rd-full: 9999px;

            background-color: var(--don-bg);
            color: var(--don-on-surf);
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            position: relative;
            isolation: isolate;
        }

        .donation-dashboard p, 
        .donation-dashboard span:not(.material-symbols-outlined):not([class*="fa-"]), 
        .donation-dashboard div:not(.material-symbols-outlined):not([class*="fa-"]),
        .donation-dashboard h1, .donation-dashboard h2, .donation-dashboard h3, .donation-dashboard h4 {
            font-family: var(--don-body);
        }

        .donation-dashboard .material-symbols-outlined {
            font-family: 'Material Symbols Outlined' !important;
            font-weight: normal !important;
            font-style: normal !important;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }

        .donation-dashboard i[class*="fa-"] {
            font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands" !important;
            font-weight: 900 !important;
            font-style: normal !important;
            display: inline-block;
        }

        .donation-dashboard a { text-decoration: none; color: inherit; }
        .donation-dashboard button { cursor: pointer; border: none; background: none; color: inherit; }
        
        .donation-dashboard .font-headline { font-family: var(--don-headline) !important; }
        .donation-dashboard .text-primary { color: var(--don-primary); }
        .donation-dashboard .text-outline { color: var(--don-out); }
        .donation-dashboard .font-bold { font-weight: 700; }
        .donation-dashboard .font-extrabold { font-weight: 800; }
        .donation-dashboard .text-xs { font-size: 0.75rem; }
        .donation-dashboard .text-sm { font-size: 0.875rem; }
        .donation-dashboard .text-lg { font-size: 1.125rem; }
        .donation-dashboard .text-xl { font-size: 1.25rem; }
        .donation-dashboard .text-2xl { font-size: 1.5rem; }
        .donation-dashboard .text-3xl { font-size: 1.875rem; }

        .sticky-progress {
            position: sticky;
            top: 0; 
            z-index: 30;
            background-color: var(--don-surf-low);
            border: var(--don-border);
            border-left: none; border-right: none;
            padding: 0.75rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .donasi-main-content {
            flex: 1;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-width: 1280px;
            margin: 0 auto;
            width: 100%;
        }

        .donasi-card {
            border: var(--don-border);
            border-radius: var(--don-rd-lg);
            padding: 1.25rem;
            background-color: var(--don-surf);
            box-shadow: 4px 4px 0px 0px var(--don-on-surf);
        }

        .donasi-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-weight: 700;
            transition: all 0.2s;
            border: var(--don-border);
        }

        .donasi-btn-primary {
            background-color: var(--don-primary);
            color: var(--don-on-primary) !important;
            border-radius: var(--don-rd-full);
            padding: 0.5rem 1.5rem;
        }

        .donasi-avatar {
            border-radius: var(--don-rd-full);
            border: var(--don-border);
            object-fit: cover;
        }

        .progress-wrapper {
            width: 100%;
            flex: 1;
        }
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .progress-track {
            width: 100%;
            background-color: var(--don-surf-lowest);
            border: var(--don-border);
            border-radius: var(--don-rd-full);
            height: 1rem;
            overflow: hidden;
        }
        .progress-fill {
            background: linear-gradient(to right, var(--don-primary), var(--don-primary-dim));
            height: 100%;
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feed-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .feed-list {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }
        
        .donation-item {
            background-color: var(--don-surf-lowest);
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .donor-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .donor-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .interaction-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            border-top: 1px solid var(--don-surf-var);
            padding-top: 0.75rem;
        }
        
        .social-grid {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1rem;
        }
        .social-btn {
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            padding: 0.75rem 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            color: white !important;
            transition: all 0.2s;
            width: 100%;
            font-size: 1rem;
            font-weight: 700;
        }
        .social-btn i { font-size: 1.5rem; }
        .social-btn:active { transform: scale(0.95); }
        .social-youtube { background-color: #FF0000; box-shadow: 4px 4px 0px 0px #8B0000; }
        .social-discord { background-color: #5865F2; box-shadow: 4px 4px 0px 0px #2D348F; }
        
        .fab-mobile {
            position: fixed;
            bottom: 1.5rem;
            right: 1rem;
            left: 1rem;
            z-index: 50;
        }
        .fab-btn {
            background-color: var(--don-primary);
            color: var(--don-on-primary) !important;
            border-radius: var(--don-rd-md);
            padding: 1rem;
            font-weight: bold;
            font-size: 1.1rem;
            border: var(--don-border);
            box-shadow: 4px 4px 0px 0px var(--don-on-surf);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
        }

        @media (min-width: 640px) {
            .social-grid { flex-direction: row; }
            .social-btn { flex: 1; }
        }

        @media (min-width: 768px) {
            .sticky-progress { flex-direction: row; padding: 1rem 1.5rem; }
            .progress-track { height: 1.5rem; }
            .donasi-main-content { padding: 1.5rem; }
            .fab-mobile { display: none; }
        }

        @media (min-width: 1024px) {
            .donasi-main-content { flex-direction: row; align-items: flex-start; }
            .column-left { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
            .column-right { width: 350px; display: flex; flex-direction: column; gap: 1.5rem; position: sticky; top: 6rem; }
        }
      `}} />

      {seedStatus && (
          <div style={{ backgroundColor: 'var(--don-primary)', color: 'white', padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', zIndex: 100, borderBottom: 'var(--don-border)' }}>
              ℹ️ {seedStatus}
          </div>
      )}

      <div className="sticky-progress">
          <div className="progress-wrapper">
              <div className="progress-header">
                  <h1 className="font-headline text-lg md:text-xl font-bold">Target Server</h1>
                  <span className="font-bold text-primary text-sm md:text-base">Rp {totalAmount.toLocaleString()} / Rp {targetGoal.toLocaleString()}</span>
              </div>
              <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
          </div>
          <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="donasi-btn donasi-btn-primary font-bold hidden md:flex">
              <span className="material-symbols-outlined">volunteer_activism</span> Donasi Sekarang
          </a>
      </div>

      <main className="donasi-main-content">
          <div className="column-left">
              {/* VIDEO SECTION */}
              {videoDonations.length > 0 && (
                <section className="donasi-card bg-surface-low" style={{ padding: '1rem' }}>
                    <div className="video-header" style={{ marginBottom: '1rem' }}>
                        <h2 className="font-headline text-xl md:text-2xl font-extrabold">Video Donatur</h2>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {videoDonations.slice(0, 4).map(v => (
                          <div key={`vid-${v.id}`} style={{ border: 'var(--don-border)', borderRadius: 'var(--don-rd-md)', overflow: 'hidden', backgroundColor: 'white' }}>
                              <div style={{ aspectRatio: '16/9', backgroundColor: '#000' }}>
                                  <iframe src={`https://www.youtube.com/embed/${v.videoId}`} width="100%" height="100%" frameBorder="0" allowFullScreen title={v.name}></iframe>
                              </div>
                              <div style={{ padding: '0.75rem' }}>
                                  <h3 className="font-bold text-sm">Sawer dari {v.name}</h3>
                                  <p className="text-xs text-outline">{v.formattedDate}</p>
                              </div>
                          </div>
                        ))}
                    </div>
                </section>
              )}

              {/* LIVE FEED SECTION */}
              <section className="donasi-card bg-surface-low feed-container">
                  <div className="video-header">
                      <h2 className="font-headline text-xl md:text-2xl font-extrabold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="ping-dot"><span className="ping-dot-inner"></span></span>
                          Live Feed
                      </h2>
                  </div>

                  <div className="feed-list">
                      {loading ? (
                        <div className="text-center py-10 text-outline animate-pulse font-bold">Memuat data donasi...</div>
                      ) : supporters.length === 0 ? (
                        <div className="text-center py-10 text-outline font-bold bg-don-surf-low rounded-xl border-dashed border-2 border-don-out-var">Belum ada donasi. Jadi yang pertama! 😊</div>
                      ) : (
                        displaySupporters.map(s => (
                          <div className="donation-item" key={s.id}>
                              <div className="donor-header">
                                  <div className="donor-info">
                                      <div className="donasi-avatar" style={{ width: '42px', height: '42px', backgroundColor: 'var(--don-pri-cont)', color: 'var(--don-on-pri-cont)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                          {s.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-base">{s.name}</h4>
                                          <p className="text-xs font-bold text-primary">Rp {s.amount.toLocaleString()}</p>
                                      </div>
                                  </div>
                                  <span className="text-[10px] text-outline font-bold">{s.formattedDate}</span>
                              </div>
                              
                              {s.message && (
                                <div className="donation-message" style={{ margin: 0, padding: '0.5rem 0.75rem' }}>
                                    <p className="text-sm">"{s.message}"</p>
                                </div>
                              )}
  
                              <div className="interaction-row">
                                  <button className="interaction-btn" onClick={() => setActiveCommentId(activeCommentId === s.id ? null : s.id)}>
                                      <span className="material-symbols-outlined text-base">chat_bubble</span> 
                                      <span className="text-xs font-bold">{comments[s.id]?.length || 0} Balasan</span>
                                  </button>
                              </div>
  
                              {activeCommentId === s.id && (
                                <div className="comment-section" style={{ borderTop: 'none', marginTop: 0 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {comments[s.id]?.map(c => (
                                      <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                        <img src={c.photoURL} alt="" className="donasi-avatar" style={{ width: '28px', height: '28px' }} />
                                        <div style={{ padding: '0.5rem', backgroundColor: 'var(--don-surf-low)', borderRadius: '0.5rem', border: 'var(--don-border)', fontSize: '0.75rem', flex: 1 }}>
                                          <strong className="text-primary">{c.name}</strong>: {c.text}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="comment-input-row">
                                    <input 
                                      className="comment-input" 
                                      placeholder={user ? "Balas..." : "Login untuk membalas"} 
                                      value={newComment}
                                      disabled={!user}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(s.id)}
                                    />
                                    {user && (
                                      <button className="donasi-btn donasi-btn-primary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleSendComment(s.id)}>
                                        <span className="material-symbols-outlined text-sm">send</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        ))
                      )}
                  </div>
              </section>
          </div>

          <div className="column-right">
              {/* TOP SUPPORTERS SECTION */}
              <section className="donasi-card bg-surface-highest">
                  <h3 className="font-headline text-lg font-bold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--don-ter)', fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      Top Supporters
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {topSupporters.map((ts, idx) => (
                        <div className="supporter-row" style={{ padding: '0.35rem 0.75rem', margin: 0 }} key={`ts-${idx}`}>
                            <div className="font-bold text-base" style={{ color: 'var(--don-out-var)', width: '20px' }}>{idx + 1}</div>
                            <div className="donasi-avatar" style={{ width: '32px', height: '32px', backgroundColor: idx === 0 ? 'var(--don-primary)' : 'var(--don-pri-cont)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                              {ts.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 className="font-bold text-xs">{ts.name}</h4>
                                <p className="text-[10px] text-primary font-bold">Rp {ts.amount.toLocaleString()}</p>
                            </div>
                        </div>
                      ))}
                  </div>
              </section>

              {/* SOCIAL SECTION */}
              <section className="donasi-card bg-surface-low">
                  <h3 className="font-headline text-lg font-bold">Dukungan Lainnya</h3>
                  <div className="social-grid">
                      <a href="https://www.youtube.com/@TeknologiSantuy" target="_blank" rel="noopener noreferrer" className="social-btn social-youtube">
                          <i className="fa-brands fa-youtube"></i>
                          <span>Subscribe</span>
                      </a>
                      <a href="https://discord.gg/dJzbq53jXH" target="_blank" rel="noopener noreferrer" className="social-btn social-discord">
                          <i className="fa-brands fa-discord"></i>
                          <span>Join Discord</span>
                      </a>
                  </div>
              </section>

              {/* MEME SECTION */}
              <section className="donasi-card meme-panel" style={{ padding: '1rem' }}>
                  <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: 'white', border: 'var(--don-border)', borderRadius: 'var(--don-rd-md)', marginBottom: '0.75rem', overflow: 'hidden' }}>
                      <img alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjZ6NXA2ZzVnbmU0ZzVnbmU0ZzVnbmU0ZzVnbmU0ZzVnbmU0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif"/>
                  </div>
                  <h4 className="font-headline font-bold text-base" style={{ color: 'var(--don-on-ter-cont)' }}>"Target Tercapai 100%"</h4>
                  <p className="text-[10px] mt-1 font-bold" style={{ opacity: 0.8 }}>Terima kasih orang baik! 🐱</p>
              </section>
          </div>
      </main>

      <div className="fab-mobile">
          <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="fab-btn">
              <span className="material-symbols-outlined">volunteer_activism</span>
              Sawer Sekarang
          </a>
      </div>

      <AnimatePresence>
        {showAlert && currentAlert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}></div>
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 1.2, opacity: 0 }} className="donasi-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 10, backgroundColor: 'white' }}>
              <div style={{ height: '200px', width: '100%', marginBottom: '1rem', borderRadius: 'var(--don-rd-md)', overflow: 'hidden', border: 'var(--don-border)' }}>
                <img src={currentAlert.meme} alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h2 className="font-headline text-xl font-extrabold text-primary mb-2 uppercase">{currentAlert.name} MANTAP!</h2>
              <div className="donasi-btn-primary font-bold text-xl mb-4" style={{ display: 'inline-block', borderRadius: 'var(--don-rd-md)', padding: '0.4rem 1.2rem' }}>Rp {currentAlert.amount.toLocaleString()}</div>
              <p className="font-bold italic text-outline text-sm" style={{ backgroundColor: 'var(--don-surf-low)', padding: '0.75rem', borderRadius: 'var(--don-rd-md)', border: 'var(--don-border)' }}>
                "{currentAlert.message}"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} preload="auto"><source src={ALERT_SOUND_URL} type="audio/mpeg" /></audio>
    </div>
  );
}
