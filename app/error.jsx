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
        className="w-full max-w-2xl mx-auto text-center brutal-box-lg bg-[var(--blue-dark)] p-12 md:p-16 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FF4757] rounded-[var(--r-md)] border-[var(--bw)] border-[var(--black)] shadow-[var(--bs)] mb-8">
          <span className="material-symbols-outlined text-5xl text-white">
            warning
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight" style={{ fontFamily: 'var(--font-archivo-black)' }}>
          Ups! Sistem Error
        </h1>
        <div className="inline-block bg-[var(--black)] text-[#FF4757] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6 rotate-[-2deg]">
          500 - Internal Error
        </div>
        
        <p className="text-[#B0BEC5] text-lg mb-8 max-w-md mx-auto">
          Maaf banget, sepertinya ada masalah di server kami. Teknisi virtual kami sedang berusaha memperbaikinya.
        </p>

        {error?.message && (
          <div className="p-4 bg-[var(--black)]/50 rounded-[var(--r-md)] mb-8 text-left border border-[var(--black)] overflow-x-auto max-w-full">
            <code className="text-[#FF4757] text-sm break-words whitespace-pre-wrap font-mono">
              {error.message}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => reset()} 
            className="btn w-full sm:w-auto justify-center bg-[#FF4757] text-white hover:bg-[#ff6b77] border-[var(--black)]"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Coba Lagi
          </button>
          <Link href="/" className="btn btn-outline-white w-full sm:w-auto justify-center">
            <span className="material-symbols-outlined text-[18px]">home</span>
            Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
