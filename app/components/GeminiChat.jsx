"use client";
import React, { useState, useRef, useEffect } from 'react';
import * as jotai from 'jotai';
import { geminiChatAtom } from '@/atoms/geminiChatAtom';
import { useSession, signIn } from 'next-auth/react';

const { useAtom } = jotai;

// Detect mobile device
const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// --- UTILS ---
function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--yellow,#ffe135)">$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:2px;font-family:monospace;color:var(--yellow)">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" style="color:var(--yellow);text-decoration:underline;font-weight:700">$1</a>')
    .replace(/^[-*]\s+(.+)$/gm, '<li style="margin-left:16px;margin-bottom:4px;list-style:disc">$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li style="margin-left:16px;margin-bottom:4px;list-style:decimal">$1</li>')
    .replace(/\n/g, '<br/>');
}

function useTypingEffect(text, speed = 15, onDone) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!text || isMobile) { // Skip animation on mobile for performance
      setDisplayed(text || '');
      if (onDone) onDone();
      return;
    }
    setDisplayed('');
    indexRef.current = 0;
    setIsTyping(true);
    const interval = setInterval(() => {
      indexRef.current += 3; // Advance by 3 characters to reduce re-renders
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setIsTyping(false);
        clearInterval(interval);
        if (onDone) onDone();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  return { displayed: isMobile ? text : displayed, isTyping: isMobile ? false : isTyping };
}

// --- COMPONENTS ---
function AiMessage({ text, shouldAnimate, onAnimationDone, image, requiresLogin }) {
  const { displayed, isTyping } = useTypingEffect(shouldAnimate ? text : null, 8, onAnimationDone);
  const content = shouldAnimate ? displayed : text;

  return (
    <div style={{
      alignSelf: 'flex-start', maxWidth: '85%', padding: '12px 16px',
      background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.95)',
      border: '1px solid rgba(255,255,255,0.12)', 
      borderRadius: '2px 16px 16px 16px',
      fontSize: '13.5px', lineHeight: '1.6',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      {image && (
        <img 
          src={`data:${image.mimeType};base64,${image.data}`} 
          alt="Uploaded" 
          loading="lazy"
          style={{ 
            width: isMobile ? '200px' : '100%', 
            maxWidth: '100%', 
            borderRadius: '8px', 
            marginBottom: '10px', 
            border: '1px solid rgba(255,255,255,0.1)',
            height: 'auto'
          }} 
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      {isTyping && !isMobile && <span style={{ display: 'inline-block', width: '6px', height: '14px', background: 'var(--yellow)', marginLeft: '2px', animation: 'blink 0.6s infinite' }} />}
      
      {requiresLogin && !isTyping && (
        <button onClick={() => signIn('discord')} style={{
          marginTop: '12px', padding: '8px 16px', background: '#5865F2', 
          color: '#fff', border: 'none', borderRadius: '8px', 
          cursor: 'pointer', fontWeight: 'bold', fontSize: '12px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <i className="fa-brands fa-discord"></i> Login dengan Discord
        </button>
      )}
      {!isMobile && <style jsx>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>}
    </div>
  );
}

export default function GeminiChat() {
  const [chatState, setChatState] = useAtom(geminiChatAtom);
  const { isOpen, stepContext } = chatState;
  const { data: session } = useSession();
  
  const initialMessage = { role: 'ai', text: 'Halo! 👋 Saya asisten Teknologi Santuy. Ada yang bisa saya bantu hari ini?', animate: !isMobile };
  const [messages, setMessages] = useState([]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [guestCount, setGuestCount] = useState(0);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const setIsOpen = (val) => setChatState(prev => ({ ...prev, isOpen: val }));

  useEffect(() => {
    // Load guest count on mount
    const count = parseInt(localStorage.getItem('ts_guest_ai_count') || '0', 10);
    setGuestCount(count);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Start a new fresh chat every time it opens
      setMessages([initialMessage]);
    } else {
      // If closed, automatically stop any ongoing generation
      if (loading && abortControllerRef.current) {
        abortControllerRef.current.abort();
        setLoading(false);
        abortControllerRef.current = null;
      }
      setInput('');
      setSelectedImage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const markMessageAnimated = (index) => {
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, animate: false } : m));
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      abortControllerRef.current = null;
      setMessages(prev => [...prev, { role: 'ai', text: '_Respon dihentikan._', animate: false }]);
    }
  };

  const incrementGuestCount = () => {
    const newCount = guestCount + 1;
    setGuestCount(newCount);
    localStorage.setItem('ts_guest_ai_count', newCount);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || loading) return;
    
    // Check Limit
    if (!session && guestCount >= 10) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Oops! Anda telah mencapai batas **10 pesan gratis** sebagai tamu. Silakan login untuk mendapatkan akses AI **tanpa batas** (unlimited) secara gratis.', animate: !isMobile, requiresLogin: true }]);
      return;
    }

    const userMsg = input.trim();
    const userImg = selectedImage;
    setInput('');
    setSelectedImage(null);
    abortControllerRef.current = new AbortController();
    
    const newUserMsg = { role: 'user', text: userMsg || '(Gambar dikirim)', image: userImg };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({ 
          message: userMsg, 
          stepContext, 
          image: userImg ? { inlineData: userImg } : null, 
          history: messages.slice(-5).map(m => ({ role: m.role, text: m.text })) // Reduce history
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      // Increment limit on success
      if (!session) incrementGuestCount();
      
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || data.error, animate: !isMobile }]); // Skip animation on mobile
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'ai', text: isMobile ? 'Error: Periksa koneksi' : 'Gagal terhubung ke AI. Coba lagi.', animate: false }]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} style={{
      position: 'fixed', bottom: '24px', left: '24px', zIndex: 1000,
      width: '56px', height: '56px', borderRadius: '16px',
      background: 'var(--yellow)', border: '2px solid rgba(0,0,0,0.2)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)', cursor: 'pointer',
      fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'transform 0.2s', color: '#000'
    }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      <i className="fa-solid fa-robot"></i>
    </button>
  );

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '24px', zIndex: 2000,
      width: isMobile ? '320px' : '380px', height: isMobile ? '480px' : '580px', maxHeight: '85vh',
      background: 'var(--blue-base, rgba(13, 63, 94, 0.85))',
      backdropFilter: isMobile ? 'none' : 'blur(8px)', // Reduce blur on mobile
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      animation: isMobile ? 'none' : 'chat-appear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' // Skip animation on mobile
    }}>
      {!isMobile && (
        <style jsx>{`
          @keyframes chat-appear {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      )}
      {/* Header */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--blue-dark, rgba(255,255,255,0.03))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', 
            width: '32px', height: '32px', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className="fa-solid fa-robot"></i>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: 700 }}>AI Chat</h4>
            <span style={{ fontSize: '10px', color: 'var(--yellow)', opacity: 0.8 }}>Online • Super Ringan</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px' }}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          msg.role === 'ai' ? (
            <AiMessage key={`ai-${i}`} text={msg.text} shouldAnimate={msg.animate} onAnimationDone={() => markMessageAnimated(i)} requiresLogin={msg.requiresLogin} />
          ) : (
            <div key={`user-${i}`} style={{
              alignSelf: 'flex-end', maxWidth: '85%', padding: '12px 16px',
              background: 'var(--yellow)', color: '#000', borderRadius: '16px 2px 16px 16px',
              fontSize: '13.5px', fontWeight: 700, boxShadow: '0 4px 15px rgba(255, 225, 53, 0.2)'
            }}>
              {msg.image && <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} alt="User upload" loading="lazy" style={{ width: isMobile ? '200px' : '100%', maxWidth: '100%', borderRadius: '10px', marginBottom: '8px', height: 'auto' }} />}
              {msg.text}
            </div>
          )
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontStyle: 'italic' }}>AI sedang merespon...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div style={{ padding: '16px 20px 20px', background: 'rgba(0,0,0,0.2)' }}>
        {selectedImage && (
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px' }}>
             <i className="fa-solid fa-image" style={{ color: 'var(--yellow)' }}></i>
             <span style={{ fontSize: '11px', color: '#fff', flex: 1, opacity: 0.8 }}>Gambar siap dianalisis</span>
             <button onClick={() => setSelectedImage(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <form onSubmit={sendMessage} style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '4px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button type="button" onClick={() => fileInputRef.current.click()} style={{ 
            width: '36px', height: '36px', background: 'transparent', border: 'none', 
            color: selectedImage ? 'var(--yellow)' : 'rgba(255,255,255,0.6)', 
            cursor: 'pointer', transition: '0.2s' 
          }}>
            <i className="fa-solid fa-image"></i>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setSelectedImage({ mimeType: file.type, data: reader.result.split(',')[1] });
                reader.readAsDataURL(file);
              }
            }} />
          </button>
          
          <input 
            value={input} onChange={e => setInput(e.target.value)} 
            placeholder="Ketik pesan..." disabled={loading}
            style={{ 
              flex: 1, background: 'transparent', border: 'none', outline: 'none', 
              color: '#fff', fontSize: '14px', padding: '8px 4px' 
            }}
          />
          
          <button 
            type={loading ? "button" : "submit"} 
            onClick={loading ? stopGeneration : undefined}
            disabled={!loading && (!input.trim() && !selectedImage)} 
            style={{ 
              width: '40px', height: '40px', borderRadius: '12px',
              background: loading ? '#ff4757' : 'var(--yellow)', 
              border: 'none', color: loading ? '#fff' : '#000', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: loading ? '0 4px 12px rgba(255, 71, 87, 0.4)' : '0 4px 12px rgba(255, 225, 53, 0.3)'
            }}
          >
            <i className={`fa-solid ${loading ? 'fa-stop' : 'fa-paper-plane'}`}></i>
          </button>
        </form>
        {!session && (
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
            Sisa pesan gratis: {Math.max(0, 10 - guestCount)}/10
          </div>
        )}
      </div>
    </div>
  );
}
