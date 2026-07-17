import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye, Calendar as CalendarIcon, Clock, Link as LinkIcon, FileText, Search } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import TipTapEditor from '../../components/Editor/TipTapEditor';
import SEOFields from '../../components/SEO/SEOFields';

const emptyForm = { 
  slug: '', title: '', excerpt: '', content: '', thumbnail: '', 
  date: '', category: 'Update', author: '', tags: '', status: 'published',
  seoTitle: '', metaDescription: '', focusKeyword: '', metaKeywords: '',
  canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterCard: 'summary_large_image', robots: 'index,follow',
  timelineEvents: []
};

const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const LiveUpdates = () => {
  const { dbData, setDbData, triggerNotification, loadDb } = useOutletContext();
  const list = dbData.liveUpdates || [];

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
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
      await axios.post('/api/live-updates', serializeForApi({ ...addForm, id: Date.now().toString() }));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Live Update added!');
      setShowAdd(false);
      setAddForm(emptyForm);
    } catch {
      triggerNotification('Failed to add liveUpdate.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this liveUpdate?')) return;
    setIsSaving(true);
    try {
      await axios.delete(`/api/live-updates/${id}`);
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Live Update deleted!');
    } catch {
      triggerNotification('Failed to delete liveUpdate.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} selected items?`)) return;
    setIsSaving(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => axios.delete(`/api/live-updates/${id}`)));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification(`${selectedIds.size} Live Updates deleted!`);
      setSelectedIds(new Set());
    } catch {
      triggerNotification('Failed to delete some items.', 'error');
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
      await axios.put(`/api/live-updates/${editingId}`, serializeForApi(editForm));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Live Update updated!');
      setEditingId(null);
    } catch {
      triggerNotification('Failed to update liveUpdate.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { field: 'category', label: 'Category', type: 'select', options: ['Casting', 'Release Dates', 'OTT Dates', 'Re-Release', 'Production', 'Box Office'], colSpan: 1 },
    { field: 'title', label: 'Title', placeholder: 'Live Update title', colSpan: 2 },
    { field: 'author', label: 'Author', placeholder: 'Author name', colSpan: 1 },
    { field: 'date', label: 'Date', placeholder: '', type: 'date', colSpan: 1 },
    { field: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'scheduled'], colSpan: 1 },
        { field: 'tags', label: 'Tags', placeholder: 'tag1, tag2, tag3', colSpan: 1 },
    { field: 'showAboveBanner', label: 'Show Above Banner', type: 'checkbox', colSpan: 1 },
    { field: 'thumbnail', label: 'Thumbnail URL', placeholder: 'https://...', colSpan: 1 },
  ];

  const handleAddEvent = (formState, setFormState) => {
    const newEvent = { id: Date.now().toString(), category: 'Update', date: new Date().toISOString().slice(0, 16), title: '', content: '' };
    setFormState(f => ({ ...f, timelineEvents: [newEvent, ...(f.timelineEvents || [])] }));
  };

  const handleUpdateEvent = (index, field, value, setFormState) => {
    setFormState(f => {
      const newEvents = [...(f.timelineEvents || [])];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return { ...f, timelineEvents: newEvents };
    });
  };

  const handleRemoveEvent = (index, setFormState) => {
    setFormState(f => {
      const newEvents = [...(f.timelineEvents || [])];
      newEvents.splice(index, 1);
      return { ...f, timelineEvents: newEvents };
    });
  };

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
            ) : type === 'checkbox' ? (
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={!!formState[field]}
                  onChange={e => setFormState(f => ({ ...f, [field]: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-800 bg-black/50 text-brand-red focus:ring-brand-red focus:ring-offset-gray-900"
                />
                <span className="ml-2 text-sm text-gray-300">Enable</span>
              </div>
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
          placeholder="Brief summary of the liveUpdate"
          className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-y"
        />
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Content</label>
        <TipTapEditor
          content={formState.content || ''}
          onChange={html => setFormState(f => ({ ...f, content: html }))}
          placeholder="Write your liveUpdate content here..."
          autoSaveKey={isNew ? 'new_liveUpdate' : `edit_liveUpdate_${formState.id}`}
        />
      </div>


      <SEOFields 
        values={formState}
        onChange={(newValues) => setFormState(newValues)}
        showAdvanced={true}
      />

      {/* Timeline Events */}
      <div className="bg-[#1a1a1d] p-4 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-bold text-md">Timeline Events</h4>
          <button onClick={() => handleAddEvent(formState, setFormState)} className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
            <Plus className="w-3 h-3" /> Add Event
          </button>
        </div>
        
        <div className="space-y-4">
          {(formState.timelineEvents || []).map((event, index) => (
            <div key={event.id || index} className="p-4 bg-black/40 rounded-lg border border-gray-800 relative">
              <button onClick={() => handleRemoveEvent(index, setFormState)} className="absolute top-3 right-3 text-gray-500 hover:text-brand-red transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select
                    value={event.category}
                    onChange={e => handleUpdateEvent(index, 'category', e.target.value, setFormState)}
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-brand-red"
                  >
                    {['Update', 'Verdict', 'Audience', 'Box Office', 'News'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date/Time</label>
                  <input
                    type="datetime-local"
                    value={event.date || ''}
                    onChange={e => handleUpdateEvent(index, 'date', e.target.value, setFormState)}
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={e => handleUpdateEvent(index, 'title', e.target.value, setFormState)}
                    placeholder="Event title..."
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Content</label>
                <textarea
                  value={event.content}
                  onChange={e => handleUpdateEvent(index, 'content', e.target.value, setFormState)}
                  rows={3}
                  placeholder="Write the event content here..."
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red resize-y"
                />
              </div>
            </div>
          ))}
          {(formState.timelineEvents || []).length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">No timeline events added yet. Click 'Add Event' to start.</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">LiveUpdates</h2>
          <p className="text-gray-500 text-sm">Manage news and editorial content</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search liveUpdates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
          {selectedIds.size > 0 && (
            <button onClick={handleBulkDelete} disabled={isSaving} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold px-4 py-2.5 rounded-xl text-sm transition-all border border-red-500/20 whitespace-nowrap">
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
            </button>
          )}
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center justify-center gap-2 bg-brand-red text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-red-600 transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Update
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-red" />
            Create New Live Update
          </h3>
          {renderFormFields(addForm, setAddForm, true)}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-gray-400 hover:text-white text-sm font-bold transition-colors">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={isSaving} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 transition-all shadow-lg shadow-brand-red/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Publish Live Update
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {paginatedList.length === 0 && <div className="text-center py-16 text-gray-600">No liveUpdates yet.</div>}
        {paginatedList.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <h3 className="text-white font-bold text-lg">Edit Live Update</h3>
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
                  <div className="pt-2">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-800 bg-black/50 text-brand-red focus:ring-brand-red focus:ring-offset-gray-900 cursor-pointer"
                      checked={selectedIds.has(item.id)}
                      onChange={e => {
                        const newSet = new Set(selectedIds);
                        if (e.target.checked) newSet.add(item.id);
                        else newSet.delete(item.id);
                        setSelectedIds(newSet);
                      }}
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
                  <button onClick={() => { setEditingId(item.id); setEditForm(deserializeForForm(sanitize({ ...item }))); }} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Edit Live Update">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete Live Update">
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

export default LiveUpdates;
