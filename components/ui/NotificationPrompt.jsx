'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Gamepad2, Sparkles } from 'lucide-react';

export default function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Cek apakah browser mendukung notifikasi & status izinnya
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setIsSubscribed(true);
        return;
      }

      // Jangan munculkan jika user baru saja menolak (dismiss) sebelumnya
      const dismissed = localStorage.getItem('notif_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setIsVisible(true), 5000); // Muncul setelah 5 detik
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsSubscribed(true);
        setIsVisible(false);
        
        // Tampilkan feedback sukses premium
        new Notification("Teknologi Santuy", {
          body: "Yash! Notifikasi Berhasil Diaktifkan. Kamu akan dapet info game terbaru!",
          icon: "/logo.png"
        });
      } else {
        handleDismiss();
      }
    } catch (error) {
      console.error("Notif Error:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('notif_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && !isSubscribed && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.9 }}
          className="fixed top-8 left-8 z-[9999]"
        >
          <div className="notif-premium-card">
            <style jsx>{`
              .notif-premium-card {
                background: #fff;
                border: 4px solid #000;
                box-shadow: 10px 10px 0 #000;
                padding: 20px;
                width: 320px;
                position: relative;
                color: #000;
              }
              .notif-badge {
                display: inline-block;
                background: #000;
                color: #ffe600;
                padding: 4px 10px;
                font-size: 10px;
                font-weight: 900;
                text-transform: uppercase;
                margin-bottom: 12px;
              }
              .notif-title {
                font-size: 18px;
                font-weight: 900;
                line-height: 1.2;
                margin-bottom: 8px;
                text-transform: uppercase;
              }
              .notif-desc {
                font-size: 13px;
                font-weight: 700;
                color: #444;
                margin-bottom: 18px;
              }
              .btn-container {
                display: flex;
                gap: 10px;
              }
              .btn-allow {
                flex: 1;
                background: #ffe600;
                color: #000;
                border: 3px solid #000;
                padding: 10px;
                font-weight: 900;
                font-size: 13px;
                text-transform: uppercase;
                cursor: pointer;
                box-shadow: 4px 4px 0 #000;
                transition: all 0.1s;
              }
              .btn-allow:active {
                transform: translate(2px, 2px);
                box-shadow: 2px 2px 0 #000;
              }
              .btn-later {
                background: #fff;
                border: 3px solid #000;
                padding: 10px 14px;
                font-weight: 900;
                font-size: 13px;
                cursor: pointer;
                color: #000;
              }
              .close-trigger {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                opacity: 0.3;
              }
              .close-trigger:hover { opacity: 1; }
              .sparkle-icon {
                position: absolute;
                top: -10px;
                right: -10px;
                background: #ffe600;
                border: 2px solid #000;
                padding: 6px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            `}</style>

            <div className="sparkle-icon"><Sparkles size={16} fill="#000" /></div>
            <X size={16} className="close-trigger" onClick={handleDismiss} />
            
            <div className="notif-badge">Update VIP</div>
            <div className="notif-title">Mau Info Game Gratis?</div>
            <div className="notif-desc">
              Kami akan kabari kamu lewat notifikasi browser setiap ada <b>Game Baru</b> atau <b>Update Patch</b>.
            </div>

            <div className="btn-container">
              <button className="btn-allow" onClick={requestPermission}>
                Aktifkan!
              </button>
              <button className="btn-later" onClick={handleDismiss}>
                Nanti saja
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
