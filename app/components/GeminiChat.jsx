"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as jotai from 'jotai';
import { geminiChatAtom } from '@/atoms/geminiChatAtom';

const { useAtom } = jotai;

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

function useTypingEffect(text, speed = 8, onDone) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!text) return;
    setDisplayed('');
    indexRef.current = 0;
    setIsTyping(true);
    const interval = setInterval(() => {
      indexRef.current++;
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

  return { displayed, isTyping };
}

// --- COMPONENTS ---
function AiMessage({ text, shouldAnimate, onAnimationDone, image }) {
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
        <img src={`data:${image.mimeType};base64,${image.data}`} alt="Uploaded" 
             style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.1)' }} />
      )}
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      {isTyping && <span style={{ display: 'inline-block', width: '6px', height: '14px', background: 'var(--yellow)', marginLeft: '2px', animation: 'blink 0.6s infinite' }} />}
      <style jsx>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

export default function GeminiChat() {
  const [chatState, setChatState] = useAtom(geminiChatAtom);
  const { isOpen, stepContext } = chatState;
  
  const [sessions, setSessions] = useState([{ id: 'default', name: 'Chat Baru', messages: [{ role: 'ai', text: 'Halo! 👋 Saya asisten Teknologi Santuy. Ada yang bisa saya bantu hari ini?', animate: false }] }]);
  const [activeSessionId, setActiveSessionId] = useState('default');
  const [showHistory, setShowHistory] = useState(false);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const setIsOpen = (val) => setChatState(prev => ({ ...prev, isOpen: val }));
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  useEffect(() => {
    const saved = localStorage.getItem('ts_chat_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
      const lastSessionId = localStorage.getItem('ts_active_session_id');
      if (lastSessionId) setActiveSessionId(lastSessionId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ts_chat_sessions', JSON.stringify(sessions));
    localStorage.setItem('ts_active_session_id', activeSessionId);
  }, [sessions, activeSessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const updateActiveSessionMessages = (newMsgs) => {
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: newMsgs } : s));
  };

  const markMessageAnimated = (index) => {
    updateActiveSessionMessages(messages.map((m, i) => i === index ? { ...m, animate: false } : m));
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newSess = {
      id: newId,
      name: `Sesi ${sessions.length + 1}`,
      messages: [{ role: 'ai', text: 'Halo! Sesi baru telah dimulai. Ada kendala apa hari ini?', animate: false }]
    };
    setSessions([newSess, ...sessions]);
    setActiveSessionId(newId);
    setShowHistory(false);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      updateActiveSessionMessages([...messages, { role: 'ai', text: '_Respon dihentikan._', animate: false }]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || loading) return;
    const userMsg = input.trim();
    const userImg = selectedImage;
    setInput('');
    setSelectedImage(null);
    abortControllerRef.current = new AbortController();
    const newUserMsg = { role: 'user', text: userMsg || '(Gambar dikirim)', image: userImg };
    const updatedMsgs = [...messages, newUserMsg];
    updateActiveSessionMessages(updatedMsgs);
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({ message: userMsg, stepContext, image: userImg ? { inlineData: userImg } : null, history: messages.slice(-10).map(m => ({ role: m.role, text: m.text })) })
      });
      const data = await res.json();
      updateActiveSessionMessages([...updatedMsgs, { role: 'ai', text: data.reply || data.error, animate: true }]);
    } catch (err) {
      if (err.name !== 'AbortError') updateActiveSessionMessages([...updatedMsgs, { role: 'ai', text: 'Gagal terhubung ke AI.', animate: true }]);
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
      width: '380px', height: '580px', maxHeight: '85vh',
      background: 'var(--blue-base, rgba(13, 63, 94, 0.85))',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      animation: 'chat-appear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <style jsx>{`
        @keyframes chat-appear {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      {/* Header */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--blue-dark, rgba(255,255,255,0.03))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setShowHistory(!showHistory)} style={{ 
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', 
            width: '32px', height: '32px', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className={`fa-solid ${showHistory ? 'fa-angle-left' : 'fa-bars-staggered'}`}></i>
          </button>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{activeSession.name}</h4>
            <span style={{ fontSize: '10px', color: 'var(--yellow)', opacity: 0.8 }}>Online • Gemini 3.1 Flash</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px' }}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* History Drawer Overlay */}
      {showHistory && (
        <div style={{
          position: 'absolute', top: '60px', left: 0, bottom: 0, right: 0,
          background: 'var(--blue-base, rgba(13, 63, 94, 0.98))', zIndex: 10, padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <button onClick={handleNewChat} style={{
            padding: '12px', background: 'var(--yellow)', color: '#000', border: 'none',
            borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '12px'
          }}>+ Mulai Chat Baru</button>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.map(s => (
              <div key={s.id} onClick={() => { setActiveSessionId(s.id); setShowHistory(false); }} style={{
                padding: '12px', borderRadius: '10px', background: activeSessionId === s.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                color: '#fff', cursor: 'pointer', fontSize: '12px', border: activeSessionId === s.id ? '1px solid var(--yellow)' : '1px solid transparent',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <i className="fa-regular fa-comment-dots" style={{ opacity: 0.5 }}></i>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { if(confirm('Hapus semua riwayat?')){ setSessions([{id:'default',name:'Chat Baru',messages:[{role:'ai',text:'History dihapus.',animate:false}]}]); setActiveSessionId('default'); localStorage.clear(); setShowHistory(false); } }} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>
            <i className="fa-solid fa-trash-can" style={{ marginRight: '6px' }}></i> Hapus Semua Riwayat
          </button>
        </div>
      )}

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          msg.role === 'ai' ? (
            <AiMessage key={`${activeSessionId}-${i}`} text={msg.text} shouldAnimate={msg.animate} onAnimationDone={() => markMessageAnimated(i)} />
          ) : (
            <div key={i} style={{
              alignSelf: 'flex-end', maxWidth: '85%', padding: '12px 16px',
              background: 'var(--yellow)', color: '#000', borderRadius: '16px 2px 16px 16px',
              fontSize: '13.5px', fontWeight: 700, boxShadow: '0 4px 15px rgba(255, 225, 53, 0.2)'
            }}>
              {msg.image && <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} alt="User upload" style={{ width: '100%', borderRadius: '10px', marginBottom: '8px' }} />}
              {msg.text}
            </div>
          )
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontStyle: 'italic' }}>AI sedang berpikir...</div>
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
          <button type="button" onClick={() => {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR) return alert("Mic tidak didukung");
            const recognition = new SR();
            recognition.lang = 'id-ID';
            recognition.onstart = () => setIsListening(true);
            recognition.onresult = e => setInput(e.results[0][0].transcript);
            recognition.onend = () => setIsListening(false);
            recognition.start();
          }} style={{ width: '36px', height: '36px', background: 'transparent', border: 'none', color: isListening ? 'var(--yellow)' : 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
            <i className={`fa-solid ${isListening ? 'fa-microphone-lines fa-beat-fade' : 'fa-microphone'}`}></i>
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
            <i className={`fa-solid ${loading ? 'fa-square' : 'fa-paper-plane'}`}></i>
          </button>
        </form>
      </div>
    </div>
  );
}
