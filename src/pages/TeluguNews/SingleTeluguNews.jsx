import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Comments from '../../components/Comments';
import ShareWidget from '../../components/ShareWidget';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

const fetchSingleTeluguNews = async (slug) => {
  const res = await axios.get(`/api/telugu-news/${slug}`);
  return res.data;
};

const SingleTeluguNews = () => {
  const { slug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['telugu-news', slug],
    queryFn: () => fetchSingleTeluguNews(slug),
  });

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (isLoading) {
    return <div style={{ color: 'var(--muted)', padding: '100px 0', textAlign: 'center' }}>Loading...</div>;
  }

  if (!article) {
    return (
      <div style={{ color: 'var(--text)', padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '32px' }}>Article Not Found</h2>
        <Link to="/telugu-news" style={{ color: 'var(--gold)', marginTop: '10px', display: 'inline-block' }}>Back to Telugu News</Link>
      </div>
    );
  }

  const heroImage = article.thumbnail || article.featuredImage || FALLBACK;

  return (
    <>
      <Helmet>
        <title>{article.seoTitle || article.title} | CHITRAMBHALARE</title>
        <meta name="description" content={article.metaDescription || article.excerpt} />
        {article.metaKeywords && <meta name="keywords" content={article.metaKeywords} />}
        {article.canonicalUrl && <link rel="canonical" href={article.canonicalUrl} />}
        <meta property="og:title" content={article.ogTitle || article.seoTitle || article.title} />
        <meta property="og:description" content={article.ogDescription || article.metaDescription || article.excerpt} />
        <meta property="og:image" content={article.ogImage || heroImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content={article.twitterCard || 'summary_large_image'} />
        <meta name="twitter:title" content={article.ogTitle || article.seoTitle || article.title} />
        <meta name="twitter:description" content={article.ogDescription || article.metaDescription || article.excerpt} />
        <meta name="twitter:image" content={article.ogImage || heroImage} />
        {article.robots && <meta name="robots" content={article.robots} />}
      </Helmet>

      <div className="wrap">
        <div className="breadcrumb">
          <Link to="/main" className="bc-link">Home</Link>
          <span>/</span>
          <Link to="/telugu-news" className="bc-link">Telugu News</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>
            {article.title.length > 30 ? `${article.title.slice(0, 27)}...` : article.title}
          </span>
        </div>

        <div className="art-layout">
          <article>
            <div className="art-cat-badge">{article.category || 'Telugu News'}</div>
            <h1 className="art-title">{article.title}</h1>
            {article.excerpt && <p className="art-deck">{article.excerpt}</p>}

            <div className="art-byline">
              <div className="avatar">
                {(article.author || 'CB').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="byline-name">{article.author}</div>
                <div className="byline-meta">
                  {article.date && <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
                  {article.source && <><span className="bdot">◆</span><span>Source: {article.source}</span></>}
                  {article.category && <><span className="bdot">◆</span><span>{article.category}</span></>}
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="art-hero-img" style={{ position: 'relative' }}>
              <img
                src={heroImage}
                alt={article.title}
                onError={e => { e.target.src = FALLBACK; }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
              <div className="art-hero-text" style={{ position: 'relative', zIndex: 2 }}>
                {(article.category || 'Telugu News').toUpperCase()}
              </div>
            </div>
            <div className="img-caption">{article.title}</div>

            {/* Body Content */}
            {(() => {
              let html = typeof article.content === 'string' ? article.content : '';
              html = html.replace(/<table/g, '<div class="table-responsive" style="width: 100%; overflow-x: auto; margin: 24px 0;"><table style="width: 100%; min-width: 600px; border-collapse: collapse;"')
                         .replace(/<\/table>/g, '</table></div>');
              return (
                <div className="art-body prose prose-invert max-w-none" id="artBody"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            })()}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="art-tags">
                {article.tags.map(tag => (
                  <Link to={`/telugu-news?search=${tag}`} key={tag} className="atag">{tag}</Link>
                ))}
              </div>
            )}

            {/* Share */}
            <ShareWidget
              title={article.title}
              url={`https://chitrambhalare.in/telugu-news/${article.slug}`}
              shareUrl={`https://chitrambhalare.in/api/share/telugu-news/${article.slug}`}
              image={heroImage}
            />

            {/* Comments */}
            <Comments entityType="telugu-news" entityId={article.slug || article.id} />
          </article>

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

export default SingleTeluguNews;
