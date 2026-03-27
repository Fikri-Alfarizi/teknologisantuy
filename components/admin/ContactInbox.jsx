'use client';

import React, { useState, useEffect } from 'react';
import { getContactMessages, deleteContactMessage } from '@/app/actions/adminActions';
import { FaEnvelope, FaTrash, FaUser, FaReply, FaClock } from 'react-icons/fa';

export default function ContactInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const res = await getContactMessages();
    if (res.success) setMessages(res.data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (confirm('Hapus pesan ini permanen?')) {
      const res = await deleteContactMessage(id);
      if (res.success) fetchMessages();
    }
  }

  if (loading) return <div style={{ padding: '40px', fontWeight: 800 }}>Membuka Kotak Masuk...</div>;

  return (
    <div style={{ color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '4px solid #000', paddingBottom: '20px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '28px', textTransform: 'uppercase', letterSpacing: '-1px' }}>
          Kontak <span style={{ background: 'var(--yellow)', padding: '0 10px', border: '3px solid #000' }}>Pesan Masuk</span>
        </h2>
        <button onClick={fetchMessages} style={{ 
          padding: '10px 20px', background: '#000', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '5px 5px 0 var(--yellow)'
        }}>Refresh Inbox</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((msg, i) => (
          <div key={msg.id} style={{ 
            background: '#fff', border: '4px solid #000', boxShadow: '8px 8px 0 #000', padding: '24px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '2px dashed #ddd', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '45px', height: '45px', background: 'var(--yellow)', border: '2px solid #000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  <FaUser />
                </div>
                <div>
                  <div style={{ fontWeight: 950, fontSize: '16px', textTransform: 'uppercase' }}>{msg.name}</div>
                  <div style={{ fontSize: '12px', color: '#444', fontWeight: 700 }}>{msg.email}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 950, background: '#000', color: '#fff', padding: '2px 10px', fontSize: '10px', marginBottom: '5px' }}>{msg.subject || 'NO SUBJECT'}</div>
                <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                  <FaClock /> {new Date(msg.timestamp).toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div style={{ padding: '10px 0', fontSize: '15px', fontWeight: 600, color: '#333', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {msg.message}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <a href={`mailto:${msg.email}?subject=RE: ${msg.subject}`} style={{ 
                padding: '8px 20px', background: '#fff', border: '3px solid #000', borderRadius: '4px',
                color: '#000', textDecoration: 'none', fontWeight: 900, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '3px 3px 0 #000'
              }}>
                <FaReply /> Balas Lewat Email
              </a>
              <button 
                onClick={() => handleDelete(msg.id)}
                style={{ 
                  padding: '8px 15px', background: '#ff6b6b', border: '3px solid #000', borderRadius: '4px',
                  color: '#000', fontWeight: 900, cursor: 'pointer', boxShadow: '3px 3px 0 #000'
                }}
              >
                <FaTrash /> Hapus
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div style={{ padding: '100px', textAlign: 'center', background: '#fff', border: '4px solid #000', boxShadow: '10px 10px 0 #eee' }}>
            <FaEnvelope size={50} style={{ opacity: 0.1, marginBottom: '20px' }} />
            <p style={{ fontWeight: 950, fontSize: '18px', textTransform: 'uppercase' }}>Inbox Kosong.</p>
          </div>
        )}
      </div>
    </div>
  );
}
