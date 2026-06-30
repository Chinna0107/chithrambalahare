import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';

const emptyForm = { movieName: '', hourlyGross: '', totalGross: '', premierGross: '', screens: '', status: 'Live', lastUpdated: '', poster: '' };
const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const NorthAmerica = () => {
  const { dbData, setDbData, triggerNotification } = useOutletContext();
  const list = dbData.northAmericaCollections || [];

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const save = async (updated) => {
    setIsSaving(true);
    try {
      const res = await axios.post('/api/north-america', updated);
      const newList = res.data.northAmericaCollections || updated;
      setDbData(d => ({ ...d, northAmericaCollections: newList }));
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('North America collections saved!');
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

  const handleDelete = (id) => {
    const updated = list.filter(item => item.id !== id);
    save(updated);
  };

  const handleEditSave = async () => {
    const updated = list.map(item => item.id === editingId ? { ...item, ...editForm } : item);
    await save(updated);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">North America Collections</h2>
          <p className="text-gray-500 text-sm">{list.length} entries</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20"
        >
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-sm">New Entry</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(emptyForm).map(field => (
              <div key={field}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{field}</label>
                <input
                  type="text"
                  value={addForm[field]}
                  onChange={e => setAddForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={isSaving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
            </button>
            <button onClick={() => setShowAdd(false)} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {list.length === 0 && (
          <div className="text-center py-16 text-gray-600">No entries yet. Click "Add Entry" to get started.</div>
        )}
        {list.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(emptyForm).map(field => (
                    <div key={field}>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{field}</label>
                      <input
                        type="text"
                        value={editForm[field] ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={handleEditSave} disabled={isSaving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {item.poster && <img src={item.poster} alt={item.movieName} className="w-12 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-800" />}
                  <div>
                    <p className="text-white font-bold">{item.movieName}</p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {item.totalGross && <span className="text-xs text-gray-400">Total: <span className="text-white">{item.totalGross}</span></span>}
                      {item.hourlyGross && <span className="text-xs text-gray-400">Hourly: <span className="text-white">{item.hourlyGross}</span></span>}
                      {item.screens && <span className="text-xs text-gray-400">Screens: <span className="text-white">{item.screens}</span></span>}
                      {item.status && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === 'Live' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>{item.status}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
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

export default NorthAmerica;
