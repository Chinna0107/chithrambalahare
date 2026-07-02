import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye, Calendar, Link as LinkIcon, Star, Film } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import TipTapEditor from '../../components/Editor/TipTapEditor';

const emptyForm = { 
  slug: '', movieName: '', poster: '', rating: '', snippet: '', verdict: '', 
  story: '', performances: '', technicalAspects: '', verdictText: '', 
  ottPlatform: '', ottReleaseDate: '', date: '',
  genre: '', language: '', runtime: '', releaseDate: '', director: '', producer: '', 
  productionHouse: '', trailer: '', status: 'published',
  seoTitle: '', metaDescription: '', metaKeywords: '',
  canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterCard: 'summary_large_image', robots: 'index,follow'
};

const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const Reviews = () => {
  const { dbData, setDbData, triggerNotification, loadDb } = useOutletContext();
  const list = dbData.reviews || [];

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const refreshDb = async () => {
    try {
      const data = await loadDb();
      setDbData(data);
    } catch { /* ignore */ }
  };

  const handleAdd = async () => {
    if (!addForm.movieName.trim() || !addForm.slug.trim()) return;
    setIsSaving(true);
    try {
      await axios.post('/api/reviews', { ...addForm, id: Date.now().toString(), date: addForm.date || new Date().toISOString() });
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Review added!');
      setShowAdd(false);
      setAddForm(emptyForm);
    } catch {
      triggerNotification('Failed to add review.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setIsSaving(true);
    try {
      await axios.delete(`/api/reviews/${id}`);
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Review deleted!');
    } catch {
      triggerNotification('Failed to delete review.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`/api/reviews/${editingId}`, editForm);
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Review updated!');
      setEditingId(null);
    } catch {
      triggerNotification('Failed to update review.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const basicFields = [
    { field: 'movieName', label: 'Movie Name', placeholder: 'Movie Name', colSpan: 2 },
    { field: 'slug', label: 'Slug', placeholder: 'e.g. pushpa-2-review', colSpan: 1 },
    { field: 'rating', label: 'Rating', placeholder: 'e.g. 3.5/5', colSpan: 1 },
    { field: 'director', label: 'Director', placeholder: 'Director Name', colSpan: 1 },
    { field: 'producer', label: 'Producer', placeholder: 'Producer Name', colSpan: 1 },
    { field: 'productionHouse', label: 'Production House', placeholder: 'Production House', colSpan: 1 },
    { field: 'language', label: 'Language', placeholder: 'e.g. Telugu', colSpan: 1 },
    { field: 'genre', label: 'Genre', placeholder: 'e.g. Action, Drama', colSpan: 1 },
    { field: 'releaseDate', label: 'Release Date (Theatrical)', type: 'date', colSpan: 1 },
    { field: 'runtime', label: 'Runtime', placeholder: 'e.g. 2h 45m', colSpan: 1 },
    { field: 'ottPlatform', label: 'OTT Platform', placeholder: 'e.g. Netflix', colSpan: 1 },
    { field: 'ottReleaseDate', label: 'OTT Release Date', type: 'date', colSpan: 1 },
    { field: 'trailer', label: 'Trailer YouTube URL', placeholder: 'https://youtube.com/...', colSpan: 1 },
    { field: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'scheduled'], colSpan: 1 },
    { field: 'poster', label: 'Poster URL', placeholder: 'https://...', colSpan: 1 },
  ];

  const renderFormFields = (formState, setFormState, isNew) => (
    <div className="space-y-6">
      {/* Movie Info */}
      <div className="bg-black/30 p-5 rounded-2xl border border-gray-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2"><Film className="w-4 h-4 text-blue-500" /> Movie Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicFields.map(({ field, label, placeholder, type, options, colSpan }) => (
            <div key={field} className={colSpan === 2 ? 'sm:col-span-2 lg:col-span-3' : ''}>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
              {field === 'poster' ? (
                <ImageUpload 
                  value={formState[field] ?? ''} 
                  onChange={url => setFormState(f => ({ ...f, [field]: url }))} 
                  placeholder={`Upload poster...`} 
                />
              ) : type === 'select' ? (
                <select
                  value={formState[field] ?? options[0]}
                  onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full bg-[#18181B] border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                >
                  {options.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                </select>
              ) : (
                <input
                  type={type || 'text'}
                  value={formState[field] ?? ''}
                  onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-[#18181B] border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review Content */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2"><Star className="w-4 h-4 text-brand-red" /> Review Content</h4>
        
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Short Snippet (Card Description)</label>
          <textarea
            value={formState.snippet ?? ''}
            onChange={e => setFormState(f => ({ ...f, snippet: e.target.value }))}
            rows={2}
            className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-y"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Story</label>
          <TipTapEditor
            content={formState.story || ''}
            onChange={html => setFormState(f => ({ ...f, story: html }))}
            placeholder="Write the story synopsis..."
            autoSaveKey={isNew ? 'new_rev_story' : `edit_rev_story_${formState.id}`}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Performances</label>
          <TipTapEditor
            content={formState.performances || ''}
            onChange={html => setFormState(f => ({ ...f, performances: html }))}
            placeholder="Review the cast performances..."
            autoSaveKey={isNew ? 'new_rev_perf' : `edit_rev_perf_${formState.id}`}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Technical Aspects</label>
          <TipTapEditor
            content={formState.technicalAspects || ''}
            onChange={html => setFormState(f => ({ ...f, technicalAspects: html }))}
            placeholder="Review music, cinematography, editing..."
            autoSaveKey={isNew ? 'new_rev_tech' : `edit_rev_tech_${formState.id}`}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Final Verdict (HTML)</label>
          <TipTapEditor
            content={formState.verdictText || ''}
            onChange={html => setFormState(f => ({ ...f, verdictText: html }))}
            placeholder="Final thoughts and verdict..."
            autoSaveKey={isNew ? 'new_rev_verd' : `edit_rev_verd_${formState.id}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Short Verdict Label (e.g., Hit, Flop)</label>
            <input
              type="text"
              value={formState.verdict ?? ''}
              onChange={e => setFormState(f => ({ ...f, verdict: e.target.value }))}
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
            />
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Movie Reviews</h2>
          <p className="text-gray-500 text-sm">Manage detailed movie reviews and ratings</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
          <Plus className="w-4 h-4" /> New Review
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-brand-red" />
            Create New Review
          </h3>
          {renderFormFields(addForm, setAddForm, true)}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-gray-400 hover:text-white text-sm font-bold transition-colors">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={isSaving} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 transition-all shadow-lg shadow-brand-red/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Publish Review
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.length === 0 && <div className="text-center py-16 text-gray-600">No reviews yet.</div>}
        {list.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <h3 className="text-white font-bold text-lg">Edit Review</h3>
                  <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderFormFields(editForm, setEditForm, false)}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button onClick={() => setEditingId(null)} className="px-6 py-2 text-gray-400 hover:text-white text-sm font-bold transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleEditSave} disabled={isSaving} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 transition-all shadow-lg shadow-brand-red/20">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {item.poster ? (
                    <img src={item.poster} alt={item.movieName} className="w-20 h-28 object-cover rounded-xl flex-shrink-0 bg-gray-800 shadow-md" />
                  ) : (
                    <div className="w-20 h-28 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Film className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-lg truncate">{item.movieName}</h3>
                      {item.rating && <span className="bg-yellow-500/20 text-yellow-500 font-bold px-2 py-0.5 rounded-lg text-xs shadow-[0_0_10px_rgba(234,179,8,0.2)] flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {item.rating}</span>}
                      {item.verdict && <span className="bg-green-500/10 text-green-500 font-bold px-2 py-0.5 rounded-lg text-xs">{item.verdict}</span>}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {item.genre && <span className="text-xs font-bold bg-gray-800 px-2 py-1 rounded-md text-gray-300">{item.genre}</span>}
                      {item.director && <span className="text-xs text-gray-400 flex items-center gap-1">Dir: {item.director}</span>}
                      {item.date && <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{String(item.date).split('T')[0]}</span>}
                      {item.slug && (
                        <a href={`https://chitrambhalare.com/${item.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                          <LinkIcon className="w-3 h-3" /> /{item.slug}
                        </a>
                      )}
                    </div>
                    {item.snippet && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.snippet}</p>}
                    
                    {expandedId === item.id && (
                      <div className="mt-4 p-5 bg-black/40 rounded-xl text-sm text-gray-300 prose prose-invert max-w-none border border-gray-800 space-y-6">
                        <div><h5 className="text-white font-bold text-base mb-2 border-b border-gray-800 pb-1">Story</h5><div dangerouslySetInnerHTML={{ __html: item.story }} /></div>
                        <div><h5 className="text-white font-bold text-base mb-2 border-b border-gray-800 pb-1">Performances</h5><div dangerouslySetInnerHTML={{ __html: item.performances }} /></div>
                        <div><h5 className="text-white font-bold text-base mb-2 border-b border-gray-800 pb-1">Technical Aspects</h5><div dangerouslySetInnerHTML={{ __html: item.technicalAspects }} /></div>
                        <div><h5 className="text-brand-red font-bold text-base mb-2 border-b border-gray-800 pb-1">Final Verdict</h5><div dangerouslySetInnerHTML={{ __html: item.verdictText }} /></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Preview Review">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingId(item.id); setEditForm(sanitize({ ...item })); }} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Edit Review">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete Review">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
