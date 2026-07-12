import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getArticles } from '../../services/api';

const CATEGORIES = [
  { name: 'All', value: 'Box Office' },
  { name: 'Tollywood', value: 'Tollywood Box Office' },
  { name: 'Bollywood', value: 'Bollywood Box Office' },
  { name: 'Kollywood', value: 'Kollywood Box Office' },
  { name: 'Pan-India', value: 'Pan-India Box Office' }
];

const BoxOffice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const category = searchParams.get('category') || 'Box Office';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['articles', { category, page, search }],
    queryFn: () => getArticles({ 
      page, 
      limit: 12, 
      category: category,
      search
    }),
  });

  const handleCategoryChange = (catVal) => {
    setSearchParams({ category: catVal, page: '1' });
  };

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
        <meta name="description" content="Latest box office collections, records, and trade reports from Tollywood and Indian Cinema." />
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
            <div><div className="cat-stat-val">1,200+</div><div className="cat-stat-lbl">Articles</div></div>
            <div><div className="cat-stat-val">Daily</div><div className="cat-stat-lbl">Updates</div></div>
            <div><div className="cat-stat-val">8</div><div className="cat-stat-lbl">Today</div></div>
          </div>
        </div>
        <div className="cat-icon">📈</div>
      </div>

      <div className="desktop-grid">
        <div>
          {/* Filter tabs */}
          <div className="filter-scroll">
            <div className="filter-tabs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  className={`ftab ${category === cat.value ? 'on' : ''}`}
                  onClick={() => handleCategoryChange(cat.value)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

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
        <div className="sidebar-desktop" style={{ display: 'none' }}>
          <div style={{ position: 'sticky', top: '76px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="sw">
              <div className="sw-hdr">
                <div className="live-dot"></div>
                <div className="sw-title">Live Tracking</div>
              </div>
              <Link to="/live-tracking" className="bo-row">
                <div className="bo-name" style={{ color: 'var(--brand-red)', fontWeight: 'bold' }}>Access Live Tracker →</div>
              </Link>
            </div>
            
            <div className="sw">
              <div className="sw-hdr">
                <div className="sw-title">Trending Box Office</div>
              </div>
              <Link to="/movie-news/peddi-crosses-320-cr-worldwide-in-2-weeks-telugu-dominates" className="pop-item">
                <div className="pop-num">1</div>
                <div>
                  <div className="pop-text">Peddi Joins the ₹300 Cr Club at the Box Office</div>
                  <div className="pop-meta">Box Office · June 14</div>
                </div>
              </Link>
              <Link to="/movie-news/kalki-2898-ad-final-closing-collections" className="pop-item">
                <div className="pop-num">2</div>
                <div>
                  <div className="pop-text">Kalki 2898 AD Final Worldwide Closing Collections</div>
                  <div className="pop-meta">Box Office · June 18</div>
                </div>
              </Link>
              <Link to="/movie-news/pushpa-2-day-1-records" className="pop-item">
                <div className="pop-num">3</div>
                <div>
                  <div className="pop-text">Pushpa 2 Day 1 Advance Bookings Create History</div>
                  <div className="pop-meta">Box Office · June 18</div>
                </div>
              </Link>
            </div>

            <div className="sw">
              <div className="sw-hdr">
                <div className="sw-title">Browse Topics</div>
              </div>
              <div className="tag-cloud">
                <Link to="/box-office?category=Tollywood+Box+Office" className="tag">Tollywood</Link>
                <Link to="/box-office?category=Bollywood+Box+Office" className="tag">Bollywood</Link>
                <Link to="/box-office?category=Pan-India+Box+Office" className="tag">Pan-India</Link>
                <Link to="/live-tracking" className="tag">Live Tracking</Link>
                <Link to="/movie-news" className="tag">Movie News</Link>
                <Link to="/reviews" className="tag">Reviews</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Cloud (Mobile Only) */}
      <div className="mobile-sidebar">
        <div className="sw">
          <div className="sw-hdr">
            <div className="sw-title">Browse Topics</div>
          </div>
          <div className="tag-cloud">
            <Link to="/box-office?category=Tollywood+Box+Office" className="tag">Tollywood</Link>
            <Link to="/box-office?category=Bollywood+Box+Office" className="tag">Bollywood</Link>
            <Link to="/box-office?category=Pan-India+Box+Office" className="tag">Pan-India</Link>
            <Link to="/live-tracking" className="tag">Live Tracking</Link>
            <Link to="/movie-news" className="tag">Movie News</Link>
            <Link to="/reviews" className="tag">Reviews</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxOffice;
