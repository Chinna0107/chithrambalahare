import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Star, ChevronLeft, ChevronRight, X, Link as LinkIcon, Share2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import 'swiper/css';
import { getReviewBySlug } from '../../services/api';
import Comments from '../../components/Comments';
import ShareWidget from '../../components/ShareWidget';

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
    window.scrollTo(0, 0);
  }, [slug]);

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
        <title>{review.seoTitle || review.movieName + " Review"} | CHITRAMBHALARE</title>
        <meta name="description" content={review.metaDescription || review.snippet || review.verdict} />
        {review.metaKeywords && <meta name="keywords" content={review.metaKeywords} />}
        {review.canonicalUrl && <link rel="canonical" href={review.canonicalUrl} />}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={review.ogTitle || review.seoTitle || review.movieName + " Review"} />
        <meta property="og:description" content={review.ogDescription || review.metaDescription || review.snippet || review.verdict} />
        <meta property="og:image" content={review.ogImage || heroImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        {review.canonicalUrl && <meta property="og:url" content={review.canonicalUrl} />}

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={review.twitterCard || "summary_large_image"} />
        <meta name="twitter:title" content={review.ogTitle || review.seoTitle || review.movieName + " Review"} />
        <meta name="twitter:description" content={review.ogDescription || review.metaDescription || review.snippet || review.verdict} />
        <meta name="twitter:image" content={review.ogImage || heroImage} />
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
            <ShareWidget title={review.movieName + " Review"} url={window.location.href} image={heroImage} />
            
            {/* COMMENTS SECTION */}
            <Comments entityType="review" entityId={review.slug || review.id} />

          </article>

          {/* Desktop Sidebar */}
          <div className="sidebar-desktop">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className="mobile-sidebar mt-8 px-4">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default SingleReview;


