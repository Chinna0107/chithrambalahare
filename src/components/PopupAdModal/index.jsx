import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ExternalLink } from 'lucide-react';
import { getPopupAd } from '../../services/api';

const PopupAdModal = ({ forceShow = false }) => {
  const { data: adData, isLoading } = useQuery({
    queryKey: ['popupAd'],
    queryFn: getPopupAd,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [timerCount, setTimerCount] = useState(0);

  useEffect(() => {
    if (!adData) return;

    if (!adData.active && !forceShow) return;

    // Check Scheduling
    if (!forceShow) {
      const now = new Date().getTime();
      if (adData.scheduleStart && now < new Date(adData.scheduleStart).getTime()) return;
      if (adData.scheduleEnd && now > new Date(adData.scheduleEnd).getTime()) return;
    }

    // Check Display Rules
    if (!forceShow && adData.displayRule === 'once_per_user') {
      const dismissed = localStorage.getItem('tolly_ad_dismissed');
      if (dismissed === 'true') return;
    }

    // Process Delay
    const delayMs = forceShow ? 0 : (adData.displayDelay || 0) * 1000;
    
    const delayTimer = setTimeout(() => {
      setIsOpen(true);
      
      // Setup Close Timer Logic
      const closeSecs = adData.closeTimer || 0;
      setTimerCount(closeSecs);

      if (closeSecs > 0) {
        let currentCount = closeSecs;
        const interval = setInterval(() => {
          currentCount--;
          setTimerCount(currentCount);
          if (currentCount <= 0) {
            clearInterval(interval);
            setCanClose(true);
            if (adData.autoClose && !forceShow) {
               setIsOpen(false);
               if (adData.displayRule === 'once_per_user') {
                 localStorage.setItem('tolly_ad_dismissed', 'true');
               }
            }
          }
        }, 1000);
      } else {
        setCanClose(true);
      }

    }, delayMs);

    return () => clearTimeout(delayTimer);
  }, [adData, forceShow]);

  // Listen to custom admin preview trigger
  useEffect(() => {
    const handlePreview = (e) => {
      if (e.detail && e.detail.ad) {
        setIsOpen(true);
      }
    };
    window.addEventListener('tolly_ad_preview', handlePreview);
    return () => window.removeEventListener('tolly_ad_preview', handlePreview);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (!forceShow && adData?.displayRule === 'once_per_user') {
      localStorage.setItem('tolly_ad_dismissed', 'true');
    }
  };

  if (!isOpen || isLoading || !adData) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => canClose && handleClose()}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#131a2b] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 animate-scale-up z-50">
        
        {/* Banner Image */}
        {(adData.imageDesktop || adData.imageMobile || adData.imageUrl) && (
          <a href={adData.redirectUrl || '#'} target={adData.redirectUrl ? '_blank' : '_self'} rel="noopener noreferrer" className="block relative w-full overflow-hidden min-h-[150px]">
             {/* Unified ImageUrl fallback */}
             {adData.imageUrl && !adData.imageDesktop && !adData.imageMobile && (
                <img 
                  src={adData.imageUrl} 
                  alt={adData.title || "Advertisement"} 
                  className="w-full h-auto object-cover block"
                />
             )}
             {/* Desktop Image */}
             {adData.imageDesktop && (
                <img 
                  src={adData.imageDesktop} 
                  alt={adData.title || "Advertisement"} 
                  className={`w-full h-auto object-cover ${adData.imageMobile ? 'hidden sm:block' : 'block'}`}
                />
             )}
             {/* Mobile Image */}
             {adData.imageMobile && (
                <img 
                  src={adData.imageMobile} 
                  alt={adData.title || "Advertisement"} 
                  className={`w-full h-auto object-cover ${adData.imageDesktop ? 'block sm:hidden' : 'block'}`}
                />
             )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
          </a>
        )}

        {/* Content Box */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2 text-center">
            {adData.title && (
              <h3 className="text-xl md:text-2xl font-poppins font-bold text-gray-100 leading-snug">
                {adData.title}
              </h3>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
            {adData.redirectUrl && (
              <a
                href={adData.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="flex-1 max-w-[200px] inline-flex items-center justify-center bg-brand-red text-white text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-brand-red/95 transition-all text-center"
              >
                {adData.buttonText || "Learn More"}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        </div>

        {/* Close Button / Timer */}
        <button
          onClick={handleClose}
          disabled={!canClose}
          className={`absolute top-4 right-4 p-2.5 rounded-full border transition-all z-50 shadow-md ${
            canClose 
              ? 'bg-black/80 hover:bg-brand-red text-white border-white/20 hover:border-brand-red/40 cursor-pointer' 
              : 'bg-black/40 text-gray-400 border-gray-600 cursor-not-allowed'
          }`}
          aria-label="Close Ad"
        >
          {canClose ? <X className="w-4 h-4" /> : <span className="text-xs font-bold w-4 h-4 flex items-center justify-center text-white">{timerCount}</span>}
        </button>
      </div>

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default PopupAdModal;
