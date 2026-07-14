import { useState } from 'react';
import { Search, Globe, Share2, ChevronDown, ChevronUp, Eye, AlertCircle } from 'lucide-react';

const SEOFields = ({ values = {}, onChange, showAdvanced = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOg, setShowOg] = useState(false);

  const update = (field, value) => {
    onChange?.({ ...values, [field]: value });
  };

  const seoTitleLength = (values.seoTitle || '').length;
  const metaDescLength = (values.metaDescription || '').length;
  const seoTitleColor = seoTitleLength === 0 ? 'text-gray-500' : seoTitleLength <= 60 ? 'text-green-500' : 'text-red-500';
  const metaDescColor = metaDescLength === 0 ? 'text-gray-500' : metaDescLength <= 155 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-[#18181B] rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Search className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-white">SEO Settings</h3>
            <p className="text-xs text-gray-500">Search engine optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {values.seoTitle && values.metaDescription ? (
            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Configured</span>
          ) : (
            <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">Incomplete</span>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-5 border-t border-gray-800 pt-5">
          {/* Google Preview */}
          <div className="bg-black/30 rounded-xl p-4 border border-gray-800">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-3 h-3" /> Google Preview
            </p>
            <div className="space-y-1">
              <p className="text-blue-400 text-base font-medium truncate">
                {values.seoTitle || values.title || 'Page Title'}
              </p>
              <p className="text-green-600 text-xs truncate">
                {values.canonicalUrl || values.slug ? `chitrambhalare.in/${values.slug || ''}` : 'chitrambhalare.in'}
              </p>
              <p className="text-gray-400 text-xs line-clamp-2">
                {values.metaDescription || 'Add a meta description to improve click-through rates from search results.'}
              </p>
            </div>
          </div>

          {/* SEO Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Title <span className="text-red-500">*</span></label>
              <span className={`text-xs font-mono ${seoTitleColor}`}>{seoTitleLength}/60</span>
            </div>
            <input
              type="text" value={values.seoTitle || ''} onChange={e => update('seoTitle', e.target.value)}
              placeholder="Enter SEO-optimized title"
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meta Description <span className="text-red-500">*</span></label>
              <span className={`text-xs font-mono ${metaDescColor}`}>{metaDescLength}/155</span>
            </div>
            <textarea
              value={values.metaDescription || ''} onChange={e => update('metaDescription', e.target.value)}
              placeholder="Write a compelling description for search results"
              rows={3}
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red resize-none transition-colors"
            />
          </div>

          {/* Focus Keyword */}
          {showAdvanced && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Focus Keyword</label>
              <input
                type="text" value={values.focusKeyword || ''} onChange={e => update('focusKeyword', e.target.value)}
                placeholder="Primary keyword for this content"
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>
          )}

          {/* Meta Keywords */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Meta Keywords <span className="text-red-500">*</span></label>
            <input
              type="text" value={values.metaKeywords || ''} onChange={e => update('metaKeywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 whitespace-nowrap">chitrambhalare.in/</span>
              <input
                type="text" value={values.slug || ''} onChange={e => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
                placeholder="url-friendly-slug"
                className="flex-1 bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Canonical URL</label>
            <input
              type="url" value={values.canonicalUrl || ''} onChange={e => update('canonicalUrl', e.target.value)}
              placeholder="https://chitrambhalare.in/your-page"
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          {/* Robots */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Robots</label>
            <select
              value={values.robots || 'index,follow'} onChange={e => update('robots', e.target.value)}
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
            >
              <option value="index,follow">Index, Follow</option>
              <option value="noindex,follow">No Index, Follow</option>
              <option value="index,nofollow">Index, No Follow</option>
              <option value="noindex,nofollow">No Index, No Follow</option>
            </select>
          </div>

          {/* Open Graph Section */}
          <div className="border-t border-gray-800 pt-4">
            <button
              type="button"
              onClick={() => setShowOg(!showOg)}
              className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Open Graph & Social
              {showOg ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showOg && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">OG Title</label>
                  <input
                    type="text" value={values.ogTitle || ''} onChange={e => update('ogTitle', e.target.value)}
                    placeholder="Open Graph title (defaults to SEO title)"
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">OG Description</label>
                  <textarea
                    value={values.ogDescription || ''} onChange={e => update('ogDescription', e.target.value)}
                    placeholder="Description for social sharing"
                    rows={2}
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red resize-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">OG Image URL</label>
                  <input
                    type="url" value={values.ogImage || ''} onChange={e => update('ogImage', e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Twitter Card</label>
                  <select
                    value={values.twitterCard || 'summary_large_image'} onChange={e => update('twitterCard', e.target.value)}
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
                  >
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="summary">Summary</option>
                    <option value="player">Player</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOFields;
