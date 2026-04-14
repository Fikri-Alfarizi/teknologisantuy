"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ForumNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[var(--blue-base)] overflow-hidden relative">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', 
          backgroundSize: '48px 48px' 
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--blue-mid)]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl mx-auto text-center brutal-box-lg bg-[var(--blue-dark)] p-12 md:p-16 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[var(--blue-mid)] rounded-[var(--r-md)] border-[var(--bw)] border-[var(--black)] shadow-[var(--bs)] mb-8">
          <span className="material-symbols-outlined text-5xl text-black font-bold">
            forum
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black mb-4 text-white tracking-tight" style={{ fontFamily: 'var(--font-archivo-black)' }}>
          Forum Hilang
        </h1>
        <div className="inline-block bg-[var(--black)] text-[var(--blue-mid)] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6 rotate-[-2deg]">
          Community Not Found
        </div>
        
        <p className="text-[#B0BEC5] text-lg mb-10 max-w-md mx-auto">
          Thread atau komunitas forum yang kamu cari sepertinya tidak ada. Mungkin teman-teman di komunitas lain bisa membantu!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/forum" className="btn btn-blue w-full sm:w-auto justify-center">
            <span className="material-symbols-outlined text-[18px]">forum</span>
            Ke Forum Utama
          </Link>
          <Link href="/" className="btn btn-outline-white w-full sm:w-auto justify-center">
            <span className="material-symbols-outlined text-[18px]">home</span>
            Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
