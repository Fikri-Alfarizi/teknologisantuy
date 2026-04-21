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
            
            --don-border: 4px solid var(--don-on-surf);
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
            padding-top: 2rem;
            isolation: isolate;
        }

        /* Scope typography strictly to avoid hitting icons */
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
            font-size: 24px;
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
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
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
            padding: 1.25rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            box-shadow: 0 4px 0px 0px var(--don-on-surf);
        }

        .donasi-main-content {
            flex: 1;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            max-width: 1280px;
            margin: 0 auto;
            width: 100%;
        }

        .donasi-card {
            border: var(--don-border);
            border-radius: var(--don-rd-lg);
            padding: 1.5rem;
            background-color: var(--don-surf);
            box-shadow: 4px 4px 0px 0px var(--don-on-surf);
        }

        .bg-surface-low { background-color: var(--don-surf-low); }
        .bg-surface-highest { background-color: var(--don-surf-high); }

        .donasi-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            font-weight: 800;
            transition: all 0.2s;
            border: var(--don-border);
            box-shadow: 4px 4px 0px 0px var(--don-on-surf);
            text-transform: uppercase;
        }
        .donasi-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px 0px var(--don-on-surf);
        }

        .donasi-btn-primary {
            background-color: var(--don-primary);
            color: var(--don-on-primary) !important;
            border-radius: var(--don-rd-full);
            padding: 0.75rem 2rem;
        }

        .donasi-avatar {
            border-radius: var(--don-rd-full);
            border: var(--don-border);
            object-fit: cover;
        }

        .progress-wrapper {
            width: 100%;
            max-width: 48rem;
            flex: 1;
        }
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 0.75rem;
        }
        .progress-track {
            width: 100%;
            background-color: var(--don-surf-lowest);
            border: var(--don-border);
            border-radius: var(--don-rd-full);
            height: 1.75rem;
            overflow: hidden;
        }
        .progress-fill {
            background: linear-gradient(to right, var(--don-primary), var(--don-primary-dim));
            height: 100%;
            border-right: var(--don-border);
            border-radius: 0 var(--don-rd-full) var(--don-rd-full) 0;
            transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .video-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .video-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        
        .feed-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 600px;
        }
        .feed-list {
            flex: 1;
            overflow-y: auto;
            padding-right: 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-height: 1400px;
        }
        
        .donation-item {
            background-color: var(--don-surf-lowest);
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            padding: 1.5rem;
            box-shadow: 6px 6px 0px 0px var(--don-on-surf);
            transition: transform 0.2s;
        }
        .donation-item:hover { transform: translateY(-2px); }

        .donor-info {
            display: flex;
            align-items: center;
            gap: 1.25rem;
        }
        
        .social-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .social-link-card {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            padding: 1rem 1.25rem;
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            background-color: var(--don-surf-lowest);
            box-shadow: 4px 4px 0px 0px var(--don-on-surf);
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }
        .social-link-card:hover { 
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px 0px var(--don-on-surf);
        }
        .social-icon-box {
            width: 48px;
            height: 48px;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: var(--don-border);
            flex-shrink: 0;
            color: white !important;
            font-size: 1.5rem;
        }
        .social-youtube .social-icon-box { background-color: #FF0000; }
        .social-discord .social-icon-box { background-color: #5865F2; }

        .meme-panel {
            background-color: var(--don-ter-cont);
            text-align: center;
            box-shadow: 8px 8px 0px 0px var(--don-on-surf);
        }

        @media (min-width: 768px) {
            .sticky-progress { flex-direction: row; }
            .video-grid { grid-template-columns: repeat(2, 1fr); }
            .social-grid { flex-direction: row; }
            .social-link-card { flex: 1; }
        }

        @media (min-width: 1024px) {
            .donasi-main-content { flex-direction: row; }
            .column-left { width: 70%; display: flex; flex-direction: column; gap: 2rem; }
            .column-right { width: 30%; display: flex; flex-direction: column; gap: 2rem; }
        }
      `}} />

      {seedStatus && (
          <div style={{ backgroundColor: 'var(--don-primary)', color: 'white', padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', zIndex: 100, borderBottom: 'var(--don-border)' }}>
              <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>info</span>
              {seedStatus}
          </div>
      )}

      <div className="sticky-progress">
          <div className="progress-wrapper">
              <div className="progress-header">
                  <h1 className="font-headline text-2xl font-extrabold uppercase tracking-tight">Target Server Maintenance</h1>
                  <span className="font-extrabold text-primary text-xl">Rp {totalAmount.toLocaleString()} <span style={{ color: 'var(--don-out)', fontSize: '0.8rem' }}>/ Rp {targetGoal.toLocaleString()}</span></span>
              </div>
              <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
          </div>
          <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="donasi-btn donasi-btn-primary">
              <span className="material-symbols-outlined">volunteer_activism</span> Sawer Sekarang
          </a>
      </div>

      <main className="donasi-main-content">
          <div className="column-left">
              {/* VIDEO SECTION */}
              {videoDonations.length > 0 && (
                <section className="donasi-card bg-surface-low">
                    <div className="video-header">
                        <h2 className="font-headline text-3xl font-extrabold uppercase">Video Teranyar</h2>
                        <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="text-primary font-extrabold text-sm flex items-center gap-1">
                            MAU VIDEO ANDA DI SINI? <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    
                    <div className="video-grid">
                        {videoDonations.slice(0, 4).map(v => (
                          <div className="donasi-card" style={{ padding: 0, overflow: 'hidden' }} key={`vid-${v.id}`}>
                              <div style={{ aspectRatio: '16/9', background: '#000' }}>
                                  <iframe src={`https://www.youtube.com/embed/${v.videoId}`} frameBorder="0" allowFullScreen style={{ width: '100%', height: '100%' }} title={v.name}></iframe>
                              </div>
                              <div style={{ padding: '1rem', borderTop: 'var(--don-border)' }}>
                                  <h3 className="font-extrabold text-sm uppercase">Donatur: {v.name}</h3>
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
                      <h2 className="font-headline text-3xl font-extrabold uppercase" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span className="ping-dot">
                              <span className="ping-dot-inner" style={{ animation: 'ping 1.5s infinite' }}></span>
                          </span>
                          Support Feed
                      </h2>
                      <div style={{ padding: '0.5rem 1rem', border: 'var(--don-border)', borderRadius: 'var(--don-rd-full)', backgroundColor: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>
                          REAL-TIME
                      </div>
                  </div>

                  <div className="feed-list">
                      {loading ? (
                        <div className="text-center py-20 text-outline animate-pulse font-extrabold text-xl">HARAP TUNGGU...</div>
                      ) : supporters.length === 0 ? (
                        <div className="text-center py-20 text-outline font-extrabold bg-don-surf-low rounded-xl border-dashed border-4 border-don-out-var uppercase">Belum ada donasi hari ini.</div>
                      ) : (
                        displaySupporters.map(s => (
                          <div className="donation-item" key={s.id}>
                              <div className="donor-header">
                                  <div className="donor-info">
                                      <div className="donasi-avatar" style={{ width: '56px', height: '56px', backgroundColor: 'var(--don-pri-cont)', color: 'var(--don-on-pri-cont)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.5rem' }}>
                                          {s.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                              <h4 className="font-extrabold text-xl">{s.name}</h4>
                                              {s.amount >= 50000 && <span className="donor-badge" style={{ padding: '2px 10px', fontSize: '11px' }}>SULTAN</span>}
                                          </div>
                                          <p className="text-lg font-extrabold text-primary">Rp {s.amount.toLocaleString()}</p>
                                      </div>
                                  </div>
                                  <span className="text-xs text-outline font-bold uppercase">{s.formattedDate}</span>
                              </div>
                              
                              {s.message && (
                                <div className="donation-message" style={{ margin: '1.25rem 0' }}>
                                    <p style={{ fontWeight: 600 }}>"{s.message}"</p>
                                </div>
                              )}
  
                              <div className="interaction-row">
                                  <button className="interaction-btn" onClick={() => setActiveCommentId(activeCommentId === s.id ? null : s.id)} style={{ border: 'var(--don-border)', padding: '4px 12px', borderRadius: 'var(--don-rd-full)', backgroundColor: 'var(--don-surf-low)' }}>
                                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat_bubble</span> 
                                      {comments[s.id]?.length || 0} KOMENTAR
                                  </button>
                              </div>
  
                              <AnimatePresence>
                                {activeCommentId === s.id && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="comment-section" style={{ overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                      {comments[s.id]?.map(c => (
                                        <div key={c.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                          <img src={c.photoURL} alt="" className="donasi-avatar" style={{ width: '36px', height: '36px' }} />
                                          <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--don-surf-low)', borderRadius: '1rem', border: 'var(--don-border)', fontSize: '0.9rem', flex: 1, boxShadow: '2px 2px 0px 0px var(--don-on-surf)' }}>
                                            <strong className="text-primary">{c.name}</strong>: {c.text}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="comment-input-row">
                                      <input 
                                        className="comment-input" 
                                        placeholder={user ? "KETIK KOMENTAR..." : "LOGIN UNTUK KOMEN"} 
                                        value={newComment}
                                        disabled={!user}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(s.id)}
                                      />
                                      {user && (
                                        <button className="donasi-btn donasi-btn-primary" style={{ padding: '0.5rem', minWidth: '48px', minHeight: '48px', borderRadius: 'var(--don-rd-full)' }} onClick={() => handleSendComment(s.id)}>
                                          <span className="material-symbols-outlined">send</span>
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                          </div>
                        ))
                      )}
                  </div>
              </section>
          </div>

          <div className="column-right">
              {/* TOP SUPPORTERS SECTION */}
              <section className="donasi-card bg-surface-highest">
                  <h3 className="font-headline text-2xl font-extrabold uppercase mb-6 flex items-center gap-3">
                      <span className="material-symbols-outlined" style={{ color: 'var(--don-ter)', fontVariationSettings: "'FILL' 1", fontSize: '32px' }}>workspace_premium</span>
                      Supporter Terbaik
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {topSupporters.map((ts, idx) => (
                        <div className="supporter-row" key={`ts-${idx}`} style={{ padding: '0.75rem 1rem' }}>
                            <div className="font-extrabold text-2xl" style={{ color: 'var(--don-out-var)', width: '32px' }}>#{idx + 1}</div>
                            <div className="donasi-avatar" style={{ width: '44px', height: '44px', backgroundColor: idx === 0 ? 'var(--don-primary)' : 'var(--don-pri-cont)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                              {ts.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 className="font-extrabold text-sm uppercase">{ts.name}</h4>
                                <p className="font-extrabold text-primary">Rp {ts.amount.toLocaleString()}</p>
                            </div>
                        </div>
                      ))}
                  </div>
              </section>

              {/* SOCIAL SECTION - IMPROVED "PAS" UI */}
              <section className="donasi-card bg-surface-low">
                  <h3 className="font-headline text-xl font-extrabold uppercase">Lainnya</h3>
                  <div className="social-grid">
                      <a href="https://www.youtube.com/@TeknologiSantuy" target="_blank" rel="noopener noreferrer" className="social-link-card social-youtube">
                          <div className="social-icon-box">
                              <i className="fa-brands fa-youtube"></i>
                          </div>
                          <div>
                              <div className="font-extrabold text-sm uppercase">YouTube</div>
                              <div className="text-outline text-xs font-bold">SUBSCRIBE</div>
                          </div>
                      </a>
                      <a href="https://discord.gg/dJzbq53jXH" target="_blank" rel="noopener noreferrer" className="social-link-card social-discord">
                          <div className="social-icon-box">
                              <i className="fa-brands fa-discord"></i>
                          </div>
                          <div>
                              <div className="font-extrabold text-sm uppercase">Discord</div>
                              <div className="text-outline text-xs font-bold">GABUNG</div>
                          </div>
                      </a>
                  </div>
              </section>

              {/* MEME SECTION */}
              <section className="donasi-card meme-panel">
                  <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: 'white', border: 'var(--don-border)', borderRadius: 'var(--don-rd-md)', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
                      <img alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjZ6NXA2ZzVnbmU0ZzVnbmU0ZzVnbmU0ZzVnbmU0ZzVnbmU0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif"/>
                  </div>
                  <h4 className="font-headline font-extrabold text-xl uppercase" style={{ color: 'var(--don-on-ter-cont)' }}>"Siap Melayani!"</h4>
                  <p className="font-extrabold text-sm mt-1" style={{ opacity: 0.9 }}>MAKASIH ORANG BAIK! 🐱</p>
              </section>
          </div>
      </main>

      <div className="fab-mobile">
          <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="donasi-btn donasi-btn-primary">
              <span className="material-symbols-outlined">volunteer_activism</span> SAWER
          </a>
      </div>

      <AnimatePresence>
        {showAlert && currentAlert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}></div>
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 1.2, opacity: 0 }} className="donasi-card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 10, backgroundColor: 'white', padding: '2rem' }}>
              <div style={{ height: '240px', width: '100%', marginBottom: '1.5rem', borderRadius: 'var(--don-rd-md)', overflow: 'hidden', border: 'var(--don-border)' }}>
                <img src={currentAlert.meme} alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h2 className="font-headline text-3xl font-extrabold text-primary mb-3 uppercase tracking-tighter">{currentAlert.name} MENGIRIM SAWERAN!</h2>
              <div className="donasi-btn-primary font-extrabold text-3xl mb-6" style={{ display: 'inline-block', borderRadius: 'var(--don-rd-md)', padding: '0.75rem 2rem' }}>Rp {currentAlert.amount.toLocaleString()}</div>
              {currentAlert.message && (
                <div style={{ backgroundColor: 'var(--don-surf-low)', padding: '1.25rem', borderRadius: 'var(--don-rd-md)', border: 'var(--don-border)', fontWeight: 800, fontStyle: 'italic', fontSize: '1.125rem' }}>
                    "{currentAlert.message}"
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} preload="auto"><source src={ALERT_SOUND_URL} type="audio/mpeg" /></audio>
    </div>
  );
}
