import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import { getPopupAd } from '../../services/api';

const PopupAdModal = ({ forceShow = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: adData, isLoading } = useQuery({
    queryKey: ['popupAd'],
    queryFn: getPopupAd,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [timerCount, setTimerCount] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const carouselItems = adData?.carouselItems?.length > 0 
    ? adData.carouselItems 
    : [];

  const currentItem = carouselItems[currentImageIdx];

  useEffect(() => {
    if (!isOpen || carouselItems.length === 0) return;
    const durationMs = (currentItem?.timer || 3) * 1000;
    
    const timeout = setTimeout(() => {
      setCurrentImageIdx((prev) => (prev + 1) % carouselItems.length);
    }, durationMs);

    return () => clearTimeout(timeout);
  }, [currentImageIdx, isOpen, carouselItems.length, currentItem?.timer]);

  useEffect(() => {
    if (isLoading) return;
    
    if (!adData || !adData.active || (carouselItems.length === 0 && !forceShow)) {
      if (location.pathname === '/') {
        navigate('/main', { replace: true });
      }
      return;
    }

    if (forceShow) {
      setIsOpen(true);
      setCanClose(true);
      return;
    }

    // Check Scheduling
    if (!forceShow) {
      const now = new Date().getTime();
      if (adData.scheduleStart && now < new Date(adData.scheduleStart).getTime()) {
        if (location.pathname === '/') navigate('/main', { replace: true });
        return;
      }
      if (adData.scheduleEnd && now > new Date(adData.scheduleEnd).getTime()) {
        if (location.pathname === '/') navigate('/main', { replace: true });
        return;
      }
    }

    const dismissed = localStorage.getItem('tolly_ad_dismissed');
    if (adData.displayRule === 'once_per_user') {
      if (dismissed === 'true') {
        if (location.pathname === '/') {
          navigate('/main', { replace: true });
        }
        return;
      }
    }

    // Process Delay
    const delayMs = forceShow ? 0 : (adData.displayDelay || 0) * 1000;
    
    const delayTimer = setTimeout(() => {
      setIsOpen(true);
      
      // Setup Close Timer Logic
      const closeSecs = adData.closeTimer || 5; // default 5s
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
              setIsOpen(false);
              if (adData.displayRule === 'once_per_user') {
                localStorage.setItem('tolly_ad_dismissed', 'true');
              }
              if (location.pathname === '/') navigate('/main', { replace: true });
            }
          }
        }, 1000);
      } else {
        setCanClose(true);
      }

    }, delayMs);

    return () => clearTimeout(delayTimer);
  }, [adData, isLoading, forceShow, carouselItems.length, location.pathname, navigate]);

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
    if (!forceShow && location.pathname === '/') {
      navigate('/main');
    }
  };

  if (!isOpen || isLoading || !adData || carouselItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="wrap relative pointer-events-none z-50 flex items-center justify-center h-full w-full">
        <div className="relative w-full bg-[#131a2b] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 animate-scale-up pointer-events-auto">
        
        {/* Banner Image */}
        {currentItem && (
          <a href={currentItem.redirectUrl || "https://www.m9.news/"} target="_blank" rel="noopener noreferrer" className="block relative w-full overflow-hidden min-h-[400px] md:min-h-[600px]">
            <img 
              src={currentItem.imageUrl} 
              alt="Advertisement" 
              className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
          </a>
        )}

        {/* Content Box */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="space-y-3 text-center">
            {currentItem.title && (
              <h3 className="text-xl md:text-2xl lg:text-3xl font-poppins font-bold text-white leading-snug">
                {currentItem.title}
              </h3>
            )}
            {currentItem.description && (
              <p className="text-gray-400 text-sm md:text-base whitespace-pre-line">
                {currentItem.description}
              </p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all z-50 shadow-md bg-black/80 hover:bg-brand-red text-white border-white/20 hover:border-brand-red/40 cursor-pointer"
          aria-label="Close Ad"
        >
          {!canClose && timerCount > 0 && <span className="text-xs font-bold pl-1">{timerCount}s</span>}
          <X className="w-4 h-4" />
        </button>
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

export default PopupAdModal;
