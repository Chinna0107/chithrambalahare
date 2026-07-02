import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const PopupAd = () => {
  const { dbData, setDbData, triggerNotification } = useOutletContext();

  const [form, setForm] = useState({
    active: dbData.popupAd?.active ?? false,
    title: dbData.popupAd?.title ?? '',
    imageUrl: dbData.popupAd?.imageUrl ?? '',
    redirectUrl: dbData.popupAd?.redirectUrl ?? '',
    buttonText: dbData.popupAd?.buttonText ?? '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

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
        <p className="text-gray-500 text-sm">Manage the sitewide popup advertisement</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#18181B] rounded-2xl border border-gray-800 p-6 space-y-5">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-800">
          <div>
            <p className="text-white font-bold text-sm">Popup Active</p>
            <p className="text-gray-500 text-xs mt-0.5">Show or hide the popup across the site</p>
          </div>
          <button
            type="button"
            onClick={() => handleChange('active', !form.active)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${form.active ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.active ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
            <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. New Release Alert!" className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image</label>
            <ImageUpload value={form.imageUrl} onChange={(url) => handleChange('imageUrl', url)} placeholder="Upload popup image..." />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Link URL</label>
            <input
              type="text"
              value={form.redirectUrl}
              onChange={e => handleChange('redirectUrl', e.target.value)}
              placeholder="https://"
              className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Button Text</label>
            <input type="text" value={form.buttonText} onChange={e => handleChange('buttonText', e.target.value)} placeholder="e.g. Watch Now" className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" />
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
