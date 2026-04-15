'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeDownloadUrl } from '../../lib/url-obfuscator';
import { Shield, Download, AlertTriangle, CheckCircle2, Loader2, Gamepad2, Share2, Bookmark, Zap, Cpu, Eye, MessageCircle } from 'lucide-react';
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

  // Capture parameters and CLEAN URL immediately
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <style>{`
        .digital-grid {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        @media (max-width: 768px) {
          .fixed-widget { position: static !important; margin-bottom: 20px; max-width: 100% !important; }
        }
      `}</style>
      
      {/* Fixed Download Widget */}
      <div className={`fixed right-6 top-20 z-40 max-w-sm fixed-widget transition-all duration-300 ${isReady ? 'scale-95 opacity-75' : 'scale-100 opacity-100'}`}>
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
                {/* Progress Bar */}
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

                {/* Security Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex gap-2 text-xs text-green-700">
                    <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Link aman & terpercaya</span>
                  </div>
                </div>

                {/* Tips */}
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
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl transition-all duration-200 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  UNDUH SEKARANG
                </a>
                <p className="text-xs text-slate-500 text-center">Klik untuk memulai download</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen digital-grid pt-6 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Article Header */}
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Article Metadata */}
            <div className="px-6 md:px-10 pt-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">{gameGenre}</span>
                <span className="text-xs text-slate-500">Teknologi Gaming</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                Evolusi Gaming 2024: Bagaimana Game Modern Mengubah Industri Hiburan Digital
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
                  <div>
                    <p className="font-bold text-sm">Tim Teknologi Santuy</p>
                    <p className="text-xs text-slate-500">25 Agustus 2024 • 8 min baca</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Bookmark className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image with Ad */}
            <div className="grid grid-cols-3 gap-6 p-6 md:p-10">
              <div className="col-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1538481527238-41badf67c289?w=800&q=80" 
                  alt="Gaming Scene"
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
              </div>
              <div className="bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center min-h-[300px] overflow-hidden">
                <AdsterraAd id="136aa22e44a04ff3d80d1888c11e7ecd" width={300} height={250} slotId="ad-rect-1" />
              </div>
            </div>

            {/* Article Body */}
            <div className="px-6 md:px-10 pb-10 space-y-6 text-slate-700 leading-relaxed">
              
              <p className="text-lg first-letter:text-5xl first-letter:font-black first-letter:text-blue-600 first-letter:float-left first-letter:pr-3 first-letter:leading-none">
                Perkembangan industri gaming telah mencapai titik infleksi yang signifikan pada tahun 2024. Tidak hanya tentang grafis yang memukau atau mekanik gameplay yang kompleks, melainkan tentang bagaimana teknologi gaming mengubah cara kita berinteraksi dengan media digital secara fundamental.
              </p>

              <p>
                Revolusi ini dimulai dengan akselerasi pengadopsian ray tracing real-time, teknologi neural rendering, dan AI-driven game design yang membuat pengalaman bermain semakin personal dan dinamis. Setiap pemain kini mendapatkan cerita yang unik, lingkungan yang responsif, dan tantangan yang disesuaikan dengan gaya bermain mereka.
              </p>

              {/* Mid-article Ad */}
              <div className="my-8 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center py-8 overflow-hidden">
                <AdsterraAd id="dc9dac060d8897a73c73d316590a3e03" width={728} height={90} slotId="ad-mid-1" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-8">Dampak Ekonomis Gaming Global</h2>
              
              <p>
                Market gaming global diproyeksikan mencapai $220 miliar pada 2024, tumbuh 11.2% year-over-year. Pertumbuhan ini didorong oleh ekspansi di Asia Tenggara, di mana Indonesia memainkan peran krusial sebagai salah satu pasar dengan penetrasi mobile gaming tertinggi di dunia.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 pl-6 py-4">
                <p className="font-semibold text-slate-900 italic text-lg mb-2">
                  "Gaming bukan lagi sekadar hiburan. Ini adalah ekosistem yang menciptakan lapangan kerja, mendorong inovasi teknologi, dan mengubah cara kita bersosialisasi."
                </p>
                <p className="text-sm text-slate-600">— Dr. Andi Sutrisno, Gaming Analyst Indonesia</p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-8">Tren Teknologi yang Mendominasi</h2>

              <ul className="space-y-3 list-none">
                <li className="flex gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Cloud Gaming:</strong> Streaming game dengan latensi ultra-rendah memungkinkan akses instan ke library ribuan game tanpa download.</span>
                </li>
                <li className="flex gap-3">
                  <Cpu className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>AI & Procedural Generation:</strong> Konten yang dihasilkan secara prosedural menciptakan dunia game yang tak terbatas dan selalu segar.</span>
                </li>
                <li className="flex gap-3">
                  <Gamepad2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Cross-platform Play:</strong> Ekosistem yang seamless memungkinkan pemain bermain bersama regardless of device mereka.</span>
                </li>
              </ul>

              {/* Another Ad */}
              <div className="my-8 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center py-8 overflow-hidden">
                <AdsterraAd id="9e3cd57d75a7607bfbb8eb212e8b0ee3" width={468} height={60} slotId="ad-mid-2" />
              </div>

              <p>
                Indonesia mengalami pertumbuhan tercepat dalam adopsi teknologi gaming ini. Startup lokal seperti Nodeflux dan Agate Games telah mengembangkan teknologi yang kompetitif secara global, menunjukkan bahwa inovasi gaming tidak hanya datang dari Silicon Valley atau Tokyo.
              </p>

              <p>
                Dengan investasi besar dari venture capital, dukungan pemerintah melalui berbagai insentif, dan talenta muda yang antusias, Indonesia berpotensi menjadi pusat pengembangan game global dalam dekade mendatang. Komunitas gaming lokal yang vibrant menjadi testing ground sempurna untuk game-game baru sebelum launching global.
              </p>

            </div>

            {/* Related Articles */}
            <div className="px-6 md:px-10 py-10 border-t border-slate-200">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600"></span>
                Artikel Terkait
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <a href="#" className="group block bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 hover:shadow-md transition-all">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mb-3 uppercase">TIPS</span>
                  <h4 className="font-bold text-sm leading-snug group-hover:text-blue-600 transition-colors">Cara Optimasi Performa PC Gaming</h4>
                </a>
                <a href="#" className="group block bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 hover:shadow-md transition-all">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mb-3 uppercase">HARDWARE</span>
                  <h4 className="font-bold text-sm leading-snug group-hover:text-blue-600 transition-colors">GPU Terbaru 2024: Comparison & Review</h4>
                </a>
                <a href="#" className="group block bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 hover:shadow-md transition-all">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mb-3 uppercase">ESPORTS</span>
                  <h4 className="font-bold text-sm leading-snug group-hover:text-blue-600 transition-colors">Turnamen E-Sports Indonesia Meledak</h4>
                </a>
              </div>
            </div>

          </article>

          {/* Comments Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Diskusi ({12})
            </h3>
            
            <div className="space-y-4 mb-6">
              <textarea 
                placeholder="Bagikan pendapat Anda tentang gaming di Indonesia..."
                className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                Kirim Komentar
              </button>
            </div>

            <div className="space-y-5 border-t pt-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">Rudi Hermawan</span>
                    <span className="text-xs text-slate-500">2 jam lalu</span>
                  </div>
                  <p className="text-sm text-slate-700">Sangat setuju dengan artikel ini. Gaming di Indonesia memang berkembang pesat!</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">Eka Putri</span>
                    <span className="text-xs text-slate-500">1 jam lalu</span>
                  </div>
                  <p className="text-sm text-slate-700">Pengen lihat lebih banyak startup gaming lokal. Potensinya sangat besar!</p>
                </div>
              </div>
            </div>
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
