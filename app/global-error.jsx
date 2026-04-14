"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body className="antialiased" style={{ backgroundColor: '#1F2933', color: '#FFFFFF' }}>
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--blue-base,#1F2933)] overflow-hidden relative" style={{ fontFamily: 'sans-serif' }}>
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', 
              backgroundSize: '48px 48px' 
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4757]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-2xl mx-auto text-center p-12 md:p-16 relative z-10" style={{
            border: '2.5px solid #111820', 
            borderRadius: '28px', 
            backgroundColor: '#2C3A47',
            boxShadow: '7px 7px 0 #111820'
          }}>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FF4757] mb-8" style={{
              borderRadius: '18px',
              border: '2.5px solid #111820',
              boxShadow: '5px 5px 0 #111820'
            }}>
              <span className="text-white" style={{ fontSize: '48px' }}>⚠️</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">
              Fatal Error
            </h1>
            <div className="inline-block px-4 py-1 mb-6 text-sm font-bold uppercase tracking-widest" style={{
              backgroundColor: '#111820',
              color: '#FF4757',
              borderRadius: '40px',
              transform: 'rotate(-2deg)'
            }}>
              Kritis - Root Crash
            </div>
            
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: '#B0BEC5' }}>
              Oops! Aplikasi mengalami crash berat. Kami sarankan untuk merefresh halaman.
            </p>

            {error?.message && (
              <div className="p-4 mb-8 text-left overflow-x-auto max-w-full" style={{
                backgroundColor: 'rgba(17,24,32,0.5)',
                borderRadius: '18px',
                border: '1px solid #111820'
              }}>
                <code className="text-sm break-words whitespace-pre-wrap font-mono" style={{ color: '#FF4757' }}>
                  {error.message}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => reset()} 
                className="w-full sm:w-auto justify-center font-bold px-6 py-3" style={{
                  backgroundColor: '#FF4757',
                  color: 'white',
                  border: '2.5px solid #111820',
                  borderRadius: '18px',
                  boxShadow: '5px 5px 0 #111820',
                  cursor: 'pointer'
                }}
              >
                Refresh Halaman
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="w-full sm:w-auto justify-center font-bold px-6 py-3" style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2.5px solid white',
                  borderRadius: '18px',
                  cursor: 'pointer'
                }}
              >
                Ke Beranda
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
