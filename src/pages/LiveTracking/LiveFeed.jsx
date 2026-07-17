import React from 'react';

const LiveFeed = ({ topic }) => {
  const getTagStyle = (category) => {
    const lower = (category || '').toLowerCase();
    if (lower.includes('verdict')) return 'bg-[#2e2509] text-[#e5b842]';
    if (lower.includes('audience')) return 'bg-[#1f242e] text-[#9ca3af]';
    if (lower.includes('update')) return 'bg-[#3b1115] text-[#ef4444]';
    if (lower.includes('box office')) return 'bg-[#1f242e] text-green-400';
    return 'bg-[#1f242e] text-gray-300';
  };

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  if (!topic) return null;

  // The timelineEvents is an array of event objects. We sort them by date (newest first).
  const events = (topic.timelineEvents || []).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="mt-12 pt-8 mb-8">
      <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-10" style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
        LIVE FEED
      </h2>
      
      <div className="relative ml-2 sm:ml-4">
        {/* The main vertical line */}
        <div className="absolute top-2 bottom-0 left-[6px] w-[1px] bg-[#3b1115]" />
        
        {events.length === 0 ? (
          <div className="pl-8 text-gray-500">No live updates currently available for this topic.</div>
        ) : (
          events.map((item, index) => {
            const isFirst = index === 0;
            return (
              <div key={item.id} className="mb-14 relative pl-10">
                {/* Timeline Dot */}
                <div 
                  className={`absolute left-[0px] top-1.5 w-[13px] h-[13px] rounded-full z-10 bg-[#0d0d0d] flex items-center justify-center`} 
                >
                  {isFirst ? (
                    <div className="w-[13px] h-[13px] bg-[#ef4444] rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
                  ) : (
                    <div className="w-[9px] h-[9px] bg-transparent border-[2px] border-[#3b1115] rounded-full" />
                  )}
                </div>

                {/* Header (Tag & Timestamp) */}
                <div className="flex items-center gap-4 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm ${getTagStyle(item.category)}`}>
                    {item.category || 'UPDATE'}
                  </span>
                  <span className="text-[#6b7280] text-sm font-medium">{formatTime(item.date)}</span>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                
                {/* Content */}
                <div 
                  className="text-[#d1d5db] text-base leading-relaxed pr-4 prose prose-invert max-w-none prose-p:my-2 prose-a:text-[#ef4444] hover:prose-a:text-red-400 prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
