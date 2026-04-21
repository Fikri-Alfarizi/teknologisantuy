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
  Timestamp 
} from 'firebase/firestore';

const ALERT_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3";

const MEME_LIST = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJieHBobHh3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3cmVudmUmc2lkPWc/l0Hlx0N5lh6U/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJieHBobHh3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3cmVudmUmc2lkPWc/3o7abKhOpu0N82FmXC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamR6N3ZqY2E5ZzB6Z3ZqY2E5ZzB6Z3ZqY2E5ZzB6Z3ZqY2E5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif",
  "https://api.memegen.link/images/custom/_/ANTAP_MANTAP.png?background=https://i.imgflip.com/4/30t1mt.jpg",
];

const INITIAL_MOCK_DATA = [
  { id: 'm1', name: "Fikri Alfarizi", amount: 10000, message: "Contoh donasi: Video Youtube akan muncul di sini!", timestamp: null, videoId: 'dQw4w9WgXcQ' },
  { id: 'm2', name: "Orang Baik", amount: 5000, message: "Terus semangat bang!", timestamp: null },
];

const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Calculate time ago string
const timeAgo = (dateStr) => {
  if (!dateStr || dateStr === 'Baru') return 'Baru saja';
  // simple mock for example
  return dateStr;
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
  
  // Real Target
  const targetGoal = 50000;
  
  const audioRef = useRef(null);
  const isInitialLoad = useRef(true);
  const mountTime = useRef(Timestamp.now());

  const displaySupporters = supporters.length > 0 ? supporters : (loading ? [] : INITIAL_MOCK_DATA);
  const totalAmount = supporters.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const progressPercent = Math.min((totalAmount / targetGoal) * 100, 100);
  
  const videoDonations = displaySupporters.filter(s => s.videoId);
  const topSupporters = [...displaySupporters].sort((a,b) => b.amount - a.amount).slice(0, 3);

  useEffect(() => {
    const qDonations = query(collection(db, 'donations'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribeDonations = onSnapshot(qDonations, (snapshot) => {
      const donationData = snapshot.docs.map(doc => {
        const data = doc.data();
        const msg = data.message || "";
        const ytId = getYoutubeId(msg);
        return {
          id: doc.id, ...data,
          formattedDate: data.timestamp?.toDate().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) || 'Baru',
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
        .donation-dashboard {
            --bg-color: #f5f6ff;
            --on-surface: #282f3f;
            --primary: #0057bd;
            --primary-dim: #004ca6;
            --on-primary: #f0f2ff;
            --primary-container: #6e9fff;
            --on-primary-container: #002150;
            --secondary: #3a53b7;
            --secondary-dim: #2c47ab;
            --on-secondary: #f2f1ff;
            --secondary-container: #c7cfff;
            --on-secondary-container: #223ea2;
            --tertiary: #893c92;
            --tertiary-container: #f199f7;
            --on-tertiary-container: #5e106a;
            --surface: #f5f6ff;
            --surface-variant: #d3dcf9;
            --surface-container-low: #edf0ff;
            --surface-container-highest: #d3dcf9;
            --surface-container-lowest: #ffffff;
            --error: #b31b25;
            --outline: #707789;
            --outline-variant: #a6adc1;

            --font-headline: 'Space Grotesk', sans-serif;
            --font-body: 'Manrope', sans-serif;
            
            --border-brutal: 2px solid var(--on-surface);
            --radius-md: 0.5rem;
            --radius-lg: 1rem;
            --radius-xl: 1.5rem;
            --radius-full: 9999px;

            background-color: var(--bg-color);
            color: var(--on-surface);
            font-family: var(--font-body);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .donation-dashboard a { text-decoration: none; color: inherit; }
        .donation-dashboard button { cursor: pointer; border: none; background: none; font-family: inherit; }
        .donation-dashboard img { max-width: 100%; display: block; }
        .donation-dashboard h1, .donation-dashboard h2, .donation-dashboard h3, .donation-dashboard h4, .donation-dashboard p { margin: 0; padding: 0; }

        .font-headline { font-family: var(--font-headline); }
        .text-primary { color: var(--primary); }
        .text-outline { color: var(--outline); }
        .font-bold { font-weight: 700; }
        .font-extrabold { font-weight: 800; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }

        .top-app-bar {
            background-color: rgba(245, 246, 255, 0.8);
            border-bottom: var(--border-brutal);
            position: sticky;
            top: 0;
            z-index: 50;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            backdrop-filter: blur(16px);
        }

        .sticky-progress {
            position: sticky;
            top: 70px; 
            z-index: 30;
            background-color: var(--surface-container-low);
            border-bottom: var(--border-brutal);
            padding: 1rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: space-between;
        }

        .donasi-main-content {
            flex: 1;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .donasi-card {
            border: var(--border-brutal);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
        }

        .bg-surface-low { background-color: var(--surface-container-low); }
        .bg-surface-highest { background-color: var(--surface-container-highest); }
        .bg-surface { background-color: var(--surface); }

        .donasi-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            font-weight: 700;
            transition: all 0.2s;
            border: var(--border-brutal);
        }

        .donasi-btn-primary {
            background-color: var(--primary);
            color: var(--on-primary);
            border-radius: var(--radius-full);
            padding: 0.5rem 1rem;
        }
        .donasi-btn-primary:hover { background-color: var(--primary-dim); }

        .donasi-btn-share {
            background-color: var(--tertiary-container);
            color: var(--on-tertiary-container);
            border-radius: var(--radius-full);
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }

        .donasi-avatar {
            border-radius: var(--radius-full);
            border: var(--border-brutal);
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
            background-color: var(--surface);
            border: var(--border-brutal);
            border-radius: var(--radius-full);
            height: 1.5rem;
            overflow: hidden;
        }
        .progress-fill {
            background: linear-gradient(to right, var(--primary), var(--primary-dim));
            height: 100%;
            border-right: var(--border-brutal);
            border-radius: 0 var(--radius-full) var(--radius-full) 0;
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
            background-color: var(--surface);
            border: var(--border-brutal);
            border-radius: var(--radius-md);
            overflow: hidden;
            cursor: pointer;
        }
        .video-thumbnail-wrapper {
            aspect-ratio: 16 / 9;
            position: relative;
            border-bottom: var(--border-brutal);
            background-color: var(--surface-variant);
        }
        .video-thumbnail-wrapper img, .video-thumbnail-wrapper iframe {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .play-overlay {
            position: absolute;
            inset: 0;
            background-color: rgba(40, 47, 63, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            pointer-events: none;
        }
        .video-card:hover .play-overlay { background-color: rgba(40, 47, 63, 0.1); }
        .play-btn {
            width: 3rem;
            height: 3rem;
            background-color: var(--primary);
            color: var(--on-primary);
            border-radius: var(--radius-full);
            border: var(--border-brutal);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        .video-card:hover .play-btn { transform: scale(1.1); }
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
            gap: 1rem;
            max-height: 800px;
        }
        
        .donation-item {
            background-color: var(--surface);
            border: var(--border-brutal);
            border-radius: var(--radius-md);
            padding: 1.25rem;
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
            background-color: var(--primary-container);
            color: var(--on-primary-container);
            font-size: 10px;
            font-weight: bold;
            padding: 0.125rem 0.5rem;
            border-radius: var(--radius-full);
            border: 1px solid var(--on-surface);
        }
        .donation-message {
            margin-top: 1rem;
            background-color: var(--surface-container-lowest);
            border: var(--border-brutal);
            border-radius: var(--radius-md);
            padding: 0.75rem;
            font-style: italic;
            font-size: 0.875rem;
        }
        .interaction-row {
            margin-top: 0.75rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        .interaction-btn {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.875rem;
            color: var(--outline);
            font-weight: 600;
        }
        .interaction-btn:hover { color: var(--primary); }
        
        .comment-section {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px dashed var(--outline-variant);
        }
        .comment-input-row {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        .comment-input {
            flex: 1;
            background: var(--surface-container-lowest);
            border: var(--border-brutal);
            border-radius: var(--radius-full);
            padding: 0.25rem 0.75rem;
            font-family: inherit;
            font-size: 0.875rem;
            color: var(--on-surface);
            outline: none;
        }
        .comment-input:focus { border-color: var(--primary); }

        .ping-dot {
            position: relative;
            display: flex;
            height: 1rem;
            width: 1rem;
        }
        .ping-dot-inner {
            position: relative;
            display: inline-flex;
            border-radius: var(--radius-full);
            height: 1rem;
            width: 1rem;
            background-color: var(--error);
            border: var(--border-brutal);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
           75%, 100% { transform: scale(1.5); opacity: 0; }
        }

        .supporter-row {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background-color: var(--surface);
            padding: 0.5rem;
            border-radius: var(--radius-md);
            border: var(--border-brutal);
            margin-bottom: 0.75rem;
        }
        .social-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }
        .social-btn {
            border: var(--border-brutal);
            border-radius: var(--radius-md);
            padding: 0.75rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            color: white;
            transition: background-color 0.2s;
        }
        .social-youtube { background-color: #FF0000; }
        .social-youtube:hover { background-color: #CC0000; }
        .social-discord { background-color: #5865F2; }
        .social-discord:hover { background-color: #4752C4; }
        
        .meme-panel {
            background-color: var(--tertiary-container);
            text-align: center;
        }

        .fab-mobile {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 50;
        }
        .fab-btn {
            background-color: var(--primary);
            color: var(--on-primary);
            border-radius: var(--radius-full);
            padding: 1rem 2rem;
            font-weight: bold;
            font-size: 1.125rem;
            border: var(--border-brutal);
            box-shadow: 4px 4px 0px 0px var(--on-surface);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
        }
        .fab-btn:active {
            transform: translate(4px, 4px);
            box-shadow: none;
        }

        @media (min-width: 768px) {
            .sticky-progress { flex-direction: row; top: 0; }
            .video-grid { grid-template-columns: repeat(2, 1fr); }
            .fab-mobile { display: none; }
        }

        @media (min-width: 1024px) {
            .donasi-main-content { flex-direction: row; }
            .column-left { width: 75%; display: flex; flex-direction: column; gap: 1.5rem; }
            .column-right { width: 25%; display: flex; flex-direction: column; gap: 1.5rem; }
            .video-grid { grid-template-columns: repeat(3, 1fr); }
        }
        
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--surface-container-low);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--outline-variant);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--outline);
        }
      `}} />

      <header className="top-app-bar">
          <div className="font-headline text-2xl font-extrabold" style={{ letterSpacing: '-0.05em' }}>DonationFlow</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="donasi-avatar" style={{ padding: '0.5rem', border: 'none', background: 'transparent' }}>
                  <span className="material-symbols-outlined">notifications</span>
              </button>
              <img 
                alt="User avatar" 
                className="donasi-avatar" 
                style={{ width: '40px', height: '40px' }} 
                src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.displayName || 'User'}`} 
              />
          </div>
      </header>

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
          <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="donasi-btn-share donasi-btn font-bold">
              <span className="material-symbols-outlined text-sm">volunteer_activism</span> Donasi Sekarang
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
                            Mau video Anda di sini? <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    
                    <div className="video-grid">
                        {videoDonations.slice(0, 5).map(v => (
                          <div className="video-card" key={`vid-${v.id}`}>
                              <div className="video-thumbnail-wrapper">
                                  <iframe src={`https://www.youtube.com/embed/${v.videoId}`} frameBorder="0" allowFullScreen></iframe>
                              </div>
                              <div className="video-info">
                                  <h3 className="font-bold text-sm" style={{ marginBottom: '4px' }}>Donasi dari {v.name}</h3>
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
                      <button className="donasi-btn" style={{ backgroundColor: 'var(--surface)', padding: '0.5rem', borderRadius: 'var(--radius-full)' }}>
                          <span className="material-symbols-outlined text-sm">filter_list</span>
                      </button>
                  </div>

                  <div className="feed-list">
                      {displaySupporters.map(s => (
                        <div className="donation-item" key={s.id}>
                            <div className="donor-header">
                                <div className="donor-info">
                                    <div className="donasi-avatar" style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-container)', color: 'var(--on-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
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
                            
                            <div className="donation-message" style={!s.message ? { color: 'var(--outline)' } : {}}>
                                <p>{s.message ? `"${s.message}"` : "Tidak ada pesan yang ditinggalkan."}</p>
                            </div>

                            {/* COMMENTS TOGGLE */}
                            <div className="interaction-row">
                                <button className="interaction-btn" onClick={() => setActiveCommentId(activeCommentId === s.id ? null : s.id)}>
                                    <span className="material-symbols-outlined text-sm">chat_bubble</span> 
                                    {comments[s.id]?.length || 0} Balasan
                                </button>
                            </div>

                            {/* COMMENT BOX */}
                            {activeCommentId === s.id && (
                              <div className="comment-section">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {comments[s.id]?.map(c => (
                                    <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                      <img src={c.photoURL} alt="Avatar" className="donasi-avatar" style={{ width: '24px', height: '24px' }} />
                                      <div style={{ padding: '0.5rem', backgroundColor: 'var(--surface-container-lowest)', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', fontSize: '0.8rem', flex: 1 }}>
                                        <strong>{c.name}</strong>: {c.text}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {user ? (
                                  <div className="comment-input-row">
                                    <input 
                                      className="comment-input" 
                                      placeholder="Tambahkan balasan..." 
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(s.id)}
                                    />
                                    <button className="donasi-btn donasi-btn-primary" onClick={() => handleSendComment(s.id)} style={{ padding: '0.25rem 0.75rem' }}>
                                      <span className="material-symbols-outlined text-sm">send</span>
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-xs text-outline" style={{ marginTop: '0.5rem' }}><Link href="/auth/login" className="text-primary font-bold">Login</Link> untuk membalas.</p>
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
              </section>
          </div>

          <div className="column-right">
              {/* TOP SUPPORTERS SECTION */}
              <section className="donasi-card bg-surface-highest">
                  <h3 className="font-headline text-xl font-bold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' , fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      Top Supporters
                  </h3>
                  <div>
                      {topSupporters.map((ts, idx) => (
                        <div className="supporter-row" key={`ts-${idx}`}>
                            <div className="font-bold text-lg" style={{ color: 'var(--outline-variant)', width: '24px', textAlign: 'center' }}>{idx + 1}</div>
                            <div className="donasi-avatar" style={{ width: '40px', height: '40px', backgroundColor: idx === 0 ? 'var(--primary)' : 'var(--secondary-container)', color: idx === 0 ? 'var(--on-primary)' : 'var(--on-secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
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
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_display</span>
                          <span className="font-bold text-xs" style={{ color: "white" }}>Subscribe</span>
                      </a>
                      <a href="https://discord.gg/dJzbq53jXH" target="_blank" rel="noopener noreferrer" className="social-btn social-discord">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                          <span className="font-bold text-xs" style={{ color: "white" }}>Join Discord</span>
                      </a>
                  </div>
              </section>

              {/* MEME SECTION */}
              <section className="donasi-card meme-panel">
                  <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: 'var(--surface)', border: 'var(--border-brutal)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', overflow: 'hidden' }}>
                      <img alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGBR2iR_8EJjXUZiGgn_XgLM_BGfzrMb5WjlJdyhwQkbMeoDJ_eaAqIyaWks335kYtGIK7JbVLe8u5ZwqKUMjEzrBpqAt0b3kRxT1O_1dZDoKclWxmMo-XxoJwPEioSsLvaibSkPEoPGdN1PwrNRjTdsIWB0s7M94efO-XDUcQEKSGgVHSWlZjj2KACpkjvVOntkEXBEy4vAY1FXc5z0obSx34FX22Iv0pl5dWpRXFB57e47LVO-KbdJeVBG5DhkLYZQvn8kAUYPI"/>
                  </div>
                  <h4 className="font-headline font-bold text-lg" style={{ color: 'var(--on-tertiary-container)', lineHeight: 1.2 }}>"When you see the donation goal hit 100%"</h4>
                  <p className="text-xs mt-2 font-bold" style={{ color: 'rgba(94, 16, 106, 0.8)', marginTop: '0.5rem' }}>Terima kasih orang baik! 🐱</p>
              </section>
          </div>
      </main>

      <div className="fab-mobile">
          <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="fab-btn donasi-btn">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              Donasi Sekarang
          </a>
      </div>

      <AnimatePresence>
        {showAlert && currentAlert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(40,47,63,0.8)', backdropFilter: 'blur(8px)' }}></div>
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 1.2, opacity: 0 }} className="donasi-card bg-surface" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
              <div style={{ height: '200px', width: '100%', marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: 'var(--border-brutal)', position: 'relative' }}>
                <img src={currentAlert.meme} alt="Meme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h2 className="font-headline text-2xl font-extrabold text-primary mb-2">{currentAlert.name} SAWER!</h2>
              <div className="donasi-btn-primary font-bold text-2xl mb-4" style={{ display: 'inline-block', borderRadius: 'var(--radius-md)', padding: '0.5rem 1.5rem' }}>Rp {currentAlert.amount.toLocaleString()}</div>
              <p className="font-bold italic text-outline" style={{ backgroundColor: 'var(--surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'var(--border-brutal)' }}>
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
