import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2 } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const emptyForm = { 
  slug: '', movieName: '', releaseDate: '', language: '', distributor: '', genre: '', budget: '',
  openingDayPreview: '', advanceBookings: '', premiereCollections: '',
  hourlyGross: '', totalGross: '', premierGross: '', screens: '', 
  weekendCollections: '', weeklyCollections: '', status: 'Live', notes: '', 
  lastUpdated: '', poster: '', dailyBreakdown: [],
  seoTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '', 
  ogTitle: '', ogDescription: '', ogImage: '', twitterCard: '', robots: 'index,follow'
};

const seoFieldsList = ['seoTitle', 'metaDescription', 'metaKeywords', 'canonicalUrl', 'ogTitle', 'ogDescription', 'ogImage', 'twitterCard', 'robots'];

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

  const renderFields = (formState, setFormState) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(emptyForm).filter(f => f !== 'dailyBreakdown' && !seoFieldsList.includes(f)).map(field => {
            return (
              <div key={field}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {field === 'poster' ? (
                  <ImageUpload 
                    value={formState[field] ?? ''} 
                    onChange={url => setFormState(f => ({ ...f, [field]: url }))} 
                    placeholder="Upload poster..." 
                  />
                ) : (
                  <input
                    type="text"
                    value={formState[field] ?? ''}
                    onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-red transition-all"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* SEO Settings */}
        <div className="border border-gray-800 rounded-xl p-4 bg-black/20 mt-6">
          <h4 className="text-[10px] font-bold text-brand-red uppercase tracking-wider mb-4">SEO Settings</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {seoFieldsList.map(field => (
              <div key={field}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {field === 'ogImage' ? (
                  <ImageUpload 
                    value={formState[field] ?? ''} 
                    onChange={url => setFormState(f => ({ ...f, [field]: url }))} 
                    placeholder="Upload OG Image..." 
                  />
                ) : (
                  <input
                    type="text"
                    value={formState[field] ?? ''}
                    onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-red transition-all"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="border border-gray-800 rounded-xl p-4 bg-black/20">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-[10px] font-bold text-brand-red uppercase tracking-wider">Daily Collections</label>
            <button 
              type="button"
              onClick={() => {
                const arr = Array.isArray(formState.dailyBreakdown) ? formState.dailyBreakdown : [];
                setFormState(f => ({ ...f, dailyBreakdown: [...arr, { day: `Day ${arr.length + 1}`, collection: '' }] }));
              }}
              className="flex items-center gap-1 text-[10px] font-bold bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Day
            </button>
          </div>
          
          <div className="space-y-2">
            {(Array.isArray(formState.dailyBreakdown) ? formState.dailyBreakdown : []).map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={item.day} 
                  onChange={(e) => {
                    const newArr = [...formState.dailyBreakdown];
                    newArr[index].day = e.target.value;
                    setFormState(f => ({ ...f, dailyBreakdown: newArr }));
                  }}
                  className="w-24 bg-black/50 border border-gray-800 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-brand-red"
                  placeholder="Day X"
                />
                <input 
                  type="text" 
                  value={item.collection} 
                  onChange={(e) => {
                    const newArr = [...formState.dailyBreakdown];
                    newArr[index].collection = e.target.value;
                    setFormState(f => ({ ...f, dailyBreakdown: newArr }));
                  }}
                  className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-brand-red"
                  placeholder="Collection (e.g. $1.5M)"
                />
                <button 
                  type="button"
                  onClick={() => {
                    const newArr = formState.dailyBreakdown.filter((_, i) => i !== index);
                    setFormState(f => ({ ...f, dailyBreakdown: newArr }));
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!formState.dailyBreakdown || formState.dailyBreakdown.length === 0) && (
              <p className="text-xs text-gray-500 text-center py-2">No daily collections added yet.</p>
            )}
          </div>
        </div>
      </div>
    );
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
          {renderFields(addForm, setAddForm)}
          <div className="flex gap-3 pt-2">
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
                {renderFields(editForm, setEditForm)}
                <div className="flex gap-3 pt-2">
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
                  <button onClick={() => { 
                    setEditingId(item.id); 
                    setEditForm({ ...sanitize({ ...item }), dailyBreakdown: Array.isArray(item.dailyBreakdown) ? item.dailyBreakdown : [] }); 
                  }} className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
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
