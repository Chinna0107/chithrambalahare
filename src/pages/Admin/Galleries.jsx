import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';

const emptyForm = { title: '', coverImage: '', images: '', date: '' };
const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const Galleries = () => {
  const { dbData, setDbData, triggerNotification } = useOutletContext();
  const list = dbData.galleries || [];

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const serializeForApi = (item) => ({
    ...item,
    images: typeof item.images === 'string'
      ? item.images.split('\n').map(s => s.trim()).filter(Boolean)
      : item.images || [],
    date: item.date || new Date().toISOString(),
  });

  const deserializeForForm = (item) => ({
    ...item,
    images: Array.isArray(item.images) ? item.images.join('\n') : item.images || '',
  });

  const save = async (rawList) => {
    setIsSaving(true);
    const serialized = rawList.map(serializeForApi);
    try {
      const res = await axios.post('/api/galleries', serialized);
      const newList = res.data.galleries || serialized;
      setDbData(d => ({ ...d, galleries: newList }));
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Galleries saved!');
    } catch {
      triggerNotification('Failed to save.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!addForm.title.trim()) return;
    await save([...list, { ...addForm, id: Date.now() }]);
    setShowAdd(false);
    setAddForm(emptyForm);
  };

  const handleDelete = (id) => save(list.filter(item => item.id !== id));

  const handleEditSave = async () => {
    await save(list.map(item => item.id === editingId ? { ...item, ...editForm } : item));
    setEditingId(null);
  };

  const FormFields = ({ formState, setFormState }) => (
    <div className="space-y-4">
      {[
        { field: 'title', label: 'Gallery Title', type: 'text', placeholder: 'e.g. Pushpa 2 Stills' },
        { field: 'coverImage', label: 'Cover Image URL', type: 'text', placeholder: 'https://...' },
        { field: 'date', label: 'Date', type: 'date', placeholder: '' },
      ].map(({ field, label, type, placeholder }) => (
        <div key={field}>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
          <input
            type={type}
            value={formState[field] ?? ''}
            onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
            placeholder={placeholder}
            className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
          />
        </div>
      ))}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Image URLs (one per line)</label>
        <textarea
          value={formState.images ?? ''}
          onChange={e => setFormState(f => ({ ...f, images: e.target.value }))}
          rows={5}
          placeholder="https://image1.jpg&#10;https://image2.jpg"
          className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-y"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Exclusive Galleries</h2>
          <p className="text-gray-500 text-sm">{list.length} galleries</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
          <Plus className="w-4 h-4" /> Add Gallery
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-sm">New Gallery</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.length === 0 && <div className="col-span-2 text-center py-16 text-gray-600">No galleries yet.</div>}
        {list.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="p-5 space-y-4">
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
              <>
                {item.coverImage && <img src={item.coverImage} alt={item.title} className="w-full h-36 object-cover bg-gray-800" />}
                <div className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{Array.isArray(item.images) ? item.images.length : 0} images{item.date && ` • ${String(item.date).split('T')[0]}`}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditingId(item.id); setEditForm(deserializeForForm(sanitize({ ...item }))); }} className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Galleries;
