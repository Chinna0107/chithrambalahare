import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ReviewCard from '../../components/ReviewCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { getReviews } from '../../services/api';

const Reviews = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['all-reviews'],
    queryFn: getReviews,
  });

  return (
    <div className="wrap">
      <Helmet>
        <title>Movie Reviews | CHITRAMBHALARE</title>
        <meta name="description" content="Read unbiased and detailed movie reviews." />
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
            <div><div className="cat-stat-val">300+</div><div className="cat-stat-lbl">Reviews</div></div>
            <div><div className="cat-stat-val">Weekly</div><div className="cat-stat-lbl">Updates</div></div>
            <div><div className="cat-stat-val">⭐</div><div className="cat-stat-lbl">Ratings</div></div>
          </div>
        </div>
        <div className="cat-icon">⭐</div>
      </div>

      <div className="desktop-grid">
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {[...Array(10)].map((_, i) => <LoadingSkeleton key={i} type="card" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {reviews?.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="sidebar-desktop" style={{ display: 'none' }}>
          <div style={{ position: 'sticky', top: '76px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            
            <div className="sw">
              <div className="sw-hdr">
                <div className="sw-title">Popular Stories</div>
              </div>
              <Link to="/movie-news/peddi-crosses-320-cr-worldwide-in-2-weeks-telugu-dominates" className="pop-item">
                <div className="pop-num">1</div>
                <div>
                  <div className="pop-text">Peddi Joins the ₹300 Cr Club at the Box Office</div>
                  <div className="pop-meta">Box Office · June 14</div>
                </div>
              </Link>
              <Link to="/movie-news/chiranjeevi-venkatesh-rumors-films-not-postponed" className="pop-item">
                <div className="pop-num">2</div>
                <div>
                  <div className="pop-text">Chiranjeevi & Venkatesh Rumors: Films Not Postponed</div>
                  <div className="pop-meta">Movie News · June 18</div>
                </div>
              </Link>
              <Link to="/movie-news/dhurandhar-unedited-version-streams-on-netflix-june-19" className="pop-item">
                <div className="pop-num">3</div>
                <div>
                  <div className="pop-text">Dhurandhar Unedited Version Streams on Netflix June 19</div>
                  <div className="pop-meta">OTT · June 18</div>
                </div>
              </Link>
            </div>

            <div className="sw">
              <div className="sw-hdr">
                <div className="sw-title">Browse Topics</div>
              </div>
              <div className="tag-cloud">
                <Link to="/movie-news?search=Ram Charan" className="tag">Ram Charan</Link>
                <Link to="/movie-news?search=Pawan Kalyan" className="tag">Pawan Kalyan</Link>
                <Link to="/movie-news?search=Chiranjeevi" className="tag">Chiranjeevi</Link>
                <Link to="/movie-news?category=OTT" className="tag">OTT</Link>
                <Link to="/box-office" className="tag">Box Office</Link>
                <Link to="/reviews" className="tag">Reviews</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Cloud (Mobile Only) */}
      <div className="mobile-sidebar mt-8">
        <div className="sw">
          <div className="sw-hdr">
            <div className="sw-title">Browse Topics</div>
          </div>
          <div className="tag-cloud">
            <Link to="/movie-news?search=Ram Charan" className="tag">Ram Charan</Link>
            <Link to="/movie-news?search=Pawan Kalyan" className="tag">Pawan Kalyan</Link>
            <Link to="/movie-news?search=Chiranjeevi" className="tag">Chiranjeevi</Link>
            <Link to="/movie-news?category=OTT" className="tag">OTT</Link>
            <Link to="/box-office" className="tag">Box Office</Link>
            <Link to="/reviews" className="tag">Reviews</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;


