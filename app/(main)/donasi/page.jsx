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
            padding: 1rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .donasi-main-content {
            flex: 1;
            padding: 1.5rem;
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
            padding: 1.5rem;
            background-color: var(--don-surf);
        }

        .bg-surface-low { background-color: var(--don-surf-low); }
        .bg-surface-highest { background-color: var(--don-surf-high); }

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
        .donasi-btn-primary:hover { background-color: var(--don-primary-dim); }

        .donasi-btn-share {
            background-color: var(--don-ter-cont);
            color: var(--don-on-ter-cont) !important;
            border-radius: var(--don-rd-full);
            padding: 0.5rem 1.5rem;
            font-size: 0.875rem;
        }

        .donasi-avatar {
            border-radius: var(--don-rd-full);
            border: var(--don-border);
            object-fit: cover;
        }

        .progress-wrapper {
            width: 100%;
            max-width: 42rem;
            flex: 1;
        }
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 0.5rem;
        }
        .progress-track {
            width: 100%;
            background-color: var(--don-surf-lowest);
            border: var(--don-border);
            border-radius: var(--don-rd-full);
            height: 1.5rem;
            overflow: hidden;
        }
        .progress-fill {
            background: linear-gradient(to right, var(--don-primary), var(--don-primary-dim));
            height: 100%;
            border-right: var(--don-border);
            border-radius: 0 var(--don-rd-full) var(--don-rd-full) 0;
            transition: width 0.5s ease-out;
        }

        .video-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        .video-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        .video-card {
            background-color: var(--don-surf-lowest);
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            overflow: hidden;
        }
        .video-thumbnail-wrapper {
            aspect-ratio: 16 / 9;
            position: relative;
            border-bottom: var(--don-border);
            background-color: var(--don-surf-var);
        }
        .video-thumbnail-wrapper iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .video-info { padding: 1rem; }

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
            max-height: 1200px;
        }
        
        .donation-item {
            background-color: var(--don-surf-lowest);
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            padding: 1.25rem;
            box-shadow: 4px 4px 0px 0px var(--don-on-surf);
        }
        .donor-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
        }
        .donor-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .donor-badge {
            background-color: var(--don-pri-cont);
            color: var(--don-on-pri-cont);
            font-size: 10px;
            font-weight: bold;
            padding: 0.125rem 0.5rem;
            border-radius: var(--don-rd-full);
            border: 1px solid var(--don-on-surf);
        }
        .donation-message {
            margin-top: 1rem;
            background-color: var(--don-surf-low);
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            padding: 0.75rem;
            font-style: italic;
            font-size: 0.875rem;
        }
        .interaction-row {
            margin-top: 0.75rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .interaction-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: var(--don-out);
            font-weight: 600;
        }
        .interaction-btn:hover { color: var(--don-primary); }
        
        .comment-section {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px dashed var(--don-out-var);
        }
        .comment-input-row {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .comment-input {
            flex: 1;
            background: var(--don-surf-lowest);
            border: var(--don-border);
            border-radius: var(--don-rd-full);
            padding: 0.5rem 1rem;
            font-family: inherit;
            font-size: 0.875rem;
            color: var(--don-on-surf);
            outline: none;
        }

        .ping-dot {
            position: relative;
            display: flex;
            height: 1rem;
            width: 1rem;
        }
        .ping-dot-inner {
            position: relative;
            border-radius: var(--don-rd-full);
            height: 1rem;
            width: 1rem;
            background-color: var(--don-err);
            border: var(--don-border);
        }

        .supporter-row {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background-color: var(--don-surf-lowest);
            padding: 0.5rem;
            border-radius: var(--don-rd-md);
            border: var(--don-border);
            margin-bottom: 0.75rem;
        }
        
        .social-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            margin-top: 1rem;
        }
        .social-btn {
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            padding: 0.75rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: white !important;
            transition: transform 0.2s;
            min-height: 80px;
        }
        .social-btn:hover { transform: scale(1.05); }
        .social-youtube { background-color: #FF0000; }
        .social-discord { background-color: #5865F2; }
        
        .meme-panel {
            background-color: var(--don-ter-cont);
            text-align: center;
            box-shadow: 4px 4px 0px 0px var(--don-on-surf);
        }

        .fab-mobile {
            position: fixed;
            bottom: 5rem;
            right: 1.5rem;
            z-index: 50;
        }
        .fab-btn {
            background-color: var(--don-primary);
            color: var(--don-on-primary) !important;
            border-radius: var(--don-rd-full);
            padding: 1rem 1.5rem;
            font-weight: bold;
            font-size: 1rem;
            border: var(--don-border);
            box-shadow: 4px 4px 0px 0px var(--don-on-surf);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        @media (min-width: 768px) {
            .sticky-progress { flex-direction: row; }
            .video-grid { grid-template-columns: repeat(2, 1fr); }
            .fab-mobile { display: none; }
        }

        @media (min-width: 1024px) {
            .donasi-main-content { flex-direction: row; }
            .column-left { width: 70%; display: flex; flex-direction: column; gap: 1.5rem; }
            .column-right { width: 30%; display: flex; flex-direction: column; gap: 1.5rem; }
        }
        
        .donation-dashboard ::-webkit-scrollbar { width: 8px; }
        .donation-dashboard ::-webkit-scrollbar-track { background: var(--don-surf-low); }
        .donation-dashboard ::-webkit-scrollbar-thumb { background: var(--don-out-var); border-radius: 4px; }
      `}} />

      {seedStatus && (
          <div style={{ backgroundColor: 'var(--don-primary)', color: 'white', padding: '0.5rem 1rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', zIndex: 100 }}>
              ℹ️ {seedStatus}
          </div>
      )}

      <div className="sticky-progress">
          <div className="progress-wrapper">
              <div className="progress-header">
                  <h1 className="font-headline text-2xl font-bold">Target Server Maintenance</h1>
                  <span className="font-bold text-primary">Rp {totalAmount.toLocaleString()} / Rp {targetGoal.toLocaleString()}</span>
              </div>
              <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
          </div>
          <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="donasi-btn donasi-btn-primary font-bold">
              <span className="material-symbols-outlined">volunteer_activism</span> Donasi Sekarang
          </a>
      </div>

      <main className="donasi-main-content">
          <div className="column-left">
              {/* VIDEO SECTION */}
              {videoDonations.length > 0 && (
                <section className="donasi-card bg-surface-low">
                    <div className="video-header">
                        <h2 className="font-headline text-3xl font-extrabold">Video dari Donatur</h2>
                        <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Update Game <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    
                    <div className="video-grid">
                        {videoDonations.slice(0, 4).map(v => (
                          <div className="video-card" key={`vid-${v.id}`}>
                              <div className="video-thumbnail-wrapper">
                                  <iframe src={`https://www.youtube.com/embed/${v.videoId}`} frameBorder="0" allowFullScreen title={v.name}></iframe>
                              </div>
                              <div className="video-info">
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
                      <h2 className="font-headline text-3xl font-extrabold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="ping-dot">
                              <span className="ping-dot-inner"></span>
                          </span>
                          Live Feed Donasi
                      </h2>
                      <button className="donasi-btn" style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: 'var(--don-rd-full)' }}>
                          <span className="material-symbols-outlined">filter_list</span>
                      </button>
                  </div>

                  <div className="feed-list">
                      {loading ? (
                        <div className="text-center py-10 text-outline animate-pulse font-bold">Memuat data donasi...</div>
                      ) : supporters.length === 0 ? (
                        <div className="text-center py-10 text-outline font-bold bg-don-surf-low rounded-xl border-dashed border-2 border-don-out-var">Belum ada donasi hari ini. Jadilah yang pertama! 😊</div>
                      ) : (
                        displaySupporters.map(s => (
                          <div className="donation-item" key={s.id}>
                              <div className="donor-header">
                                  <div className="donor-info">
                                      <div className="donasi-avatar" style={{ width: '48px', height: '48px', backgroundColor: 'var(--don-pri-cont)', color: 'var(--don-on-pri-cont)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
                                          {s.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                              <h4 className="font-bold text-lg">{s.name}</h4>
                                              {s.amount >= 50000 && <span className="donor-badge">Sultan</span>}
                                          </div>
                                          <p className="text-sm font-bold text-primary mt-1">Mendonasikan Rp {s.amount.toLocaleString()}</p>
                                      </div>
                                  </div>
                                  <span className="text-xs text-outline font-bold">{s.formattedDate}</span>
                              </div>
                              
                              {s.message && (
                                <div className="donation-message">
                                    <p>"{s.message}"</p>
                                </div>
                              )}
  
                              <div className="interaction-row">
                                  <button className="interaction-btn" onClick={() => setActiveCommentId(activeCommentId === s.id ? null : s.id)}>
                                      <span className="material-symbols-outlined">chat_bubble</span> 
                                      {comments[s.id]?.length || 0} Balasan
                                  </button>
                              </div>
  
                              {activeCommentId === s.id && (
                                <div className="comment-section">
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {comments[s.id]?.map(c => (
                                      <div key={c.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                        <img src={c.photoURL} alt="" className="donasi-avatar" style={{ width: '32px', height: '32px' }} />
                                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--don-surf-low)', borderRadius: '1rem', border: 'var(--don-border)', fontSize: '0.85rem', flex: 1 }}>
                                          <strong className="text-primary">{c.name}</strong>: {c.text}
                                        </div>
                                      </div>
                                    ))}
                                    {(!comments[s.id] || comments[s.id].length === 0) && <p className="text-xs text-outline italic">Belum ada balasan...</p>}
                                  </div>
                                  
                                  <div className="comment-input-row">
                                    <input 
                                      className="comment-input" 
                                      placeholder={user ? "Ketik balasan..." : "Login untuk membalas"} 
                                      value={newComment}
                                      disabled={!user}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(s.id)}
                                    />
                                    {user && (
                                      <button className="donasi-btn donasi-btn-primary" onClick={() => handleSendComment(s.id)}>
                                        <span className="material-symbols-outlined">send</span>
                                      </button>
                                    )}
                                  </div>
                                  {!user && <Link href="/auth/login" className="text-xs text-primary font-bold mt-2 block">Klik di sini untuk Login</Link>}
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
                  <h3 className="font-headline text-xl font-bold" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--don-ter)', fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      Top Supporters
                  </h3>
                  <div>
                      {topSupporters.length === 0 && <p className="text-xs text-outline italic">Belum ada top donor...</p>}
                      {topSupporters.map((ts, idx) => (
                        <div className="supporter-row" key={`ts-${idx}`}>
                            <div className="font-bold text-lg" style={{ color: 'var(--don-out-var)', width: '24px', textAlign: 'center' }}>{idx + 1}</div>
                            <div className="donasi-avatar" style={{ width: '40px', height: '40px', backgroundColor: idx === 0 ? 'var(--don-primary)' : 'var(--don-pri-cont)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {ts.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 className="font-bold text-sm">{ts.name}</h4>
                                <p className="text-xs text-primary font-bold">Rp {ts.amount.toLocaleString()}</p>
                            </div>
                        </div>
                      ))}
                  </div>
              </section>

              {/* SOCIAL SECTION */}
              <section className="donasi-card bg-surface-low">
                  <h3 className="font-headline text-lg font-bold" style={{ marginBottom: '1rem' }}>Dukungan Lainnya</h3>
                  <div className="social-grid">
                      <a href="https://www.youtube.com/@TeknologiSantuy" target="_blank" rel="noopener noreferrer" className="social-btn social-youtube">
                          <i className="fa-brands fa-youtube text-2xl"></i>
                          <span className="font-bold text-xs">Subscribe</span>
                      </a>
                      <a href="https://discord.gg/dJzbq53jXH" target="_blank" rel="noopener noreferrer" className="social-btn social-discord">
                          <i className="fa-brands fa-discord text-2xl"></i>
                          <span className="font-bold text-xs">Join Discord</span>
                      </a>
                  </div>
              </section>

              {/* MEME SECTION */}
              <section className="donasi-card meme-panel">
                  <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: 'white', border: 'var(--don-border)', borderRadius: 'var(--don-rd-md)', marginBottom: '0.75rem', overflow: 'hidden' }}>
                      <img alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjZ6NXA2ZzVnbmU0ZzVnbmU0ZzVnbmU0ZzVnbmU0ZzVnbmU0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif"/>
                  </div>
                  <h4 className="font-headline font-bold text-lg" style={{ color: 'var(--don-on-ter-cont)' }}>"Target Tercapai 100%"</h4>
                  <p className="text-xs mt-2 font-bold" style={{ opacity: 0.8 }}>Terima kasih orang baik! 🐱</p>
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
              <h2 className="font-headline text-2xl font-extrabold text-primary mb-2 uppercase">{currentAlert.name} MENGIRIM DUKUNGAN!</h2>
              <div className="donasi-btn-primary font-bold text-2xl mb-4" style={{ display: 'inline-block', borderRadius: 'var(--don-rd-md)', padding: '0.5rem 1.5rem' }}>Rp {currentAlert.amount.toLocaleString()}</div>
              <p className="font-bold italic text-outline" style={{ backgroundColor: 'var(--don-surf-low)', padding: '1rem', borderRadius: 'var(--don-rd-md)', border: 'var(--don-border)' }}>
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