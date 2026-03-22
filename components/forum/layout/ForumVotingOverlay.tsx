"use client";

import { auth, firestore } from "@/firebase/forum/clientApp";
import useCustomToast from "@/hooks/useCustomToast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCheck, FaExclamationTriangle, FaHourglassHalf, FaTimes, FaArrowLeft } from "react-icons/fa";

const ForumVotingOverlay: React.FC = () => {
  const [user, userLoading, userError] = useAuthState(auth);
  const [vote, setVote] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const showToast = useCustomToast();

  // Watch for auth errors (e.g. network-request-failed)
  useEffect(() => {
    if (userError) {
      const err = userError as any;
      console.error("[AUTH ERROR]:", err.code, err.message);
      if (err.code === "auth/network-request-failed") {
        showToast({
          title: "Gagal Kontak Firebase",
          status: "error",
          description: "Firebase tidak merespon (Network Failed). Hubungkan internet atau matikan pemblokir iklan."
        });
      }
    }
  }, [userError, showToast]);

  useEffect(() => {
    setMounted(true);
    // Use a fresh key to ensure clean state after previous bugs
    const voted = localStorage.getItem("forum_vote_ultra_v1");
    if (voted) {
      setHasVoted(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (vote === null) return;
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      showToast({
        title: "Koneksi Bermasalah",
        status: "warning",
        description: "Firebase tidak merespon. Pastikan koneksi internet stabil."
      });
    }, 8000);

    try {
      await addDoc(collection(firestore, "forumVotes"), {
        userId: user?.uid || "anonymous",
        vote: vote,
        feedback: feedback,
        timestamp: serverTimestamp(),
      });

      clearTimeout(timeoutId);
      localStorage.setItem("forum_vote_ultra_v1", "true");
      setIsSubmitted(true);
      showToast({
        title: "Suara Terkirim!",
        status: "success",
        description: "Terima kasih atas partisipasi kamu."
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Error submitting vote:", error);
      showToast({
        title: "Gagal Mengirim Suara",
        status: "error",
        description: error.message || "Bisa karena offline atau masalah teknis."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="voting-overlay">
      <style jsx>{`
        .voting-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          overflow-y: auto;
        }

        .vote-card {
          width: 100%;
          max-width: 440px;
          background: var(--blue-dark);
          border: 3px solid var(--black);
          box-shadow: 10px 10px 0 var(--black);
          position: relative;
          margin: auto;
        }

        .vote-header {
          background: var(--yellow);
          border-bottom: 3px solid var(--black);
          padding: 20px;
          text-align: center;
          color: var(--black);
        }

        .vote-header h2 {
          font-size: 22px;
          font-weight: 950;
          margin: 8px 0;
          text-transform: uppercase;
          letter-spacing: -0.5px;
        }

        .vote-body {
          padding: 20px 24px 30px;
        }

        .vote-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .option-btn {
          padding: 12px;
          border: 2px solid var(--black);
          font-weight: 900;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.1s;
          text-transform: uppercase;
        }

        .option-yes { background: #eee; color: #000; }
        .option-yes.active { background: #00ffaa; box-shadow: 3px 3px 0 var(--black); transform: translate(-1px, -1px); }
        
        .option-no { background: #eee; color: #000; }
        .option-no.active { background: #ff5f57; box-shadow: 3px 3px 0 var(--black); transform: translate(-1px, -1px); }

        .option-btn:hover:not(.active) {
          background: #fff;
        }

        .feedback-area {
          margin-bottom: 20px;
        }

        .feedback-label {
          display: block;
          color: var(--white);
          font-weight: 800;
          font-size: 11px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .custom-textarea {
          width: 100%;
          background: var(--white);
          border: 2px solid var(--black);
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 600;
          min-height: 80px;
          outline: none;
          box-shadow: inset 3px 3px 0 rgba(0,0,0,0.05);
          color: #000;
        }

        .submit-btn {
          width: 100%;
          background: var(--yellow);
          color: var(--black);
          border: 3px solid var(--black);
          padding: 14px;
          font-weight: 950;
          font-size: 16px;
          text-transform: uppercase;
          box-shadow: 6px 6px 0 var(--black);
          transition: all 0.1s;
          cursor: pointer;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0 var(--black);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .voter-info {
          text-align: center;
          margin-top: 20px;
          color: rgba(255,255,255,0.4);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .success-card {
          max-width: 400px;
          background: #00ffaa;
          border: 4px solid #000;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 12px 12px 0 #000;
          color: #000;
          margin: auto;
        }

        .success-card h3 {
          font-size: 28px;
          font-weight: 950;
          margin: 15px 0;
          text-transform: uppercase;
        }
      `}</style>



      {hasVoted || isSubmitted ? (
        <div className="vote-card">
          <div className="vote-header">
            <div style={{ background: '#00ffaa', display: 'inline-flex', padding: '15px', borderRadius: '50%', border: '4px solid #000', marginBottom: '10px', boxShadow: '4px 4px 0 #000' }}>
              <FaCheck size={40} />
            </div>
            <h2>TERIMA KASIH!</h2>
            <p style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '13px', opacity: 0.8 }}>SUARAMU TELAH TERCATAT</p>
          </div>
          <div className="vote-body" style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff', lineHeight: '1.6', marginBottom: '25px' }}>
              Masukanmu sangat berarti bagi kami untuk menentukan masa depan forum Teknologi Santuy.
            </p>
            <Link href="/" className="submit-btn" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              KEMBALI KE BERANDA
            </Link>
          </div>
        </div>
      ) : (
        <div className="vote-card">
          <div className="vote-header">
            <FaExclamationTriangle size={40} />
            <h2>Forum Under Dev</h2>
            <p style={{ fontWeight: 700, fontSize: '14px' }}>
              Bantu kami memutuskan apakah pengembangan forum ini layak dilanjutkan!
            </p>
          </div>

          <div className="vote-body">
            <div className="vote-options">
              <button 
                className={`option-btn option-yes ${vote === true ? 'active' : ''}`}
                onClick={() => setVote(true)}
              >
                <FaCheck /> Lanjutkan
              </button>
              <button 
                className={`option-btn option-no ${vote === false ? 'active' : ''}`}
                onClick={() => setVote(false)}
              >
                <FaTimes /> Jangan Dulu
              </button>
            </div>

            <div className="feedback-area">
              <label className="feedback-label">Apa Saran Kamu? (Opsional)</label>
              <textarea 
                className="custom-textarea"
                placeholder="Berikan idemu..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <button 
              className="submit-btn"
              onClick={handleSubmit}
              disabled={vote === null || loading}
            >
              {loading ? 'Mengirim...' : 'KIRIM SUARA'}
            </button>

            <div className="voter-info">
              <FaHourglassHalf style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {user ? user.displayName : 'Tamu Anonim'} • 1 Suara
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumVotingOverlay;
