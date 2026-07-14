import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

const fetchTeluguNews = async ({ page = 1, search = '' } = {}) => {
  const res = await axios.get('/api/telugu-news', {
    params: { limit: 12, offset: (page - 1) * 12, search }
  });
  return res.data;
};

const TeluguNews = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['telugu-news', page, search],
    queryFn: () => fetchTeluguNews({ page, search }),
    keepPreviousData: true,
  });

  const published = news.filter(n => !n.status || n.status === 'published');

  return (
    <>
      <Helmet>
        <title>Telugu News | Chitrambhalare</title>
        <meta name="description" content="Latest Telugu news, regional updates, politics, entertainment and more on Chitrambhalare." />
      </Helmet>

      <div className="wrap">
        <div className="breadcrumb">
          <Link to="/main" className="bc-link">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>Telugu News</span>
        </div>

        <div className="art-layout">
          <div>
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <h1 className="section-title">Telugu News</h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '6px' }}>
                Latest regional news, politics, entertainment & more
              </p>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="Search Telugu news..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>

            {isLoading ? (
              <div style={{ color: 'var(--muted)', padding: '60px 0', textAlign: 'center' }}>Loading...</div>
            ) : published.length === 0 ? (
              <div style={{ color: 'var(--muted)', padding: '60px 0', textAlign: 'center' }}>
                No news found.
              </div>
            ) : (
              <div className="telugu-news-grid">
                {published.map(item => (
                  <Link to={`/telugu-news/${item.slug || item.id}`} key={item.id} className="telugu-news-card">
                    <div className="telugu-news-thumb">
                      <img
                        src={item.thumbnail || item.featuredImage || FALLBACK}
                        alt={item.title}
                        onError={e => { e.target.src = FALLBACK; }}
                      />
                      {item.category && (
                        <span className="telugu-news-cat">{item.category}</span>
                      )}
                    </div>
                    <div className="telugu-news-body">
                      <h2 className="telugu-news-title">{item.title}</h2>
                      {item.excerpt && <p className="telugu-news-excerpt">{item.excerpt}</p>}
                      <div className="telugu-news-meta">
                        {item.author && <span>{item.author}</span>}
                        {item.date && <span>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {published.length >= 12 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: '8px 20px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                <span style={{ color: 'var(--muted)', lineHeight: '36px' }}>Page {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{ padding: '8px 20px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="sidebar-desktop">
            <Sidebar />
          </div>
        </div>

        <div className="mobile-sidebar mt-8 px-4">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default TeluguNews;
