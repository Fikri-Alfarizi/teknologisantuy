'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import '../artikel.css';

// ── Random Article Content Pool ──
const ARTICLES = [
  {
    category: 'Teknologi',
    title: '5 Tren Kecerdasan Buatan yang Akan Mendominasi Tahun 2026',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    paragraphs: [
      'Kecerdasan buatan (AI) terus berkembang dengan pesat dan mengubah berbagai aspek kehidupan manusia. Dari asisten virtual hingga mobil otonom, teknologi ini semakin terintegrasi dalam keseharian kita.',
      'Menurut laporan terbaru dari McKinsey Global Institute, investasi dalam AI generatif meningkat lebih dari 300% dibandingkan tahun sebelumnya. Perusahaan-perusahaan besar seperti Google, Microsoft, dan OpenAI berlomba-lomba mengembangkan model AI yang semakin canggih.',
      'Salah satu tren yang paling menarik adalah penggunaan AI dalam bidang kesehatan. Algoritma deep learning kini mampu mendeteksi penyakit dari foto rontgen dengan akurasi yang menyaingi dokter spesialis.',
    ],
    sections: [
      { heading: 'AI Generatif dalam Industri Kreatif', content: 'Teknologi seperti DALL-E, Midjourney, dan Stable Diffusion telah merevolusi cara seniman dan desainer bekerja. AI generatif tidak hanya membantu dalam pembuatan gambar, tetapi juga dalam penulisan konten, komposisi musik, dan bahkan pengembangan game. Banyak studio indie yang mengadopsi tools ini untuk mempercepat pipeline produksi mereka.' },
      { heading: 'Masa Depan Edge AI', content: 'Pemrosesan AI di perangkat edge (seperti smartphone dan IoT) semakin populer. Dengan chip khusus seperti Apple Neural Engine dan Google Tensor, perangkat mobile kini mampu menjalankan model AI tanpa perlu koneksi internet. Hal ini membuka peluang baru untuk aplikasi real-time seperti augmented reality dan pengenalan suara offline.' },
      { heading: 'Etika dan Regulasi AI', content: 'Seiring dengan perkembangan AI, pertanyaan tentang etika dan regulasi semakin mengemuka. Uni Eropa telah mengesahkan AI Act, regulasi komprehensif pertama di dunia yang mengatur penggunaan AI. Indonesia sendiri sedang menyusun pedoman etika AI nasional melalui Badan Riset dan Inovasi Nasional (BRIN).' },
    ],
    quote: '"AI tidak akan menggantikan manusia, tetapi manusia yang menggunakan AI akan menggantikan mereka yang tidak." — Kai-Fu Lee'
  },
  {
    category: 'Gadget',
    title: 'Review Lengkap: Smartphone Flagship Terbaik untuk Produktivitas 2026',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    paragraphs: [
      'Di era digital yang serba cepat ini, memilih smartphone yang tepat menjadi keputusan penting bagi produktivitas sehari-hari. Dengan banyaknya pilihan di pasaran, konsumen sering kali bingung menentukan perangkat yang sesuai.',
      'Tahun 2026 menghadirkan persaingan ketat di segmen flagship. Samsung Galaxy S26 Ultra, iPhone 17 Pro Max, dan Google Pixel 10 Pro masing-masing menawarkan keunggulan tersendiri dalam hal performa, kamera, dan ekosistem.',
      'Dari segi performa, chipset terbaru seperti Snapdragon 8 Gen 5 dan Apple A19 Pro memberikan peningkatan signifikan dalam efisiensi daya dan kecepatan pemrosesan. Benchmark Geekbench menunjukkan lonjakan performa multi-core hingga 40% dibanding generasi sebelumnya.',
    ],
    sections: [
      { heading: 'Perbandingan Kamera: Siapa Juaranya?', content: 'Samsung mengunggulkan sensor 200MP dengan optical zoom 10x, sementara Apple fokus pada pemrosesan komputasional dengan Photonic Engine terbarunya. Google Pixel tetap mengandalkan kecerdasan AI untuk menghasilkan foto yang natural dan konsisten, terutama dalam kondisi low-light.' },
      { heading: 'Baterai dan Pengisian Daya', content: 'Masalah daya tahan baterai masih menjadi perhatian utama pengguna. Kabar baiknya, teknologi baterai silicon-carbon yang diadopsi oleh beberapa produsen menawarkan kapasitas 20% lebih besar tanpa menambah ukuran fisik. Fast charging 120W kini menjadi standar di perangkat flagship.' },
      { heading: 'Tips Memilih Smartphone yang Tepat', content: 'Sebelum membeli, pertimbangkan kebutuhan utama Anda. Jika fotografi adalah prioritas, Pixel 10 Pro patut dipertimbangkan. Untuk multitasking berat, Galaxy S26 Ultra dengan RAM 16GB menjadi pilihan ideal. Dan untuk ekosistem yang terintegrasi, iPhone 17 Pro Max tetap tak tertandingi.' },
    ],
    quote: '"Smartphone terbaik adalah yang paling cocok dengan kebutuhan dan gaya hidup penggunanya." — MKBHD'
  },
  {
    category: 'Tips & Trik',
    title: '10 Cara Efektif Meningkatkan Produktivitas Kerja dari Rumah',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80',
    paragraphs: [
      'Work from home (WFH) telah menjadi bagian tak terpisahkan dari budaya kerja modern. Namun, banyak pekerja yang masih kesulitan menjaga produktivitas saat bekerja dari rumah dibandingkan di kantor.',
      'Penelitian dari Stanford University menunjukkan bahwa pekerja remote yang memiliki rutinitas terstruktur 23% lebih produktif dibandingkan yang tidak. Kunci utamanya adalah menciptakan lingkungan kerja yang kondusif dan disiplin dalam manajemen waktu.',
      'Dalam artikel ini, kami akan membahas strategi-strategi yang telah terbukti efektif berdasarkan riset dan pengalaman para profesional yang telah sukses beradaptasi dengan model kerja hybrid.',
    ],
    sections: [
      { heading: 'Desain Ruang Kerja yang Optimal', content: 'Investasikan pada kursi ergonomis dan meja yang tepat. Pencahayaan alami terbukti meningkatkan mood dan produktivitas. Pastikan area kerja Anda terpisah dari area istirahat untuk menciptakan batasan psikologis antara waktu kerja dan waktu pribadi. Monitor eksternal juga sangat membantu untuk multitasking.' },
      { heading: 'Teknik Manajemen Waktu Pomodoro', content: 'Teknik Pomodoro melibatkan kerja fokus selama 25 menit diikuti istirahat 5 menit. Setelah 4 siklus, ambil istirahat panjang 15-30 menit. Metode ini terbukti mengurangi kelelahan mental dan meningkatkan konsentrasi. Gunakan aplikasi seperti Forest atau Focus@Will untuk membantu implementasinya.' },
      { heading: 'Pentingnya Digital Detox', content: 'Notifikasi media sosial adalah pembunuh produktivitas nomor satu. Gunakan fitur Focus Mode di smartphone Anda selama jam kerja. Batasi pengecekan email menjadi 3 kali sehari pada waktu yang sudah ditentukan. Luangkan minimal 30 menit sebelum tidur tanpa layar untuk kualitas tidur yang lebih baik.' },
    ],
    quote: '"Produktivitas bukan tentang melakukan lebih banyak, tapi tentang melakukan hal yang tepat dengan lebih efisien." — Tim Ferriss'
  },
  {
    category: 'Sains',
    title: 'Penemuan Terbaru: Bagaimana Komputasi Kuantum Mengubah Dunia Digital',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    paragraphs: [
      'Komputasi kuantum bukan lagi sekadar teori fisika. Perusahaan teknologi terkemuka dunia telah mencapai milestone penting dalam mengembangkan komputer kuantum yang praktis dan dapat diandalkan.',
      'Google baru-baru ini mengumumkan prosesor kuantum Willow yang mampu menyelesaikan perhitungan dalam hitungan menit yang membutuhkan waktu ribuan tahun bagi superkomputer konvensional. Pencapaian ini menandai era baru dalam komputasi.',
      'Implikasi dari perkembangan ini sangat luas, mulai dari penemuan obat baru, optimisasi rantai pasokan, pemodelan iklim, hingga kriptografi yang tak terpecahkan.',
    ],
    sections: [
      { heading: 'Apa Itu Qubit dan Mengapa Penting?', content: 'Berbeda dengan bit klasik yang hanya bisa bernilai 0 atau 1, qubit dapat berada dalam superposisi kedua nilai secara bersamaan. Ini memungkinkan komputer kuantum memproses informasi secara paralel dalam skala yang tak terbayangkan. Dengan 300 qubit, komputer kuantum secara teoritis dapat merepresentasikan lebih banyak status daripada jumlah atom di alam semesta.' },
      { heading: 'Aplikasi Praktis yang Sudah Ada', content: 'Beberapa perusahaan farmasi telah menggunakan simulasi kuantum untuk mempercepat penemuan obat baru. IBM Quantum Network menghubungkan lebih dari 200 organisasi yang bereksperimen dengan algoritma kuantum untuk optimisasi logistik, manajemen portofolio keuangan, dan machine learning.' },
      { heading: 'Tantangan yang Masih Dihadapi', content: 'Meskipun kemajuan signifikan, komputer kuantum masih menghadapi tantangan besar. Qubit sangat sensitif terhadap gangguan lingkungan (decoherence) dan membutuhkan suhu mendekati nol absolut untuk beroperasi. Para ilmuwan sedang mengembangkan teknik error correction yang lebih efisien untuk mengatasi masalah ini.' },
    ],
    quote: '"Komputer kuantum bukan hanya lebih cepat, mereka berpikir dengan cara yang fundamentally berbeda." — Michio Kaku'
  },
  {
    category: 'Internet',
    title: 'Panduan Lengkap: Cara Menjaga Keamanan Data Pribadi di Era Digital',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80',
    paragraphs: [
      'Di tengah maraknya kebocoran data dan serangan siber, menjaga keamanan informasi pribadi menjadi keterampilan esensial bagi setiap pengguna internet. Kasus-kasus terbaru menunjukkan bahwa tidak ada platform yang benar-benar aman dari ancaman.',
      'Badan Siber dan Sandi Negara (BSSN) mencatat peningkatan 65% serangan siber di Indonesia dibandingkan tahun lalu. Phishing, ransomware, dan pencurian identitas digital menjadi tiga ancaman terbesar yang dihadapi pengguna internet Indonesia.',
      'Kabar baiknya, ada langkah-langkah sederhana yang bisa Anda lakukan untuk secara signifikan meningkatkan keamanan digital Anda tanpa perlu menjadi ahli cybersecurity.',
    ],
    sections: [
      { heading: 'Password Manager: Investasi Wajib', content: 'Gunakan password manager seperti Bitwarden, 1Password, atau KeePass untuk mengelola kata sandi yang unik dan kuat untuk setiap akun. Hindari menggunakan password yang sama di beberapa layanan. Aktifkan autentikasi dua faktor (2FA) menggunakan aplikasi authenticator, bukan SMS yang rentan terhadap SIM swapping.' },
      { heading: 'VPN dan Enkripsi Komunikasi', content: 'Virtual Private Network (VPN) mengenkripsi lalu lintas internet Anda, melindungi data dari pengintaian terutama saat menggunakan WiFi publik. Pilih layanan VPN yang terpercaya dan memiliki kebijakan no-log. Untuk komunikasi sensitif, gunakan aplikasi dengan enkripsi end-to-end seperti Signal.' },
      { heading: 'Deteksi dan Hindari Phishing', content: 'Selalu periksa URL sebelum memasukkan kredensial. Email phishing sering menggunakan domain yang mirip dengan layanan asli dengan perbedaan subtle. Jangan klik link dari sumber yang tidak dikenal, dan waspadai email yang menciptakan rasa urgensi. Jika ragu, akses layanan langsung melalui browser, bukan melalui link di email.' },
    ],
    quote: '"Keamanan digital bukan pilihan, melainkan kebutuhan dasar di abad ke-21." — Edward Snowden'
  }
];

