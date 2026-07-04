import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const PopupAd = () => {
  const { dbData, setDbData, triggerNotification } = useOutletContext();

  const [form, setForm] = useState({
    active: dbData.popupAd?.active ?? false,
    closeTimer: dbData.popupAd?.closeTimer ?? 5,
    autoClose: dbData.popupAd?.autoClose ?? false,
    imageUrl: dbData.popupAd?.imageUrl ?? '',
    redirectUrl: dbData.popupAd?.redirectUrl ?? '',
    buttonText: dbData.popupAd?.buttonText ?? '',
    carouselItems: dbData.popupAd?.carouselItems ?? []
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleCarouselChange = (index, field, value) => {
    const newItems = [...form.carouselItems];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('carouselItems', newItems);
  };

  const addCarouselItem = () => {
    handleChange('carouselItems', [...form.carouselItems, { imageUrl: '', redirectUrl: '', timer: 3, title: '', description: '' }]);
  };

  const removeCarouselItem = (index) => {
    handleChange('carouselItems', form.carouselItems.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post('/api/popup-ad', form);
      setDbData(d => ({ ...d, popupAd: form }));
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Popup ad settings saved!');
    } catch {
      triggerNotification('Failed to save popup ad.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-poppins font-bold text-white mb-1">Popup Ad Settings</h2>
        <p className="text-gray-500 text-sm">Manage the sitewide popup advertisement and carousel</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#18181B] rounded-2xl border border-gray-800 p-6 space-y-5">
        {/* Active Toggle */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Popup Active</h2>
            <p className="text-sm text-gray-500">Enable or disable the popup ad across the site</p>
          </div>
          <button
            type="button"
            onClick={() => handleChange('active', !form.active)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${form.active ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.active ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Auto Close Popup</label>
              <button
                type="button"
                onClick={() => handleChange('autoClose', !form.autoClose)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none ${form.autoClose ? 'bg-brand-red' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${form.autoClose ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-500">If enabled, the popup will automatically close after the timer ends.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Timer (Seconds)</label>
            <input 
              type="number" 
              min="0"
              value={form.closeTimer} 
              onChange={e => handleChange('closeTimer', parseInt(e.target.value) || 0)} 
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
            />
            <p className="text-xs text-gray-500 mt-2">Duration before the user can skip the ad (or before auto-close).</p>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-bold text-white uppercase tracking-wider">Carousel Images</label>
            <button
              type="button"
              onClick={addCarouselItem}
              className="flex items-center gap-1 text-xs font-bold text-brand-red hover:text-white bg-brand-red/10 hover:bg-brand-red transition-all px-3 py-1.5 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Image
            </button>
          </div>
          
          {form.carouselItems.length === 0 && (
            <p className="text-gray-500 text-xs text-center py-4 bg-black/30 rounded-xl border border-gray-800 border-dashed">No images added to the carousel yet.</p>
          )}

          <div className="space-y-4">
            {form.carouselItems.map((item, idx) => (
              <div key={idx} className="p-4 bg-black/30 rounded-xl border border-gray-800 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeCarouselItem(idx)}
                  className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <h4 className="text-gray-400 font-bold text-xs uppercase">Image {idx + 1}</h4>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                  <ImageUpload value={item.imageUrl} onChange={(url) => handleCarouselChange(idx, 'imageUrl', url)} placeholder="Upload popup image..." />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={e => handleCarouselChange(idx, 'title', e.target.value)}
                    placeholder="e.g. CLICK HERE to watch Super Subbu..."
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    value={item.description || ''}
                    onChange={e => handleCarouselChange(idx, 'description', e.target.value)}
                    placeholder="Read more at..."
                    rows="2"
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Redirect Link URL</label>
                    <input
                      type="text"
                      value={item.redirectUrl}
                      onChange={e => handleCarouselChange(idx, 'redirectUrl', e.target.value)}
                      placeholder="https://"
                      className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Timer (Seconds)</label>
                    <input
                      type="number"
                      min="1"
                      value={item.timer}
                      onChange={e => handleCarouselChange(idx, 'timer', parseInt(e.target.value) || 3)}
                      placeholder="e.g. 3"
                      className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-brand-red/20"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Popup Settings
        </button>
      </form>
    </div>
  );
};

export default PopupAd;
