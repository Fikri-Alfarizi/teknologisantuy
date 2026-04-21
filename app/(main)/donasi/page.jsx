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
  
  const targetGoal = 500000; // Target goal disesuaikan lebih besar
  
  const audioRef = useRef(null);
  const isInitialLoad = useRef(true);
  const mountTime = useRef(Timestamp.now());

  const displaySupporters = supporters;
  const totalAmount = supporters.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const progressPercent = Math.min((totalAmount / targetGoal) * 100, 100);
  
  const videoDonations = displaySupporters.filter(s => s.videoId);
  const topSupporters = [...displaySupporters].sort((a,b) => b.amount - a.amount).slice(0, 5);

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
            --don-bg: #f8f9ff;
            --don-on-surf: #1a1e2e;
            --don-primary: #0057bd;
            --don-primary-dim: #004ca6;
            --don-on-primary: #ffffff;
            --don-pri-cont: #e0ebff;
            --don-on-pri-cont: #001a41;
            --don-sec: #3a53b7;
            --don-sec-dim: #2c47ab;
            --don-surf: #ffffff;
            --don-surf-low: #f5f7ff;
            --don-surf-high: #eef2ff;
            --don-surf-lowest: #ffffff;
            --don-err: #df2c3a;
            --don-out: #5a6175;
            --don-out-var: #94a3b8;
            --don-gold: #fbbf24;
            --don-silver: #94a3b8;
            --don-bronze: #d97706;

            --don-headline: 'Space Grotesk', sans-serif;
            --don-body: 'Manrope', sans-serif;
            
            --don-border: 2px solid var(--don-on-surf);
            --don-shadow: 4px 4px 0px 0px var(--don-on-surf);
            --don-shadow-sm: 2px 2px 0px 0px var(--don-on-surf);
            --don-rd-md: 0.75rem;
            --don-rd-lg: 1.25rem;
            --don-rd-xl: 2rem;
            --don-rd-full: 9999px;

            background-color: var(--don-bg);
            color: var(--don-on-surf);
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            position: relative;
            padding-top: 0;
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
            font-size: 24px;
            display: inline-block;
            line-height: 1;
        }

        .donation-dashboard i[class*="fa-"] {
            font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands" !important;
            font-weight: 900 !important;
            font-style: normal !important;
        }

        .donation-dashboard .font-headline { font-family: var(--don-headline) !important; }
        .donation-dashboard .font-bold { font-weight: 700; }
        .donation-dashboard .font-extrabold { font-weight: 800; }

        .sticky-progress {
            position: sticky;
            top: 0; 
            z-index: 50;
            background-color: var(--don-surf);
            border-bottom: var(--don-border);
            padding: 0.75rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }

        .progress-wrapper {
            width: 100%;
            max-width: 60rem;
            margin: 0 auto;
        }
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .progress-track {
            width: 100%;
            background-color: var(--don-surf-low);
            border: var(--don-border);
            border-radius: var(--don-rd-full);
            height: 1.25rem;
            overflow: hidden;
            position: relative;
        }
        .progress-fill {
            background: repeating-linear-gradient(
                45deg,
                var(--don-primary),
                var(--don-primary) 10px,
                var(--don-primary-dim) 10px,
                var(--don-primary-dim) 20px
            );
            height: 100%;
            transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
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
            box-shadow: var(--don-shadow);
        }

        .section-title {
            font-family: var(--don-headline) !important;
            font-size: 1.75rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
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
            padding: 1.25rem;
            transition: transform 0.2s;
        }
        .donation-item:hover { transform: translateY(-3px); }

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
        .donor-avatar-circle {
            width: 44px;
            height: 44px;
            border-radius: var(--don-rd-full);
            border: var(--don-border);
            background-color: var(--don-pri-cont);
            color: var(--don-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.25rem;
        }
        .donor-badge {
            background-color: #fef08a;
            color: #854d0e;
            font-size: 0.65rem;
            font-weight: 800;
            padding: 0.2rem 0.6rem;
            border-radius: var(--don-rd-full);
            border: 1px solid currentColor;
            text-transform: uppercase;
        }

        .donation-message {
            margin-top: 1rem;
            background-color: var(--don-surf-low);
            border: 1px solid var(--don-on-surf);
            border-radius: 0.5rem;
            padding: 0.75rem;
            font-style: italic;
            font-size: 0.9rem;
            position: relative;
        }

        .supporter-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            background-color: var(--don-surf-lowest);
            padding: 0.75rem;
            border-radius: var(--don-rd-md);
            border: var(--don-border);
            margin-bottom: 0.75rem;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }
        .supporter-card:hover { transform: scale(1.02); z-index: 5; }
        
        .rank-badge {
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 0.5rem;
            border: var(--don-border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-family: var(--don-headline) !important;
            background-color: #fff;
        }
        .rank-gold { background-color: var(--don-gold); }
        .rank-silver { background-color: var(--don-silver); }
        .rank-bronze { background-color: var(--don-bronze); color: white; }

        .social-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
        }
        .social-btn {
            border: var(--don-border);
            border-radius: var(--don-rd-md);
            padding: 1rem 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: white !important;
            box-shadow: 3px 3px 0px 0px var(--don-on-surf);
            transition: all 0.1s;
        }
        .social-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0px 0px var(--don-on-surf); }
        .social-youtube { background-color: #FF0000; }
        .social-discord { background-color: #5865F2; }

        /* MOBILE OPTIMIZATIONS */
        @media (max-width: 767px) {
            .donation-dashboard { padding-top: 0; }
            .section-title { font-size: 1.5rem; }
            .sticky-progress { padding: 0.5rem 0.75rem; }
            .progress-header h1 { font-size: 1rem; }
            .progress-header span { font-size: 0.85rem; }
            
            .donasi-main-content { gap: 1rem; padding: 0.75rem; }
            .donasi-card { padding: 1rem; border-radius: 0.75rem; }
            .donation-item { padding: 0.85rem; }
            
            .donor-avatar-circle { width: 36px; height: 36px; font-size: 1rem; }
            .rank-badge { width: 1.75rem; height: 1.75rem; font-size: 0.85rem; }
            
            .donor-header { flex-direction: column; gap: 0.5rem; }
            .donation-date { font-size: 0.65rem; }

            .fab-mobile { bottom: 1.5rem; right: 1rem; }
            .fab-btn { padding: 0.75rem 1.25rem; font-size: 0.875rem; }
        }

        @media (min-width: 768px) {
            .sticky-progress { flex-direction: row; align-items: center; padding: 1rem 2rem; }
            .progress-wrapper { flex: 1; margin: 0; }
            .donasi-main-content { padding: 2rem; }
        }

        @media (min-width: 1024px) {
            .donasi-main-content { flex-direction: row; align-items: flex-start; }
            .column-left { width: 68%; }
            .column-right { width: 32%; position: sticky; top: 100px; }
        }

        @keyframes pulse-red {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(223, 44, 58, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(223, 44, 58, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(223, 44, 58, 0); }
        }
        .ping-active { animation: pulse-red 2s infinite; }
      `}} />

      <div className="sticky-progress">
          <div className="progress-wrapper">
              <div className="progress-header">
                  <h1 className="font-headline font-extrabold text-lg md:text-xl">Target Server Maintenance</h1>
                  <span className="font-bold text-primary text-sm md:text-base">
                    Rp {totalAmount.toLocaleString()} <span className="text-outline">/ Rp {targetGoal.toLocaleString()}</span>
                  </span>
              </div>
              <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
          </div>
          <div className="hidden md:flex gap-2">
            <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="donasi-btn donasi-btn-primary">
                <span className="material-symbols-outlined">volunteer_activism</span> Dukung Kami
            </a>
          </div>
      </div>

      <main className="donasi-main-content">
          <div className="column-left flex flex-col gap-6">
              {/* FEED SECTION */}
              <section className="donasi-card">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="section-title mb-0">
                          <span className="ping-dot ping-active" style={{ width: '12px', height: '12px', backgroundColor: 'var(--don-err)', borderRadius: '50%' }}></span>
                          Live Feed Donasi
                      </h2>
                      <div className="text-xs font-bold text-outline uppercase tracking-wider hidden sm:block">Update Otomatis</div>
                  </div>

                  <div className="feed-list">
                      {loading ? (
                        <div className="text-center py-12 text-outline animate-pulse font-bold">Menghubungkan ke server...</div>
                      ) : displaySupporters.length === 0 ? (
                        <div className="text-center py-12 bg-don-surf-low rounded-xl border-2 border-dashed border-don-out-var">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-30">pending</span>
                          <p className="font-bold opacity-60">Belum ada donasi hari ini.</p>
                        </div>
                      ) : (
                        displaySupporters.map(s => (
                          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="donation-item" key={s.id}>
                              <div className="donor-header">
                                  <div className="donor-info">
                                      <div className="donor-avatar-circle">{s.name.charAt(0).toUpperCase()}</div>
                                      <div>
                                          <div className="flex items-center gap-2 flex-wrap">
                                              <h4 className="font-extrabold text-base md:text-lg m-0">{s.name}</h4>
                                              {s.amount >= 50000 && <span className="donor-badge">⭐ Top Donor</span>}
                                          </div>
                                          <p className="text-sm font-bold text-primary m-0">Menyumbang Rp {s.amount.toLocaleString()}</p>
                                      </div>
                                  </div>
                                  <div className="donation-date text-xs font-bold text-outline">{s.formattedDate}</div>
                              </div>
                              
                              {s.message && (
                                <div className="donation-message">
                                    "{s.message}"
                                </div>
                              )}
  
                              <div className="mt-4 flex items-center gap-4">
                                  <button onClick={() => setActiveCommentId(activeCommentId === s.id ? null : s.id)} className="flex items-center gap-1.5 text-xs font-bold text-outline hover:text-primary transition-colors">
                                      <span className="material-symbols-outlined text-sm">chat_bubble</span> 
                                      {comments[s.id]?.length || 0} Balasan
                                  </button>
                                  {s.videoId && (
                                     <button onClick={() => window.open(`https://youtube.com/watch?v=${s.videoId}`)} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                                        <span className="material-symbols-outlined text-sm">smart_display</span> Video Terlampir
                                     </button>
                                  )}
                              </div>
  
                              {activeCommentId === s.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="comment-section mt-4 pt-4 border-t border-dashed border-don-out-var">
                                  <div className="flex flex-col gap-3">
                                    {comments[s.id]?.map(c => (
                                      <div key={c.id} className="flex gap-3 items-start">
                                        <img src={c.photoURL} alt="" className="w-8 h-8 rounded-full border-2 border-don-on-surf" />
                                        <div className="bg-don-surf-low p-3 rounded-xl border border-don-on-surf text-sm flex-1">
                                          <strong className="text-primary">{c.name}</strong>: {c.text}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="flex gap-2 mt-4">
                                    <input 
                                      className="flex-1 bg-white border-2 border-don-on-surf rounded-full px-4 py-2 text-sm outline-none" 
                                      placeholder={user ? "Balas dukungan ini..." : "Login untuk membalas"} 
                                      value={newComment}
                                      disabled={!user}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(s.id)}
                                    />
                                    {user && (
                                      <button onClick={() => handleSendComment(s.id)} className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full border-2 border-don-on-surf">
                                        <span className="material-symbols-outlined text-sm">send</span>
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                          </motion.div>
                        ))
                      )}
                  </div>
              </section>
          </div>

          <div className="column-right flex flex-col gap-6">
              {/* TOP SUPPORTERS leaderboard */}
              <section className="donasi-card">
                  <h3 className="section-title text-xl">
                      <span className="material-symbols-outlined text-don-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      Top Supporters
                  </h3>
                  <div className="space-y-3">
                      {topSupporters.map((ts, idx) => (
                        <div key={`ts-${idx}`} className="supporter-card">
                            <div className={`rank-badge ${idx === 0 ? 'rank-gold' : idx === 1 ? 'rank-silver' : idx === 2 ? 'rank-bronze' : ''}`}>
                                {idx + 1}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-extrabold text-sm m-0 leading-tight">{ts.name}</h4>
                                <p className="text-xs font-bold text-primary m-0">Rp {ts.amount.toLocaleString()}</p>
                            </div>
                            {idx === 0 && <span className="material-symbols-outlined text-lg" style={{ color: 'var(--don-gold)', fontVariationSettings: "'FILL' 1" }}>stars</span>}
                        </div>
                      ))}
                      {topSupporters.length === 0 && <p className="text-xs text-outline italic text-center py-4">Menunggu pahlawan pertama...</p>}
                  </div>
              </section>

              {/* DUKUNGAN LAINNYA buttons */}
              <section className="donasi-card">
                  <h3 className="section-title text-xl">Lainnya</h3>
                  <div className="social-grid">
                      <a href="https://www.youtube.com/@TeknologiSantuy" target="_blank" rel="noopener noreferrer" className="social-btn social-youtube">
                          <i className="fa-brands fa-youtube text-2xl"></i>
                          <span className="font-extrabold text-xs">YouTube</span>
                      </a>
                      <a href="https://discord.gg/dJzbq53jXH" target="_blank" rel="noopener noreferrer" className="social-btn social-discord">
                          <i className="fa-brands fa-discord text-2xl"></i>
                          <span className="font-extrabold text-xs">Discord</span>
                      </a>
                  </div>
              </section>

              {/* MEME / FUN section */}
              <section className="donasi-card bg-don-pri-cont text-center !shadow-none" style={{ borderStyle: 'dashed' }}>
                  <div className="aspect-square bg-white border-2 border-don-on-surf rounded-xl mb-4 overflow-hidden">
                      <img alt="Meme" className="w-full h-full object-cover" src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjZ6NXA2ZzVnbmU0ZzVnbmU0ZzVnbmU0ZzVnbmU0ZzVnbmU0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif"/>
                  </div>
                  <h4 className="font-headline font-extrabold text-base mb-1">Dukung Terus Mimin!</h4>
                  <p className="text-xs font-bold opacity-70">Donatur senang, server pun tenang. 🐱</p>
              </section>
          </div>
      </main>

      {/* MOBILE FAB - FIXED BUTTON */}
      <div className="fab-mobile md:hidden">
          <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="fab-btn donasi-btn bg-primary text-white">
              <span className="material-symbols-outlined">volunteer_activism</span>
              Dukung Sekarang
          </a>
      </div>

      {/* CELEBRATION ALERT */}
      <AnimatePresence>
        {showAlert && currentAlert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <motion.div initial={{ scale: 0.8, y: 50, rotate: -2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 1.2, opacity: 0 }} className="donasi-card max-w-[420px] w-full text-center bg-white relative z-10">
              <div className="h-48 w-full mb-4 rounded-xl overflow-hidden border-4 border-don-on-surf">
                <img src={currentAlert.meme} alt="Meme Selebrasi" className="w-full h-full object-cover" />
              </div>
              <h2 className="font-headline text-2xl font-extrabold text-primary mb-2 uppercase italic">{currentAlert.name} IS HERE!</h2>
              <div className="bg-primary text-white font-extrabold text-2xl mb-6 inline-block rounded-xl border-4 border-don-on-surf px-6 py-2 shadow-[4px_4px_0px_0px_#1a1e2e]">
                Rp {currentAlert.amount.toLocaleString()}
              </div>
              <p className="font-bold italic text-outline bg-don-surf-low p-4 rounded-xl border-2 border-don-on-surf">
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
