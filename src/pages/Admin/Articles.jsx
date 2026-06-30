import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye } from 'lucide-react';

const emptyForm = { slug: '', title: '', excerpt: '', content: '', thumbnail: '', featuredImage: '', date: '', category: '', author: '', tags: '' };
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
    content: typeof item.content === 'string'
      ? item.content.split('\n').map(s => s.trim()).filter(Boolean)
      : item.content || [],
    tags: typeof item.tags === 'string'
      ? item.tags.split(',').map(s => s.trim()).filter(Boolean)
      : item.tags || [],
    date: item.date || new Date().toISOString(),
  });

  const deserializeForForm = (item) => ({
    ...item,
    content: Array.isArray(item.content) ? item.content.join('\n') : item.content || '',
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
    { field: 'slug', label: 'Slug', placeholder: 'e.g. pushpa-2-review', colSpan: 1 },
    { field: 'title', label: 'Title', placeholder: 'Article title', colSpan: 1 },
    { field: 'category', label: 'Category', placeholder: 'e.g. News', colSpan: 1 },
    { field: 'author', label: 'Author', placeholder: 'Author name', colSpan: 1 },
    { field: 'thumbnail', label: 'Thumbnail URL', placeholder: 'https://...', colSpan: 1 },
    { field: 'featuredImage', label: 'Featured Image URL', placeholder: 'https://...', colSpan: 1 },
    { field: 'date', label: 'Date', placeholder: '', type: 'date', colSpan: 1 },
    { field: 'tags', label: 'Tags (comma separated)', placeholder: 'tag1, tag2, tag3', colSpan: 1 },
  ];

  const FormFields = ({ formState, setFormState }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ field, label, placeholder, type }) => (
          <div key={field}>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            <input
              type={type || 'text'}
              value={formState[field] ?? ''}
              onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
              placeholder={placeholder}
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Excerpt</label>
        <textarea
          value={formState.excerpt ?? ''}
          onChange={e => setFormState(f => ({ ...f, excerpt: e.target.value }))}
          rows={2}
          placeholder="Brief summary of the article"
          className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-y"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Content (one paragraph per line)</label>
        <textarea
          value={formState.content ?? ''}
          onChange={e => setFormState(f => ({ ...f, content: e.target.value }))}
          rows={8}
          placeholder="Paragraph 1&#10;Paragraph 2&#10;Paragraph 3"
          className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-y"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Latest Movie News</h2>
          <p className="text-gray-500 text-sm">{list.length} articles</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-sm">New Article</h3>
          <FormFields formState={addForm} setFormState={setAddForm} />
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={isSaving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
            </button>
            <button onClick={() => setShowAdd(false)} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.length === 0 && <div className="text-center py-16 text-gray-600">No articles yet.</div>}
        {list.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-4">
                <FormFields formState={editForm} setFormState={setEditForm} />
                <div className="flex gap-3">
                  <button onClick={handleEditSave} disabled={isSaving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-800" />}
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate">{item.title}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.category && <span className="text-xs text-brand-red font-bold">{item.category}</span>}
                      {item.author && <span className="text-xs text-gray-500">by {item.author}</span>}
                      {item.date && <span className="text-xs text-gray-600">{String(item.date).split('T')[0]}</span>}
                    </div>
                    {item.excerpt && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.excerpt}</p>}
                    {expandedId === item.id && (
                      <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs text-gray-400 max-h-40 overflow-y-auto">
                        {Array.isArray(item.content) ? item.content.map((p, i) => <p key={i} className="mb-1">{p}</p>) : String(item.content || '')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingId(item.id); setEditForm(deserializeForForm(sanitize({ ...item }))); }} className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
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
