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
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative selection:bg-teal-500/30 selection:text-teal-200">
      {/* Adsterra Social Bar */}
      <Script src="https://pl29153603.profitablecpmratenetwork.com/ac/dd/97/acdd97eeb1fbbcd3524c8515b27438ee.js" strategy="lazyOnload" />

      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center">
        
        {/* Top Desktop Ad (728x90) */}
        <div className="hidden lg:flex w-full justify-center mb-12">
          <div className="w-full max-w-[728px] min-h-[90px] bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl flex items-center justify-center p-2 shadow-xl">
            <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-top-728" />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: PROCESS (8/12) ================= */}
          <div className="lg:col-span-8 space-y-8 flex flex-col items-center">
            
            <div className="w-full bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-[40px] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
              {/* Inner accent ring */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
              
              <div className="flex flex-col items-center text-center">
                
                {/* Dynamic Icon State */}
                <div className="mb-10 relative">
                  <div className={`absolute inset-0 blur-2xl rounded-full transition-all duration-700 ${isReady ? 'bg-teal-500/30' : 'bg-slate-700/20 animate-pulse'}`} />
                  <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center border-2 transition-all duration-500 relative z-10 ${isReady ? 'bg-teal-500 border-teal-400 text-slate-950 scale-110' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                    {isReady ? <CheckCircle2 className="w-12 h-12" /> : <Shield className="w-12 h-12 animate-pulse" />}
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                  {isReady ? 'LINK DOWNLOAD SIAP!' : 'MENYIAPKAN DATA...'}
                </h1>
                
                <div className="inline-flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-6 py-2.5 rounded-2xl mb-12 shadow-inner">
                   <Gamepad2 className="w-5 h-5 text-teal-400" />
                   <span className="text-slate-200 font-bold uppercase tracking-widest text-sm md:text-base">{gameName}</span>
                </div>

                {/* Main Progress Area */}
                {!isReady ? (
                  <div className="w-full max-w-xl space-y-8 animate-in fade-in duration-700">
                    <div className="flex justify-between items-end mb-1 px-2 text-sm font-black uppercase tracking-[0.2em]">
                      <span className="text-teal-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-ping" />
                        {statusText}
                      </span>
                      <span className="text-white bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-700 font-mono text-lg">
                        {countdown}S
                      </span>
                    </div>
                    
                    <div className="h-10 w-full bg-slate-950 border-2 border-slate-800/80 rounded-3xl overflow-hidden p-1.5 shadow-2xl relative">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-600 via-teal-400 to-teal-500 rounded-2xl transition-all duration-1000 ease-linear relative overflow-hidden shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                        style={{ width: `${progress}%` }}
                      >
                         <div className="absolute inset-0 bg-white/20 skew-x-[-20deg] animate-[shimmer_2s_infinite] w-[30%]" />
                      </div>
                    </div>

                    <div className="py-4 flex justify-center min-h-[80px]">
                       <div className="bg-white/5 backdrop-blur-sm border border-slate-800 rounded-2xl p-2.5 shadow-xl">
                          <AdsterraAd id="9e3cd57d75a7607bfbb8eb212e8b0ee3" width={468} height={60} slotId="ad-mid-468" />
                       </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.3em] opacity-40 italic">Membangun koneksi terenkripsi...</p>
                  </div>
                ) : (
                  <div className="w-full max-w-xl animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700">
                    <a 
                      href={targetUrl}
                      className="group relative w-full inline-flex items-center justify-center gap-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-8 px-12 rounded-[32px] shadow-[0_20px_50px_rgba(20,184,166,0.3)] hover:shadow-[0_25px_60px_rgba(20,184,166,0.5)] transition-all duration-300 transform hover:-translate-y-2 active:scale-95 text-2xl md:text-3xl"
                    >
                      <Download className="w-10 h-10 group-hover:bounce" />
                      UNDUH SEKARANG
                    </a>
                    <p className="mt-8 text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Terimakasih sudah mampir santuyers!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Desktop Ad (728x90) */}
            <div className="hidden lg:flex w-full justify-center">
              <div className="w-full max-w-[728px] min-h-[90px] bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl flex items-center justify-center p-2 shadow-xl">
                <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-bottom-728" />
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SIDEBAR (4/12) ================= */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Ad Rectangle (300x250) */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[32px] p-6 flex flex-col items-center justify-center min-h-[320px] shadow-2xl overflow-hidden relative group">
               <div className="absolute top-4 left-4 text-[10px] font-black text-slate-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Sponsor Hub</div>
               <AdsterraAd id="136aa22e44a04ff3d80d1888c11e7ecd" width={300} height={250} slotId="ad-rect-300" />
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[28px] p-6 hover:bg-slate-800/40 transition-colors shadow-lg">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20 mb-4">
                  <Shield className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-white font-black text-lg mb-2 uppercase tracking-tight italic">AMOR PROTECTED</h3>
                <p className="text-sm text-slate-400 font-bold leading-relaxed opacity-80">
                  Semua link telah melewati verifikasi internal kami. Keamanan device kamu adalah prioritas nomor satu.
                </p>
              </div>

              <div className="bg-amber-950/20 backdrop-blur-xl border border-amber-500/20 rounded-[28px] p-6 shadow-lg">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <h4 className="text-amber-500 font-black text-lg mb-2 uppercase tracking-tight italic">ALERT!</h4>
                <p className="text-sm text-amber-100/60 font-medium leading-relaxed">
                  Matikan <b>Ad-Blocker</b> jika tombol download tidak muncul. Iklan membantu kami menjaga server tetap online secara gratis.
                </p>
              </div>
            </div>

            {/* Native Ads Placeholder */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[32px] p-6 shadow-2xl">
              <p className="text-[10px] text-teal-500 font-black uppercase tracking-[0.3em] mb-6 text-center">TOP RECOMMENDATIONS</p>
              <div className="rounded-2xl overflow-hidden min-h-[220px] bg-black/20 p-2">
                <Script async="async" data-cfasync="false" src="https://pl29153574.profitablecpmratenetwork.com/48133abeb7c91d73ea045430da0d0442/invoke.js" strategy="lazyOnload" />
                <div id="container-48133abeb7c91d73ea045430da0d0442" className="w-full"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(350%) skewX(-20deg); }
        }
        .bounce { animation: bounce 1s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
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