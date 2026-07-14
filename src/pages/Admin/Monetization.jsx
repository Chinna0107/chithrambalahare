import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, Save, Loader2, Image as ImageIcon, Clock, MousePointer2, Settings2 } from 'lucide-react';
import axios from 'axios';
import ImageUpload from '../../components/ImageUpload';

const Monetization = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [fullData, setFullData] = useState({});

  const [popupData, setPopupData] = useState({
    active: false,
    title: '',
    imageDesktop: '',
    imageMobile: '',
    redirectUrl: '',
    scheduleStart: '',
    scheduleEnd: '',
    closeTimer: 0,
    autoClose: false,
    displayRule: 'every_visit',
    displayDelay: 0
  });

  useEffect(() => {
    fetchPopupData();
  }, []);

  const fetchPopupData = async () => {
    try {
      const res = await axios.get('/api/popup-ad');
      setFullData(res.data);
      
      // Format timestamps for datetime-local inputs
      const formatDT = (isoString) => {
        if (!isoString || typeof isoString !== 'string') return '';
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return '';
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      };

      setPopupData({
        active: res.data.active || false,
        title: res.data.title || '',
        imageDesktop: res.data.imageDesktop || '',
        imageMobile: res.data.imageMobile || '',
        redirectUrl: res.data.redirectUrl || '',
        scheduleStart: formatDT(res.data.scheduleStart),
        scheduleEnd: formatDT(res.data.scheduleEnd),
        closeTimer: res.data.closeTimer || 0,
        autoClose: res.data.autoClose || false,
        displayRule: res.data.displayRule || 'every_visit',
        displayDelay: res.data.displayDelay || 0
      });
    } catch (err) {
      console.error('Failed to fetch popup data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...fullData,
        ...popupData,
        scheduleStart: (popupData.scheduleStart && !isNaN(new Date(popupData.scheduleStart).getTime())) ? new Date(popupData.scheduleStart).toISOString() : null,
        scheduleEnd: (popupData.scheduleEnd && !isNaN(new Date(popupData.scheduleEnd).getTime())) ? new Date(popupData.scheduleEnd).toISOString() : null,
      };
      await axios.post('/api/popup-ad', payload);
      setNotification({ message: 'Popup Ad settings saved successfully!', type: 'success' });
      // Clear notification after 3s
      setTimeout(() => setNotification(null), 3000);
      window.dispatchEvent(new Event('tolly_db_change'));
    } catch (err) {
      setNotification({ message: 'Failed to save settings.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setPopupData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet><title>Monetization & Ads - Admin</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-brand-red" />
            Advertisement Management
          </h2>
          <p className="text-gray-400 text-sm mt-1">Configure site-wide popup ads and monetization logic.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-red hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg font-bold ${notification.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {notification.message}
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* General Settings */}
          <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-poppins font-bold text-white mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-gray-400" /> General Settings
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-800">
                <div>
                  <p className="text-white font-bold">Enable Popup Advertisement</p>
                  <p className="text-gray-500 text-sm">Turn the global popup on or off.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={popupData.active} onChange={(e) => handleChange('active', e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Campaign Title (Internal)</label>
                <input 
                  type="text" 
                  value={popupData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Sankranthi Special Offer"
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Redirect URL</label>
                <input 
                  type="text" 
                  value={popupData.redirectUrl}
                  onChange={(e) => handleChange('redirectUrl', e.target.value)}
                  placeholder="https://example.com/landing-page"
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Media Assets */}
          <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-poppins font-bold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" /> Creative Assets
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Desktop Image URL</label>
                <ImageUpload 
                  value={popupData.imageDesktop}
                  onChange={(url) => handleChange('imageDesktop', url)}
                  placeholder="Upload desktop banner..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Mobile Image URL</label>
                <ImageUpload 
                  value={popupData.imageMobile}
                  onChange={(url) => handleChange('imageMobile', url)}
                  placeholder="Upload mobile banner..."
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Scheduling */}
          <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-poppins font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Scheduling
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Start Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={popupData.scheduleStart}
                  onChange={(e) => handleChange('scheduleStart', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">End Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={popupData.scheduleEnd}
                  onChange={(e) => handleChange('scheduleEnd', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all"
                />
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-3">Leave dates empty to show the popup indefinitely (as long as it is Active).</p>
          </div>

          {/* Display Behavior */}
          <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-poppins font-bold text-white mb-4 flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-gray-400" /> Display Behavior
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Display Rule</label>
                <select 
                  value={popupData.displayRule}
                  onChange={(e) => handleChange('displayRule', e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all appearance-none"
                >
                  <option value="every_visit">Show on every page visit</option>
                  <option value="once_per_user">Show only once per user (uses Cookies/Storage)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Display Delay (Secs)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={popupData.displayDelay}
                    onChange={(e) => handleChange('displayDelay', parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all"
                  />
                  <p className="text-gray-500 text-xs mt-1">Wait before showing.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Close Timer (Secs)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={popupData.closeTimer}
                    onChange={(e) => handleChange('closeTimer', parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all"
                  />
                  <p className="text-gray-500 text-xs mt-1">Delay close button.</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-800">
                <div>
                  <p className="text-white font-bold">Auto-Close Popup</p>
                  <p className="text-gray-500 text-sm">Popup closes automatically after Timer ends.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={popupData.autoClose} onChange={(e) => handleChange('autoClose', e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                </label>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Monetization;
