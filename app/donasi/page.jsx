"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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

// Sound effect for donation
const ALERT_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3";

const MEME_LIST = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJieHBobHh3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3cmVudmUmc2lkPWc/l0Hlx0N5lh6U/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJieHBobHh3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3d3Z3cmVudmUmc2lkPWc/3o7abKhOpu0N82FmXC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamR6N3ZqY2E5ZzB6Z3ZqY2E5ZzB6Z3ZqY2E5ZzB6Z3ZqY2E5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif",
  "https://api.memegen.link/images/custom/_/ANTAP_MANTAP.png?background=https://i.imgflip.com/4/30t1mt.jpg",
];

// Helper to extract YouTube ID
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
  const [targetGoal] = useState(50000); // 50rb target
  
  const audioRef = useRef(null);
  const isInitialLoad = useRef(true);
  const mountTime = useRef(Timestamp.now());

  // Calculate total donation for the goal bar
  const totalAmount = supporters.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const progressPercent = Math.min((totalAmount / targetGoal) * 100, 100);

  useEffect(() => {
    // 1. Listen to real-time donations
    const qDonations = query(
      collection(db, 'donations'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribeDonations = onSnapshot(qDonations, (snapshot) => {
      const donationData = snapshot.docs.map(doc => {
        const data = doc.data();
        const msg = data.message || "";
        const ytId = getYoutubeId(msg);
        
        return {
          id: doc.id,
          ...data,
          formattedDate: data.timestamp?.toDate().toLocaleString('id-ID', { 
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
          }) || 'Baru saja',
          videoType: ytId ? 'youtube' : null,
          videoId: ytId
        };
      });

      setSupporters(donationData);
      setLoading(false);

      if (!isInitialLoad.current && snapshot.docChanges().length > 0) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            if (data.timestamp && data.timestamp.seconds > mountTime.current.seconds) {
              triggerCelebration({
                name: data.name,
                amount: data.amount,
                message: data.message,
                meme: MEME_LIST[Math.floor(Math.random() * MEME_LIST.length)]
              });
            }
          }
        });
      }
      isInitialLoad.current = false;
    });

    // 2. Listen to real-time comments
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

    return () => {
      unsubscribeDonations();
      unsubscribeComments();
    };
  }, []);

  const triggerCelebration = (supporter) => {
    setCurrentAlert(supporter);
    setShowAlert(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setShowAlert(false), 6000);
  };

  const handleSendComment = async (donationId) => {
    if (!user) return alert("Silakan login untuk berkomentar!");
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, 'donation_comments'), {
        donationId,
        uid: user.uid,
        name: userProfile?.displayName || user.displayName || "User",
        photoURL: userProfile?.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${user.uid}`,
        text: newComment,
        timestamp: serverTimestamp()
      });
      setNewComment("");
      setActiveCommentId(null);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-yellow-500 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* DONATION GOAL BAR */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-2 font-black uppercase italic text-sm tracking-widest">
            <span className="text-yellow-400">TARGET SERVER MAINTENANCE: <span className="text-white">Rp {targetGoal.toLocaleString()}</span></span>
            <span className={totalAmount >= targetGoal ? "text-green-500" : "text-white"}>
              {totalAmount.toLocaleString()} / {targetGoal.toLocaleString()} ({Math.round(progressPercent)}%)
            </span>
          </div>
          <div className="h-8 bg-white/5 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-yellow-400 rounded-full flex items-center justify-end px-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[pulse_2s_linear_infinite]"></div>
            </motion.div>
          </div>
          {totalAmount >= targetGoal && (
            <div className="mt-2 text-center text-xs font-black text-green-500 animate-bounce">
              GOAL TERCAPAI! TERIMA KASIH ORANG BAIK! 🎉
            </div>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black italic mb-6 tracking-tighter uppercase leading-tight"
          >
            DONASI <span className="text-yellow-400 drop-shadow-[0_5px_0_rgba(0,0,0,1)]">SANTUY</span>
          </motion.h1>
          
          <motion.div className="flex flex-col items-center gap-6">
            <a 
              href="https://saweria.co/teknologisantuy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-yellow-400 text-black px-12 py-6 rounded-2xl font-black text-3xl hover:bg-white transition-all transform hover:scale-105 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4"
            >
              <i className="fa-solid fa-heart animate-bounce text-red-600"></i> SAWERIA SEKARANG
            </a>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> REAL-TIME DONATION
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <i className="fa-solid fa-play text-red-500"></i> VIDEO MEDIA SHARE
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {supporters.length > 0 ? (
            supporters.map((s, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#151515] rounded-[2.5rem] border-2 border-white/5 overflow-hidden flex flex-col h-full"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-black text-2xl uppercase tracking-tight text-white mb-1">{s.name}</h3>
                      <p className="text-xs text-yellow-400 font-bold uppercase tracking-[0.2em]">{s.formattedDate}</p>
                    </div>
                    <div className="bg-yellow-400 text-black px-6 py-2 rounded-2xl text-xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      Rp {s.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <i className="fa-solid fa-quote-left text-white/10 absolute -top-4 -left-4 text-5xl"></i>
                    <p className="text-gray-200 text-xl font-medium italic relative z-10 pl-4 border-l-4 border-yellow-400/30">
                      "{s.message || "Tetap santuy dan terus berkarya!"}"
                    </p>
                  </div>

                  {/* VIDEO EMBED IF EXISTS */}
                  {s.videoId && (
                    <div className="mt-6 mb-4 rounded-2xl overflow-hidden border-2 border-white/10 aspect-video bg-black relative group">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${s.videoId}`} 
                        title="Donation Media"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest shadow-lg">PERMANENT VIDEO</div>
                    </div>
                  )}
                </div>

                {/* COMMENT SECTION */}
                <div className="mt-auto bg-black/30 border-t border-white/5 p-6">
                  <div className="space-y-4 mb-4">
                    {comments[s.id]?.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
                          <img src={c.photoURL} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex-1">
                          <div className="text-[10px] font-black text-yellow-400 uppercase mb-1">{c.name}</div>
                          <p className="text-sm text-gray-300">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Tulis balasan..." 
                        className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none transition-all pr-12"
                        value={activeCommentId === s.id ? newComment : ""}
                        onChange={(e) => {
                          setActiveCommentId(s.id);
                          setNewComment(e.target.value);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(s.id)}
                      />
                      <button 
                        onClick={() => handleSendComment(s.id)}
                        className="absolute right-2 top-2 w-8 h-8 bg-yellow-400 text-black rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                       <Link href="/auth/login" className="text-xs font-black text-gray-500 uppercase hover:text-yellow-400 transition-colors">
                        LOGIN UNTUK BERKOMENTAR
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-30">
              <i className="fa-solid fa-hand-holding-heart text-7xl mb-6"></i>
              <h3 className="text-2xl font-black uppercase">MEMUAT DATA DONASI...</h3>
            </div>
          )}
        </div>
      </div>

      {/* ALERT OVERLAY */}
      <AnimatePresence>
        {showAlert && currentAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="bg-white text-black p-10 rounded-[3rem] border-[12px] border-black shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center relative"
            >
              <div className="h-64 w-full mb-8 rounded-[2rem] overflow-hidden border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Image src={currentAlert.meme} alt="Meme" fill className="object-cover" unoptimized />
              </div>
              <div className="text-xs font-black uppercase text-red-600 mb-1 tracking-widest">Sultan Baru Muncul!</div>
              <h2 className="text-3xl font-black uppercase mb-4 leading-none">{currentAlert.name} <br/> <span className="opacity-50">SAWER!</span></h2>
              <div className="bg-yellow-400 border-4 border-black inline-block px-10 py-3 text-4xl font-black my-2 transform -rotate-1">
                Rp {currentAlert.amount.toLocaleString()}
              </div>
              <p className="mt-8 text-2xl font-bold italic leading-tight p-4 bg-gray-100 rounded-2xl border-2 border-black">
                "{currentAlert.message || "Maju terus Teknologi Santuy!"}"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} preload="auto">
        <source src={ALERT_SOUND_URL} type="audio/mpeg" />
      </audio>
    </div>
  );
}
