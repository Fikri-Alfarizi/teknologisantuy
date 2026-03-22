'use client';

import { useState } from 'react';
import { FaImage, FaXmark } from 'react-icons/fa6';

/**
 * PostForm — ported from Circus NewPostForm / TextInputs + ImageUpload
 * Handles title, body, and optional image upload.
 */
export default function PostForm({ communityId, onSubmit, onCancel, isLoading = false }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedFile(ev.target.result);
      setSelectedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    onSubmit?.({ title: title.trim(), body: body.trim() }, selectedFile);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <style jsx>{`
        .post-form {
          background: var(--white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-lg);
          padding: 28px;
        }
        .form-title {
          font-size: 18px;
          font-weight: 900;
          color: var(--black);
          text-transform: uppercase;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: var(--bw) solid var(--black);
        }
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
          color: var(--black);
        }
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 14px;
          background: var(--off-white);
          border: var(--bw) solid var(--black);
          box-shadow: var(--bs-sm);
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          color: var(--black);
        }
        .form-input:focus, .form-textarea:focus {
          outline: none;
          transform: translate(-2px, -2px);
          box-shadow: var(--bs);
        }
        .form-textarea {
          min-height: 160px;
          resize: vertical;
        }
        .char-count {
          font-size: 10px;
          color: rgba(0,0,0,0.3);
          margin-top: 4px;
          font-weight: 700;
        }

        .image-upload-area {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .upload-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: var(--off-white);
          border: var(--bw) solid var(--black);
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          text-transform: uppercase;
        }
        .upload-btn:hover { background: var(--yellow); }
        .image-preview {
          position: relative;
          max-width: 200px;
        }
        .image-preview img {
          width: 100%;
          border: 2px solid var(--black);
        }
        .remove-img {
          position: absolute;
          top: -8px; right: -8px;
          width: 24px; height: 24px;
          background: #EE4540;
          color: white;
          border: 2px solid var(--black);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
          padding-top: 16px;
          border-top: var(--bw) solid var(--black);
        }
        .btn {
          padding: 12px 24px;
          border: var(--bw) solid var(--black);
          font-weight: 900;
          font-size: 13px;
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.15s;
          box-shadow: var(--bs-sm);
        }
        .btn:hover { transform: translate(2px, 2px); box-shadow: none; }
        .btn-primary { background: var(--yellow); color: var(--black); }
        .btn-secondary { background: var(--white); color: var(--black); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      `}</style>

      <div className="form-title">
        ✍️ Create Post in c/{communityId}
      </div>

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          placeholder="An interesting title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
        <div className="char-count">{title.length}/200</div>
      </div>

      <div className="form-group">
        <label className="form-label">Body</label>
        <textarea
          className="form-textarea"
          placeholder="Optional post body text..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Image (Optional)</label>
        <div className="image-upload-area">
          <label className="upload-btn">
            <FaImage /> Choose Image
            <input type="file" accept="image/*" hidden onChange={handleFileSelect} />
          </label>
          {selectedFile && (
            <div className="image-preview">
              <img src={selectedFile} alt="Preview" />
              <button type="button" className="remove-img" onClick={() => { setSelectedFile(null); setSelectedFileName(''); }}>
                <FaXmark />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading || !title.trim()}>
          {isLoading ? '⏳ Posting...' : '🚀 Post'}
        </button>
      </div>
    </form>
  );
}
