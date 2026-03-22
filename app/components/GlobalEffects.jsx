"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalEffects() {
  const pathname = usePathname();
  useEffect(() => {
    // ════ PARTICLE SYSTEM ════
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let W, H;
      
      const resize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      class Particle {
        constructor() { this.reset(true); }
        reset(init) {
          this.x = Math.random() * W;
          this.y = init ? Math.random() * H : H + 20;
          this.size = Math.random() * 4 + 1.5;
          this.speedY = -(Math.random() * 0.5 + 0.2);
          this.speedX = (Math.random() - 0.5) * 0.3;
          this.opacity = Math.random() * 0.35 + 0.05;
          this.shape = Math.random() > 0.5 ? 'square' : 'circle';
          this.color = Math.random() > 0.6
            ? `rgba(255,225,53,${this.opacity})`
            : `rgba(37,150,190,${this.opacity})`;
        }
        update() {
          this.y += this.speedY;
          this.x += this.speedX;
          if (this.y < -20) this.reset(false);
        }
        draw() {
          if (!ctx) return;
          ctx.fillStyle = this.color;
          if (this.shape === 'square') {
            ctx.fillRect(this.x, this.y, this.size, this.size);
          } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (let i = 0; i < 70; i++) particles.push(new Particle());

      let animationId;
      const animateParticles = () => {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        animationId = requestAnimationFrame(animateParticles);
      };
      animateParticles();
      
      // Cleanup particles
      return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationId);
      };
    }
  }, []);



  useEffect(() => {
    // ════ SCROLL REVEAL ════
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // Observe future added elements (Async Server Components streaming)
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach(mut => {
        mut.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            if (node.classList.contains('reveal')) revealObs.observe(node);
            if (node.querySelectorAll) {
              node.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
            }
          }
        });
      });
    });

    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      revealObs.disconnect();
      mutObs.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    // ════ COUNTER ANIMATION ════
    const formatNum = (n, target) => {
      if (target >= 1000) {
        if (target >= 100000) return (n / 1000).toFixed(0) + 'K';
        return (n / 1000).toFixed(1).replace('.0', '') + 'K';
      }
      return n.toString();
    };

    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.target);
          const suf = el.dataset.suf || '';
          let start = 0, dur = 1800;
          const step = target / (dur / 16);
          const timer = setInterval(() => {
            start = Math.min(start + step, target);
            el.textContent = formatNum(Math.floor(start), target) + suf;
            if (start >= target) clearInterval(timer);
          }, 16);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

    return () => counterObs.disconnect();
  }, [pathname]);

  useEffect(() => {
    // ════ BACK TO TOP ════
    const btt = document.getElementById('btt');
    const onScroll = () => btt?.classList.toggle('show', window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <canvas id="particleCanvas"></canvas>
      <button 
        id="btt" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </>
  );
}
