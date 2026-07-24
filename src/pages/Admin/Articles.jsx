import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye, Calendar as CalendarIcon, Clock, Link as LinkIcon, FileText, Search } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import TipTapEditor from '../../components/Editor/TipTapEditor';
import { useArticles } from '../../hooks/useArticles';
import SEOFields from '../../components/SEO/SEOFields';

const emptyForm = {
  slug: '', title: '', excerpt: '', content: '', thumbnail: '',
  date: '', category: 'movie-news', author: '', tags: '', status: 'published',
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredList = list.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
    if (!addForm.title.trim() || !addForm.slug.trim()) {
      triggerNotification('Title and Slug are required', 'error');
      return;
    }
    if (!addForm.seoTitle?.trim() || !addForm.metaDescription?.trim() || !addForm.metaKeywords?.trim()) {
      triggerNotification('Please fill all required SEO fields (Title, Description, Meta Keywords)', 'error');
      return;
    }
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
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch {
      triggerNotification('Failed to delete article.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedList.map(i => i.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} articles?`)) return;
    setIsSaving(true);
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`/api/articles/${id}`)));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification(`${selectedIds.length} articles deleted!`);
      setSelectedIds([]);
    } catch {
      triggerNotification('Failed to delete some articles.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!editForm.title.trim() || !editForm.slug.trim()) {
      triggerNotification('Title and Slug are required', 'error');
      return;
    }
    if (!editForm.seoTitle?.trim() || !editForm.metaDescription?.trim() || !editForm.metaKeywords?.trim()) {
      triggerNotification('Please fill all required SEO fields (Title, Description, Meta Keywords)', 'error');
      return;
    }
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
    { field: 'category', label: 'Category', type: 'select', options: ['movie-news', 'Production', 'ott', 'Box Office'], colSpan: 1 },
    { field: 'title', label: 'Title', placeholder: 'Article title', colSpan: 2 },
    { field: 'author', label: 'Author', placeholder: 'Author name', colSpan: 1 },
    { field: 'date', label: 'Date', placeholder: '', type: 'date', colSpan: 1 },
    { field: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'scheduled'], colSpan: 1 },
    { field: 'tags', label: 'Tags', placeholder: 'tag1, tag2, tag3', colSpan: 1 },
    { field: 'thumbnail', label: 'Thumbnail URL', placeholder: 'https://...', colSpan: 1 },
  ];

  const renderFormFields = (formState, setFormState, isNew) => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ field, label, placeholder, type, options, colSpan }) => (
          <div key={field} className={colSpan === 2 ? 'sm:col-span-2' : ''}>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            {field === 'thumbnail' ? (
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
                onChange={e => {
                  const val = e.target.value;
                  setFormState(f => {
                    const newState = { ...f, [field]: val };
                    if (field === 'title') {
                      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      // Only auto-fill if the user hasn't typed a slug yet, or if they are creating a new post
                      if (isNew && (!f.slug || f.slug === (f.title ? f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : ''))) {
                        newState.slug = generatedSlug;
                        newState.canonicalUrl = `https://chitrambhalare.in/${generatedSlug}`;
                      }
                    }
                    return newState;
                  });
                }}
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
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#18181B] border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red transition-all w-64"
            />
          </div>
          <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>
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
        {selectedIds.length > 0 && (
          <div className="bg-[#18181B] border border-brand-red/30 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-brand-red/10 animate-in fade-in slide-in-from-top-2 mb-4">
            <div className="flex items-center gap-4">
              <span className="text-white font-bold">{selectedIds.length} selected</span>
              <button onClick={handleSelectAll} className="text-sm font-semibold text-brand-red hover:text-red-400 transition-colors">
                {selectedIds.length === paginatedList.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <button onClick={handleBulkDelete} disabled={isSaving} className="flex items-center gap-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Selected
            </button>
          </div>
        )}
        {paginatedList.length === 0 && <div className="text-center py-16 text-gray-600">No articles yet.</div>}
        {paginatedList.map(item => (
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
                  <div className="pt-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                      className="w-5 h-5 rounded border-gray-700 bg-black/50 text-brand-red focus:ring-brand-red focus:ring-offset-gray-900 cursor-pointer transition-colors"
                    />
                  </div>
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
                        <a href={`https://chitrambhalare.in/${item.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
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
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 bg-[#18181B] border border-gray-800 rounded-2xl p-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-400 text-sm font-medium">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
