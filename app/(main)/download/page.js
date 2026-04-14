'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeDownloadUrl } from '../../lib/url-obfuscator';
import { Shield, Download, AlertCircle, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
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

  return <div id={slotId} className="w-full flex justify-center overflow-hidden" />;
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('to');
  const gameName = searchParams.get('name') || 'Game';
  
  const [countdown, setCountdown] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Mengamankan koneksi...');

  useEffect(() => {
    if (token) {
      setTargetUrl(decodeDownloadUrl(token));
    }
  }, [token]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setProgress(((10 - (countdown - 1)) / 10) * 100);
        
        if (countdown === 8) setStatusText('Mengecek integritas file...');
        if (countdown === 6) setStatusText('Menghubungkan ke Mirror Server...');
        if (countdown === 4) setStatusText('Bypass proteksi link...');
        if (countdown === 2) setStatusText('Siap mengunduh!');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
      setStatusText('Link Verifikasi Berhasil!');
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-[#1F2933] pt-32 pb-20 px-4 relative flex flex-col items-center">
      {/* Adsterra Social Bar */}
      <Script src="https://pl29153603.profitablecpmratenetwork.com/ac/dd/97/acdd97eeb1fbbcd3524c8515b27438ee.js" strategy="lazyOnload" />

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        
        {/* Adsterra Top Banner */}
        <div className="hidden md:flex w-full min-h-[110px] bg-white border-[3px] border-[#111820] shadow-[8px_8px_0px_0px_rgba(17,24,32,1)] rounded-2xl mb-12 items-center justify-center overflow-hidden p-2">
          <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-top-728" />
        </div>

        <div className="w-full bg-[#2C3A47] border-[3px] border-[#111820] shadow-[10px_10px_0px_0px_rgba(17,24,32,1)] rounded-[32px] p-8 md:p-14 mb-10">
          <div className="flex flex-col items-center text-center">
            
            {/* Simple Icon Box */}
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-[3px] border-[#111820] mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 ${isReady ? 'bg-[#2EC4B6]' : 'bg-[#3A4A57]'}`}>
              {isReady ? <CheckCircle2 className="w-12 h-12 text-[#111820]" /> : <Shield className="w-12 h-12 text-[#2EC4B6]" />}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase italic">
              {isReady ? 'LINK SUDAH SIAP!' : 'MENYIAPKAN DATA...'}
            </h1>
            
            <div className="bg-[#2EC4B6] border-[3px] border-[#111820] px-6 py-2 rounded-xl mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
               <p className="text-[#111820] font-black uppercase tracking-widest text-sm">{gameName}</p>
            </div>

            {/* Progress Section */}
            {!isReady ? (
              <div className="w-full max-w-lg space-y-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-black text-[#2EC4B6] uppercase tracking-widest bg-[#111820] px-4 py-1 rounded-lg border-2 border-[#111820]">
                    {statusText}
                  </span>
                  <span className="text-2xl font-black text-white bg-[#111820] px-4 py-1 rounded-xl border-2 border-[#111820] shadow-[4px_4px_0px_0px_rgba(46,196,182,0.3)]">
                    {countdown}s
                  </span>
                </div>
                
                <div className="h-8 w-full bg-[#111820] border-[3px] border-[#111820] rounded-2xl overflow-hidden p-1 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
                  <div 
                    className="h-full bg-[#2EC4B6] border-r-[3px] border-[#111820] transition-all duration-1000 ease-linear rounded-lg shadow-[0_0_20px_rgba(46,196,182,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {/* 468x60 Banner responsive */}
                <div className="pt-6 flex justify-center min-h-[80px]">
                   <div className="p-2 bg-white border-[3px] border-[#111820] rounded-xl shadow-[4px_4px_0px_0px_rgba(17,24,32,1)]">
                      <AdsterraAd id="9e3cd57d75a7607bfbb8eb212e8b0ee3" width={468} height={60} slotId="ad-mid-468" />
                   </div>
                </div>

                <p className="text-xs text-[#B0BEC5] text-center font-black uppercase tracking-[0.3em] opacity-60">Mohon tunggu sebentar ya santuyers</p>
              </div>
            ) : (
              <div className="w-full max-w-lg animate-in fade-in zoom-in slide-in-from-bottom-6 duration-500">
                <a 
                  href={targetUrl}
                  className="group w-full inline-flex items-center justify-center gap-4 bg-[#2EC4B6] hover:bg-[#20A39E] text-[#111820] font-black py-7 px-10 rounded-3xl border-[4px] border-[#111820] shadow-[10px_10px_0px_0px_rgba(17,24,32,1)] hover:shadow-[4px_4px_0px_0px_rgba(17,24,32,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200 text-2xl md:text-3xl tracking-tighter"
                >
                  <Download className="w-10 h-10" />
                  UNDUH SEKARANG
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8 mt-16">
            <div className="flex-1 p-8 rounded-[24px] bg-[#3A4A57] border-[3px] border-[#111820] shadow-[6px_6px_0px_0px_rgba(17,24,32,1)]">
              <h3 className="text-white font-black flex items-center gap-3 mb-4 text-xl italic uppercase">
                <Shield className="w-6 h-6 text-[#2EC4B6]" /> KEAMANAN TERJAGA
              </h3>
              <p className="text-base text-[#B0BEC5] leading-relaxed font-bold">
                Link ini telah kami verifikasi aman dari malware. Kami selalu menjaga keamanan santuyers saat mengunduh game.
              </p>
            </div>
            <div className="flex-1 p-4 rounded-[24px] bg-white border-[3px] border-[#111820] shadow-[6px_6px_0px_0px_rgba(17,24,32,1)] flex items-center justify-center overflow-hidden min-h-[280px]">
              <AdsterraAd id="136aa22e44a04ff3d80d1888c11e7ecd" width={300} height={250} slotId="ad-rect-300" />
            </div>
          </div>
        </div>

        {/* Native Banner Section */}
        <div className="w-full bg-[#2C3A47] border-[3px] border-[#111820] shadow-[8px_8px_0px_0px_rgba(17,24,32,1)] rounded-[28px] p-8 flex flex-col items-center">
          <p className="text-sm text-white font-black uppercase tracking-[0.2em] mb-8 bg-[#111820] px-8 py-2 rounded-full border-2 border-[#2EC4B6]/20 shadow-[4px_4px_0px_0px_rgba(46,196,182,0.1)]">REKOMENDASI KHUSUS UNTUKMU</p>
          <Script async="async" data-cfasync="false" src="https://pl29153574.profitablecpmratenetwork.com/48133abeb7c91d73ea045430da0d0442/invoke.js" strategy="lazyOnload" />
          <div id="container-48133abeb7c91d73ea045430da0d0442" className="w-full min-h-[200px]"></div>
        </div>

        {/* Info Box */}
        <div className="w-full mt-10 flex flex-col md:flex-row items-center gap-6 p-8 bg-[#3A4A57] border-[3px] border-[#111820] rounded-[24px] shadow-[6px_6px_0px_0px_rgba(17,24,32,1)]">
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center border-[3px] border-[#111820] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <AlertCircle className="w-10 h-10 text-[#111820]" />
          </div>
          <div>
            <h4 className="text-[#2EC4B6] font-black text-xl mb-2 uppercase italic tracking-tighter">PEMBERITAHUAN PENTING</h4>
            <p className="text-sm text-[#B0BEC5] leading-relaxed font-bold">
              Matikan Ad-Blocker jika tombol download tidak muncul. Iklan adalah satu-satunya sumber dana kami untuk menyewa server kecepatan tinggi buat kamu.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="w-full min-h-[110px] bg-white border-[3px] border-[#111820] shadow-[8px_8px_0px_0px_rgba(17,24,32,1)] rounded-2xl mt-14 flex items-center justify-center overflow-hidden p-2">
          <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-bottom-728" />
        </div>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F2933] flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#2EC4B6] animate-spin" /></div>}>
      <DownloadContent />
    </Suspense>
  );
}
