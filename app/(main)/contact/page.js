'use client';

import React, { useState } from 'react';
import { FaPaperPlane, FaEnvelope, FaDiscord, FaYoutube, FaInstagram, FaQuestionCircle } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* ══ HERO SECTION ══ */}
      <section className="contact-hero">
        <div className="container contact-hero-container">
          <div className="hero-eyebrow reveal"><i className="fa-solid fa-envelope"></i> Hubungi Kami</div>
          <h1 className="contact-hero-title reveal">Let's <span className="accent">Get in Touch</span></h1>
          <p className="contact-hero-sub reveal">
            Punya pertanyaan, keluhan, atau ingin kerja sama? Tim Teknologi Santuy siap membantu Anda kapan saja.
          </p>
        </div>
      </section>

      {/* ══ CONTACT CONTENT ══ */}
      <section className="contact-section">
        <div className="container contact-grid">
          
          {/* LEFT: INFO & SOCIALS */}
          <div className="contact-info-col reveal from-left">
            <h2 className="section-title contact-section-title">Saluran <span className="mark">Resmi</span></h2>
            <p className="contact-info-desc">
              Gunakan formulir atau hubungi kami melalui media sosial di bawah ini untuk respon yang lebih cepat.
            </p>

            <div className="contact-links-stack">
              <ContactInfoBox 
                icon={<FaEnvelope color="var(--yellow)" />} 
                label="Email Support" 
                value="fikrialfarizi038@gmail.com" 
                link="mailto:fikrialfarizi038@gmail.com"
              />
              <ContactInfoBox 
                icon={<FaDiscord color="#5865F2" />} 
                label="Discord Server" 
                value="Join TS Community" 
                link="https://discord.gg/dJzbq53jXH"
              />
              <ContactInfoBox 
                icon={<FaYoutube color="#FF0000" />} 
                label="YouTube Channel" 
                value="@TeknologiSantuy" 
                link="https://www.youtube.com/@TeknologiSantuy"
              />
              <ContactInfoBox 
                icon={<FaInstagram color="#E4405F" />} 
                label="Instagram" 
                value="@fikrialfrz" 
                link="https://www.instagram.com/fikrialfrz/"
              />
            </div>

            <div className="contact-faq-box">
               <h4 className="faq-title">
                 <FaQuestionCircle /> FAQ Singkat
               </h4>
               <ul className="faq-list">
                 <li>• Password Game? Cek di katalog game.</li>
                 <li>• Game Error? Hubungi admin via Discord.</li>
                 <li>• Request Game? Tulis di forum atau kontak kami.</li>
               </ul>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="contact-form-col reveal from-right">
            <div className="contact-form-card">
              {status === 'success' ? (
                <div className="contact-success-state">
                   <div className="success-icon"><i className="fa-solid fa-circle-check"></i></div>
                   <h2 className="success-title">Terima Kasih!</h2>
                   <p className="success-msg">Pesan Anda telah terkirim ke sistem admin dan email kami. Kami akan segera menghubungi Anda kembali.</p>
                   <button 
                     onClick={() => setStatus('idle')}
                     className="btn-retry"
                   >Kirim Pesan Lain</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <FormGroup label="Nama Lengkap">
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </FormGroup>
                    <FormGroup label="Email Aktif">
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </FormGroup>
                  </div>
                  
                  <FormGroup label="Perihal / Subject">
                    <input 
                      type="text" 
                      placeholder="Contoh: Request Game, Kerja Sama, dll" 
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    />
                  </FormGroup>

                  <FormGroup label="Isi Pesan">
                    <textarea 
                      required
                      placeholder="Apa yang bisa kami bantu? Tuliskan detailnya di sini..." 
                      className="form-textarea"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </FormGroup>

                  {status === 'error' && (
                    <div className="error-msg">
                      <i className="fa-solid fa-circle-exclamation"></i> Gagal mengirim pesan. Silakan coba lagi nanti.
                    </div>
                  )}

                  <button 
                    disabled={status === 'loading'}
                    type="submit" 
                    className="submit-btn-brutal"
                  >
                    {status === 'loading' ? 'Sedang Mengirim...' : (
                      <>Kirim Pesan <FaPaperPlane /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      <style jsx>{`
        .contact-page-wrapper {
          overflow-x: hidden;
        }

        /* Hero */
        .contact-hero {
          padding: 120px 0 60px;
          background: var(--deep-blue);
        }
        .contact-hero-container {
          text-align: center;
        }
        .contact-hero-title {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .contact-hero-sub {
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.8;
          font-size: 1.1rem;
        }

        /* Section Content */
        .contact-section {
          padding: 80px 0;
          background: var(--dark-bg);
          position: relative;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 60px;
          align-items: start;
        }

        /* Left side styles */
        .contact-info-desc {
          opacity: 0.7;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .contact-links-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .contact-faq-box {
          margin-top: 60px;
          padding: 30px;
          background: rgba(255,255,255,0.03);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 20px;
        }
        .faq-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          color: var(--yellow);
          font-weight: 800;
        }
        .faq-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 14px;
          line-height: 1.8;
          opacity: 0.7;
        }

        /* Right side (Form) styles */
        .contact-form-card {
           background: white;
           padding: 48px;
           border: 5px solid black;
           box-shadow: 15px 15px 0px var(--yellow);
           border-radius: 4px;
        }
        .contact-form {
           display: flex;
           flex-direction: column;
           gap: 24px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .form-textarea {
          min-height: 180px;
          resize: vertical;
        }
        .submit-btn-brutal {
          margin-top: 10px;
          width: 100%;
          padding: 20px;
          background: black;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          fontSize: 18px;
          font-weight: 950;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.2s;
          border: none;
        }
        .submit-btn-brutal:hover:not(:disabled) {
           transform: scale(1.02);
           box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .submit-btn-brutal:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Success State */
        .contact-success-state {
          text-align: center;
          padding: 20px 0;
        }
        .success-icon {
          font-size: 60px;
          color: #00c853;
          margin-bottom: 20px;
        }
        .success-title {
          color: black;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 15px;
        }
        .success-msg {
          color: #444;
          font-weight: 600;
          line-height: 1.6;
        }
        .btn-retry {
          margin-top: 30px;
          padding: 12px 30px;
          background: black;
          color: white;
          border: none;
          font-weight: 800;
          cursor: pointer;
          border-radius: 4px;
          transition: 0.2s;
        }
        .error-msg {
          color: #ff1744;
          font-weight: 800;
          font-size: 14px;
          text-align: center;
        }

        /* Responsiveness */
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .contact-hero-title {
            font-size: 2.8rem;
          }
        }

        @media (max-width: 768px) {
          .contact-hero {
            padding: 100px 0 40px;
          }
          .contact-hero-title {
            font-size: 2.3rem;
          }
          .form-row { 
            grid-template-columns: 1fr; 
          }
          .contact-form-card {
            padding: 30px 20px;
            box-shadow: 8px 8px 0px var(--yellow);
          }
          .contact-section {
            padding: 40px 0 80px;
          }
          .contact-links-stack {
            gap: 12px;
          }
          .submit-btn-brutal {
            padding: 16px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
           .contact-hero-title {
             font-size: 2rem;
           }
           .hero-eyebrow {
             font-size: 0.8rem;
           }
           .contact-hero-sub {
             font-size: 1rem;
           }
        }
      `}</style>
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ color: 'black', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {React.cloneElement(children, {
        className: 'form-input-brutal'
      })}
      <style jsx global>{`
        .form-input-brutal {
          width: 100% !important;
          padding: 14px 18px !important;
          border: 3px solid black !important;
          border-radius: 4px !important;
          background: #f8f9fa !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          outline: none !important;
          color: black !important;
          transition: 0.2s !important;
        }
        .form-input-brutal:focus {
          border-color: var(--yellow) !important;
          background: white !important;
        }
        @media (max-width: 768px) {
          .form-input-brutal {
            padding: 12px 14px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}

function ContactInfoBox({ icon, label, value, link }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="contact-box-hover box-link">
      <div className="box-icon-wrapper">
        {icon}
      </div>
      <div className="box-text-content">
        <div className="box-label">{label}</div>
        <div className="box-value">{value}</div>
      </div>
      <style jsx>{`
        .box-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px; 
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 12px;
          text-decoration: none;
          transition: 0.3s;
          transform: translateZ(0);
        }
        .box-link:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--yellow);
          transform: translateY(-2px);
        }
        .box-icon-wrapper {
          width: 44px;
          height: 44px;
          background: rgba(0,0,0,0.5); 
          border: 1px solid black; 
          border-radius: 8px;
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .box-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          opacity: 0.5;
          margin-bottom: 2px;
        }
        .box-value {
          font-size: 14px; 
          font-weight: 900; 
          color: white;
          word-break: break-all;
        }

        @media (max-width: 768px) {
          .box-link {
            padding: 12px;
            gap: 12px;
          }
          .box-icon-wrapper {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
          .box-value {
            font-size: 13px;
          }
        }
      `}</style>
    </a>
  );
}