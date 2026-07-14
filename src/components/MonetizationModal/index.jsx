import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import { getPopupAd } from '../../services/api';

const MonetizationModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: adData, isLoading } = useQuery({
    queryKey: ['popupAd'],
    queryFn: getPopupAd,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [timerCount, setTimerCount] = useState(0);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    if (adData?.displayRule === 'once_per_user') {
      localStorage.setItem('tolly_monetization_dismissed', 'true');
    }
  }, [adData?.displayRule]);

  useEffect(() => {
    if (isLoading) return;
    
    // We only show this if the site popup is active, and there's a desktop or mobile image.
    if (!adData || !adData.active || (!adData.imageDesktop && !adData.imageMobile)) {
      return;
    }

    // We only show this on the main page
    if (location.pathname !== '/main') {
      return;
    }

    // Check Scheduling
    const now = new Date().getTime();
    if (adData.scheduleStart && now < new Date(adData.scheduleStart).getTime()) return;
    if (adData.scheduleEnd && now > new Date(adData.scheduleEnd).getTime()) return;

    // Check Display Rule
    const dismissed = localStorage.getItem('tolly_monetization_dismissed');
    if (adData.displayRule === 'once_per_user' && dismissed === 'true') {
      return;
    }

    // Process Delay
    const delayMs = (adData.displayDelay || 0) * 1000;
    
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
            if (adData.autoClose) {
              handleClose();
            }
          }
        }, 1000);
      } else {
        setCanClose(true);
      }

    }, delayMs);

    return () => clearTimeout(delayTimer);
  }, [adData, isLoading, location.pathname, handleClose]);

  if (!isOpen || isLoading || !adData) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Ad Container */}
      <div className="relative z-50 flex flex-col pointer-events-none max-w-5xl w-full mx-4">
        
        {/* Top Header Actions */}
        <div className="flex items-center justify-between gap-4 mb-3 pointer-events-auto w-full">
          <div className="flex items-center gap-4">
            {adData.title && (
              <div className="text-white font-bold text-sm md:text-base bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                {adData.title}
              </div>
            )}
            {!canClose && timerCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                <span className="text-gray-300 font-medium text-xs md:text-sm">You can skip in</span>
                <span className="text-brand-red font-bold text-sm md:text-base">{timerCount}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {adData.redirectUrl && (
              <a href={adData.redirectUrl} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-red/90 text-white font-bold text-sm hover:bg-brand-red transition-all duration-300 shadow-lg">
                View Offer <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            
            <button 
              onClick={handleClose}
              disabled={!canClose}
              className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg border border-white/10 ${canClose ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white' : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'}`}
              aria-label="Close Ad"
            >
              <X className="w-4 h-4" /> 
              {canClose ? 'Close' : 'Wait...'}
            </button>
          </div>
        </div>

        {/* Center Image Section */}
        <div className="flex-1 flex items-center justify-center w-full transform transition-all duration-500 animate-scale-up pointer-events-auto">
          <a href={adData.redirectUrl || "#"} target="_blank" rel="noopener noreferrer" className="relative max-w-5xl w-full flex justify-center items-center group rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 bg-black/40 mx-auto">
            
            {/* Desktop Image */}
            {adData.imageDesktop && (
              <img 
                src={adData.imageDesktop} 
                alt={adData.title || "Advertisement"} 
                className={`max-w-full w-auto h-auto max-h-[75vh] object-contain transition-transform duration-700 group-hover:scale-105 mx-auto ${adData.imageMobile ? 'hidden md:block' : 'block'}`}
              />
            )}
            
            {/* Mobile Image */}
            {adData.imageMobile && (
              <img 
                src={adData.imageMobile} 
                alt={adData.title || "Advertisement"} 
                className={`max-w-full w-auto h-auto max-h-[75vh] object-contain transition-transform duration-700 group-hover:scale-105 mx-auto ${adData.imageDesktop ? 'block md:hidden' : 'block'}`}
              />
            )}

            {!adData.imageDesktop && !adData.imageMobile && (
              <div className="p-12 text-center text-gray-500">
                <p>Advertisement Content Missing</p>
              </div>
            )}
            
          </a>
        </div>
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

export default MonetizationModal;
