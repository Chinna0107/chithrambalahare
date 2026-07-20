import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../../components/Sidebar';
import { getArticles, getStats } from '../../services/api';

const OTT = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const category = 'OTT'; // Hardcoded for this page

  const { data, isLoading } = useQuery({
    queryKey: ['articles', { category, page, search }],
    queryFn: () => getArticles({
      page,
      limit: 12,
      category,
      search
    }),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats', 'ott'],
    queryFn: () => getStats('ott'),
  });

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allFetchedArticles = data?.data || [];
  const featuredArticle = page === 1 && allFetchedArticles[0] ? allFetchedArticles[0] : null;
  const sideArticles = page === 1 ? allFetchedArticles.slice(1, 4) : [];
  const gridArticles = page === 1 ? allFetchedArticles.slice(4) : allFetchedArticles;

  return (
    <div className="wrap">
      <Helmet>
        <title>OTT News | CHITRAMBHALARE</title>
        <meta name="description" content="Find out when your favorite Telugu movies are streaming — OTT release dates, platform details and digital rights news for Tollywood films." />
        <meta name="keywords" content="telugu movies OTT release date, tollywood OTT news, telugu movie streaming platform, telugu new movies OTT, tollywood digital rights news" />
      </Helmet>

      {/* Breadcrumb */}
      <div style={{ padding: '12px 0 0', fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Link to="/main" style={{ cursor: 'pointer', color: 'var(--gold)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text)' }}>OTT</span>
      </div>

      {/* Category Banner */}
      <div className="cat-banner">
        <div>
          <div className="cat-eyebrow">Browse Category</div>
          <div className="cat-title">OTT Updates</div>
          <div className="cat-desc">Latest OTT releases, digital streaming dates, and exclusive news.</div>
          <div className="cat-stats">
            <div><div className="cat-stat-val">{stats ? stats.total.toLocaleString() : '...'}</div><div className="cat-stat-lbl">Articles</div></div>
            <div><div className="cat-stat-val">Daily</div><div className="cat-stat-lbl">Updates</div></div>
            <div><div className="cat-stat-val">{stats ? stats.today : '...'}</div><div className="cat-stat-lbl">Today</div></div>
          </div>
        </div>
        <div className="cat-icon">📺</div>
      </div>

      <div className="desktop-grid">
        <div>
          {isLoading ? (
            <div style={{ color: 'var(--muted)', padding: '40px 0', textAlign: 'center' }}>
              Loading OTT News...
            </div>
          ) : allFetchedArticles.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted)' }}>No OTT articles found.</p>
            </div>
          ) : (
            <>
              {/* Featured Section */}
              {featuredArticle && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-title">Featured</div>
                  </div>
                  <Link to={`/movie-news/${featuredArticle.slug}`} className="feat-main" style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="feat-img" style={{ position: 'relative', overflow: 'hidden' }}>
                      {featuredArticle.featuredImage || featuredArticle.thumbnail ? (
                        <img
                          src={featuredArticle.featuredImage || featuredArticle.thumbnail}
                          alt={featuredArticle.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                        />
                      ) : (
                        featuredArticle.title.split(' ')[0]
                      )}
                      <div className="feat-badge" style={{ zIndex: 2 }}>🔥 Top Story</div>
                    </div>
                    <div className="feat-body">
                      <div className="feat-title">{featuredArticle.title}</div>
                      <div className="feat-excerpt">{featuredArticle.excerpt}</div>
                      <div className="feat-meta">
                        <span>By {featuredArticle.author}</span>
                        <span className="dot">◆</span>
                        <span>{new Date(featuredArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className="dot">◆</span>
                        <span>3 min read</span>
                      </div>
                    </div>
                  </Link>
                </>
              )}

              {/* Side Scroll Section */}
              {sideArticles.length > 0 && (
                <div className="side-scroll">
                  {sideArticles.map((art) => (
                    <Link to={`/movie-news/${art.slug}`} key={art.id} className="side-card">
                      <div className="side-cat">{art.category}</div>
                      <div className="side-title">{art.title}</div>
                      <div className="side-date">
                        {new Date(art.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile Sidebar */}
              <div className="mobile-sidebar">
                <div className="sw">
                  <div className="sw-hdr">
                    <div className="live-dot"></div>
                    <div className="sw-title">Live Box Office</div>
                  </div>
                  <Link to="/box-office" className="bo-row">
                    <div className="bo-rank">1</div>
                    <div className="bo-name">Peddi</div>
                    <div className="bo-amt">₹320 Cr</div>
                  </Link>
                  <Link to="/box-office" className="bo-row">
                    <div className="bo-rank">2</div>
                    <div className="bo-name">Drishyam 3</div>
                    <div className="bo-amt">₹236 Cr</div>
                  </Link>
                  <Link to="/box-office" className="bo-row">
                    <div className="bo-rank">3</div>
                    <div className="bo-name">Obsession</div>
                    <div className="bo-amt">₹85 Cr</div>
                  </Link>
                  <Link to="/box-office" className="bo-row">
                    <div className="bo-rank">4</div>
                    <div className="bo-name">Hai Jawani Toh Ishq</div>
                    <div className="bo-amt">₹55 Cr</div>
                  </Link>
                </div>
              </div>

              {/* All News Grid */}
              {gridArticles.length > 0 && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-title">All OTT News</div>
                  </div>
                  <div className="news-grid">
                    {gridArticles.map((art) => (
                      <Link to={`/movie-news/${art.slug}`} key={art.id} className="n-card">
                        <div className="n-thumb" style={{ background: '#0d1b30', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {art.thumbnail ? (
                            <img
                              src={art.thumbnail}
                              alt={art.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            '🎬'
                          )}
                        </div>
                        <div className="n-body">
                          <div className="n-cat">{art.category}</div>
                          <div className="n-title">{art.title}</div>
                          <div className="n-meta">
                            {new Date(art.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination */}
              {data?.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pg-btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    ‹
                  </button>
                  {[...Array(data.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`pg-btn ${page === i + 1 ? 'cur' : ''}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="pg-btn"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === data.totalPages}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="sidebar-desktop">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="mobile-sidebar">
        <Sidebar />
      </div>
    </div>
  );
};

export default OTT;
