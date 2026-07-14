import { Link as LinkIcon, Share2 } from 'lucide-react';
import { useState } from 'react';

const ShareWidget = ({ title, url, image, shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Use the backend share URL (with OG tags) for social platforms
  // Fall back to article URL, then current page
  const PROD_SHARE_URL = shareUrl || url || window.location.href;
  // For copy-to-clipboard, use the article URL directly
  const ARTICLE_URL = url || window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(ARTICLE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        setIsSharing(true);
        await navigator.share({
          title: title,
          text: title,
          // Use the backend share URL so WhatsApp/etc scrapes OG image+title
          url: PROD_SHARE_URL
        });
      }
    } catch (err) {
      console.log('Error sharing:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex items-center space-x-3 my-8 py-6 border-y border-brand-red/10">
      <div className="flex items-center text-gray-300 font-poppins font-bold mr-4">
        <span className="text-brand-red mr-2">Share:</span>
      </div>
      
      <a 
        href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(PROD_SHARE_URL)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all hover:scale-110 shadow-sm"
        aria-label="Share on Facebook"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(PROD_SHARE_URL)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all hover:scale-110 shadow-sm"
        aria-label="Share on Twitter"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
      </a>

      <a 
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + "\n" + PROD_SHARE_URL)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all hover:scale-110 shadow-sm"
        aria-label="Share on WhatsApp"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.386 0 12.032c0 2.128.553 4.204 1.604 6.034L.145 23.4l5.485-1.439a11.977 11.977 0 006.4 1.838h.005c6.645 0 12.03-5.387 12.03-12.033 0-3.221-1.255-6.251-3.535-8.531C18.251 1.255 15.221 0 12.031 0zm0 21.832h-.005a9.982 9.982 0 01-5.088-1.385l-.365-.217-3.782.992.998-3.69-.238-.378A9.957 9.957 0 011.996 12.03c0-5.54 4.509-10.05 10.04-10.05 2.684 0 5.205 1.045 7.1 2.941a10.016 10.016 0 012.937 7.111c-.001 5.541-4.51 10.051-10.042 10.051zm5.503-7.518c-.302-.151-1.785-.881-2.062-.981-.277-.101-.479-.151-.68.151-.201.302-.78 1.002-.957 1.203-.176.202-.352.227-.654.076-.302-.151-1.274-.469-2.428-1.5-.9-.803-1.507-1.794-1.684-2.096-.176-.302-.019-.465.132-.616.136-.136.302-.352.453-.529.151-.176.201-.302.302-.503.1-.202.05-.378-.025-.529-.076-.151-.68-1.637-.93-2.242-.244-.59-.493-.51-.68-.52-.175-.01-.377-.01-.579-.01-.201 0-.529.076-.805.378-.277.302-1.057 1.033-1.057 2.518 0 1.485 1.082 2.92 1.233 3.121.151.202 2.131 3.254 5.161 4.561 2.235.962 2.981 1.066 4.011 1.012 1.139-.06 3.528-1.442 4.02-2.836.492-1.394.492-2.593.342-2.845-.151-.252-.553-.402-.855-.553z"/></svg>
      </a>

      {navigator.share && (
        <button 
          onClick={handleNativeShare}
          disabled={isSharing}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${isSharing ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white hover:scale-110'}`}
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
      
      <button 
        onClick={handleCopy}
        className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 hover:bg-brand-red hover:text-white transition-all hover:scale-110 shadow-sm relative group"
        aria-label="Copy Link"
      >
        <LinkIcon className="w-4 h-4" />
        {copied && (
          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
};

export default ShareWidget;
