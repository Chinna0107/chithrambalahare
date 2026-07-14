import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye, Calendar as CalendarIcon, FileText, Search } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import TipTapEditor from '../../components/Editor/TipTapEditor';
import SEOFields from '../../components/SEO/SEOFields';

const emptyForm = {
  slug: '', title: '', excerpt: '', content: '', thumbnail: '',
  source: '', author: '', category: 'Telugu News',
  tags: '', status: 'published', date: '',
  seoTitle: '', metaDescription: '', focusKeyword: '', metaKeywords: '',
  canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '',
  twitterCard: 'summary_large_image', robots: 'index,follow'
};

const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const serializeForApi = (item) => ({
  ...item,
  tags: typeof item.tags === 'string'
    ? item.tags.split(',').map(s => s.trim()).filter(Boolean)
    : item.tags || [],
  date: item.date || new Date().toISOString(),
});

const deserializeForForm = (item) => sanitize({
  ...item,
  tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
});

const TeluguNews = () => {
  const { triggerNotification } = useOutletContext();
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const token = localStorage.getItem('tolly_employee_token');
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : { 'x-admin-passcode': localStorage.getItem('tolly_admin_passcode') };

  const fetchNews = async () => {
    try {
      const res = await axios.get('/api/telugu-news', { headers });
      setList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const filteredList = list.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

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
      await axios.post('/api/telugu-news', serializeForApi(addForm), { headers });
      await fetchNews();
      triggerNotification('Telugu News added!');
      setShowAdd(false);
      setAddForm(emptyForm);
    } catch {
      triggerNotification('Failed to add news.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    setIsSaving(true);
    try {
      await axios.delete(`/api/telugu-news/${id}`, { headers });
      await fetchNews();
      triggerNotification('News deleted!');
    } catch {
      triggerNotification('Failed to delete news.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!editForm.title?.trim() || !editForm.slug?.trim()) {
      triggerNotification('Title and Slug are required', 'error');
      return;
    }
    if (!editForm.seoTitle?.trim() || !editForm.metaDescription?.trim() || !editForm.metaKeywords?.trim()) {
      triggerNotification('Please fill all required SEO fields (Title, Description, Meta Keywords)', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await axios.put(`/api/telugu-news/${editingId}`, serializeForApi(editForm), { headers });
      await fetchNews();
      triggerNotification('News updated!');
      setEditingId(null);
    } catch {
      triggerNotification('Failed to update news.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { field: 'category', label: 'Category', type: 'select', options: ['Telugu News', 'Politics', 'Entertainment', 'Sports', 'Business', 'Technology', 'Health'], colSpan: 1 },
    { field: 'title', label: 'Title', placeholder: 'News title', colSpan: 2 },
    { field: 'slug', label: 'Slug (URL)', placeholder: 'news-slug-url', colSpan: 1 },
    { field: 'author', label: 'Author', placeholder: 'Author name', colSpan: 1 },
    { field: 'source', label: 'Source', placeholder: 'Source URL or name', colSpan: 1 },
    { field: 'date', label: 'Date', type: 'date', colSpan: 1 },
    { field: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'scheduled'], colSpan: 1 },
    { field: 'tags', label: 'Tags', placeholder: 'tag1, tag2, tag3', colSpan: 1 },
    { field: 'thumbnail', label: 'Thumbnail', placeholder: 'https://...', colSpan: 1 },
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
                placeholder="Upload thumbnail..."
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
                    if (field === 'title' && isNew) {
                      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      if (!f.slug || f.slug === (f.title ? f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '')) {
                        newState.slug = generatedSlug;
                        newState.canonicalUrl = `https://chitrambhalare.in/telugu-news/${generatedSlug}`;
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
          placeholder="Brief summary of the news"
          className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-y"
        />
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Content</label>
        <TipTapEditor
          content={formState.content || ''}
          onChange={html => setFormState(f => ({ ...f, content: html }))}
          placeholder="Write your news content here..."
          autoSaveKey={isNew ? 'new_telugu_news' : `edit_telugu_news_${formState.id}`}
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
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Telugu News</h2>
          <p className="text-gray-500 text-sm">Manage regional Telugu news articles</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#18181B] border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red transition-all w-64"
            />
          </div>
          <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
            <Plus className="w-4 h-4" /> New News
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-red" />
            Create New Telugu News
          </h3>
          {renderFormFields(addForm, setAddForm, true)}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-gray-400 hover:text-white text-sm font-bold transition-colors">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={isSaving} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 transition-all shadow-lg shadow-brand-red/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Publish News
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {paginatedList.length === 0 && <div className="text-center py-16 text-gray-600">No news yet.</div>}
        {paginatedList.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <h3 className="text-white font-bold text-lg">Edit News</h3>
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
                  <div className="w-20 h-20 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                    {item.thumbnail
                      ? <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><FileText className="w-8 h-8 text-gray-600" /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-red/20 text-brand-red">{item.category || 'Telugu News'}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.status === 'published' ? 'bg-green-500/20 text-green-400' : item.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{item.status || 'published'}</span>
                    </div>
                    <h3 className="text-white font-bold text-base truncate mb-1">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      {item.author && <span className="text-xs text-gray-400">{item.author}</span>}
                      {item.source && <span className="text-xs text-blue-400">Source: {item.source}</span>}
                      {item.date && <span className="text-xs text-gray-400 flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{String(item.date).split('T')[0]}</span>}
                    </div>
                    {item.excerpt && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.excerpt}</p>}

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
                  <button onClick={() => { setEditingId(item.id); setEditForm(deserializeForForm(item)); }} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Edit News">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete News">
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

export default TeluguNews;
