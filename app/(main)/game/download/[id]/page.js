'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../download-article.css';

export default function DownloadArticlePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await fetch(`/api/game/${id}`);
        if (!res.ok) throw new Error('Game not found');
        const data = await res.json();
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchGame();
  }, [id]);

  if (loading) {
    return (
      <div className="dl-article">
        <div className="dl-loading">
          <div className="spinner"></div>
          <p>Memuat data game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="dl-article">
        <div className="dl-error">
          <i className="fa-solid fa-circle-exclamation"></i>
          <h2>Game Tidak Ditemukan</h2>
          <p>Data game yang kamu cari tidak ada atau sudah dihapus.</p>
          <Link href="/game" style={{
            color: 'var(--yellow)', textDecoration: 'underline', marginTop: '8px'
          }}>
            ← Kembali ke Katalog Game
          </Link>
        </div>
      </div>
    );
  }

  // Generate slug for SEO-friendly display
  const slug = game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="dl-article">
      {/* Breadcrumb */}
      <nav className="dl-breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href="/game">Game</Link>
        <span className="sep">/</span>
        <span>Download {game.title}</span>
      </nav>

      {/* Hero Cover */}
      <div className="dl-hero-cover">
        <img src={game.image} alt={game.title} />
      </div>

      {/* Meta Tags */}
      <div className="dl-meta">
        <span className="dl-meta-item">
          <i className="fa-regular fa-calendar"></i> {game.timestamp}
        </span>
        <span className="dl-meta-item">
          <i className="fa-solid fa-hard-drive"></i> {game.size}
        </span>
        <span className="dl-meta-item">
          <i className="fa-solid fa-gamepad"></i> PC Game
        </span>
        <span className="dl-meta-item">
          <i className="fa-solid fa-user-pen"></i> Teknologi Santuy
        </span>
      </div>

      {/* Article Title */}
      <h1 className="dl-title">
        Cara Download dan Install <span className="accent">{game.title}</span> di PC
      </h1>

      {/* ═══ AD SLOT 1: Top Banner ═══ */}
      <div className="ad-slot" id="ad-slot-top">
        {/* Paste kode AdSense / Ad Network di sini */}
        Ad Slot — Top Banner
      </div>

      {/* ═══ ARTICLE BODY ═══ */}
      <div className="dl-body">
        <h2><i className="fa-solid fa-circle-info"></i> Tentang {game.title}</h2>
        <p>
          <strong>{game.title}</strong> adalah salah satu game PC yang banyak dicari oleh gamers Indonesia. 
          Game ini tersedia untuk diunduh secara gratis melalui server komunitas Teknologi Santuy. 
          Dengan ukuran file sebesar <strong>{game.size}</strong>, pastikan kamu memiliki ruang penyimpanan 
          yang cukup sebelum memulai proses download.
        </p>
        <p>
          Artikel ini akan memandu kamu langkah demi langkah untuk mengunduh dan menginstall 
          game ini di PC kamu. Ikuti instruksi di bawah ini dengan seksama agar proses instalasi 
          berjalan lancar tanpa kendala.
        </p>

        <h2><i className="fa-solid fa-desktop"></i> Spesifikasi Minimum yang Disarankan</h2>
        <ul>
          <li><strong>Sistem Operasi:</strong> Windows 10/11 64-bit</li>
          <li><strong>Prosesor:</strong> Intel Core i5 atau setara AMD</li>
          <li><strong>RAM:</strong> 8 GB (16 GB disarankan)</li>
          <li><strong>GPU:</strong> NVIDIA GTX 1060 / AMD RX 580 atau lebih tinggi</li>
          <li><strong>Storage:</strong> {game.size} ruang kosong</li>
          <li><strong>DirectX:</strong> Versi 12</li>
        </ul>

        {/* ═══ AD SLOT 2: Mid Article ═══ */}
        <div className="ad-slot" id="ad-slot-mid">
          {/* Paste kode AdSense / Ad Network di sini */}
          Ad Slot — Mid Article
        </div>

        <h2><i className="fa-solid fa-list-check"></i> Langkah-Langkah Download & Install</h2>
        <p>Berikut adalah panduan langkah demi langkah untuk mengunduh dan menginstall game ini:</p>
        <ul>
          <li><strong>Langkah 1:</strong> Klik tombol <em>"Download Sekarang"</em> di bagian bawah artikel ini.</li>
          <li><strong>Langkah 2:</strong> Kamu akan diarahkan ke halaman hosting file. Tunggu beberapa saat lalu klik tombol download.</li>
          <li><strong>Langkah 3:</strong> Setelah file selesai diunduh, ekstrak menggunakan <strong>WinRAR</strong> atau <strong>7-Zip</strong>.</li>
          {game.password !== '-' && (
            <li><strong>Langkah 4:</strong> Saat diminta password, masukkan: <strong style={{color: 'var(--yellow)'}}>{game.password}</strong></li>
          )}
          <li><strong>{game.password !== '-' ? 'Langkah 5' : 'Langkah 4'}:</strong> Buka folder hasil ekstrak, lalu jalankan file <code>setup.exe</code> atau file installer yang tersedia.</li>
          <li><strong>{game.password !== '-' ? 'Langkah 6' : 'Langkah 5'}:</strong> Ikuti instruksi instalasi hingga selesai. Mainkan gamenya! 🎮</li>
        </ul>

        <h2><i className="fa-solid fa-triangle-exclamation"></i> Tips Penting</h2>
        <ul>
          <li>Matikan sementara <strong>Windows Defender / Antivirus</strong> selama proses instalasi untuk menghindari false positive.</li>
          <li>Pastikan kamu mengunduh dari link resmi yang tersedia di artikel ini.</li>
          <li>Gunakan <strong>IDM (Internet Download Manager)</strong> atau download manager lainnya untuk mempercepat proses download.</li>
          <li>Jika mengalami error saat instalasi, restart PC lalu coba lagi.</li>
          <li>Bergabunglah di <strong>Discord Teknologi Santuy</strong> untuk mendapatkan bantuan dari komunitas.</li>
        </ul>
      </div>

      {/* ═══ GAME INFO BOX ═══ */}
      <div className="dl-info-box">
        <h3><i className="fa-solid fa-circle-info"></i> Informasi File</h3>
        <div className="dl-info-grid">
          <div className="dl-info-item">
            <div className="label">Nama Game</div>
            <div className="value" style={{color: 'var(--white)'}}>{game.title}</div>
          </div>
          <div className="dl-info-item">
            <div className="label">Ukuran File</div>
            <div className="value">{game.size}</div>
          </div>
          <div className="dl-info-item">
            <div className="label">Password Ekstrak</div>
            <div className="value">{game.password}</div>
          </div>
          <div className="dl-info-item">
            <div className="label">Tanggal Upload</div>
            <div className="value" style={{color: 'var(--white)'}}>{game.timestamp}</div>
          </div>
        </div>
      </div>

      {/* ═══ AD SLOT 3: Before Download ═══ */}
      <div className="ad-slot" id="ad-slot-pre-download">
        {/* Paste kode AdSense / Ad Network di sini */}
        Ad Slot — Pre-Download
      </div>

      {/* ═══ DOWNLOAD SECTION ═══ */}
      <div className="dl-download-section">
        <h3>🎮 Siap Download?</h3>
        <p>Klik tombol di bawah untuk mulai mengunduh {game.title}</p>
        <a
          href={game.link}
          target="_blank"
          rel="noopener noreferrer"
          className="dl-download-btn"
        >
          <i className="fa-solid fa-download"></i>
          Download Sekarang ({game.size})
        </a>
      </div>

      {/* ═══ DISCLAIMER ═══ */}
      <div className="dl-disclaimer">
        <strong><i className="fa-solid fa-shield-halved"></i> Disclaimer:</strong> Teknologi Santuy hanya menyediakan 
        tautan yang bersumber dari komunitas. Kami tidak bertanggung jawab atas konten pihak ketiga. 
        Pastikan untuk membeli game original jika kamu menyukai gamenya dan mampu untuk mendukung 
        developer. Artikel ini bertujuan sebagai panduan informatif bagi komunitas.
      </div>

      {/* ═══ BACK LINK ═══ */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <Link href="/game" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: 'var(--yellow)', textDecoration: 'none', fontWeight: '600',
          fontSize: '15px', transition: 'opacity 0.2s'
        }}>
          <i className="fa-solid fa-arrow-left"></i> Kembali ke Katalog Game
        </Link>
      </div>
    </div>
  );
}
