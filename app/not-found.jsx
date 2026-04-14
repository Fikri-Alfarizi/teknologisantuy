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
        className="w-full max-w-2xl mx-auto text-center brutal-box-lg bg-[var(--blue-dark)] p-12 md:p-16 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[var(--yellow)] rounded-[var(--r-md)] border-[var(--bw)] border-[var(--black)] shadow-[var(--bs)] mb-8">
          <span className="material-symbols-outlined text-5xl text-white">
            explore_off
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-4 text-white tracking-tight" style={{ fontFamily: 'var(--font-archivo-black)' }}>
          404
        </h1>
        <div className="inline-block bg-[var(--black)] text-[var(--yellow)] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6 rotate-[-2deg]">
          Page Not Found
        </div>
        
        <p className="text-[#B0BEC5] text-lg mb-10 max-w-md mx-auto">
          Waduh! Halaman yang kamu cari sepertinya sudah hilang ditelan black hole atau URL-nya salah ketik nih.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn btn-yellow w-full sm:w-auto justify-center">
            <span className="material-symbols-outlined text-[18px]">home</span>
            Balik ke Beranda
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline-white w-full sm:w-auto justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali
          </button>
        </div>
      </motion.div>
    </div>
  );
}
