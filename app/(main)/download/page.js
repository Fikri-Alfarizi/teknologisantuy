'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeDownloadUrl } from '../../lib/url-obfuscator';
import { Shield, Download, AlertTriangle, CheckCircle2, Loader2, Gamepad2 } from 'lucide-react';
import Script from 'next/script';

// Component for Adsterra Ads
function AdsterraAd({ id, width, height, slotId }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = document.getElementById(slotId);
    if (container && !container.hasChildNodes()) {
      const atOptions = document.createElement('script');
      atOptions.innerHTML = `
        atOptions = {
          'key' : '${id}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      const script = document.createElement('script');
      script.src = `https://www.highperformanceformat.com/${id}/invoke.js`;
      
      container.appendChild(atOptions);
      container.appendChild(script);
    }
  }, [id, width, height, slotId]);

  return <div id={slotId} className="flex justify-center overflow-hidden rounded-xl" />;
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const [gameName, setGameName] = useState('Memuat Game...');
  const [targetUrl, setTargetUrl] = useState('');
  
  const [countdown, setCountdown] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Mengamankan koneksi...');

  // Capture parameters and CLEAN URL immediately
  useEffect(() => {
    const token = searchParams.get('to');
    const name = searchParams.get('name');
    
    if (token) {
      setTargetUrl(decodeDownloadUrl(token));
      if (name) setGameName(name);

      // Clean the URL bar immediately (within 1ms)
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/download');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setProgress(((10 - (countdown - 1)) / 10) * 100);
        
        if (countdown === 8) setStatusText('Mengecek integritas file...');
        if (countdown === 6) setStatusText('Menghubungkan ke Mirror Server...');
        if (countdown === 4) setStatusText('Bypass proteksi link...');
        if (countdown === 2) setStatusText('Menyiapkan file unduhan...');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
      setStatusText('Link Verifikasi Berhasil!');
      setProgress(100);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 py-10 px-4 sm:px-6 lg:px-8 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Adsterra Social Bar */}
      <Script src="https://pl29153603.profitablecpmratenetwork.com/ac/dd/97/acdd97eeb1fbbcd3524c8515b27438ee.js" strategy="lazyOnload" />

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header & Ad (728x90) */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="hidden md:flex w-full max-w-[728px] min-h-[90px] bg-slate-900 border border-slate-800 rounded-2xl items-center justify-center overflow-hidden p-2 shadow-sm">
            <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-top-728" />
          </div>
        </div>

        {/* Main Grid Layout - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= KOLOM KIRI (MAIN CONTENT - 8 Kolom) ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-48 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

              <div className="relative z-10 flex flex-col items-center text-center">
                
                {/* Status Icon */}
                <div className="mb-6">
                  {isReady ? (
                    <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center ring-4 ring-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all duration-500">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center ring-4 ring-slate-700/50 animate-pulse transition-all duration-500">
                      <Shield className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Title & Game Name */}
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                  {isReady ? 'File Sudah Siap!' : 'Menyiapkan Data...'}
                </h1>
                
                <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-5 py-2.5 rounded-full mb-10 shadow-inner">
                   <Gamepad2 className="w-4 h-4 text-teal-400" />
                   <p className="text-slate-300 font-medium text-sm sm:text-base">{gameName}</p>
                </div>

                {/* Progress / Button Area */}
                {!isReady ? (
                  <div className="w-full max-w-md space-y-6">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-sm font-medium text-teal-400 animate-pulse">
                        {statusText}
                      </span>
                      <span className="text-xl font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                        {countdown}s
                      </span>
                    </div>
                    
                    {/* Modern Progress Bar */}
                    <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-1000 ease-linear relative overflow-hidden"
                        style={{ width: `${progress}%` }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite] -skew-x-12" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">
                      Mohon tunggu sebentar, sistem sedang memproses permintaan Anda.
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                    <a 
                      href={targetUrl}
                      className="group relative flex items-center justify-center gap-3 w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-5 px-8 rounded-2xl shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:-translate-y-1 transition-all duration-300 text-lg sm:text-xl"
                    >
                      <Download className="w-6 h-6 group-hover:animate-bounce" />
                      <span>Unduh Sekarang</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mid Ad (468x60) */}
            {!isReady && (
              <div className="w-full min-h-[80px] bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center p-2 shadow-sm">
                 <AdsterraAd id="9e3cd57d75a7607bfbb8eb212e8b0ee3" width={468} height={60} slotId="ad-mid-468" />
              </div>
            )}

            {/* Security Guarantee Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-700">
                <Shield className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Keamanan Terjamin</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Tautan ini telah melalui proses verifikasi keamanan internal kami. Kami berkomitmen untuk memastikan perangkat Anda aman dari perangkat lunak berbahaya saat mengunduh.
                </p>
              </div>
            </div>

          </div>

          {/* ================= KOLOM KANAN (SIDEBAR - 4 Kolom) ================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Square Ad (300x250) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-center min-h-[280px] shadow-sm">
              <AdsterraAd id="136aa22e44a04ff3d80d1888c11e7ecd" width={300} height={250} slotId="ad-rect-300" />
            </div>

            {/* Warning Info Box */}
            <div className="bg-amber-950/30 border border-amber-500/20 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="text-amber-500 font-semibold text-base">Perhatian Penting</h4>
              </div>
              <p className="text-amber-200/70 text-sm leading-relaxed">
                Harap matikan <strong>Ad-Blocker</strong> Anda jika tombol unduhan tidak muncul. Iklan membantu kami mempertahankan server berkecepatan tinggi secara gratis untuk Anda.
              </p>
            </div>

            {/* Native Recommendations */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm text-slate-300 font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Rekomendasi
              </h4>
              <div className="rounded-xl overflow-hidden min-h-[200px]">
                <Script async="async" data-cfasync="false" src="https://pl29153574.profitablecpmratenetwork.com/48133abeb7c91d73ea045430da0d0442/invoke.js" strategy="lazyOnload" />
                <div id="container-48133abeb7c91d73ea045430da0d0442" className="w-full"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Banner (728x90) */}
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-[728px] min-h-[100px] bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center p-2 shadow-sm">
            <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-bottom-728" />
          </div>
        </div>

      </div>

      {/* Global CSS for custom animations (shimmer) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col gap-4 items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <span className="text-slate-400 font-medium animate-pulse">Memuat halaman...</span>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  );
}