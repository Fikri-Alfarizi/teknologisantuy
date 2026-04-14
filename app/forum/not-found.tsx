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
        className="brutal-box-lg bg-[var(--blue-dark)] relative z-10 mx-auto text-center"
        style={{ maxWidth: '520px', padding: '48px 32px', width: '90%' }}
      >
        <div 
          className="inline-flex items-center justify-center bg-[var(--blue-mid)] shadow-[var(--bs)] mb-6"
          style={{ width: '80px', height: '80px', borderRadius: '16px', border: '2.5px solid var(--black)' }}
        >
          <span className="material-symbols-outlined text-black font-bold" style={{ fontSize: '42px' }}>
            forum
          </span>
        </div>
        
        <h1 className="font-black mb-2 text-white" style={{ fontFamily: 'var(--font-archivo-black)', fontSize: '56px', lineHeight: '1.1' }}>
          Forum Hilang
        </h1>
        <div 
          className="inline-block bg-[var(--black)] text-[var(--blue-mid)] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{ transform: 'rotate(-2deg)' }}
        >
          Community Not Found
        </div>
        
        <p className="text-[#B0BEC5] mb-8 mx-auto" style={{ fontSize: '15px', lineHeight: '1.6', maxWidth: '380px' }}>
          Thread atau komunitas forum yang kamu cari sepertinya tidak ada. Mungkin teman-teman di komunitas lain bisa membantu!
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/forum" className="btn btn-blue" style={{ flex: '0 1 auto' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>forum</span>
            Ke Forum Utama
          </Link>
          <Link href="/" className="btn btn-outline-white" style={{ flex: '0 1 auto' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
            Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
