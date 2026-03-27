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
    <>
      {/* ══ HERO SECTION ══ */}
      <section className="hero" style={{ padding: '120px 0 60px', background: 'var(--deep-blue)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="hero-eyebrow reveal"><i className="fa-solid fa-envelope"></i> Hubungi Kami</div>
          <h1 className="hero-title reveal" style={{ fontSize: '3.5rem' }}>Let's <span className="accent">Get in Touch</span></h1>
          <p className="hero-sub reveal" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Punya pertanyaan, keluhan, atau ingin kerja sama? Tim Teknologi Santuy siap membantu Anda kapan saja.
          </p>
        </div>
      </section>

      {/* ══ CONTACT CONTENT ══ */}
      <section className="section section-alt">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '60px' }}>
          
          {/* LEFT: INFO & SOCIALS */}
          <div className="reveal from-left">
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Saluran <span className="mark">Resmi</span></h2>
            <p style={{ opacity: 0.7, marginBottom: '40px' }}>
              Gunakan formulir atau hubungi kami melalui media sosial di bawah ini untuk respon yang lebih cepat.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

            <div style={{ 
              marginTop: '60px', padding: '30px', background: 'rgba(255,255,255,0.03)', 
              border: '2px solid rgba(255,255,255,0.1)', borderRadius: '20px'
             }}>
               <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--yellow)' }}>
                 <FaQuestionCircle /> FAQ Singkat
               </h4>
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '1.8', opacity: 0.8 }}>
                 <li>• Password Game? Cek di katalog game.</li>
                 <li>• Game Error? Hubungi admin via Discord.</li>
                 <li>• Request Game? Tulis di forum atau kontak kami.</li>
               </ul>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="reveal from-right">
            <div style={{ 
              background: 'white', padding: '48px', border: '5px solid black', 
              boxShadow: '15px 15px 0px var(--yellow)', borderRadius: '4px' 
            }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                   <div style={{ 
                     fontSize: '60px', color: '#00c853', marginBottom: '20px'
                   }}><i className="fa-solid fa-circle-check"></i></div>
                   <h2 style={{ color: 'black', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Terima Kasih!</h2>
                   <p style={{ color: '#444', fontWeight: 600 }}>Pesan Anda telah terkirim ke sistem admin dan email kami. Kami akan segera menghubungi Anda kembali.</p>
                   <button 
                     onClick={() => setStatus('idle')}
                     style={{ 
                       marginTop: '30px', padding: '12px 30px', background: 'black', color: 'white', 
                       border: 'none', fontWeight: 800, cursor: 'pointer', borderRadius: '4px' 
                     }}
                   >Kirim Pesan Lain</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
                      style={{ minHeight: '180px', resize: 'vertical' }}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </FormGroup>

                  {status === 'error' && (
                    <div style={{ color: '#ff1744', fontWeight: 800, fontSize: '14px', textAlign: 'center' }}>
                      <i className="fa-solid fa-circle-exclamation"></i> Gagal mengirim pesan. Silakan coba lagi nanti.
                    </div>
                  )}

                  <button 
                    disabled={status === 'loading'}
                    type="submit" 
                    className="brutal-btn"
                    style={{ 
                      marginTop: '10px', width: '100%', padding: '20px', 
                      background: 'black', color: 'white', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', gap: '15px',
                      fontSize: '18px', fontWeight: 950, textTransform: 'uppercase',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer'
                    }}
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
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ color: 'black', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {React.cloneElement(children, {
        style: {
          ...children.props.style,
          width: '100%',
          padding: '16px 20px',
          border: '3px solid black',
          borderRadius: '4px',
          background: '#f8f9fa',
          fontSize: '16px',
          fontWeight: '600',
          outline: 'none',
          color: 'black',
          transition: '0.2s'
        },
        className: 'form-input-brutal'
      })}
    </div>
  );
}

function ContactInfoBox({ icon, label, value, link }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" style={{ 
      display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', 
      background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', 
      borderRadius: '16px', textDecoration: 'none', transition: '0.3s',
      transform: 'translateZ(0)'
    }} className="contact-box-hover">
      <div style={{ 
        width: '50px', height: '50px', background: 'rgba(0,0,0,0.5)', 
        border: '2px solid black', borderRadius: '12px', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', fontSize: '20px' 
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5, marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '15px', fontWeight: 900, color: 'white' }}>{value}</div>
      </div>
    </a>
  );
}