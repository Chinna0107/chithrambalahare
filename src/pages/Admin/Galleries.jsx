import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, X, Loader2, GripVertical, Star, Eye } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageUpload from '../../components/ImageUpload';

const CATEGORIES = [
  'Actress Gallery',
  'Movie Opening Gallery',
  'Movie Success Gallery',
  'Events',
  'Posters',
  'Stills'
];

const emptyForm = { title: '', category: 'Stills', coverImage: '', images: [], date: '', slug: '', seoTitle: '', metaDescription: '', canonicalUrl: '', ogImage: '' };
const sanitize = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === null || v === undefined ? '' : v]));

const SortableImageItem = ({ image, onUpdate, onRemove, onSetFeatured, isFeatured }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-[#121214] border ${isFeatured ? 'border-brand-red' : 'border-gray-800'} rounded-xl p-3 flex gap-4 items-start`}>
      <button type="button" {...attributes} {...listeners} className="mt-2 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div className="w-32 h-24 flex-shrink-0 relative rounded-lg overflow-hidden border border-gray-700 bg-black">
        <img src={image.url} alt={image.altText || 'Gallery image'} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Alt Text</label>
            <input type="text" value={image.altText || ''} onChange={e => onUpdate(image.url, 'altText', e.target.value)} className="w-full bg-black/50 border border-gray-800 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-brand-red" placeholder="Image description..." />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Caption</label>
            <input type="text" value={image.caption || ''} onChange={e => onUpdate(image.url, 'caption', e.target.value)} className="w-full bg-black/50 border border-gray-800 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-brand-red" placeholder="Visible caption..." />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Photographer Credit</label>
            <input type="text" value={image.photographerCredit || ''} onChange={e => onUpdate(image.url, 'photographerCredit', e.target.value)} className="w-full bg-black/50 border border-gray-800 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-brand-red" placeholder="Credit..." />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => onRemove(image.url)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Remove Image">
          <Trash2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => onSetFeatured(image.url)} className={`p-1.5 rounded-lg transition-all ${isFeatured ? 'text-brand-red bg-brand-red/10' : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10'}`} title={isFeatured ? "Featured Image" : "Set as Featured"}>
          <Star className="w-4 h-4" fill={isFeatured ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};

const Galleries = () => {
  const { dbData, setDbData, triggerNotification } = useOutletContext();
  const list = dbData.galleries || [];

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [previewGallery, setPreviewGallery] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const serializeForApi = (item) => {
    let finalImages = [];
    if (typeof item.images === 'string') {
      finalImages = item.images.split('\n').filter(Boolean).map(url => ({ url }));
    } else if (Array.isArray(item.images)) {
      finalImages = item.images.map(img => typeof img === 'string' ? { url: img } : img);
    }
    
    return {
      ...item,
      images: finalImages,
      date: item.date || new Date().toISOString(),
    };
  };

  const deserializeForForm = (item) => {
    let finalImages = [];
    if (typeof item.images === 'string') {
      finalImages = item.images.split('\n').filter(Boolean).map(url => ({ url }));
    } else if (Array.isArray(item.images)) {
      finalImages = item.images.map(img => typeof img === 'string' ? { url: img } : img);
    }
    return { ...item, images: finalImages };
  };

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

  const handleDragEnd = (event, formState, setFormState) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormState((state) => {
        const oldIndex = state.images.findIndex(img => img.url === active.id);
        const newIndex = state.images.findIndex(img => img.url === over.id);
        return { ...state, images: arrayMove(state.images, oldIndex, newIndex) };
      });
    }
  };

  const handleImagesUpload = (urls, formState, setFormState) => {
    // urls is an array of strings (the ImageUpload component returns an array if returnArray is true)
    const newImages = urls.map(url => {
      // Find if already exists in current images
      const existing = formState.images.find(img => img.url === url);
      return existing || { url, altText: '', caption: '', photographerCredit: '', sortOrder: 0 };
    });
    setFormState(f => ({ ...f, images: newImages }));
  };

  const handleImageUpdate = (url, field, value, setFormState) => {
    setFormState(f => ({
      ...f,
      images: f.images.map(img => img.url === url ? { ...img, [field]: value } : img)
    }));
  };

  const handleImageRemove = (url, setFormState) => {
    setFormState(f => ({
      ...f,
      images: f.images.filter(img => img.url !== url)
    }));
  };

  const handleSetFeatured = (url, setFormState) => {
    setFormState(f => ({ ...f, coverImage: url }));
  };

  const renderFormFields = (formState, setFormState) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gallery Title</label>
          <input type="text" value={formState.title || ''} onChange={e => setFormState(f => ({ ...f, title: e.target.value }))} className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red" placeholder="e.g. Pushpa 2 Stills" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
          <select value={formState.category || 'Stills'} onChange={e => setFormState(f => ({ ...f, category: e.target.value }))} className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Cover Image URL</label>
          <ImageUpload value={formState.coverImage || ''} onChange={url => setFormState(f => ({ ...f, coverImage: url }))} placeholder="Upload cover image..." />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
          <input type="date" value={formState.date || ''} onChange={e => setFormState(f => ({ ...f, date: e.target.value }))} className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Slug</label>
          <input type="text" value={formState.slug || ''} onChange={e => setFormState(f => ({ ...f, slug: e.target.value }))} className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red" placeholder="e.g. pushpa-2-stills" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Canonical URL</label>
          <input type="text" value={formState.canonicalUrl || ''} onChange={e => setFormState(f => ({ ...f, canonicalUrl: e.target.value }))} className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red" />
        </div>
      </div>
      <div className="mt-4 border border-gray-800 rounded-xl p-4 bg-black/20">
        <h4 className="text-[10px] font-bold text-brand-red uppercase tracking-wider mb-4">SEO Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">SEO Title</label>
            <input type="text" value={formState.seoTitle || ''} onChange={e => setFormState(f => ({ ...f, seoTitle: e.target.value }))} className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Open Graph Image</label>
            <ImageUpload value={formState.ogImage || ''} onChange={url => setFormState(f => ({ ...f, ogImage: url }))} placeholder="Upload OG Image..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Meta Description</label>
            <textarea value={formState.metaDescription || ''} onChange={e => setFormState(f => ({ ...f, metaDescription: e.target.value }))} className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red" rows={2} />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gallery Images (Upload & Manage)</label>
        <ImageUpload 
          value={formState.images.map(img => img.url)} 
          onChange={urls => handleImagesUpload(urls, formState, setFormState)} 
          multiple={true}
          allowWatermark={true}
          returnArray={true}
          hidePreview={true}
          placeholder="Drag & Drop multiple images here, or click to upload..." 
        />
      </div>

      {formState.images && formState.images.length > 0 && (
        <div className="bg-[#18181B] rounded-xl border border-gray-800 p-4 space-y-3">
          <p className="text-xs text-gray-400">Drag to reorder. Set one as Featured (Cover Image).</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, formState, setFormState)}>
            <SortableContext items={formState.images.map(i => i.url)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {formState.images.map((image) => (
                  <SortableImageItem 
                    key={image.url}
                    image={image}
                    isFeatured={formState.coverImage === image.url}
                    onUpdate={(url, field, val) => handleImageUpdate(url, field, val, setFormState)}
                    onRemove={(url) => handleImageRemove(url, setFormState)}
                    onSetFeatured={(url) => handleSetFeatured(url, setFormState)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
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
          {renderFormFields(addForm, setAddForm)}
          <div className="flex gap-3 pt-2">
            <button onClick={handleAdd} disabled={isSaving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
            </button>
            <button onClick={() => setShowAdd(false)} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {list.length === 0 && <div className="text-center py-16 text-gray-600">No galleries yet.</div>}
        {list.map(item => (
          <div key={item.id} className="bg-[#18181B] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
            {editingId === item.id ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">Edit Gallery</h3>
                  <button onClick={() => setPreviewGallery(editForm)} className="flex items-center gap-2 bg-brand-red/20 text-brand-red hover:bg-brand-red/30 font-bold px-3 py-1.5 rounded-lg text-xs">
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>
                {renderFormFields(editForm, setEditForm)}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleEditSave} disabled={isSaving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Changes
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 flex-shrink-0 relative">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover bg-gray-800" />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">No Cover</div>
                  )}
                  {item.category && (
                    <span className="absolute top-2 left-2 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{Array.isArray(item.images) ? item.images.length : 0} images {item.date && ` • ${String(item.date).split('T')[0]}`}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setEditingId(item.id); setEditForm(deserializeForForm(sanitize({ ...item }))); }} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => setPreviewGallery(deserializeForForm(sanitize({ ...item })))} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                      <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm font-medium ml-auto">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {previewGallery && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 lg:p-12 overflow-y-auto">
          <div className="bg-[#121214] border border-gray-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col max-h-full">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#18181B] sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">{previewGallery.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{previewGallery.category} • {previewGallery.images.length} Images</p>
              </div>
              <button onClick={() => setPreviewGallery(null)} className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {previewGallery.images.map((img, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black border border-gray-800 relative">
                      <img src={img.url} alt={img.altText || `Preview ${idx}`} className="w-full h-full object-cover" />
                      {img.url === previewGallery.coverImage && (
                        <div className="absolute top-2 right-2 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Cover
                        </div>
                      )}
                    </div>
                    <div>
                      {img.caption && <p className="text-sm text-gray-200 font-medium">{img.caption}</p>}
                      {img.photographerCredit && <p className="text-xs text-gray-500 mt-1">Photo by {img.photographerCredit}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galleries;
