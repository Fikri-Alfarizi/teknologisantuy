"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--blue-base)] overflow-hidden relative">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', 
          backgroundSize: '48px 48px' 
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--yellow)]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="brutal-box-lg bg-[var(--blue-dark)] relative z-10 mx-auto text-center"
        style={{ maxWidth: '520px', padding: '48px 32px', width: '90%' }}
      >
        <div 
          className="inline-flex items-center justify-center bg-[var(--yellow)] shadow-[var(--bs)] mb-6"
          style={{ width: '80px', height: '80px', borderRadius: '16px', border: '2.5px solid var(--black)' }}
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: '42px' }}>
            explore_off
          </span>
        </div>
        
        <h1 className="font-black mb-2 text-white" style={{ fontFamily: 'var(--font-archivo-black)', fontSize: '72px', lineHeight: '1' }}>
          404
        </h1>
        <div 
          className="inline-block bg-[var(--black)] text-[var(--yellow)] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{ transform: 'rotate(-2deg)' }}
        >
          Page Not Found
        </div>
        
        <p className="text-[#B0BEC5] mb-8 mx-auto" style={{ fontSize: '15px', lineHeight: '1.6', maxWidth: '380px' }}>
          Waduh! Halaman yang kamu cari sepertinya sudah hilang ditelan black hole atau URL-nya salah ketik nih.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-yellow" style={{ flex: '0 1 auto' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
            Balik ke Beranda
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline-white"
            style={{ flex: '0 1 auto' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Kembali
          </button>
        </div>
      </motion.div>
    </div>
  );
}
