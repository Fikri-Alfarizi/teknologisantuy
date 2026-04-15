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
    <div className="min-h-screen bg-[#f4f0ea] text-[#111820] font-sans relative selection:bg-[#2EC4B6]/30 selection:text-[#111820] py-10 px-4"
         style={{ 
           backgroundImage: 'radial-gradient(#111820 1px, transparent 1px)', 
           backgroundSize: '24px 24px' 
         }}>
      
      {/* Adsterra Social Bar */}
      <Script src="https://pl29153603.profitablecpmratenetwork.com/ac/dd/97/acdd97eeb1fbbcd3524c8515b27438ee.js" strategy="lazyOnload" />

      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        
        {/* Top Header Ad */}
        <div className="w-full flex justify-center">
          <div className="bg-white border-[4px] border-[#111820] rounded-[16px] shadow-[4px_4px_0px_0px_#111820] p-2 overflow-hidden flex items-center justify-center max-w-[740px] min-h-[106px]">
            <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-top-728" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ================= LEFT COLUMN (2fr equivalent) ================= */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white border-[4px] border-[#111820] rounded-[24px] shadow-[8px_8px_0px_0px_#111820] p-8 md:p-14 text-center">
              
              {/* Icon Box */}
              <div className={`w-20 h-20 border-[4px] border-[#111820] rounded-[16px] shadow-[4px_4px_0px_0px_#111820] flex items-center justify-center mx-auto mb-8 transition-all duration-500 scale-110 ${isReady ? 'bg-[#2EC4B6] animate-none' : 'bg-white animate-pulse'}`}>
                {isReady ? <CheckCircle2 className="w-10 h-10" /> : <Shield className="w-10 h-10 text-[#2EC4B6]" />}
              </div>

              <h1 className="text-3xl md:text-5xl font-[900] uppercase tracking-tighter mb-4 italic">
                {isReady ? 'LINK SUDAH SIAP!' : 'MENYIAPKAN DATA'}
              </h1>
              
              <div className="inline-flex items-center gap-2 bg-white border-[4px] border-[#111820] rounded-full px-6 py-2 mb-12 shadow-[4px_4px_0px_0px_#111820]">
                 <Gamepad2 className="w-5 h-5 text-[#2EC4B6]" />
                 <span className="font-[800] text-sm md:text-base uppercase tracking-widest">{gameName}</span>
              </div>

              {/* Progress / Download Toggle */}
              {!isReady ? (
                <div className="max-w-[500px] mx-auto text-left space-y-4">
                  <div className="flex justify-between items-end font-[800]">
                    <span className="bg-[#111820] text-[#2EC4B6] px-3 py-1 rounded-[8px] text-xs uppercase tracking-wider">{statusText}</span>
                    <span className="text-2xl">{countdown}S</span>
                  </div>
                  
                  <div className="h-7 w-full bg-white border-[4px] border-[#111820] rounded-[16px] overflow-hidden shadow-[inset_4px_4px_0px_rgba(0,0,0,0.05)] p-0.5">
                    <div 
                      className="h-full bg-[#2EC4B6] border-r-[4px] border-[#111820] transition-all duration-1000 ease-linear rounded-[10px]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-center font-[700] text-xs opacity-60 uppercase tracking-widest mt-4">Tunggu sebentar, sistem sedang bersiap.</p>
                </div>
              ) : (
                <div className="max-w-[500px] mx-auto animate-in fade-in zoom-in slide-in-from-bottom-6 duration-500">
                  <a 
                    href={targetUrl}
                    className="group flex items-center justify-center gap-4 bg-[#2EC4B6] hover:bg-[#20A39E] text-[#111820] font-[900] text-xl md:text-2xl py-6 rounded-[16px] border-[4px] border-[#111820] shadow-[8px_8px_0px_0px_#111820] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#111820] transition-all duration-150 uppercase"
                  >
                    <Download className="w-8 h-8 group-hover:animate-bounce" />
                    UNDUH SEKARANG
                  </a>
                </div>
              )}
            </div>

            {/* Middle Container Ad */}
            <div className={`transition-all duration-500 overflow-hidden ${isReady ? 'h-0 opacity-0 mb-0' : 'h-auto mb-8'}`}>
              <div className="bg-white border-[4px] border-[#111820] rounded-[16px] shadow-[4px_4px_0px_0px_#111820] p-2 flex items-center justify-center min-h-[96px] max-w-[500px] mx-auto">
                <AdsterraAd id="9e3cd57d75a7607bfbb8eb212e8b0ee3" width={468} height={60} slotId="ad-mid-468" />
              </div>
            </div>

            {/* Feature Card */}
            <div className="bg-white border-[4px] border-[#111820] rounded-[24px] shadow-[8px_8px_0px_0px_#111820] p-6 flex gap-6 items-center">
              <div className="bg-[#111820] text-[#2EC4B6] p-4 rounded-[16px] border-[2px] border-[#111820] shrink-0">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-[900] text-xl uppercase italic tracking-tighter mb-1">BEBAS VIRUS & MALWARE</h3>
                <p className="text-sm font-[700] opacity-70">Link ini telah divalidasi aman. File yang kamu unduh terjamin kebersihannya.</p>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (1fr equivalent) ================= */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Sidebar Ad 300x250 */}
            <div className="bg-white border-[4px] border-[#111820] rounded-[16px] shadow-[4px_4px_0px_0px_#111820] p-4 flex items-center justify-center min-h-[290px]">
               <AdsterraAd id="136aa22e44a04ff3d80d1888c11e7ecd" width={300} height={250} slotId="ad-rect-300" />
            </div>

            {/* Alert Card */}
            <div className="bg-[#FFD166] border-[4px] border-[#111820] rounded-[24px] shadow-[8px_8px_0px_0px_#111820] p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-7 h-7" strokeWidth={3} />
                <h4 className="font-[900] text-xl uppercase tracking-tighter italic">PENTING BANGET!</h4>
              </div>
              <p className="text-sm font-[700] leading-relaxed">
                Kalau tombol download tidak muncul, tolong <strong>MATIKAN AD-BLOCKER</strong> kamu. Iklan adalah satu-satunya cara kami patungan bayar server ngebut ini.
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-white border-[4px] border-[#111820] rounded-[24px] shadow-[8px_8px_0px_0px_#111820] p-6">
               <h4 className="font-[900] text-sm uppercase mb-4 flex items-center gap-2">
                 <span className="w-3 h-3 bg-[#2EC4B6] border-[2px] border-[#111820] rounded-full"></span>
                 REKOMENDASI
               </h4>
               <div className="rounded-[12px] border-[2px] border-[#111820] overflow-hidden min-h-[200px]">
                  <Script async="async" data-cfasync="false" src="https://pl29153574.profitablecpmratenetwork.com/48133abeb7c91d73ea045430da0d0442/invoke.js" strategy="lazyOnload" />
                  <div id="container-48133abeb7c91d73ea045430da0d0442" className="w-full"></div>
               </div>
            </div>

          </div>
        </div>

        {/* Bottom Banner */}
        <div className="w-full flex justify-center mt-4">
          <div className="bg-white border-[4px] border-[#111820] rounded-[16px] shadow-[4px_4px_0px_0px_#111820] p-2 overflow-hidden flex items-center justify-center max-w-[740px] min-h-[106px]">
            <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-bottom-728" />
          </div>
        </div>

      </div>
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