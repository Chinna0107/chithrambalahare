import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Comments = ({ entityType, entityId }) => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!entityType || !entityId) return;
        setLoading(true);
        const res = await axios.get(`${API_URL}/comments/${entityType}/${entityId}`);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [entityType, entityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || !entityType || !entityId) return;
    
    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/comments`, {
        entityType,
        entityId,
        name,
        text
      });
      
      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setName('');
        setText('');
      }
    } catch (err) {
      console.error('Failed to submit comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-section" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)' }}>Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows="3"
            disabled={submitting}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', resize: 'vertical' }}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto bg-brand-red text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center hover:bg-red-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,43,43,0.3)] hover:shadow-[0_0_25px_rgba(212,43,43,0.6)] hover:-translate-y-0.5"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {loading ? (
        <div style={{ color: 'var(--muted)' }}>Loading comments...</div>
      ) : (
        <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {comment.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>{comment.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {new Date(comment.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>{comment.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div style={{ color: 'var(--muted)' }}>No comments yet. Be the first to comment!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
