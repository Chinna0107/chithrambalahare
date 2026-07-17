import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, Eye, Search } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const emptyForm = {
  slug: '', movieName: '', director: '', cast: '', poster: '',
  dayCollection: '', worldwideGross: '', indiaNet: '', indiaGross: '',
  overseas: '', verdict: '', trend: '', days: '', languages: '',
  percentage: '', date: '', dailyBreakdown: [], budget: '',
  totalIndiaNet: '', usPremieres: '',
};
const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const BoxOffice = () => {
  const { dbData, setDbData, triggerNotification, loadDb } = useOutletContext();
  const list = dbData.boxOffice || [];

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
    item.movieName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.cast?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const serializeForApi = (item) => ({
    ...item,
    dailyBreakdown: Array.isArray(item.dailyBreakdown) ? item.dailyBreakdown.filter(d => d.day || d.indiaNet || d.worldwideGross || d.occupancy) : [],
    date: item.date || new Date().toISOString(),
  });

  const deserializeForForm = (item) => ({
    ...item,
    dailyBreakdown: Array.isArray(item.dailyBreakdown) ? item.dailyBreakdown : [],
  });

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
      await axios.post('/api/box-office', serializeForApi({ ...addForm, id: Date.now().toString() }));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Box office entry added!');
      setShowAdd(false);
      setAddForm(emptyForm);
    } catch {
      triggerNotification('Failed to add entry.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this box office entry?')) return;
    setIsSaving(true);
    try {
      await axios.delete(`/api/box-office/${id}`);
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Box office entry deleted!');
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch {
      triggerNotification('Failed to delete.', 'error');
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
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} entries?`)) return;
    setIsSaving(true);
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`/api/box-office/${id}`)));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification(`${selectedIds.length} entries deleted!`);
      setSelectedIds([]);
    } catch {
      triggerNotification('Failed to delete some entries.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`/api/box-office/${editingId}`, serializeForApi(editForm));
      await refreshDb();
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Box office entry updated!');
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
    { field: 'director', label: 'Director', placeholder: 'Director name' },
    { field: 'cast', label: 'Cast', placeholder: 'Lead actors' },
    { field: 'poster', label: 'Poster URL', placeholder: 'https://...' },
    { field: 'dayCollection', label: 'Day Collection', placeholder: 'e.g. ₹25 Cr' },
    { field: 'worldwideGross', label: 'Worldwide Gross', placeholder: 'e.g. ₹500 Cr' },
    { field: 'indiaNet', label: 'India Net', placeholder: 'e.g. ₹200 Cr' },
    { field: 'indiaGross', label: 'India Gross', placeholder: 'e.g. ₹250 Cr' },
    { field: 'overseas', label: 'Overseas', placeholder: 'e.g. $15M' },
    { field: 'verdict', label: 'Verdict', placeholder: 'e.g. Blockbuster' },
    { field: 'trend', label: 'Trend', placeholder: 'e.g. Excellent' },
    { field: 'days', label: 'Days', placeholder: 'e.g. 14' },
    { field: 'languages', label: 'Languages', placeholder: 'e.g. Telugu, Hindi' },
    { field: 'percentage', label: 'Percentage', placeholder: 'e.g. +25%' },
    { field: 'budget', label: 'Budget', placeholder: 'e.g. ₹200 Cr' },
    { field: 'totalIndiaNet', label: 'Total India Net', placeholder: 'e.g. ₹350 Cr' },
    { field: 'usPremieres', label: 'US Premieres', placeholder: 'e.g. $2.5M' },
    { field: 'date', label: 'Date', placeholder: '', type: 'date' },
  ];

  const renderFormFields = (formState, setFormState) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortFields.map(({ field, label, placeholder, type }) => (
          <div key={field}>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            {field === 'poster' ? (
              <ImageUpload 
                value={formState[field] ?? ''} 
                onChange={url => setFormState(f => ({ ...f, [field]: url }))} 
                placeholder={`Upload ${label.replace(' URL', '').toLowerCase()}...`} 
              />
            ) : (
              <input
                type={type || 'text'}
                value={formState[field] ?? ''}
                onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
              />
            )}
          </div>
        ))}
      </div>
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Daily Breakdown</label>
        <div className="space-y-2">
          {(formState.dailyBreakdown || []).map((dbItem, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Day/Date"
                value={dbItem.day || ''}
                onChange={(e) => {
                  const newBd = [...(formState.dailyBreakdown || [])];
                  newBd[index] = { ...newBd[index], day: e.target.value };
                  setFormState(f => ({ ...f, dailyBreakdown: newBd }));
                }}
                className="w-1/4 bg-black/50 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
              />
              <input
                type="text"
                placeholder="India Net (e.g. 50cr)"
                value={dbItem.indiaNet || ''}
                onChange={(e) => {
                  const newBd = [...(formState.dailyBreakdown || [])];
                  newBd[index] = { ...newBd[index], indiaNet: e.target.value };
                  setFormState(f => ({ ...f, dailyBreakdown: newBd }));
                }}
                className="w-1/4 bg-black/50 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
              />
              <input
                type="text"
                placeholder="WW Gross (e.g. 80cr)"
                value={dbItem.worldwideGross || ''}
                onChange={(e) => {
                  const newBd = [...(formState.dailyBreakdown || [])];
                  newBd[index] = { ...newBd[index], worldwideGross: e.target.value };
                  setFormState(f => ({ ...f, dailyBreakdown: newBd }));
                }}
                className="w-1/4 bg-black/50 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
              />
              <input
                type="text"
                placeholder="Occupancy (e.g. 60%)"
                value={dbItem.occupancy || ''}
                onChange={(e) => {
                  const newBd = [...(formState.dailyBreakdown || [])];
                  newBd[index] = { ...newBd[index], occupancy: e.target.value };
                  setFormState(f => ({ ...f, dailyBreakdown: newBd }));
                }}
                className="w-1/4 bg-black/50 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  const newBd = [...(formState.dailyBreakdown || [])];
                  newBd.splice(index, 1);
                  setFormState(f => ({ ...f, dailyBreakdown: newBd }));
                }}
                className="p-2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newBd = [...(formState.dailyBreakdown || []), { day: '', indiaNet: '', worldwideGross: '', occupancy: '' }];
              setFormState(f => ({ ...f, dailyBreakdown: newBd }));
            }}
            className="flex items-center gap-1 text-xs text-brand-red hover:text-red-400 font-bold transition-all px-2 py-1 bg-brand-red/10 hover:bg-brand-red/20 rounded-lg w-max mt-1"
          >
            <Plus className="w-3 h-3" /> Add Day
          </button>
        </div>
      </div>
    </div>
  );

  const verdictColor = (v) => {
    const lower = (v || '').toLowerCase();
    if (['blockbuster', 'super hit', 'all time blockbuster'].includes(lower)) return 'bg-green-500/20 text-green-400';
    if (lower === 'hit') return 'bg-blue-500/20 text-blue-400';
    if (lower === 'average') return 'bg-yellow-500/20 text-yellow-400';
    if (['flop', 'disaster'].includes(lower)) return 'bg-red-500/20 text-red-400';
    return 'bg-gray-700 text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-1">Detailed Box Office Reports</h2>
          <p className="text-gray-500 text-sm">{list.length} entries</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#18181B] border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red transition-all w-64"
            />
          </div>
          <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-brand-red/20">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-[#18181B] border border-brand-red/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-sm">New Box Office Entry</h3>
          {renderFormFields(addForm, setAddForm)}
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
        {paginatedList.length === 0 && <div className="text-center py-16 text-gray-600">No box office entries yet.</div>}
        {paginatedList.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-4">
                {renderFormFields(editForm, setEditForm)}
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
                  <div className="pt-2 flex-shrink-0">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(item.id)} 
                      onChange={() => handleSelect(item.id)} 
                      className="w-5 h-5 rounded border-gray-700 bg-black/50 text-brand-red focus:ring-brand-red focus:ring-offset-gray-900 cursor-pointer transition-colors" 
                    />
                  </div>
                  {item.poster && <img src={item.poster} alt={item.movieName} className="w-12 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-800" />}
                  <div className="min-w-0">
                    <p className="text-white font-bold">{item.movieName}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.verdict && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${verdictColor(item.verdict)}`}>{item.verdict}</span>}
                      {item.worldwideGross && <span className="text-xs text-gray-400">WW: <span className="text-white">{item.worldwideGross}</span></span>}
                      {item.indiaNet && <span className="text-xs text-gray-400">India Net: <span className="text-white">{item.indiaNet}</span></span>}
                      {item.days && <span className="text-xs text-gray-500">Day {item.days}</span>}
                      {item.date && <span className="text-xs text-gray-600">{String(item.date).split('T')[0]}</span>}
                    </div>
                    {item.director && <p className="text-xs text-gray-500 mt-1">Dir: {item.director} {item.cast && `• Cast: ${item.cast}`}</p>}

                    {expandedId === item.id && (
                      <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs text-gray-400 max-h-60 overflow-y-auto space-y-1">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {item.dayCollection && <div><strong className="text-gray-300">Day Collection:</strong> {item.dayCollection}</div>}
                          {item.indiaGross && <div><strong className="text-gray-300">India Gross:</strong> {item.indiaGross}</div>}
                          {item.overseas && <div><strong className="text-gray-300">Overseas:</strong> {item.overseas}</div>}
                          {item.budget && <div><strong className="text-gray-300">Budget:</strong> {item.budget}</div>}
                          {item.totalIndiaNet && <div><strong className="text-gray-300">Total India Net:</strong> {item.totalIndiaNet}</div>}
                          {item.usPremieres && <div><strong className="text-gray-300">US Premieres:</strong> {item.usPremieres}</div>}
                          {item.languages && <div><strong className="text-gray-300">Languages:</strong> {item.languages}</div>}
                          {item.percentage && <div><strong className="text-gray-300">Change:</strong> {item.percentage}</div>}
                          {item.trend && <div><strong className="text-gray-300">Trend:</strong> {item.trend}</div>}
                        </div>
                        {Array.isArray(item.dailyBreakdown) && item.dailyBreakdown.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-800">
                            <strong className="text-gray-300 block mb-1">Daily Breakdown:</strong>
                            <div className="space-y-1">
                              {item.dailyBreakdown.map((dbItem, idx) => (
                                <div key={idx} className="flex gap-2 text-[10px] text-gray-400 bg-black/20 p-1.5 rounded">
                                  <span className="flex-1 truncate">{dbItem.day}</span>
                                  <span className="flex-1 truncate text-white">{dbItem.indiaNet}</span>
                                  <span className="flex-1 truncate text-green-400">{dbItem.worldwideGross}</span>
                                  <span className="w-12 truncate">{dbItem.occupancy}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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

export default BoxOffice;
