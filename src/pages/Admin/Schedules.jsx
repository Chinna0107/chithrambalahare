import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const emptyForm = { movieName: '', slug: '', releaseDate: '', remainingDays: '', language: '', status: 'Upcoming', banner: '', director: '', castList: '', genre: '', trailerLink: '', notes: '', seoTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '' };
const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const statusOptions = ['Upcoming', 'Released', 'Postponed', 'Cancelled'];

const fields = [
  { field: 'slug', label: 'Slug (URL)', type: 'text' },
  { field: 'movieName', label: 'Movie Name', type: 'text' },
  { field: 'releaseDate', label: 'Release Date', type: 'text' },
  { field: 'remainingDays', label: 'Remaining Days', type: 'text' },
  { field: 'language', label: 'Language', type: 'text' },
  { field: 'director', label: 'Director', type: 'text' },
  { field: 'genre', label: 'Genre', type: 'text' },
  { field: 'castList', label: 'Cast', type: 'text' },
  { field: 'trailerLink', label: 'Trailer Link', type: 'text' },
  { field: 'notes', label: 'Notes', type: 'textarea' },
];

const seoFields = [
  { field: 'seoTitle', label: 'SEO Title', type: 'text' },
  { field: 'metaDescription', label: 'Meta Description', type: 'textarea' },
  { field: 'metaKeywords', label: 'Meta Keywords', type: 'text' },
  { field: 'canonicalUrl', label: 'Canonical URL', type: 'text' },
  { field: 'ogTitle', label: 'Open Graph Title', type: 'text' },
  { field: 'ogDescription', label: 'Open Graph Description', type: 'textarea' }
];

const FormRow = ({ formState, setFormState }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="lg:col-span-4">
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Banner Image URL</label>
      <ImageUpload
        value={formState.banner}
        onChange={(url) => setFormState(f => ({ ...f, banner: url }))}
      />
    </div>
    {fields.map(({ field, label, type }) => (
      <div key={field} className={type === 'textarea' ? "lg:col-span-4" : ""}>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
        {type === 'textarea' ? (
          <textarea
            value={formState[field] ?? ''}
            onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
            className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-red transition-all"
            rows={3}
          />
        ) : (
          <input
            type={type}
            value={formState[field] ?? ''}
            onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
            className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-red transition-all"
          />
        )}
      </div>
    ))}
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
      <select
        value={formState.status ?? 'Upcoming'}
        onChange={e => setFormState(f => ({ ...f, status: e.target.value }))}
        className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
      >
        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>

    <div className="lg:col-span-4 mt-6">
      <h4 className="text-[10px] font-bold text-brand-red uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">SEO Settings</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {seoFields.map(({ field, label, type }) => (
          <div key={field} className={type === 'textarea' ? "lg:col-span-4" : "lg:col-span-2"}>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            {type === 'textarea' ? (
              <textarea
                value={formState[field] ?? ''}
                onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-red transition-all"
                rows={2}
              />
            ) : (
              <input
                type={type}
                value={formState[field] ?? ''}
                onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-red transition-all"
              />
            )}
          </div>
        ))}
        <div className="lg:col-span-4">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Open Graph Image</label>
          <ImageUpload
            value={formState.ogImage}
            onChange={(url) => setFormState(f => ({ ...f, ogImage: url }))}
          />
        </div>
      </div>
    </div>
  </div>
);

const Schedules = () => {
  const { dbData, setDbData, triggerNotification } = useOutletContext();
  const list = dbData.upcomingSchedules || [];

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const save = async (updated) => {
    setIsSaving(true);
    try {
      const res = await axios.post('/api/schedules', updated);
      const newList = res.data.upcomingSchedules || updated;
      setDbData(d => ({ ...d, upcomingSchedules: newList }));
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Schedules saved!');
    } catch {
      triggerNotification('Failed to save.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!addForm.movieName.trim()) return;
    const updated = [...list, { ...addForm, id: Date.now() }];
    await save(updated);
    setShowAdd(false);
    setAddForm(emptyForm);
  };

  const handleDelete = (id) => save(list.filter(item => item.id !== id));

  const handleEditSave = async () => {
    await save(list.map(item => item.id === editingId ? { ...item, ...editForm } : item));
    setEditingId(null);
  };

  const statusColor = { Upcoming: 'bg-blue-500/20 text-blue-400', Released: 'bg-green-500/20 text-green-400', Postponed: 'bg-yellow-500/20 text-yellow-400', Cancelled: 'bg-red-500/20 text-red-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Upcoming Schedules</h2>
          <p className="text-gray-500 text-sm">{list.length} entries</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
          <Plus className="w-4 h-4" /> Add Schedule
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-sm">New Schedule</h3>
          <FormRow formState={addForm} setFormState={setAddForm} />
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
        {list.length === 0 && <div className="text-center py-16 text-gray-600">No schedules yet.</div>}
        {list.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-4">
                <FormRow formState={editForm} setFormState={setEditForm} />
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
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 flex-wrap">
                  <p className="text-white font-bold">{item.movieName}</p>
                  {item.releaseDate && <span className="text-xs text-gray-400">{typeof item.releaseDate === 'string' ? item.releaseDate.split('T')[0] : item.releaseDate}</span>}
                  {item.remainingDays && <span className="text-xs text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">{item.remainingDays} left</span>}
                  {item.language && <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{item.language}</span>}
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[item.status] || 'bg-gray-700 text-gray-400'}`}>{item.status}</span>
                </div>
                <div className="flex gap-2">
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

export default Schedules;
