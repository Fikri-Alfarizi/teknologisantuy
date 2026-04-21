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

// Fallback data if database is empty
const INITIAL_MOCK_DATA = [
  { id: 'm1', name: "Fikri Alfarizi", amount: 10000, message: "Contoh donasi: Video Youtube akan muncul di sini!", timestamp: null, videoId: 'dQw4w9WgXcQ' },
  { id: 'm2', name: "Orang Baik", amount: 5000, message: "Terus semangat bang!", timestamp: null },
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
  const [targetGoal] = useState(50000); 
  
  const audioRef = useRef(null);
  const isInitialLoad = useRef(true);
  const mountTime = useRef(Timestamp.now());

  // Use real data or fallback to mock
  const displaySupporters = supporters.length > 0 ? supporters : (loading ? [] : INITIAL_MOCK_DATA);
  const totalAmount = supporters.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const progressPercent = Math.min((totalAmount / targetGoal) * 100, 100);

  useEffect(() => {
    const qDonations = query(collection(db, 'donations'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribeDonations = onSnapshot(qDonations, (snapshot) => {
      const donationData = snapshot.docs.map(doc => {
        const data = doc.data();
        const msg = data.message || "";
        const ytId = getYoutubeId(msg);
        return {
          id: doc.id, ...data,
          formattedDate: data.timestamp?.toDate().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) || 'Baru saja',
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
    <div className="bg-[#0a0a0a] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 font-sans min-h-[70vh]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-2 font-black uppercase text-xs tracking-widest text-gray-500">
            <span>TARGET SERVER MAINTENANCE: <span className="text-yellow-400">Rp {targetGoal.toLocaleString()}</span></span>
            <span>{totalAmount.toLocaleString()} / {targetGoal.toLocaleString()} ({Math.round(progressPercent)}%)</span>
          </div>
          <div className="h-6 bg-white/5 rounded-full border-2 border-white/10 overflow-hidden p-1">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-yellow-400 rounded-full relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
            </motion.div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black italic mb-6 tracking-tighter uppercase leading-tight">
            DONASI <span className="text-yellow-400">SANTUY</span>
          </h1>
          <div className="flex flex-col items-center gap-6">
            <a href="https://saweria.co/teknologisantuy" target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black px-10 py-5 rounded-2xl font-black text-2xl hover:bg-white transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
              <i className="fa-solid fa-heart text-red-600"></i> SAWERIA SEKARANG
            </a>
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Real-time</span>
              <span className="flex items-center gap-1"><i className="fa-solid fa-play text-red-500"></i> Video Share</span>
            </div>
          </div>
        </div>

        {loading && supporters.length === 0 ? (
          <div className="text-center py-20 animate-pulse text-gray-600 font-black italic">MEMUAT DATA...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displaySupporters.map((s, idx) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-[#151515] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-full shadow-2xl">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-xl text-white uppercase">{s.name}</h3>
                      <p className="text-[10px] text-yellow-400 font-bold uppercase">{s.formattedDate || 'Baru'}</p>
                    </div>
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-xl text-sm font-black border-2 border-black">Rp {s.amount.toLocaleString()}</div>
                  </div>
                  <p className="text-gray-300 italic mb-4">"{s.message}"</p>
                  {s.videoId && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-black/50 border border-white/10">
                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${s.videoId}`} frameBorder="0" allowFullScreen></iframe>
                    </div>
                  )}
                </div>
                <div className="mt-auto bg-black/20 border-t border-white/5 p-4">
                  <div className="space-y-3 mb-4">
                    {comments[s.id]?.map(c => (
                      <div key={c.id} className="flex gap-2 text-xs">
                        <img src={c.photoURL} alt="" className="w-6 h-6 rounded-full border border-white/10 shrink-0" />
                        <div className="bg-white/5 p-2 rounded-xl flex-1"><span className="font-black text-yellow-400 mr-1">{c.name}:</span>{c.text}</div>
                      </div>
                    ))}
                  </div>
                  {user ? (
                    <div className="relative">
                      <input type="text" placeholder="Balas..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-yellow-400 outline-none pr-10" value={activeCommentId === s.id ? newComment : ""} onChange={(e) => { setActiveCommentId(s.id); setNewComment(e.target.value); }} onKeyDown={(e) => e.key === 'Enter' && handleSendComment(s.id)} />
                      <button onClick={() => handleSendComment(s.id)} className="absolute right-2 top-1.5 text-yellow-400"><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                  ) : (
                    <div className="text-center text-[10px] text-gray-600 font-black"><Link href="/auth/login">LOGIN UNTUK KOMEN</Link></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAlert && currentAlert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 1.2, opacity: 0 }} className="bg-white text-black p-8 rounded-[2rem] border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full text-center">
              <div className="h-48 w-full mb-4 rounded-xl overflow-hidden border-4 border-black relative">
                <Image src={currentAlert.meme} alt="Meme" fill className="object-cover" unoptimized />
              </div>
              <h2 className="text-2xl font-black uppercase mb-2">{currentAlert.name} SAWER!</h2>
              <div className="bg-yellow-400 border-4 border-black inline-block px-6 py-2 text-3xl font-black mb-4">Rp {currentAlert.amount.toLocaleString()}</div>
              <p className="font-bold italic">"{currentAlert.message}"</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} preload="auto"><source src={ALERT_SOUND_URL} type="audio/mpeg" /></audio>
    </div>
  );
}
