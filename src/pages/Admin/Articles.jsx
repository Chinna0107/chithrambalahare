import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye, Calendar as CalendarIcon, Clock, Link as LinkIcon, FileText } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import TipTapEditor from '../../components/Editor/TipTapEditor';
import SEOFields from '../../components/SEO/SEOFields';

const emptyForm = { 
  slug: '', title: '', excerpt: '', content: '', thumbnail: '', featuredImage: '', 
  date: '', category: 'Casting', author: '', tags: '', status: 'published',
  seoTitle: '', metaDescription: '', focusKeyword: '', metaKeywords: '',
  canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterCard: 'summary_large_image', robots: 'index,follow'
};

const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const Articles = () => {
  const { dbData, setDbData, triggerNotification, loadDb } = useOutletContext();
  const list = dbData.articles || [];

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const serializeForApi = (item) => ({
    ...item,
    tags: typeof item.tags === 'string'
      ? item.tags.split(',').map(s => s.trim()).filter(Boolean)
      : item.tags || [],
    date: item.date || new Date().toISOString(),
  });

  const deserializeForForm = (item) => ({
    ...item,
    tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
  });

  const refreshDb = async () => {
    try {
      const data = await loadDb();
      setDbData(data);
    } catch { /* ignore */ }
  };

  const handleAdd = async () => {
    if (!addForm.title.trim() || !addForm.slug.trim()) return;
    setIsSaving(true);
    try {
      await axios.post('/api/articles', serializeForApi({ ...addForm, id: Date.now().toString() }));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Article added!');
      setShowAdd(false);
      setAddForm(emptyForm);
    } catch {
      triggerNotification('Failed to add article.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    setIsSaving(true);
    try {
      await axios.delete(`/api/articles/${id}`);
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Article deleted!');
    } catch {
      triggerNotification('Failed to delete article.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`/api/articles/${editingId}`, serializeForApi(editForm));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Article updated!');
      setEditingId(null);
    } catch {
      triggerNotification('Failed to update article.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { field: 'category', label: 'Category', type: 'select', options: ['Casting', 'Release Dates', 'OTT Dates', 'Re-Release', 'Production'], colSpan: 1 },
    { field: 'title', label: 'Title', placeholder: 'Article title', colSpan: 2 },
    { field: 'author', label: 'Author', placeholder: 'Author name', colSpan: 1 },
    { field: 'date', label: 'Date', placeholder: '', type: 'date', colSpan: 1 },
    { field: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'scheduled'], colSpan: 1 },
    { field: 'tags', label: 'Tags', placeholder: 'tag1, tag2, tag3', colSpan: 1 },
    { field: 'thumbnail', label: 'Thumbnail URL', placeholder: 'https://...', colSpan: 1 },
    { field: 'featuredImage', label: 'Featured Image URL', placeholder: 'https://...', colSpan: 1 },
  ];

  const renderFormFields = (formState, setFormState, isNew) => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ field, label, placeholder, type, options, colSpan }) => (
          <div key={field} className={colSpan === 2 ? 'sm:col-span-2' : ''}>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            {field === 'thumbnail' || field === 'featuredImage' ? (
              <ImageUpload 
                value={formState[field] ?? ''} 
                onChange={url => setFormState(f => ({ ...f, [field]: url }))} 
                placeholder={`Upload ${label.replace(' URL', '').toLowerCase()}...`} 
              />
            ) : type === 'select' ? (
              <select
                value={formState[field] ?? options[0]}
                onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
              >
                {options.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
              </select>
            ) : (
              <input
                type={type || 'text'}
                value={formState[field] ?? ''}
                onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
              />
            )}
          </div>
        ))}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Excerpt (Short Summary)</label>
        <textarea
          value={formState.excerpt ?? ''}
          onChange={e => setFormState(f => ({ ...f, excerpt: e.target.value }))}
          rows={2}
          placeholder="Brief summary of the article"
          className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-y"
        />
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Content</label>
        <TipTapEditor
          content={formState.content || ''}
          onChange={html => setFormState(f => ({ ...f, content: html }))}
          placeholder="Write your article content here..."
          autoSaveKey={isNew ? 'new_article' : `edit_article_${formState.id}`}
        />
      </div>


      <SEOFields 
        values={formState}
        onChange={(newValues) => setFormState(newValues)}
        showAdvanced={true}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Articles</h2>
          <p className="text-gray-500 text-sm">Manage news and editorial content</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-red" />
            Create New Article
          </h3>
          {renderFormFields(addForm, setAddForm, true)}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-gray-400 hover:text-white text-sm font-bold transition-colors">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={isSaving} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 transition-all shadow-lg shadow-brand-red/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Publish Article
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.length === 0 && <div className="text-center py-16 text-gray-600">No articles yet.</div>}
        {list.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <h3 className="text-white font-bold text-lg">Edit Article</h3>
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
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-gray-800" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-lg truncate">{item.title}</h3>
                      {item.status === 'draft' && <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Draft</span>}
                      {item.status === 'scheduled' && <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Scheduled</span>}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {item.category && <span className="text-xs font-bold bg-gray-800 px-2 py-1 rounded-md text-gray-300">{item.category}</span>}
                      {item.author && <span className="text-xs text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-600" />{item.author}</span>}
                      {item.date && <span className="text-xs text-gray-400 flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{String(item.date).split('T')[0]}</span>}
                      {item.slug && (
                        <a href={`https://chitrambhalare.com/${item.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                          <LinkIcon className="w-3 h-3" /> /{item.slug}
                        </a>
                      )}
                    </div>
                    {item.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.excerpt}</p>}
                    
                    {expandedId === item.id && (
                      <div className="mt-4 p-4 bg-black/40 rounded-xl text-sm text-gray-300 prose prose-invert max-w-none border border-gray-800">
                        <div dangerouslySetInnerHTML={{ __html: typeof item.content === 'string' ? item.content : JSON.stringify(item.content) }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Preview Content">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingId(item.id); setEditForm(deserializeForForm(sanitize({ ...item }))); }} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Edit Article">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete Article">
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

export default Articles;
