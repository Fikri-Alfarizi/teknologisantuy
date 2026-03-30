'use client';

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/lib/auth-context';
import { FaHashtag, FaPaperPlane } from 'react-icons/fa';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RequestGameDiscordUI() {
  const { user, userProfile } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Poll Discord messages every 3 seconds
  const { data: messages, mutate, isValidating } = useSWR('/api/discord/messages', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  });

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    setIsSending(true);
    const textToSend = inputMessage;
    setInputMessage(''); // optimistic clear

    try {
      await fetch('/api/discord/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: textToSend,
          username: userProfile?.displayName || undefined, // undefined falls back to Guest in API
          avatar_url: userProfile?.photoURL || undefined
        })
      });
      // Instantly refetch messages to show the new one
      mutate();
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="discord-layout">
      {/* SIDEBAR */}
      <div className="discord-sidebar">
        <div className="discord-server-header">
          <h3>Teknologi Santuy</h3>
          <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px' }}></i>
        </div>
        <div className="discord-channels">
          <div className="discord-channel active">
            <FaHashtag style={{ opacity: 0.6 }} /> request-game
          </div>
          <div className="discord-channel" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <FaHashtag style={{ opacity: 0.6 }} /> general
          </div>
        </div>
        
        {/* User Area in Sidebar */}
        <div className="discord-user-area">
          <img 
            src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.displayName || 'Guest'}`} 
            alt="User Avatar" 
            className="discord-avatar-small"
          />
          <div className="discord-user-info">
            <div className="discord-username">{userProfile?.displayName || 'Anonymous Guest'}</div>
            <div className="discord-status">{user ? 'Online' : 'Not Logged In'}</div>
          </div>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="discord-main">
        {/* Header */}
        <div className="discord-chat-header">
          <FaHashtag style={{ opacity: 0.6, fontSize: '20px' }} />
          <h3>request-game</h3>
          <span className="discord-header-separator">|</span>
          <span className="discord-header-topic">Chat real-time sinkron dengan server Discord!</span>
        </div>

        {/* Messages Container */}
        <div className="discord-messages">
          {!messages && isValidating && (
            <div style={{ padding: '20px', color: '#b5bac1', textAlign: 'center' }}>
              Memuat pesan dari Discord...
            </div>
          )}

          {messages && messages.length === 0 && (
            <div className="discord-welcome">
              <div className="welcome-hashtag"><FaHashtag size={40} /></div>
              <h2>Welcome to #request-game!</h2>
              <p>This is the start of the #request-game channel.</p>
            </div>
          )}

          {Array.isArray(messages) && messages.map((msg, index) => {
            // Check if sequential message from same user within 5 minutes to hide avatar
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const isSequential = prevMsg && 
                                 prevMsg.author.username === msg.author.username && 
                                 (new Date(msg.timestamp) - new Date(prevMsg.timestamp)) < 300000;

            const timeString = new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const dateString = new Date(msg.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <div key={msg.id} className={`discord-message ${isSequential ? 'sequential' : ''}`}>
                {!isSequential ? (
                  <img src={msg.author.avatar} alt="Avatar" className="discord-message-avatar" />
                ) : (
                  <div className="discord-message-timestamp-hover">{timeString}</div>
                )}
                
                <div className="discord-message-content">
                  {!isSequential && (
                    <div className="discord-message-header">
                      <span className="discord-message-author">
                        {msg.author.username}
                        {msg.author.bot && <span className="discord-bot-tag">BOT</span>}
                      </span>
                      <span className="discord-message-timestamp">{dateString} at {timeString}</span>
                    </div>
                  )}
                  <div className="discord-message-text" dangerouslySetInnerHTML={{ __html: formatDiscordLinks(msg.content) }}></div>
                  
                  {/* Attachments if any */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="discord-attachments">
                      {msg.attachments.map((att, i) => (
                        att.type?.startsWith('image/') ? (
                          <img key={i} src={att.url} alt="attachment" className="discord-attachment-image" />
                        ) : (
                          <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="discord-attachment-file">
                            {att.name}
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="discord-input-area">
          <div className="discord-input-wrapper">
            <div className="discord-input-attach"><i className="fa-solid fa-circle-plus"></i></div>
            <textarea 
              placeholder={`Message #request-game ${!user ? '(sebagai Anonymous)' : ''}`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button 
              className="discord-input-send" 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSending}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body { margin: 0; padding: 0; overflow-x: hidden; }
        
        .discord-layout {
          display: flex;
          height: calc(100vh - 80px); /* minus nav bar approx */
          min-height: 600px;
          background-color: #313338;
          color: #dbdee1;
          font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        .discord-sidebar {
          width: 240px;
          background-color: #2b2d31;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .discord-server-header {
          height: 48px;
          padding: 12px 16px;
          box-sizing: border-box;
          border-bottom: 1px solid #1e1f22;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #f2f3f5;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .discord-server-header:hover { background-color: rgba(255,255,255,0.02); }
        .discord-server-header h3 { margin: 0; font-size: 15px; }

        .discord-channels {
          padding: 12px 8px;
          flex-grow: 1;
        }

        .discord-channel {
          padding: 6px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #949ba4;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .discord-channel:hover { background-color: #35373c; color: #dbdee1; }
        .discord-channel.active { background-color: #404249; color: #fff; }

        .discord-user-area {
          height: 52px;
          background-color: #232428;
          padding: 0 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .discord-avatar-small {
          width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
        }
        .discord-user-info { flex-grow: 1; overflow: hidden; }
        .discord-username { font-size: 14px; font-weight: 600; color: #f2f3f5; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .discord-status { font-size: 12px; color: #b5bac1; }

        .discord-main {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .discord-chat-header {
          height: 48px;
          padding: 8px 16px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #2b2d31;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .discord-chat-header h3 { margin: 0; font-size: 16px; color: #f2f3f5; }
        .discord-header-separator { color: #4e5058; margin: 0 8px; }
        .discord-header-topic { color: #b5bac1; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .discord-messages {
          flex-grow: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-bottom: 24px;
        }
        
        /* Custom scrollbar for webkit */
        .discord-messages::-webkit-scrollbar { width: 8px; }
        .discord-messages::-webkit-scrollbar-track { background: #2b2d31; border-radius: 4px; border: 2px solid #313338; }
        .discord-messages::-webkit-scrollbar-thumb { background: #1a1b1e; border-radius: 4px; }

        .discord-welcome {
          padding: 48px 16px 16px;
        }
        .welcome-hashtag { width: 68px; height: 68px; background: #41434a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: #f2f3f5; }
        .discord-welcome h2 { margin: 0 0 8px; color: #f2f3f5; font-size: 32px; font-weight: 700; }
        .discord-welcome p { margin: 0; color: #b5bac1; font-size: 16px; }

        .discord-message {
          display: flex;
          padding: 2px 48px 2px 16px;
          margin-top: 17px;
          position: relative;
        }
        .discord-message:hover { background-color: #2e3035; }
        .discord-message.sequential { margin-top: 0; padding-top: 2px; padding-bottom: 2px; }

        .discord-message-avatar {
          width: 40px; height: 40px; border-radius: 50%; cursor: pointer; object-fit: cover;
          margin-right: 16px; margin-top: 2px;
        }

        .discord-message-content { flex-grow: 1; min-width: 0; }
        .discord-message-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 2px; }
        .discord-message-author { color: #f2f3f5; font-weight: 500; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .discord-message-author:hover { text-decoration: underline; }
        
        .discord-bot-tag {
          background-color: #5865F2; color: #fff; font-size: 10px; padding: 1px 4px; border-radius: 3px; font-weight: 500; text-transform: uppercase;
        }

        .discord-message-timestamp { color: #949ba4; font-size: 12px; }
        .discord-message-timestamp-hover {
          position: absolute; left: 16px; width: 40px; text-align: center;
          font-size: 10px; color: #949ba4; opacity: 0; line-height: 22px;
        }
        .discord-message:hover .discord-message-timestamp-hover { opacity: 1; }

        .discord-message-text {
          color: #dbdee1; font-size: 16px; line-height: 1.375rem; word-wrap: break-word; white-space: pre-wrap;
        }

        .discord-attachments { margin-top: 4px; display: flex; flex-direction: column; gap: 4px; }
        .discord-attachment-image { max-width: 400px; max-height: 300px; border-radius: 8px; object-fit: contain; background: #2b2d31; }
        .discord-attachment-file { display: inline-block; padding: 12px; background: #2b2d31; border: 1px solid #1e1f22; border-radius: 4px; color: #00a8fc; text-decoration: none; max-width: 300px; }
        .discord-attachment-file:hover { text-decoration: underline; }

        .discord-input-area {
          padding: 0 16px 24px;
        }
        .discord-input-wrapper {
          background-color: #383a40;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 16px;
        }
        .discord-input-attach {
          color: #b5bac1; padding: 10px 16px 10px 0; cursor: pointer; transition: color 0.2s;
        }
        .discord-input-attach:hover { color: #dbdee1; }
        .discord-input-wrapper textarea {
          flex-grow: 1; background: transparent; border: none; color: #dbdee1; font-size: 16px;
          padding: 11px 0; resize: none; font-family: inherit; line-height: 1.375rem;
          max-height: 144px; outline: none;
        }
        .discord-input-send {
          background: transparent; border: none; color: #5865F2; padding: 8px;
          cursor: pointer; opacity: 0.7; transition: opacity 0.2s;
        }
        .discord-input-send:hover { opacity: 1; }
        .discord-input-send:disabled { color: #5c5e66; cursor: not-allowed; opacity: 1; }

        @media (max-width: 768px) {
          .discord-sidebar { display: none; }
          .discord-layout { height: calc(100vh - 60px); }
        }
      `}</style>
    </div>
  );
}

// Helper to format URLs to clickable links
function formatDiscordLinks(text) {
  if (!text) return '';
  // simple URL regex
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #00a8fc; text-decoration: none;">$1</a>')
             .replace(/<a/g, '<a onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'"');
}
