import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Camera, X, ChevronLeft, ChevronRight, ArrowLeft, Images } from 'lucide-react';
import { useGalleries, useGallery } from '../../hooks/useGalleries';

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKey}
      tabIndex={0}
      autoFocus
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 bg-white/10 hover:bg-brand-red text-white p-2 rounded-full transition-all z-10"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-semibold">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-3 md:left-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-5xl max-h-[85vh] px-16" onClick={e => e.stopPropagation()}>
        <img
          src={images[current]?.url}
          alt={images[current]?.caption || ''}
          className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl mx-auto block"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {images[current]?.caption && (
          <p className="text-center text-white/70 text-sm mt-4 font-inter">
            {images[current].caption}
          </p>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-3 md:right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
              className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${idx === current ? 'border-brand-red scale-110' : 'border-transparent opacity-50 hover:opacity-80'}`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=60'; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Single Gallery View ──────────────────────────────────────────────────────
const SingleGalleryView = ({ id }) => {
  const { data: gallery, isLoading, isError } = useGallery(id);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="wrap py-6">
        <div className="h-8 bg-[#1a2235] rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#1a2235] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !gallery) {
    return (
      <div className="wrap py-20 text-center">
        <p className="text-[var(--muted)] text-lg">Gallery not found.</p>
        <Link to="/galleries" className="text-[var(--gold)] mt-4 inline-block">← Back to Galleries</Link>
      </div>
    );
  }

  const images = gallery.images || [];

  return (
    <>
      <Helmet>
        <title>{gallery.title} | CHITRAMBHALARE Galleries</title>
        <meta name="description" content={`Exclusive photos from ${gallery.title}`} />
      </Helmet>

      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      <div className="wrap py-6">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="bc-link">Home</Link>
          <span>/</span>
          <Link to="/galleries" className="bc-link">Galleries</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>{gallery.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between my-5">
          <div>
            <Link
              to="/galleries"
              className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--gold)] text-sm font-semibold mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Galleries
            </Link>
            <h1 className="art-title" style={{ fontSize: '28px', marginBottom: 0 }}>{gallery.title}</h1>
            <p className="text-[var(--muted)] text-sm mt-1">
              {images.length} Photo{images.length !== 1 ? 's' : ''}
              {gallery.date && (
                <> &middot; {new Date(gallery.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</>
              )}
            </p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-center hidden md:block">
            <Images className="w-6 h-6 text-[var(--gold)] mx-auto mb-1" />
            <div className="text-[var(--gold)] font-bold text-xl" style={{ fontFamily: 'Bebas Neue' }}>{images.length}</div>
            <div className="text-[var(--muted)] text-[10px] uppercase tracking-wide">Photos</div>
          </div>
        </div>

        {/* Grid */}
        {images.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted)]">No photos in this gallery yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-[#0d1b30] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-all hover:-translate-y-0.5"
                onClick={() => setLightboxIndex(idx)}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full border border-[var(--gold)]/30">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium line-clamp-2">{img.caption}</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// ─── Gallery List View ────────────────────────────────────────────────────────
const GalleryListView = () => {
  const { data: galleries, isLoading } = useGalleries();
  const navigate = useNavigate();

  const skeletons = Array.from({ length: 6 });

  return (
    <>
      <Helmet>
        <title>Exclusive Galleries | CHITRAMBHALARE</title>
        <meta name="description" content="Browse exclusive Tollywood photo galleries — behind the scenes, set stills, events and more." />
      </Helmet>

      <div className="wrap py-6">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="bc-link">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>Galleries</span>
        </div>

        {/* Page hero */}
        <div className="cat-banner my-4">
          <div>
            <div className="cat-eyebrow">📸 Exclusive</div>
            <div className="cat-title">Photo Galleries</div>
            <p className="cat-desc">Behind the scenes, set stills, event coverage and more from Tollywood.</p>
            <div className="cat-stats">
              <div>
                <div className="cat-stat-val">{galleries?.length ?? '—'}</div>
                <div className="cat-stat-lbl">Albums</div>
              </div>
              <div>
                <div className="cat-stat-val">
                  {galleries ? galleries.reduce((acc, g) => acc + (g.images?.length || 0), 0) : '—'}
                </div>
                <div className="cat-stat-lbl">Photos</div>
              </div>
            </div>
          </div>
          <div className="cat-icon">📷</div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {skeletons.map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] animate-pulse">
                <div className="aspect-[3/4] bg-[var(--mid)]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[var(--mid)] rounded w-1/3" />
                  <div className="h-4 bg-[var(--mid)] rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : !galleries || galleries.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)]">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No galleries available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {galleries.map((gallery) => (
              <div
                key={gallery.id}
                className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[3/4] bg-[#18181B] border border-[var(--border)] hover:border-[var(--gold)]/40 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1"
                onClick={() => navigate(`/galleries/${gallery.id}`)}
              >
                <img
                  src={gallery.coverImage || gallery.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
                  alt={gallery.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-brand-red/90 text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2 backdrop-blur-sm shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                    {gallery.images?.length || 0} Photos
                  </div>
                  <h3 className="text-gray-100 font-poppins font-bold text-lg md:text-xl line-clamp-2 leading-tight group-hover:text-yellow-400 transition-colors">
                    {gallery.title}
                  </h3>
                  {gallery.date && (
                    <p className="text-[var(--muted)] text-[10px] mt-1">
                      {new Date(gallery.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full border border-[var(--gold)]/30 shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// ─── Page Entry ───────────────────────────────────────────────────────────────
const GalleryPage = () => {
  const { id } = useParams();
  return id ? <SingleGalleryView id={id} /> : <GalleryListView />;
};

export default GalleryPage;
