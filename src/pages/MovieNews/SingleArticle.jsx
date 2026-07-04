import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { getArticleBySlug, getArticles } from '../../services/api';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

// ── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 bg-white/10 hover:bg-brand-red text-white p-2 rounded-full transition-all z-10" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-semibold">
        {current + 1} / {images.length}
      </div>
      {images.length > 1 && (
        <button className="absolute left-3 md:left-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
          onClick={(e) => { e.stopPropagation(); prev(); }}>
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <div className="max-w-5xl max-h-[85vh] px-16" onClick={e => e.stopPropagation()}>
        <img
          src={images[current]}
          alt=""
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl mx-auto block"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
      </div>
      {images.length > 1 && (
        <button className="absolute right-3 md:right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
          onClick={(e) => { e.stopPropagation(); next(); }}>
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

// ── Image Strip (horizontal scroll with Swiper) ──────────────────────────────
const ImageStrip = ({ images }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  if (!images || images.length === 0) return null;

  return (
    <div className="my-8 group-img relative">
      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      {images.length === 1 ? (
        <figure className="cursor-pointer" onClick={() => setLightboxIndex(0)}>
          <img
            src={images[0]}
            alt="Article image"
            className="w-full rounded-xl object-cover max-h-[500px]"
            onError={(e) => { e.target.src = FALLBACK; }}
          />
        </figure>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={12}
            slidesPerView={1.15}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.img-strip-next',
              prevEl: '.img-strip-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              900: { slidesPerView: 2.2 },
            }}
            className="rounded-xl"
          >
            {images.map((src, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="relative overflow-hidden rounded-xl cursor-pointer"
                  style={{ aspectRatio: '16/9' }}
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={src}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => { e.target.src = FALLBACK_THUMB; }}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 hover:opacity-100 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full transition-opacity">
                      View
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {idx + 1}/{images.length}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="img-strip-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-brand-red text-white p-1.5 rounded-full transition-all border border-white/10">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="img-strip-next absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-brand-red text-white p-1.5 rounded-full transition-all border border-white/10">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <style>{`
        .group-img .swiper-pagination-bullet { background: white; opacity: 0.5; }
        .group-img .swiper-pagination-bullet-active { background: #D42B2B; opacity: 1; }
      `}</style>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const SingleArticle = () => {
  const { slug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug),
  });

  const { data: relatedNews } = useQuery({
    queryKey: ['relatedNews', article?.category],
    queryFn: () => getArticles({ category: article?.category, limit: 5 }),
    enabled: !!article,
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
    if (article) {
      checkWidth();
      window.addEventListener('resize', checkWidth);
    }
    return () => window.removeEventListener('resize', checkWidth);
  }, [article]);

  if (isLoading) {
    return (
      <div style={{ color: 'var(--muted)', padding: '100px 0', textAlign: 'center' }}>
        Loading Article...
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ color: 'var(--text)', padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '32px' }}>Article Not Found</h2>
        <Link to="/movie-news" style={{ color: 'var(--gold)', marginTop: '10px', display: 'inline-block' }}>Back to Movie News</Link>
      </div>
    );
  }

  const isPeddiArticle = slug.includes('peddi');

  const heroImage = article.featuredImage || article.thumbnail || FALLBACK;
  
  // Extract image URLs from HTML content string for the lightbox strip
  const contentStr = typeof article.content === 'string' ? article.content : '';
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const contentImages = [];
  let match;
  while ((match = imgRegex.exec(contentStr)) !== null) {
    contentImages.push(match[1]);
  }

  // Deduplicate featured image + content images
  const allImages = [heroImage, ...contentImages.filter(u => u !== heroImage)];

  return (
    <>
      <Helmet>
        <title>{article.title} | CHITRAMBHALARE</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <div className="wrap">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <Link to="/main" className="bc-link">Home</Link>
          <span>/</span>
          <Link to="/movie-news" className="bc-link">Movie News</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>
            {article.title.length > 30 ? `${article.title.slice(0, 27)}...` : article.title}
          </span>
        </div>

        <div className="art-layout">
          {/* ARTICLE */}
          <article>
            <div className="art-cat-badge">{article.category}</div>
            <h1 className="art-title">{article.title}</h1>
            <p className="art-deck">{article.excerpt}</p>

            <div className="art-byline">
              <div className="avatar">
                {(article.author || 'CB').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="byline-name">{article.author}</div>
                <div className="byline-meta">
                  <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="bdot">◆</span>
                  <span>5 min read</span>
                  <span className="bdot">◆</span>
                  <span>{article.category}</span>
                </div>
              </div>
              <div className="art-actions">
                <button className="act-btn">♡</button>
                <button className="act-btn" onClick={() => { navigator.clipboard.writeText(window.location.href); }}>↗</button>
              </div>
            </div>

            {/* HERO IMAGE or IMAGE STRIP */}
            {allImages.length > 1 ? (
              <ImageStrip images={allImages} />
            ) : (
              <>
                <div className="art-hero-img" style={{ position: 'relative' }}>
                  <img
                    src={heroImage}
                    alt={article.title}
                    onError={(e) => { e.target.src = FALLBACK; }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                  />
                  <div className="art-hero-text" style={{ position: 'relative', zIndex: 2 }}>
                    {isPeddiArticle ? 'PEDDI' : article.category.toUpperCase()}
                  </div>
                </div>
                <div className="img-caption">{article.title}</div>
              </>
            )}

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
            <div className="art-body prose prose-invert max-w-none" id="artBody" dangerouslySetInnerHTML={{ __html: typeof article.content === 'string' ? article.content : '' }} />

            {/* TAGS */}
            <div className="art-tags">
              {article.tags?.map((tag) => (
                <Link to={`/movie-news?search=${tag}`} key={tag} className="atag">{tag}</Link>
              ))}
            </div>

            {/* SHARE BAR */}
            <div className="share-bar">
              <span className="share-lbl">Share:</span>
              <button className="share-btn" onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>Facebook</button>
              <button className="share-btn" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}>Twitter</button>
              <button className="share-btn" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`, '_blank')}>WhatsApp</button>
              <button className="share-btn" onClick={() => { navigator.clipboard.writeText(window.location.href); }}>Copy Link</button>
            </div>

            {/* AUTHOR BIO */}
            <div className="author-box">
              <div className="author-av">{(article.author || 'CB').slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="author-name">{article.author}</div>
                <div className="author-role">Senior Editor, {article.category}</div>
                <div className="author-bio">
                  {article.author} covers box office collections and trade analysis for Chitrambhalare. With 8+ years tracking Telugu cinema, they are known for detailed data breakdowns and sharp verdict analysis.
                </div>
              </div>
            </div>

            {/* RELATED ARTICLES */}
            <div className="related-title">Related Articles</div>
            <div className="related-grid">
              {relatedNews?.data?.filter(n => n.id !== article.id).slice(0, 4).map((rel) => (
                <Link to={`/movie-news/${rel.slug}`} key={rel.id} className="rel-card">
                  <div className="rel-thumb" style={{ background: '#0d1b30', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {rel.thumbnail ? (
                      <img
                        src={rel.thumbnail}
                        alt={rel.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = FALLBACK_THUMB; }}
                      />
                    ) : '🎬'}
                  </div>
                  <div className="rel-body">
                    <div className="rel-cat">{rel.category}</div>
                    <div className="rel-title">{rel.title}</div>
                    <div className="rel-date">{new Date(rel.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </Link>
              ))}
            </div>
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

export default SingleArticle;
