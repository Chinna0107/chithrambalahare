import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../../components/Sidebar';
import { getArticles, getStats } from '../../services/api';

const BoxOffice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['articles', { page, search, category: 'Box Office' }],
    queryFn: () => getArticles({
      page,
      limit: 12,
      category: 'Box Office',
      search
    }),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats', 'box-office'],
    queryFn: () => getStats('box-office'),
    staleTime: 1000 * 60 * 5,
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
        <title>Box Office News | CHITRAMBHALARE</title>
        <meta name="description" content="Track daily, weekend and lifetime box office collections of Telugu movies with accurate BMS ticket sales data and box office reports." />
        <meta name="keywords" content="tollywood box office collection, telugu movies box office report, BMS ticket sales telugu movies, telugu movie box office today, tollywood worldwide collection, telugu movie day 1 collection, telugu movie advance booking, BMS ticket tracking, Daily BMS Ticket Sales" />
      </Helmet>

      {/* Breadcrumb */}
      <div style={{ padding: '12px 0 0', fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Link to="/main" style={{ cursor: 'pointer', color: 'var(--gold)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text)' }}>Box Office</span>
      </div>

      {/* Category Banner */}
      <div className="cat-banner">
        <div>
          <div className="cat-eyebrow">Trade Reports</div>
          <div className="cat-title">Box Office News</div>
          <div className="cat-desc">Latest collections, box office records, and trade updates from Indian Cinema.</div>
          <div className="cat-stats">
            <div><div className="cat-stat-val">{stats ? stats.total.toLocaleString() : '...'}</div><div className="cat-stat-lbl">Articles</div></div>
            <div><div className="cat-stat-val">Daily</div><div className="cat-stat-lbl">Updates</div></div>
            <div><div className="cat-stat-val">{stats ? stats.today : '...'}</div><div className="cat-stat-lbl">Today</div></div>
          </div>
        </div>
        <div className="cat-icon">📈</div>
      </div>

      <div className="desktop-grid">
        <div>


          {isLoading ? (
            <div style={{ color: 'var(--muted)', padding: '40px 0', textAlign: 'center' }}>
              Loading Box Office News...
            </div>
          ) : allFetchedArticles.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted)' }}>No articles found. Try another category or search term.</p>
            </div>
          ) : (
            <>
              {/* Featured Section */}
              {featuredArticle && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-title">Featured</div>
                    <span className="see-all">See all →</span>
                  </div>
                  <Link to={`/movie-news/${featuredArticle.slug}`} className="feat-main" style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="feat-img" style={{ position: 'relative', overflow: 'hidden' }}>
                      {featuredArticle.featuredImage ? (
                        <img
                          src={featuredArticle.featuredImage}
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
                    <div className="sw-title">Live Tracking Portal</div>
                  </div>
                  <Link to="/live-tracking" className="bo-row">
                    <div className="bo-name">View Real-time Collections →</div>
                  </Link>
                </div>
              </div>

              {/* All News Grid */}
              {gridArticles.length > 0 && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-title">All Box Office News</div>
                    <span className="see-all">1,200+ →</span>
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

export default BoxOffice;
