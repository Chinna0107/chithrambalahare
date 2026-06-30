import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye } from 'lucide-react';

const emptyForm = { slug: '', movieName: '', poster: '', rating: '', snippet: '', verdict: '', story: '', performances: '', technicalAspects: '', verdictText: '', ottPlatform: '', ottReleaseDate: '', date: '' };
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
    setIsSaving(true);
    try {
      await axios.delete(`/api/reviews/${id}`);
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Review deleted!');
    } catch {
      triggerNotification('Failed to delete.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`/api/reviews/${editingId}`, { ...editForm, date: editForm.date || new Date().toISOString() });
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Review updated!');
      setEditingId(null);
    } catch {
      triggerNotification('Failed to update.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const shortFields = [
    { field: 'slug', label: 'Slug', placeholder: 'e.g. pushpa-2' },
    { field: 'movieName', label: 'Movie Name', placeholder: 'Movie title' },
    { field: 'poster', label: 'Poster URL', placeholder: 'https://...' },
    { field: 'rating', label: 'Rating', placeholder: 'e.g. 3.5/5' },
    { field: 'verdict', label: 'Verdict', placeholder: 'e.g. Hit' },
    { field: 'ottPlatform', label: 'OTT Platform', placeholder: 'e.g. Netflix' },
    { field: 'ottReleaseDate', label: 'OTT Release Date', placeholder: 'e.g. Jan 15, 2025' },
    { field: 'date', label: 'Date', placeholder: '', type: 'date' },
  ];

  const longFields = [
    { field: 'snippet', label: 'Snippet (short summary)', rows: 2 },
    { field: 'story', label: 'Story Review', rows: 4 },
    { field: 'performances', label: 'Performances Review', rows: 4 },
    { field: 'technicalAspects', label: 'Technical Aspects', rows: 4 },
    { field: 'verdictText', label: 'Verdict Text (detailed)', rows: 4 },
  ];

  const FormFields = ({ formState, setFormState }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shortFields.map(({ field, label, placeholder, type }) => (
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
      {longFields.map(({ field, label, rows }) => (
        <div key={field}>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
          <textarea
            value={formState[field] ?? ''}
            onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
            rows={rows}
            className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-y"
          />
        </div>
      ))}
    </div>
  );

  const verdictColor = (v) => {
    const lower = (v || '').toLowerCase();
    if (['blockbuster', 'super hit'].includes(lower)) return 'bg-green-500/20 text-green-400';
    if (lower === 'hit') return 'bg-blue-500/20 text-blue-400';
    if (lower === 'average') return 'bg-yellow-500/20 text-yellow-400';
    if (['flop', 'disaster'].includes(lower)) return 'bg-red-500/20 text-red-400';
    return 'bg-gray-700 text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Detailed Reviews</h2>
          <p className="text-gray-500 text-sm">{list.length} reviews</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-sm">New Review</h3>
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
        {list.length === 0 && <div className="text-center py-16 text-gray-600">No reviews yet.</div>}
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
                  {item.poster && <img src={item.poster} alt={item.movieName} className="w-12 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-800" />}
                  <div className="min-w-0">
                    <p className="text-white font-bold">{item.movieName}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.rating && <span className="text-xs text-yellow-400 font-bold">⭐ {item.rating}</span>}
                      {item.verdict && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${verdictColor(item.verdict)}`}>{item.verdict}</span>}
                      {item.date && <span className="text-xs text-gray-600">{String(item.date).split('T')[0]}</span>}
                      {item.ottPlatform && <span className="text-xs text-purple-400">{item.ottPlatform}</span>}
                    </div>
                    {item.snippet && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.snippet}</p>}
                    {expandedId === item.id && (
                      <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs text-gray-400 max-h-60 overflow-y-auto space-y-2">
                        {item.story && <div><strong className="text-gray-300">Story:</strong> {item.story}</div>}
                        {item.performances && <div><strong className="text-gray-300">Performances:</strong> {item.performances}</div>}
                        {item.technicalAspects && <div><strong className="text-gray-300">Technical:</strong> {item.technicalAspects}</div>}
                        {item.verdictText && <div><strong className="text-gray-300">Verdict:</strong> {item.verdictText}</div>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingId(item.id); setEditForm(sanitize({ ...item })); }} className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
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

export default Reviews;
