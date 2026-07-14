import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye, Calendar as CalendarIcon, FileText, Search } from 'lucide-react';
import TipTapEditor from '../../components/Editor/TipTapEditor';

const emptyForm = { title: '', content: '', source: '', author: '' };

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
  const headers = token ? { Authorization: `Bearer ${token}` } : { 'x-admin-passcode': localStorage.getItem('tolly_admin_passcode') };

  const fetchNews = async () => {
    try {
      const res = await axios.get('/api/telugu-news', { headers });
      setList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredList = list.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleAdd = async () => {
    if (!addForm.title.trim()) {
      triggerNotification('Title is required', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await axios.post('/api/telugu-news', addForm, { headers });
      await fetchNews();
      triggerNotification('News added!');
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
    if (!editForm.title.trim()) {
      triggerNotification('Title is required', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await axios.put(`/api/telugu-news/${editingId}`, editForm, { headers });
      await fetchNews();
      triggerNotification('News updated!');
      setEditingId(null);
    } catch {
      triggerNotification('Failed to update news.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormFields = (formState, setFormState, isNew) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
          <input
            type="text"
            value={formState.title || ''}
            onChange={e => setFormState(f => ({ ...f, title: e.target.value }))}
            placeholder="News Title"
            className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Author</label>
          <input
            type="text"
            value={formState.author || ''}
            onChange={e => setFormState(f => ({ ...f, author: e.target.value }))}
            placeholder="Author Name"
            className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Source</label>
          <input
            type="text"
            value={formState.source || ''}
            onChange={e => setFormState(f => ({ ...f, source: e.target.value }))}
            placeholder="Source URL or Name"
            className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Content</label>
        <TipTapEditor
          content={formState.content || ''}
          onChange={html => setFormState(f => ({ ...f, content: html }))}
          placeholder="Write your news content here..."
          autoSaveKey={isNew ? 'new_telugu_news' : `edit_telugu_news_${formState.id}`}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Telugu News</h2>
          <p className="text-gray-500 text-sm">Manage regional news</p>
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
                  <div className="w-20 h-20 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-bold text-lg truncate mb-1">{item.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {item.author && <span className="text-xs text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-600" />{item.author}</span>}
                      {item.source && <span className="text-xs text-blue-400">Source: {item.source}</span>}
                      {item.date && <span className="text-xs text-gray-400 flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{String(item.date).split('T')[0]}</span>}
                    </div>
                    
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
                  <button onClick={() => { setEditingId(item.id); setEditForm({ ...item }); }} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Edit News">
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
