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
    <div className="min-h-screen bg-[#1F2933] pt-32 pb-20 px-4 relative">
      {/* Adsterra Social Bar */}
      <Script src="https://pl29153603.profitablecpmratenetwork.com/ac/dd/97/acdd97eeb1fbbcd3524c8515b27438ee.js" strategy="lazyOnload" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Adsterra Top Banner (HIDDEN ON MOBILE IF TOO LARGE, OR RESPONSIVE) */}
        <div className="hidden md:flex w-full min-h-[90px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl mb-8 items-center justify-center overflow-hidden">
          <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-top-728" />
        </div>

        <div className="bg-[#2C3A47] border-[2.5px] border-[#111820] shadow-[7px_7px_0px_0px_rgba(17,24,32,1)] rounded-[28px] p-6 md:p-12">
          <div className="flex flex-col items-center text-center">
            
            {/* Simple Icon Box */}
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-[2.5px] border-[#111820] mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors duration-500 ${isReady ? 'bg-[#2EC4B6]' : 'bg-[#3A4A57]'}`}>
              {isReady ? <CheckCircle2 className="w-10 h-10 text-white" /> : <Shield className="w-10 h-10 text-[#2EC4B6]" />}
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
              {isReady ? 'LINK SUDAH SIAP!' : 'MENYIAPKAN FILE...'}
            </h1>
            <div className="bg-[#2EC4B6] border-2 border-[#111820] px-4 py-1 rounded-full mb-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
               <p className="text-white font-bold uppercase tracking-wider text-xs">{gameName}</p>
            </div>

            {/* Progress Section */}
            {!isReady ? (
              <div className="w-full max-w-md space-y-6">
                <div className="flex justify-between items-center text-sm font-bold text-[#B0BEC5] px-1 uppercase tracking-widest">
                  <span>{statusText}</span>
                  <span className="bg-[#111820] text-[#2EC4B6] px-3 py-1 rounded-lg border-2 border-[#2EC4B6]/20">{countdown}s</span>
                </div>
                
                <div className="h-6 w-full bg-[#111820] border-[2.5px] border-[#111820] rounded-xl overflow-hidden p-1 shadow-inner">
                  <div 
                    className="h-full bg-[#2EC4B6] border-r-2 border-[#111820] transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {/* 468x60 Banner responsive */}
                <div className="pt-4 flex justify-center min-h-[60px] overflow-hidden rounded-lg">
                   <AdsterraAd id="9e3cd57d75a7607bfbb8eb212e8b0ee3" width={468} height={60} slotId="ad-mid-468" />
                </div>

                <p className="text-[10px] text-[#B0BEC5] text-center font-bold uppercase tracking-[0.2em] opacity-50">Sabar adalah kunci kemenangan</p>
              </div>
            ) : (
              <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <a 
                  href={targetUrl}
                  className="group w-full inline-flex items-center justify-center gap-3 bg-[#2EC4B6] hover:bg-[#20A39E] text-white font-black py-5 px-8 rounded-2xl border-[3px] border-[#111820] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 text-xl tracking-tight"
                >
                  <Download className="w-7 h-7" />
                  UNDUH SEKARANG
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-12">
            <div className="flex-1 p-6 rounded-2xl bg-[#3A4A57] border-[2.5px] border-[#111820] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-white font-extrabold flex items-center gap-2 mb-3 text-lg">
                <Shield className="w-5 h-5 text-[#2EC4B6]" /> KEAMANAN TERJAGA
              </h3>
              <p className="text-sm text-[#B0BEC5] leading-relaxed font-medium">
                Tiap link yang kami sajikan telah melalui proses verifikasi malware secara rutin demi keamanan PC anda.
              </p>
            </div>
            <div className="flex-1 p-4 rounded-2xl bg-white border-[2.5px] border-[#111820] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden min-h-[250px]">
              <AdsterraAd id="136aa22e44a04ff3d80d1888c11e7ecd" width={300} height={250} slotId="ad-rect-300" />
            </div>
          </div>
        </div>

        {/* Native Banner Section */}
        <div className="mt-10 bg-[#2C3A47] border-[2.5px] border-[#111820] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-[22px] p-6 lg:p-8 flex flex-col items-center">
          <p className="text-xs text-white font-black uppercase tracking-widest mb-6 px-4 py-1 bg-[#111820] rounded-lg">REKOMENDASI UNTUKMU</p>
          <Script async="async" data-cfasync="false" src="https://pl29153574.profitablecpmratenetwork.com/48133abeb7c91d73ea045430da0d0442/invoke.js" strategy="lazyOnload" />
          <div id="container-48133abeb7c91d73ea045430da0d0442" className="w-full"></div>
        </div>

        {/* Info Box */}
        <div className="mt-8 flex items-start gap-4 p-5 bg-[#3A4A57] border-[2.5px] border-[#111820] rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="w-6 h-6 text-yellow-400 shrink-0" />
          <div>
            <h4 className="text-white font-black text-sm mb-1 uppercase tracking-tight">PENTING</h4>
            <p className="text-xs text-[#B0BEC5] leading-relaxed font-semibold">
              Gunakan Ad-Blocker hanya jika anda merasa terganggu. Sebagian besar biaya server disokong dari iklan ini. Terima kasih atas pengertiannya!
            </p>
          </div>
        </div>

        {/* Bottom Banner (MOBILE FRIENDLY WRAPPER) */}
        <div className="w-full min-h-[90px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl mt-12 flex items-center justify-center overflow-hidden">
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
