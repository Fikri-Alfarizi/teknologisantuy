'use client';
import { useState } from 'react';
import { sendEmail } from '@/app/actions/sendEmail';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    
    const formData = new FormData(e.target);
    
    try {
      const result = await sendEmail(formData);
      
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setError("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
    } finally {
      setIsSending(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        padding: '40px', background: 'var(--yellow)', border: '4px solid var(--black)',
        borderRadius: '16px', textAlign: 'center', boxShadow: '8px 8px 0px rgba(0,0,0,0.8)'
      }}>
        <i className="fa-solid fa-circle-check" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
        <h2 style={{ color: 'var(--black)', fontSize: '2rem' }}>Pesan Terkirim!</h2>
        <p style={{ color: 'var(--black)', fontWeight: 600, marginTop: '10px' }}>
          Terima kasih sudah menghubungi Teknologi Santuy secara profesional. Kami akan segera membalasnya sesantai mungkin! ☕
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="btn btn-primary" 
          style={{ marginTop: '24px', background: 'var(--black)', color: 'var(--yellow)' }}
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form-box">
      {error && (
        <div style={{ 
          background: '#ff5f57', color: 'white', padding: '12px 16px', 
          borderRadius: '12px', border: '2px solid var(--black)',
          fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px',
          boxShadow: '4px 4px 0 #000'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div className="contact-form-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--yellow)' }}>Nama Lengkap</label>
          <input 
            name="name" type="text" required
            placeholder="Siapa namamu?"
            style={{
              padding: '16px', background: '#fff', border: '3px solid var(--black)',
              borderRadius: '8px', fontSize: '1rem', fontWeight: 600, outline: 'none', color: '#000'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--yellow)' }}>Email Aktif</label>
          <input 
            name="email" type="email" required
            placeholder="alamat@email.com"
            style={{
              padding: '16px', background: '#fff', border: '3px solid var(--black)',
              borderRadius: '8px', fontSize: '1rem', fontWeight: 600, outline: 'none', color: '#000'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--yellow)' }}>Subjek Pesan</label>
        <select name="subject" style={{
          padding: '16px', background: '#fff', border: '3px solid var(--black)',
          borderRadius: '8px', fontSize: '1rem', fontWeight: 600, outline: 'none', color: '#000'
        }}>
          <option>Masalah Download Game</option>
          <option>Laporan Error Tutorial</option>
          <option>Pengajuan Kerjasama</option>
          <option>Lainnya</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--yellow)' }}>Isi Pesan</label>
        <textarea 
          name="message" required
          placeholder="Tuliskan unek-unekmu di sini..."
          rows="5"
          style={{
            padding: '16px', background: '#fff', border: '3px solid var(--black)',
            borderRadius: '8px', fontSize: '1rem', fontWeight: 600, outline: 'none', color: '#000',
            resize: 'vertical'
          }}
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSending}
        className="btn btn-primary contact-submit-btn" 
        style={{
          opacity: isSending ? 0.7 : 1, cursor: isSending ? 'not-allowed' : 'pointer'
        }}
      >
        {isSending ? 'Sedang Mengirim...' : 'Kirim Pesan Sekarang'} 
        {!isSending && <i className="fa-solid fa-paper-plane" style={{ marginLeft: 8 }}></i>}
      </button>
    </form>
  );
}
