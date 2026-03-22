import ContactForm from '@/app/components/ContactForm';

export const metadata = {
  title: "Hubungi Kami - Teknologi Santuy",
  description: "Ada keluhan, saran, atau sekadar ingin menyapa? Hubungi tim Teknologi Santuy di sini.",
};

export default function ContactPage() {
  return (
    <>
      <section className="hero contact-hero">
        <div className="container text-center">
          <div className="hero-eyebrow reveal from-bottom" suppressHydrationWarning>
            <i className="fa-solid fa-paper-plane"></i> Contact
          </div>
          <h1 className="hero-title reveal from-bottom stagger-1" suppressHydrationWarning>
            Hubungi <span className="accent">Teknologi Santuy</span>
          </h1>
          <p className="hero-sub reveal from-bottom stagger-2" suppressHydrationWarning>
            Punya kendala saat download, menemukan link tutorial yang mati, atau ingin mampir menyapa? Form di bawah ini terbuka 24/7 buat kamu!
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container">
          <div className="about-grid contact-grid">
            
            <div className="reveal from-right stagger-1" suppressHydrationWarning>
              <div className="section-eyebrow"><i className="fa-solid fa-comments"></i> Saluran Cepat</div>
              <h2 className="section-title">Nongkrong & <span className="mark">Diskusi</span></h2>
              <p className="section-desc">
                Email mungkin terasa formal, jadi kami menyarankan kamu mampir ke Discord untuk bantuan yang lebih cepat dan interaktif.
              </p>

              <div className="contact-links-wrapper">
                <a href="https://discord.gg/9WqXnkrGZJ" target="_blank" rel="noopener noreferrer" className="contact-link-card discord-card">
                  <div className="icon"><i className="fa-brands fa-discord"></i></div>
                  <div className="contact-text">
                    <h4>Join Server Discord</h4>
                    <p>Fast response & Komunitas Aktif</p>
                  </div>
                </a>

                <a href="https://www.instagram.com/fikrialfrz/" target="_blank" rel="noopener noreferrer" className="contact-link-card ig-card">
                  <div className="icon"><i className="fa-brands fa-instagram"></i></div>
                  <div className="contact-text">
                    <h4>Follow Instagram</h4>
                    <p>Update harian & DM santai</p>
                  </div>
                </a>

                 <a href="mailto:fikrialfarizi038@gmail.com" className="contact-link-card email-card">
                  <div className="icon"><i className="fa-solid fa-envelope"></i></div>
                  <div className="contact-text">
                    <h4>Kirim Email</h4>
                    <p>Untuk urusan bisnis & kerjasama</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="reveal from-left stagger-1" suppressHydrationWarning>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}