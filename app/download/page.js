'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeDownloadUrl } from '../lib/url-obfuscator';
import { Shield, Download, AlertTriangle, CheckCircle2, Loader2, Gamepad2, Share2, Bookmark, Zap, Cpu, MessageCircle, TrendingUp, Eye, Heart, MessageSquare } from 'lucide-react';
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

  return <div id={slotId} className="flex justify-center overflow-hidden rounded-lg" />;
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const [gameName, setGameName] = useState('Memuat Game...');
  const [targetUrl, setTargetUrl] = useState('');
  const [gameGenre, setGameGenre] = useState('');
  
  const [countdown, setCountdown] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Mengamankan koneksi...');

  useEffect(() => {
    const token = searchParams.get('to');
    const name = searchParams.get('name');
    const genre = searchParams.get('genre') || 'Action RPG';
    
    if (token) {
      setTargetUrl(decodeDownloadUrl(token));
      if (name) setGameName(name);
      setGameGenre(genre);

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @media (max-width: 768px) {
          .fixed-widget { position: static !important; margin-bottom: 20px; }
        }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
        <nav className="flex flex-col md:flex-row justify-between items-center h-20 px-6 max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black tracking-tighter text-blue-600">TEKNOLOGI SANTUY</div>
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Download Mandiri</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="text-slate-700 hover:text-blue-600 font-semibold text-sm transition-colors">Beranda</Link>
            <Link href="/game" className="text-slate-700 hover:text-blue-600 font-semibold text-sm transition-colors">Game</Link>
            <Link href="/download" className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1 text-sm">Download</Link>
          </div>
        </nav>
      </header>

      {/* PROGRESS BAR */}
      <div className="fixed top-16 left-0 w-full h-1 bg-slate-200 z-40">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress * 3.33}%` }}></div>
      </div>

      {/* Fixed Download Widget */}
      <div className={`fixed right-6 top-24 z-40 max-w-sm fixed-widget transition-all duration-300 ${isReady ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase">Verifikasi Download</span>
            </div>
            <h3 className="font-bold text-sm line-clamp-1">{gameName}</h3>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {!isReady ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-600">{statusText}</span>
                    <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{countdown}S</span>
                  </div>
                  <div className="relative h-6 bg-slate-200 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-linear flex items-center justify-end pr-1"
                      style={{ width: `${progress}%` }}
                    >
                      {progress > 5 && <span className="text-[10px] font-bold text-white">{Math.round(progress)}%</span>}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex gap-2 text-xs text-green-700">
                    <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Aman & Terpercaya</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 text-center italic">Baca artikel sementara kami memproses...</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-green-700">Siap di-download!</span>
                </div>
                <a 
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  <Download className="w-5 h-5" />
                  UNDUH SEKARANG
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20">
        
        {/* TOP AD */}
        <div className="w-full flex justify-center mb-8 overflow-x-auto">
          <div className="bg-white border border-slate-300 rounded-lg p-2 flex items-center justify-center">
            <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-top" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          
          {/* ARTICLE */}
          <article className="bg-white rounded-lg">
            
            {/* Header */}
            <div className="px-6 md:px-10 pt-8 pb-6 border-b border-slate-200">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase mb-4">{gameGenre}</span>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                {gameGenre === 'Action RPG' ? 'Evolusi Gaming 2024: Bagaimana Game Modern Mengubah Industri' : `Panduan Lengkap: Cara Memilih Game ${gameGenre} Terbaik`}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
                  <div>
                    <p className="font-bold text-sm">Tim Teknologi Santuy</p>
                    <p className="text-xs text-slate-500">25 Agustus 2024 • 8 min</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <Bookmark className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="grid grid-cols-3 gap-6 p-6 md:p-10">
              <div className="col-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1538481527238-41badf67c289?w=800&q=80" 
                  alt="Gaming"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
              </div>
              <div className="bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center min-h-[300px] overflow-hidden">
                <AdsterraAd id="136aa22e44a04ff3d80d1888c11e7ecd" width={300} height={250} slotId="ad-sidebar" />
              </div>
            </div>

            {/* Article Body */}
            <div className="px-6 md:px-10 pb-10 space-y-6 text-slate-700 leading-relaxed">
              
              <p className="text-lg font-semibold text-slate-900">
                Perkembangan industri gaming telah mencapai titik infleksi yang signifikan pada tahun 2024. Tidak hanya tentang grafis yang memukau, melainkan tentang bagaimana teknologi gaming mengubah cara kita berinteraksi dengan media digital.
              </p>

              <p>
                Revolusi ini dimulai dengan akselerasi pengadopsian ray tracing real-time, teknologi neural rendering, dan AI-driven game design. Setiap pemain kini mendapatkan cerita yang unik dan pengalaman yang personal.
              </p>

              {/* MID AD */}
              <div className="my-8 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center py-8 overflow-hidden">
                <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-mid-1" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-8">Dampak Ekonomis Gaming Global</h2>
              
              <p>
                Market gaming global diproyeksikan mencapai $220 miliar pada 2024, tumbuh 11.2% year-over-year. Pertumbuhan ini didorong oleh ekspansi di Asia Tenggara, di mana Indonesia memainkan peran krusial sebagai salah satu pasar dengan penetrasi mobile gaming tertinggi.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 pl-6 py-4 my-6">
                <p className="font-semibold text-slate-900 italic text-lg mb-2">
                  "Gaming adalah ekosistem yang menciptakan lapangan kerja, mendorong inovasi teknologi, dan mengubah cara kita bersosialisasi."
                </p>
                <p className="text-sm text-slate-600">— Dr. Andi Sutrisno, Gaming Analyst</p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-8">Tren Teknologi Mendominasi 2024</h2>

              <ul className="space-y-3 list-none">
                <li className="flex gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Cloud Gaming:</strong> Streaming game dengan latensi ultra-rendah.</span>
                </li>
                <li className="flex gap-3">
                  <Cpu className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>AI & Procedural:</strong> Konten yang dihasilkan secara prosedural.</span>
                </li>
                <li className="flex gap-3">
                  <Gamepad2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Cross-platform:</strong> Ekosistem yang seamless antar device.</span>
                </li>
              </ul>

              {/* ANOTHER AD */}
              <div className="my-8 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center py-8 overflow-hidden">
                <AdsterraAd id="9e3cd57d75a7607bfbb8eb212e8b0ee3" width={468} height={60} slotId="ad-mid-2" />
              </div>

              <p>
                Indonesia mengalami pertumbuhan tercepat dalam adopsi teknologi gaming. Startup lokal seperti Agate Games telah mengembangkan teknologi kompetitif secara global.
              </p>

            </div>

            {/* Related */}
            <div className="px-6 md:px-10 py-10 border-t border-slate-200">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600"></span> Artikel Terkait
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <a href="#" className="group block bg-slate-50 rounded-lg p-4 hover:shadow-lg transition-all">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mb-3 uppercase">Tips</span>
                  <h4 className="font-bold text-sm leading-snug">Cara Optimasi Performa PC Gaming</h4>
                </a>
                <a href="#" className="group block bg-slate-50 rounded-lg p-4 hover:shadow-lg transition-all">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mb-3 uppercase">Hardware</span>
                  <h4 className="font-bold text-sm leading-snug">GPU Terbaru 2024: Comparison</h4>
                </a>
                <a href="#" className="group block bg-slate-50 rounded-lg p-4 hover:shadow-lg transition-all">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mb-3 uppercase">Esports</span>
                  <h4 className="font-bold text-sm leading-snug">Turnamen E-Sports Indonesia</h4>
                </a>
              </div>
            </div>

            {/* Comments */}
            <div className="px-6 md:px-10 py-10 bg-slate-50 rounded-b-lg">
              <h4 className="font-bold text-lg mb-6">Komentar (14)</h4>
              <div className="flex gap-4 mb-10">
                <div className="flex-1">
                  <textarea 
                    placeholder="Tulis komentar..."
                    className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    rows={3}
                  />
                  <button className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                    Kirim
                  </button>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
                  <div>
                    <p className="font-bold text-sm">Rudi Hermawan <span className="text-xs text-slate-500 font-normal">2 jam</span></p>
                    <p className="text-sm text-slate-700">Sangat setuju! Gaming di Indonesia berkembang pesat.</p>
                  </div>
                </div>
              </div>
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="space-y-8">
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <div className="bg-blue-600 text-white p-4">
                <h3 className="font-black text-sm">POPULER</h3>
              </div>
              <div className="p-6 space-y-6">
                <a href="#" className="flex gap-4 group">
                  <span className="text-3xl font-black text-slate-300 group-hover:text-blue-600">01</span>
                  <h4 className="font-bold text-sm leading-tight">Bitcoin Tembus Rekor Baru</h4>
                </a>
                <a href="#" className="flex gap-4 group">
                  <span className="text-3xl font-black text-slate-300 group-hover:text-blue-600">02</span>
                  <h4 className="font-bold text-sm leading-tight">Fitur AI di Smartphone</h4>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow">
              <div className="bg-blue-600 text-white p-4">
                <h3 className="font-black text-sm">KATEGORI</h3>
              </div>
              <div className="p-6 flex flex-wrap gap-2">
                <a href="#" className="px-3 py-2 bg-slate-100 text-blue-600 text-xs font-bold rounded hover:bg-blue-600 hover:text-white transition-all">Teknologi</a>
                <a href="#" className="px-3 py-2 bg-slate-100 text-blue-600 text-xs font-bold rounded hover:bg-blue-600 hover:text-white transition-all">Gaming</a>
                <a href="#" className="px-3 py-2 bg-slate-100 text-blue-600 text-xs font-bold rounded hover:bg-blue-600 hover:text-white transition-all">Tutorial</a>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-lg">
              <h3 className="font-black text-lg mb-3">Newsletter</h3>
              <p className="text-xs mb-4 opacity-90">Update gaming mingguan di inbox Anda.</p>
              <input placeholder="Email" type="email" className="w-full p-2 rounded text-slate-900 text-xs mb-3 focus:outline-none" />
              <button className="w-full py-2 bg-blue-700 font-bold text-xs rounded hover:bg-blue-800 transition-all">SUBSCRIBE</button>
            </div>

          </aside>

        </div>

        {/* BOTTOM AD */}
        <div className="w-full flex justify-center mt-12 overflow-x-auto">
          <div className="bg-white border border-slate-300 rounded-lg p-2 flex items-center justify-center">
            <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-bottom" />
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-xl font-black mb-2">TEKNOLOGI SANTUY</div>
            <p className="text-slate-400 text-xs">© 2024 Portal Game & Teknologi Indonesia</p>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-white text-xs transition-colors">About</a>
            <a href="#" className="text-slate-400 hover:text-white text-xs transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white text-xs transition-colors">Contact</a>
          </div>

          <div className="flex gap-4 text-slate-400">
            <span className="hover:text-white cursor-pointer">f</span>
            <span className="hover:text-white cursor-pointer">𝕏</span>
            <span className="hover:text-white cursor-pointer">▶</span>
          </div>
        </div>
      </footer>

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
