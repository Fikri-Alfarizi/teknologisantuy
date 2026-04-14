"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--blue-base)] overflow-hidden relative">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', 
          backgroundSize: '48px 48px' 
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4757]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="brutal-box-lg bg-[var(--blue-dark)] relative z-10 mx-auto text-center"
        style={{ maxWidth: '520px', padding: '48px 32px', width: '90%' }}
      >
        <div 
          className="inline-flex items-center justify-center bg-[#FF4757] shadow-[var(--bs)] mb-6"
          style={{ width: '80px', height: '80px', borderRadius: '16px', border: '2.5px solid var(--black)' }}
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: '42px' }}>
            warning
          </span>
        </div>
        
        <h1 className="font-black mb-2 text-white" style={{ fontFamily: 'var(--font-archivo-black)', fontSize: '56px', lineHeight: '1.1' }}>
          Ups! Sistem Error
        </h1>
        <div 
          className="inline-block bg-[var(--black)] text-[#FF4757] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{ transform: 'rotate(-2deg)' }}
        >
          500 - Internal Error
        </div>
        
        <p className="text-[#B0BEC5] mb-8 mx-auto" style={{ fontSize: '15px', lineHeight: '1.6', maxWidth: '380px' }}>
          Maaf banget, sepertinya ada masalah di server kami. Teknisi virtual kami sedang berusaha memperbaikinya.
        </p>

        {error?.message && (
          <div 
            className="p-4 bg-[var(--black)]/50 rounded-[var(--r-md)] mb-8 text-left border border-[var(--black)] overflow-x-auto mx-auto"
            style={{ maxWidth: '100%', wordBreak: 'break-word' }}
          >
            <code className="text-[#FF4757] text-sm whitespace-pre-wrap font-mono">
              {error.message}
            </code>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => reset()} 
            className="btn bg-[#FF4757] text-white hover:bg-[#ff6b77] border-[var(--black)]"
            style={{ flex: '0 1 auto' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
            Coba Lagi
          </button>
          <Link href="/" className="btn btn-outline-white" style={{ flex: '0 1 auto' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
            Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