// Decode token to get game ID
function decodeToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split('::');
    return parts.length >= 2 ? parts[1] : null;
  } catch {
    // Try atob for client-side
    try {
      const decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
      const parts = decoded.split('::');
      return parts.length >= 2 ? parts[1] : null;
    } catch {
      return null;
    }
  }
}

const COUNTDOWN_SECONDS = 30;

export default function ArtikelPage() {
  const { token } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [adblockDetected, setAdblockDetected] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const articleRef = useRef(null);

  // Pick a random article based on token (deterministic per token)
  const articleIndex = token
    ? token.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % ARTICLES.length
    : 0;
  const article = ARTICLES[articleIndex];

  // Fetch game data
  useEffect(() => {
    async function load() {
      const gameId = decodeToken(token);
      if (!gameId) { setError('Invalid link'); setLoading(false); return; }
      try {
        const res = await fetch(`/api/game/${gameId}`);
        if (!res.ok) throw new Error('Not found');
        setGame(await res.json());
      } catch { setError('Game not found'); }
      finally { setLoading(false); }
    }
    if (token) load();
  }, [token]);

  // Adblock detection
  useEffect(() => {
    const detectAdblock = async () => {
      try {
        const res = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD', mode: 'no-cors'
        });
      } catch {
        setAdblockDetected(true);
      }
      // Also check via bait element
      const bait = document.createElement('div');
      bait.className = 'adsbox ad-slot textads banner-ads';
      bait.style.cssText = 'position:absolute;top:-999px;left:-999px;width:1px;height:1px;';
      document.body.appendChild(bait);
      setTimeout(() => {
        if (bait.offsetHeight === 0 || bait.clientHeight === 0 || window.getComputedStyle(bait).display === 'none') {
          setAdblockDetected(true);
        }
        bait.remove();
      }, 200);
    };
    detectAdblock();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (loading || error || adblockDetected) return;
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, error, adblockDetected]);

  // Scroll tracking
  const handleScroll = useCallback(() => {
    if (!articleRef.current) return;
    const el = articleRef.current;
    const scrollTop = window.scrollY;
    const docHeight = el.scrollHeight - window.innerHeight;
    const percent = Math.min(Math.round((scrollTop / docHeight) * 100), 100);
    setScrollPercent(percent);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Show download when countdown = 0 AND scroll >= 70%
  useEffect(() => {
    if (countdown <= 0 && scrollPercent >= 70) {
      setShowDownload(true);
    }
  }, [countdown, scrollPercent]);

  // SVG circle params
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference * (countdown / COUNTDOWN_SECONDS);

  if (loading) {
    return (
      <div className="artikel-page">
        <div className="artikel-loading">
          <div className="spinner"></div>
          <p>Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="artikel-page">
        <div className="artikel-loading" style={{ color: '#ff6b6b' }}>
          <i className="fa-solid fa-circle-xmark" style={{ fontSize: 48 }}></i>
          <h2 style={{ color: 'var(--white)' }}>Artikel Tidak Ditemukan</h2>
          <p>Link yang Anda akses tidak valid atau sudah kadaluarsa.</p>
          <Link href="/game" style={{ color: 'var(--yellow)', textDecoration: 'underline' }}>
            ← Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* AdSense Script — hanya di halaman ini */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8353833570794153"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Adblock Overlay */}
      {adblockDetected && (
        <div className="adblock-overlay">
          <div className="adblock-box">
            <i className="fa-solid fa-shield-halved shield"></i>
            <h2>AdBlock Terdeteksi</h2>
            <p>
              Untuk mengakses konten ini, silakan matikan AdBlock atau ekstensi pemblokir iklan Anda terlebih dahulu.
            </p>
            <div className="steps">
              <strong>Cara menonaktifkan:</strong><br/>
              1. Klik ikon ekstensi AdBlock di browser<br/>
              2. Pilih "Pause" atau "Nonaktifkan di situs ini"<br/>
              3. Refresh halaman ini
            </div>
            <button className="reload-btn" onClick={() => window.location.reload()}>
              <i className="fa-solid fa-rotate-right"></i> Refresh Halaman
            </button>
          </div>
        </div>
      )}

      <div className="artikel-page" ref={articleRef}>
        {/* Breadcrumb */}
        <nav className="artikel-breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ opacity: 0.3 }}>/</span>
          <Link href="/blog">Blog</Link>
          <span style={{ opacity: 0.3 }}>/</span>
          <span>{article.category}</span>
        </nav>

        {/* Category */}
        <span className="artikel-category">{article.category}</span>

        {/* Title */}
        <h1 className="artikel-title">{article.title}</h1>

        {/* Meta */}
        <div className="artikel-meta">
          <span><i className="fa-regular fa-calendar"></i> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span><i className="fa-regular fa-clock"></i> 5 min read</span>
          <span><i className="fa-regular fa-user"></i> Redaksi</span>
        </div>

        {/* Featured Image */}
        <div className="artikel-featured-img">
          <img src={article.image} alt={article.title} />
        </div>

        {/* ═══ AD SLOT 1 ═══ */}
        <div className="artikel-ad-slot" id="artikel-ad-1">Ad Space</div>

        {/* Article Body */}
        <div className="artikel-body">
          {article.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <blockquote>{article.quote}</blockquote>

          {/* ═══ AD SLOT 2 ═══ */}
          <div className="artikel-ad-slot" id="artikel-ad-2">Ad Space</div>

          {article.sections.map((sec, i) => (
            <div key={i}>
              <h2>{sec.heading}</h2>
              <p>{sec.content}</p>
              {/* Extra ad slot after 2nd section */}
              {i === 1 && (
                <div className="artikel-ad-slot" id="artikel-ad-3">Ad Space</div>
              )}
            </div>
          ))}

          {/* ═══ AD SLOT 4 ═══ */}
          <div className="artikel-ad-slot" id="artikel-ad-4">Ad Space</div>

          <h2>Kesimpulan</h2>
          <p>
            Perkembangan teknologi terus bergerak cepat dan membawa perubahan besar dalam kehidupan kita sehari-hari.
            Tetap update dengan informasi terbaru untuk tidak ketinggalan.
            Jangan lupa bookmark halaman ini dan bagikan ke teman-teman yang membutuhkan informasi serupa.
          </p>
        </div>

        {/* ═══ DOWNLOAD GATE ═══ */}
        <div className="artikel-gate">
          {!showDownload ? (
            <>
              <h3>📥 Konten Eksklusif</h3>
              <p>Selesaikan progres di bawah untuk mengakses file yang diminta</p>

              {/* Scroll Progress */}
              <div className="scroll-progress">
                <i className="fa-solid fa-arrow-down"></i>
                <span>Scroll:</span>
                <div className="scroll-progress-bar">
                  <div className="scroll-progress-fill" style={{ width: `${Math.min(scrollPercent / 70 * 100, 100)}%` }}></div>
                </div>
                <span style={{ color: scrollPercent >= 70 ? 'var(--yellow)' : undefined, fontWeight: scrollPercent >= 70 ? 700 : 400 }}>
                  {scrollPercent >= 70 ? '✓' : `${Math.min(Math.round(scrollPercent / 70 * 100), 100)}%`}
                </span>
              </div>

              {/* Countdown */}
              <div className="countdown-circle">
                <svg viewBox="0 0 92 92">
                  <circle cx="46" cy="46" r="42"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - dashOffset}
                  />
                </svg>
                <span className="cd-number">{countdown}</span>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.5 }}>
                {countdown > 0
                  ? `Tunggu ${countdown} detik...`
                  : scrollPercent < 70
                    ? 'Scroll artikel ke bawah untuk melanjutkan'
                    : 'Hampir selesai...'
                }
              </p>
            </>
          ) : (
            <>
              <h3>✅ File Siap Diunduh!</h3>
              <p style={{ marginBottom: '8px' }}>
                <strong style={{ color: 'var(--yellow)' }}>{game.title}</strong> — {game.size}
                {game.password !== '-' && (
                  <><br/><span style={{ fontSize: '13px' }}>Password: <strong style={{ color: 'var(--yellow)' }}>{game.password}</strong></span></>
                )}
              </p>
              <a
                href={game.link}
                target="_blank"
                rel="noopener noreferrer"
                className="artikel-dl-btn"
              >
                <i className="fa-solid fa-download"></i>
                Download Sekarang
              </a>
            </>
          )}
        </div>

        {/* ═══ AD SLOT 5 ═══ */}
        <div className="artikel-ad-slot" id="artikel-ad-5">Ad Space</div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/game" style={{ color: 'var(--yellow)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </>
  );
}
