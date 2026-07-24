import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticleBySlug, useArticles } from '../../hooks/useArticles';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, X, Link as LinkIcon } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Comments from '../../components/Comments';
import ShareWidget from '../../components/ShareWidget';

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

// ── Also Read Banner ────────────────────────────────────────────────────────────
const AlsoRead = ({ articles, exclude }) => {
  if (!articles || articles.length === 0) return null;
  const picks = articles.filter(a => a.id !== exclude?.id);
  if (picks.length === 0) return null;
  const pick = picks[Math.floor(Math.random() * picks.length)];
  return (
    <div className="also-read-banner">
      <Link to={`/movie-news/${pick.slug}`} className="also-read-link">
        <span className="also-read-label">Also Read -&nbsp;</span>
        <span className="also-read-title">{pick.title}</span>
      </Link>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const SingleArticle = () => {
  const { slug } = useParams();

  const { data: article, isLoading } = useArticleBySlug(slug);

  const { data: relatedData } = useArticles({ category: article?.category, limit: 5 });
  const relatedNews = relatedData?.data || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
        <title>{article.seoTitle || article.title} | CHITRAMBHALARE</title>
        <meta name="description" content={article.metaDescription || article.excerpt} />
        {article.metaKeywords && <meta name="keywords" content={article.metaKeywords} />}
        {article.canonicalUrl && <link rel="canonical" href={article.canonicalUrl} />}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={article.ogTitle || article.seoTitle || article.title} />
        <meta property="og:description" content={article.ogDescription || article.metaDescription || article.excerpt} />
        <meta property="og:image" content={article.ogImage || heroImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        {article.canonicalUrl && <meta property="og:url" content={article.canonicalUrl} />}

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={article.twitterCard || "summary_large_image"} />
        <meta name="twitter:title" content={article.ogTitle || article.seoTitle || article.title} />
        <meta name="twitter:description" content={article.ogDescription || article.metaDescription || article.excerpt} />
        <meta name="twitter:image" content={article.ogImage || heroImage} />
      </Helmet>

      <div className="wrap">
        {/* BREADCRUMB */}
        {(() => {
          const cat = (article.category || '').toLowerCase();
          const isBoxOffice = cat.includes('box office');
          const breadcrumbLabel = isBoxOffice ? 'Box Office' : 'Movie News';
          const breadcrumbPath = isBoxOffice ? '/box-office' : '/movie-news';
          return (
            <div className="breadcrumb">
              <Link to="/main" className="bc-link">Home</Link>
              <span>/</span>
              <Link to={breadcrumbPath} className="bc-link">{breadcrumbLabel}</Link>
              <span>/</span>
              <span style={{ color: 'var(--text)' }}>
                {article.title.length > 30 ? `${article.title.slice(0, 27)}...` : article.title}
              </span>
            </div>
          );
        })()}

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


            {/* BODY CONTENT — split after first paragraph to inject Also Read */}
            {(() => {
              let html = typeof article.content === 'string' ? article.content : '';
              
              // Wrap tables for responsiveness
              html = html.replace(/<table/g, '<div class="table-responsive" style="width: 100%; overflow-x: auto; margin: 24px 0;"><table style="width: 100%; min-width: 600px; border-collapse: collapse;"')
                         .replace(/<\/table>/g, '</table></div>');
                         
              let splitIdx = -1;
              let searchIdx = 0;
              while (true) {
                const pIdx = html.indexOf('</p>', searchIdx);
                if (pIdx === -1) {
                  const tEnd = html.indexOf('</table></div>');
                  splitIdx = tEnd !== -1 ? tEnd + 14 : -1;
                  break;
                }
                const lastTableStart = html.lastIndexOf('<div class="table-responsive"', pIdx);
                const lastTableEnd = html.lastIndexOf('</table></div>', pIdx);
                
                if (lastTableStart !== -1 && (lastTableEnd === -1 || lastTableEnd < lastTableStart)) {
                  const nextTableEnd = html.indexOf('</table></div>', pIdx);
                  if (nextTableEnd !== -1) {
                    searchIdx = nextTableEnd + 14;
                    continue;
                  }
                }
                splitIdx = pIdx + 4;
                break;
              }

              // Fallback to \n\n, \r\n\r\n, or <br><br> if no </p> was found
              if (splitIdx === -1) {
                const match = html.match(/(?:\r?\n){2,}|(?:<br\s*\/?>\s*){2,}/i);
                if (match) {
                  splitIdx = match.index + match[0].length;
                }
              }

              if (splitIdx === -1 || !relatedNews?.length) {
                return <div className="art-body prose prose-invert max-w-none" id="artBody" dangerouslySetInnerHTML={{ __html: html.replace(/\n/g, '<br />') }} />;
              }
              const firstPart = html.slice(0, splitIdx);
              const restPart = html.slice(splitIdx);
              return (
                <>
                  <div className="art-body prose prose-invert max-w-none" id="artBody" dangerouslySetInnerHTML={{ __html: firstPart.replace(/\n/g, '<br />') }} />
                  <AlsoRead articles={relatedNews} exclude={article} />
                  <div className="art-body prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: restPart.replace(/\n/g, '<br />') }} />
                </>
              );
            })()}

            {/* ALSO READ — bottom banner */}
            <AlsoRead articles={relatedNews} exclude={article} />

            {/* TAGS */}
            <div className="art-tags">
              {article.tags?.map((tag) => (
                <Link to={`/search?q=${encodeURIComponent(tag)}`} key={tag} className="atag">{tag}</Link>
              ))}
            </div>

            {/* SHARE BAR */}
            <ShareWidget 
              title={article.title} 
              url={`https://chitrambhalare.in/movie-news/${article.slug}`}
              shareUrl={`https://chitrambhalare.in/api/share/article/${article.slug}`}
              image={heroImage} 
            />

            {/* COMMENTS SECTION */}
            <Comments entityType="article" entityId={article.slug || article.id} />

            {/* RELATED ARTICLES */}
            <div className="related-title">Related Articles</div>
            <div className="related-grid">
              {relatedNews?.filter(n => n.id !== article.id).slice(0, 4).map((rel) => (
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

export default SingleArticle;
