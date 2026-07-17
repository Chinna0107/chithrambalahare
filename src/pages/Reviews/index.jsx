import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../../components/Sidebar';
import { getReviews, getStats } from '../../services/api';
import { Star } from 'lucide-react';

const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;

  const { data: allReviews, isLoading } = useQuery({
    queryKey: ['all-reviews'],
    queryFn: getReviews,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats', 'reviews'],
    queryFn: () => getStats('reviews'),
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reviews = allReviews || [];
  const totalPages = Math.ceil(reviews.length / limit) || 1;

  const currentReviews = reviews.slice((page - 1) * limit, page * limit);
  const featuredReview = page === 1 && currentReviews[0] ? currentReviews[0] : null;
  const sideReviews = page === 1 ? currentReviews.slice(1, 4) : [];
  const gridReviews = page === 1 ? currentReviews.slice(4) : currentReviews;

  return (
    <div className="wrap">
      <Helmet>
        <title>Movie Reviews | CHITRAMBHALARE</title>
        <meta name="description" content="Read honest Telugu movie reviews and ratings — story, performance and verdict for the latest Tollywood releases." />
        <meta name="keywords" content="telugu movie review, tollywood movie rating, movie reviews in telugu, latest telugu movie review, tollywood movie verdict" />
      </Helmet>

      {/* Breadcrumb */}
      <div style={{ padding: '12px 0 0', fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Link to="/main" style={{ cursor: 'pointer', color: 'var(--gold)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text)' }}>Movie Reviews</span>
      </div>

      {/* Category Banner */}
      <div className="cat-banner">
        <div>
          <div className="cat-eyebrow">Browse Category</div>
          <div className="cat-title">Movie Reviews</div>
          <div className="cat-desc">Honest, unbiased, and detailed analysis of the newest releases in Tollywood and beyond.</div>
          <div className="cat-stats">
            <div><div className="cat-stat-val">{stats ? stats.total.toLocaleString() : '...'}</div><div className="cat-stat-lbl">Reviews</div></div>
            <div><div className="cat-stat-val">Daily</div><div className="cat-stat-lbl">Updates</div></div>
            <div><div className="cat-stat-val">{stats ? stats.today : '...'}</div><div className="cat-stat-lbl">Today</div></div>
          </div>
        </div>
        <div className="cat-icon">⭐</div>
      </div>

      <div className="desktop-grid">
        <div>
          {isLoading ? (
            <div style={{ color: 'var(--muted)', padding: '40px 0', textAlign: 'center' }}>
              Loading Reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted)' }}>No reviews found.</p>
            </div>
          ) : (
            <>
              {/* Featured Section */}
              {featuredReview && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-title">Featured Review</div>
                  </div>
                  <Link to={`/reviews/${featuredReview.slug}`} className="feat-main" style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="feat-img" style={{ position: 'relative', overflow: 'hidden' }}>
                      {featuredReview.poster ? (
                        <img
                          src={featuredReview.poster}
                          alt={featuredReview.movieName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'; }}
                        />
                      ) : (
                        featuredReview.movieName.split(' ')[0]
                      )}
                      <div className="feat-badge" style={{ zIndex: 2 }}>⭐ {featuredReview.rating}/5</div>
                    </div>
                    <div className="feat-body">
                      <div className="feat-title">{featuredReview.movieName} Review</div>
                      <div className="feat-excerpt">{featuredReview.snippet}</div>
                      <div className="feat-meta">
                        <span>By {featuredReview.author || 'Admin'}</span>
                        <span className="dot">◆</span>
                        <span>{new Date(featuredReview.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                </>
              )}

              {/* Side Scroll Section */}
              {sideReviews.length > 0 && (
                <div className="side-scroll mt-4">
                  {sideReviews.map((rev) => (
                    <Link to={`/reviews/${rev.slug}`} key={rev.id} className="side-card">
                      <div className="side-cat">⭐ {rev.rating}/5</div>
                      <div className="side-title">{rev.movieName} Review</div>
                      <div className="side-date">
                        {new Date(rev.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

              {/* All Reviews Grid */}
              {gridReviews.length > 0 && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-title">All Reviews</div>
                  </div>
                  <div className="news-grid">
                    {gridReviews.map((rev) => (
                      <Link to={`/reviews/${rev.slug}`} key={rev.id} className="n-card">
                        <div className="n-thumb" style={{ background: '#0d1b30', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {rev.poster ? (
                            <img
                              src={rev.poster}
                              alt={rev.movieName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'; }}
                            />
                          ) : (
                            '🎬'
                          )}
                        </div>
                        <div className="n-body">
                          <div className="n-cat">⭐ {rev.rating}/5</div>
                          <div className="n-title">{rev.movieName} Review</div>
                          <div className="n-meta">
                            {new Date(rev.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pg-btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    ‹
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
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
                    disabled={page === totalPages}
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
      <div className="mobile-sidebar mt-8">
        <Sidebar />
      </div>
    </div>
  );
};

export default Reviews;
