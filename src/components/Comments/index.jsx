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
    <div className="mt-12 pt-8 border-t border-gray-800/50">
      <h3 className="text-2xl font-poppins font-bold text-white mb-6 flex items-center">
        Comments <span className="ml-2 text-sm bg-gray-800 text-gray-300 py-1 px-3 rounded-full">{comments.length}</span>
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-10 p-6 bg-black/20 rounded-2xl border border-gray-800/50">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows="3"
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all resize-y"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-red text-white font-bold px-8 py-3 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,43,43,0.3)] hover:shadow-[0_0_25px_rgba(212,43,43,0.6)]"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading comments...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-900/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red flex items-center justify-center font-bold text-lg flex-shrink-0">
                {comment.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-gray-200">{comment.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed m-0">{comment.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-gray-500 py-4 text-center bg-gray-900/20 rounded-xl border border-gray-800/30">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
