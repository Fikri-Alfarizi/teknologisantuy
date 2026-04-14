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

          <div className="mx-auto text-center relative z-10" style={{
            maxWidth: '520px',
            width: '90%',
            padding: '48px 32px',
            border: '2.5px solid #111820', 
            borderRadius: '28px', 
            backgroundColor: '#2C3A47',
            boxShadow: '7px 7px 0 #111820'
          }}>
            <div className="inline-flex items-center justify-center mb-6" style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#FF4757',
              borderRadius: '16px',
              border: '2.5px solid #111820',
              boxShadow: '4px 4px 0 #111820'
            }}>
              <span className="text-white" style={{ fontSize: '42px' }}>⚠️</span>
            </div>
            
            <h1 className="font-black mb-2 text-white" style={{ fontSize: '56px', lineHeight: '1.1' }}>
              Fatal Error
            </h1>
            <div className="inline-block px-4 py-1 mb-6 text-xs font-bold uppercase tracking-widest" style={{
              backgroundColor: '#111820',
              color: '#FF4757',
              borderRadius: '40px',
              transform: 'rotate(-2deg)'
            }}>
              Kritis - Root Crash
            </div>
            
            <p className="mb-8 mx-auto" style={{ color: '#B0BEC5', fontSize: '15px', lineHeight: '1.6', maxWidth: '380px' }}>
              Oops! Aplikasi mengalami crash berat. Kami sarankan untuk merefresh halaman.
            </p>

            {error?.message && (
              <div className="p-4 mb-8 text-left overflow-x-auto mx-auto" style={{
                backgroundColor: 'rgba(17,24,32,0.5)',
                borderRadius: '16px',
                border: '1px solid #111820',
                maxWidth: '100%',
                wordBreak: 'break-word'
              }}>
                <code className="text-sm whitespace-pre-wrap font-mono" style={{ color: '#FF4757' }}>
                  {error.message}
                </code>
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => reset()} 
                className="font-bold px-6 py-3" style={{
                  flex: '0 1 auto',
                  backgroundColor: '#FF4757',
                  color: 'white',
                  border: '2.5px solid #111820',
                  borderRadius: '14px',
                  boxShadow: '4px 4px 0 #111820',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}
              >
                Refresh Halaman
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="font-bold px-6 py-3" style={{
                  flex: '0 1 auto',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2.5px solid white',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontSize: '15px'
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
