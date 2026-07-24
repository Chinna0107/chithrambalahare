import React, { useEffect } from 'react';

const AdSense = ({ 
  dataAdSlot, 
  dataAdFormat = 'auto', 
  dataFullWidthResponsive = 'true', 
  className = '',
  style = { display: 'block' } 
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Only render if slot ID is provided. If you're using Auto Ads, you don't even need this component!
  if (!dataAdSlot) return null;

  return (
    <div className={`adsense-container my-6 w-full flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-9301508447872685"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  );
};

export default AdSense;
