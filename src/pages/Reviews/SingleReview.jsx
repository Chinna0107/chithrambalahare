import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Star, Link as LinkIcon } from 'lucide-react';
import { getReviewBySlug } from '../../services/api';
import Comments from '../../components/Comments';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const SingleReview = () => {
  const { slug } = useParams();

  const { data: review, isLoading } = useQuery({
    queryKey: ['review', slug],
    queryFn: () => getReviewBySlug(slug),
  });

  useEffect(() => {
    function checkWidth() {
      const w = window.innerWidth;
      const aside = document.getElementById('deskSidebar');
      const mobileInlines = document.querySelectorAll('.mob-sidebar-inline');
      if (aside) {
        if (w >= 700) {
          aside.style.display = 'block';
          mobileInlines.forEach((el) => { el.style.display = 'none'; });
        } else {
          aside.style.display = 'none';
          mobileInlines.forEach((el) => { el.style.display = 'block'; });
        }
      }
    }
    if (review) {
      checkWidth();
      window.addEventListener('resize', checkWidth);
    }
    return () => window.removeEventListener('resize', checkWidth);
  }, [review]);

  if (isLoading) {
    return (
      <div style={{ color: 'var(--muted)', padding: '100px 0', textAlign: 'center' }}>
        Loading Review...
      </div>
    );
  }

  if (!review) {
    return (
      <div style={{ color: 'var(--text)', padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '32px' }}>Review Not Found</h2>
        <Link to="/reviews" style={{ color: 'var(--gold)', marginTop: '10px', display: 'inline-block' }}>Back to Reviews</Link>
      </div>
    );
  }

  const heroImage = review.poster || FALLBACK;

  return (
    <>
      <Helmet>
        <title>{review.movieName} Review | CHITRAMBHALARE</title>
        <meta name="description" content={review.snippet} />
      </Helmet>

      <div className="wrap">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <Link to="/main" className="bc-link">Home</Link>
          <span>/</span>
          <Link to="/reviews" className="bc-link">Reviews</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>
            {review.movieName.length > 30 ? `${review.movieName.slice(0, 27)}...` : review.movieName}
          </span>
        </div>

        <div className="art-layout">
          {/* ARTICLE / REVIEW */}
          <article>
            <div className="art-cat-badge">Review</div>
            <h1 className="art-title">{review.movieName}</h1>
            <p className="art-deck">{review.snippet}</p>

            <div className="art-byline" style={{ marginBottom: '1.5rem' }}>
              <div className="avatar">CB</div>
              <div>
                <div className="byline-name">Chitrambhalare Team</div>
                <div className="byline-meta">
                  <span>{new Date(review.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="bdot">◆</span>
                  <span>Review</span>
                </div>
              </div>
              
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--card)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Star className="w-6 h-6" style={{ color: 'var(--gold)', fill: 'var(--gold)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text)' }}>{review.rating} <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>/ 5</span></span>
                </div>
              </div>


            </div>

            {/* POSTER & CAST/CREW LAYOUT */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', marginTop: '1rem' }}>
              {/* Left: Poster */}
              <div style={{ flex: '1 1 300px', maxWidth: '350px', margin: '0 auto' }}>
                <img 
                  src={heroImage} 
                  alt={review.movieName} 
                  style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', objectFit: 'cover', aspectRatio: '2/3' }} 
                  onError={(e) => { e.target.src = FALLBACK; }}
                />
              </div>
              
              {/* Right: Cast & Crew Card */}
              <div style={{ flex: '2 1 400px', background: '#f9f9f9', borderRadius: '16px', padding: '2rem', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', alignSelf: 'start' }}>
                {/* Top Border with Badge */}
                <div style={{ position: 'relative', borderTop: '1px solid #ccc', marginTop: '1rem', marginBottom: '2rem' }}>
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#dfa818', color: 'white', padding: '4px 24px', borderRadius: '20px', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 2px 10px rgba(223,168,24,0.3)', whiteSpace: 'nowrap' }}>
                    Cast & Crew
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#1a1a1a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {/* Hero / Heroine mock placeholders if they don't exist in DB just to match vibe, but we'll stick to actual data to be safe, or just map what we have */}
                  
                  {review.director && (
                    <div style={{ fontSize: '1.25rem', fontWeight: '400' }}>
                      {review.director} <span style={{ fontSize: '0.85rem', color: '#666' }}>(Director)</span>
                    </div>
                  )}
                  {review.producer && (
                    <div style={{ fontSize: '1.25rem', fontWeight: '400' }}>
                      {review.producer} <span style={{ fontSize: '0.85rem', color: '#666' }}>(Producer)</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    {review.language && (
                      <div style={{ fontSize: '1.25rem', fontWeight: '400' }}>
                        {review.language} <span style={{ fontSize: '0.85rem', color: '#666' }}>(Language)</span>
                      </div>
                    )}
                    {review.genre && (
                      <div style={{ fontSize: '1.25rem', fontWeight: '400' }}>
                        {review.genre} <span style={{ fontSize: '0.85rem', color: '#666' }}>(Genre)</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    {review.releaseDate && (
                      <div style={{ fontSize: '1.25rem', fontWeight: '500' }}>
                        <span style={{ fontSize: '1.1rem', color: '#1a1a1a', fontWeight: 'bold' }}>Release Date :</span> {review.releaseDate}
                      </div>
                    )}
                    {review.runtime && (
                      <div style={{ fontSize: '1.25rem', fontWeight: '400' }}>
                        {review.runtime} <span style={{ fontSize: '0.85rem', color: '#666' }}>(Runtime)</span>
                      </div>
                    )}
                  </div>

                  {review.productionHouse && (
                    <div style={{ fontSize: '1.25rem', fontWeight: '400' }}>
                      {review.productionHouse} <span style={{ fontSize: '0.85rem', color: '#666' }}>(Banner)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* INLINE SIDEBAR (mobile only) */}
            <div className="mob-sidebar-inline">
              <div className="sw">
                <div className="sw-hdr">
                  <div className="live-dot"></div>
                  <div className="sw-title">Live Box Office</div>
                </div>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">1</div><div className="bo-name2">Peddi</div><div className="bo-amt2">₹320 Cr</div></Link>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">2</div><div className="bo-name2">Drishyam 3</div><div className="bo-amt2">₹236 Cr</div></Link>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">3</div><div className="bo-name2">Karuppu</div><div className="bo-amt2">₹150 Cr</div></Link>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">4</div><div className="bo-name2">Obsession</div><div className="bo-amt2">₹85 Cr</div></Link>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">5</div><div className="bo-name2">Sing Geetham</div><div className="bo-amt2">₹5 Cr</div></Link>
              </div>
            </div>

            {/* BODY CONTENT */}
            <div className="art-body prose prose-invert max-w-none" id="artBody">
              {review.trailer && (
                <div className="mb-8">
                  <h2 style={{ fontSize: '24px', fontFamily: 'Bebas Neue', color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '6px', height: '24px', background: 'var(--brand-red)', marginRight: '12px', borderRadius: '4px' }}></span>
                    Trailer
                  </h2>
                  <div style={{ aspectRatio: '16/9', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={getYouTubeEmbedUrl(review.trailer)} 
                      title="Trailer" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              
              {review.story && (
                <section className="mb-8">
                  <h2 style={{ fontSize: '24px', fontFamily: 'Bebas Neue', color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '6px', height: '24px', background: 'var(--brand-red)', marginRight: '12px', borderRadius: '4px' }}></span>
                    Story
                  </h2>
                  <div dangerouslySetInnerHTML={{ __html: review.story }} />
                </section>
              )}

              {review.performances && (
                <section className="mb-8">
                  <h2 style={{ fontSize: '24px', fontFamily: 'Bebas Neue', color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '6px', height: '24px', background: 'var(--brand-red)', marginRight: '12px', borderRadius: '4px' }}></span>
                    Performances
                  </h2>
                  <div dangerouslySetInnerHTML={{ __html: review.performances }} />
                </section>
              )}

              {review.technicalAspects && (
                <section className="mb-8">
                  <h2 style={{ fontSize: '24px', fontFamily: 'Bebas Neue', color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '6px', height: '24px', background: 'var(--brand-red)', marginRight: '12px', borderRadius: '4px' }}></span>
                    Technical Aspects
                  </h2>
                  <div dangerouslySetInnerHTML={{ __html: review.technicalAspects }} />
                </section>
              )}

              {/* VERDICT BOX */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--brand-red)', borderRadius: '12px', padding: '2rem', marginTop: '3rem', textAlign: 'center', boxShadow: '0 0 20px rgba(212, 43, 43, 0.1)' }}>
                <h2 style={{ fontSize: '28px', fontFamily: 'Bebas Neue', color: 'var(--text)', marginBottom: '16px' }}>Verdict</h2>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--brand-red)' }}>
                  {review.verdict}
                </p>
                {review.verdictText && (
                  <div style={{ marginTop: '1rem', textAlign: 'left', color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: review.verdictText }} />
                )}
              </div>
            </div>

            {/* SHARE BAR */}
            <div className="share-bar" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '3rem' }}>
              <span className="share-lbl">Share:</span>
              <button className="share-btn" style={{ padding: '8px' }} title="Facebook" onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="share-btn" style={{ padding: '8px' }} title="Twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
              <button className="share-btn" style={{ padding: '8px' }} title="WhatsApp" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`, '_blank')}>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
              <button className="share-btn" style={{ padding: '8px' }} title="Copy Link" onClick={() => { navigator.clipboard.writeText(window.location.href); }}>
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* COMMENTS SECTION */}
            <Comments entityType="review" entityId={review.slug || review.id} />

          </article>

          {/* DESKTOP SIDEBAR */}
          <aside style={{ display: 'none' }} id="deskSidebar">
            <div style={{ position: 'sticky', top: '76px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="sw">
                <div className="sw-hdr"><div className="live-dot"></div><div className="sw-title">Live Box Office</div></div>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">1</div><div className="bo-name2">Peddi</div><div className="bo-amt2">₹320 Cr</div></Link>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">2</div><div className="bo-name2">Drishyam 3</div><div className="bo-amt2">₹236 Cr</div></Link>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">3</div><div className="bo-name2">Karuppu</div><div className="bo-amt2">₹150 Cr</div></Link>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">4</div><div className="bo-name2">Obsession</div><div className="bo-amt2">₹85 Cr</div></Link>
                <Link to="/box-office" className="bo-row"><div className="bo-rank2">5</div><div className="bo-name2">Sing Geetham</div><div className="bo-amt2">₹5 Cr</div></Link>
              </div>
              <div className="sw">
                <div className="sw-hdr"><div className="sw-title">You May Also Like</div></div>
                <Link to="/box-office" className="pop-item"><div className="pop-num">1</div><div><div className="pop-text">All Time Worldwide Top 15 Telugu Movies</div><div className="pop-meta">Records</div></div></Link>
                <Link to="/movie-news/dhurandhar-unedited-version-streams-on-netflix-june-19" className="pop-item"><div className="pop-num">2</div><div><div className="pop-text">Drishyam 3 — ₹236 Cr in 24 Days Worldwide</div><div className="pop-meta">Box Office</div></div></Link>
                <Link to="/reviews" className="pop-item"><div className="pop-num">3</div><div><div className="pop-text">Peddi Review: Ram Charan Powers Engaging Drama</div><div className="pop-meta">Review</div></div></Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default SingleReview;


