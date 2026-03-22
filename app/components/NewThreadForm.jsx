'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  FaChevronDown,
  FaBold,
  FaItalic,
  FaLink,
  FaCode,
  FaXmark,
} from 'react-icons/fa6';

const categories = [
  { id: 'general', label: 'General Discussion' },
  { id: 'game-pc', label: 'PC Game' },
  { id: 'game-mobile', label: 'Mobile Game' },
  { id: 'emulator', label: 'Emulator' },
  { id: 'tips-trick', label: 'Tips & Trick' },
  { id: 'bug-report', label: 'Bug Report' },
  { id: 'faq', label: 'FAQ' },
];

export default function NewThreadForm({ onSubmit, onCancel, isSubmitting = false }) {
  const { user, userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      authorId: user?.uid,
      authorName: userProfile?.displayName || 'Anonymous',
      authorPhoto: userProfile?.photoURL,
    });

    setTitle('');
    setContent('');
    setCategory('general');
  };

  if (!user) {
    return (
      <div className="login-prompt">
        <style jsx>{`
          .login-prompt {
            padding: 24px;
            background: var(--yellow);
            border: var(--bw) solid var(--black);
            box-shadow: var(--bs);
            text-align: center;
            margin-bottom: 24px;
          }
          .login-prompt p {
            font-weight: 700;
            color: var(--black);
            margin-bottom: 12px;
          }
          .login-link {
            display: inline-block;
            padding: 10px 24px;
            background: var(--black);
            color: var(--white);
            border: var(--bw) solid var(--black);
            font-weight: 800;
            text-decoration: none;
            text-transform: uppercase;
          }
          .login-link:hover {
            background: var(--blue-dark);
          }
        `}</style>
        <p>You must be logged in to create a thread</p>
        <a href="/auth/login" className="login-link">Login to Continue</a>
      </div>
    );
  }

  return (
    <div className="new-thread-form">
      <style jsx>{`
        .new-thread-form {
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-lg);
          padding: 32px;
          margin-bottom: 32px;
        }

        .form-title {
          font-size: 20px;
          font-weight: 900;
          color: var(--black);
          margin-bottom: 24px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 16px;
          border-bottom: var(--bw) solid var(--black);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 900;
          color: var(--black);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 14px 16px;
          background: var(--off-white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-sm);
          color: var(--black);
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.15s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          transform: translate(-2px, -2px);
          box-shadow: var(--bs);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(0,0,0,0.35);
        }

        .form-textarea {
          resize: vertical;
          min-height: 200px;
          font-family: inherit;
        }

        .toolbar {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          padding: 10px;
          background: var(--off-white);
          border: var(--bw) solid var(--black);
        }

        .toolbar-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--white);
          border: 2px solid var(--black);
          color: var(--black);
          cursor: pointer;
          transition: all 0.15s;
          font-size: 14px;
        }

        .toolbar-btn:hover {
          background: var(--yellow);
          transform: translate(-1px, -1px);
          box-shadow: 2px 2px 0 var(--black);
        }

        .category-dropdown {
          position: relative;
        }

        .category-select {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--off-white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-sm);
          color: var(--black);
          cursor: pointer;
          font-weight: 700;
          transition: all 0.15s;
        }

        .category-select:hover {
          transform: translate(-2px, -2px);
          box-shadow: var(--bs);
        }

        .category-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs);
          margin-top: 4px;
          z-index: 10;
        }

        .category-option {
          padding: 12px 16px;
          color: var(--black);
          cursor: pointer;
          transition: all 0.15s;
          border-bottom: 2px solid rgba(0,0,0,0.1);
          font-weight: 600;
          font-size: 14px;
        }

        .category-option:last-child {
          border-bottom: none;
        }

        .category-option:hover {
          background: var(--yellow);
          padding-left: 22px;
        }

        .category-option.active {
          background: var(--yellow);
          font-weight: 900;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 20px;
          border-top: var(--bw) solid var(--black);
        }

        .btn {
          padding: 12px 28px;
          border: var(--bw) solid var(--black);
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.15s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: var(--bs-sm);
        }

        .btn:hover {
          transform: translate(2px, 2px);
          box-shadow: none;
        }

        .btn-submit {
          background: var(--yellow);
          color: var(--black);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-cancel {
          background: var(--white);
          color: var(--black);
        }

        .char-count {
          font-size: 11px;
          color: rgba(0,0,0,0.4);
          margin-top: 6px;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .new-thread-form {
            padding: 20px;
          }
          .toolbar {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="form-title">
        ✍️ Create New Thread
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <div className="category-dropdown">
            <div
              className="category-select"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span>{categories.find(c => c.id === category)?.label}</span>
              <FaChevronDown size={12} />
            </div>
            {showCategoryDropdown && (
              <div className="category-dropdown-menu">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className={`category-option ${cat.id === category ? 'active' : ''}`}
                    onClick={() => {
                      setCategory(cat.id);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Thread Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Give your thread a descriptive title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
          />
          <div className="char-count">{title.length}/150 characters</div>
        </div>

        <div className="form-group">
          <label className="form-label">Content *</label>
          <div className="toolbar">
            <button type="button" className="toolbar-btn" title="Bold"><FaBold /></button>
            <button type="button" className="toolbar-btn" title="Italic"><FaItalic /></button>
            <button type="button" className="toolbar-btn" title="Link"><FaLink /></button>
            <button type="button" className="toolbar-btn" title="Code"><FaCode /></button>
          </div>
          <textarea
            className="form-textarea"
            placeholder="Write your thread content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="char-count">{content.length} characters</div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <FaXmark style={{ marginRight: 6 }} /> Cancel
          </button>
          <button
            type="submit"
            className="btn btn-submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            {isSubmitting ? '⏳ Posting...' : '🚀 Post Thread'}
          </button>
        </div>
      </form>
    </div>
  );
}
