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

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    if (!forceShow && adData?.displayRule === 'once_per_user') {
      localStorage.setItem('tolly_ad_dismissed', 'true');
    }
    if (!forceShow) {
      navigate('/main');
    }
  }, [forceShow, adData?.displayRule, navigate]);

  const handleSkip = () => {
    if (currentImageIdx < carouselItems.length - 1) {
      setCurrentImageIdx(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    if (!isOpen || carouselItems.length === 0) return;
    
    const durationMs = (currentItem?.timer || 3) * 1000;
    
    const timeout = setTimeout(() => {
      if (currentImageIdx < carouselItems.length - 1) {
        setCurrentImageIdx((prev) => prev + 1);
      } else {
        // Popups completed, automatically close and navigate
        handleClose();
      }
    }, durationMs);

    return () => clearTimeout(timeout);
  }, [currentImageIdx, isOpen, carouselItems.length, currentItem?.timer, handleClose]);

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

  if (!isOpen || isLoading || !adData || carouselItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Full Screen Layout Container */}
      <div className="relative z-50 flex flex-col h-full w-full pointer-events-none">
        
        {/* Top Header Section (Stacked Layout) */}
        {currentItem && (
          <div className="w-full bg-[#0a0f18]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] transform transition-transform duration-500 animate-scale-up pointer-events-auto">
            <div className="max-w-[1200px] mx-auto px-4 py-4 md:py-5 flex flex-col items-center gap-4">
              
              {/* Row 1: Logo */}
              <div className="text-center w-full">
                <span className="text-2xl md:text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px', color: '#F0EDE8' }}>
                  Chitram<span style={{ color: '#F5C842' }}>Bhalare</span>
                </span>
              </div>
              
              {/* Row 2: Actions Row */}
              <div className="flex items-center justify-center gap-4 md:gap-6 w-full">
                {currentItem.redirectUrl && (
                  <a href={currentItem.redirectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-6 py-2 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red font-bold text-sm hover:bg-brand-red hover:text-white transition-all duration-300 shadow-[0_0_15px_-3px_rgba(220,38,38,0.3)]">
                    Click to watch <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                
                <button 
                  onClick={handleSkip}
                  className="flex items-center justify-center gap-1.5 px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-brand-red hover:to-red-600 text-white shadow-lg border border-white/10"
                  aria-label="Skip Ad"
                >
                  <X className="w-4 h-4" /> 
                  Skip Ad
                </button>
              </div>

              {/* Row 3: Timer Message */}
              {!canClose && timerCount > 0 && (
                <div className="flex justify-center items-center text-center mt-1">
                  <span className="text-gray-400 font-medium text-sm tracking-wide bg-white/5 px-5 py-2 rounded-full border border-white/10 shadow-inner flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                    The page will load in <span className="text-brand-red font-bold text-base">{timerCount}</span> seconds
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center Image Section */}
        {currentItem && (
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 w-full transform transition-all duration-500 animate-scale-up pointer-events-none">
            <a href={currentItem.redirectUrl || "https://www.m9.news/"} target="_blank" rel="noopener noreferrer" className="block relative max-w-5xl w-full flex justify-center items-center group rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 bg-black/40 pointer-events-auto">
              <img 
                src={currentItem.imageUrl} 
                alt="Advertisement" 
                className="w-full h-auto max-h-[75vh] object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </a>
          </div>
        )}
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
