import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getArticles, getReviews, getBoxOfficeTop5, getUpcomingSchedules } from '../../services/api';
import { Calendar, Film, Flame, Star, TrendingUp } from 'lucide-react';

const Sidebar = () => {
  const { data: trendingArticles, refetch: refetchTrending } = useQuery({
    queryKey: ['trending-articles'],
    queryFn: () => getArticles({ limit: 50 }),
    select: (data) => data.data.filter(a => a.tags.includes('Trending')).slice(0, 5), // show top 5 for better layout balance
  });

  const { data: latestReviews, refetch: refetchReviews } = useQuery({
    queryKey: ['latest-reviews'],
    queryFn: getReviews,
    select: (data) => data.slice(0, 4),
  });

  const { data: top5BoxOffice, refetch: refetchTop5 } = useQuery({
    queryKey: ['sidebar-top5'],
    queryFn: getBoxOfficeTop5,
  });

  const { data: upcomingSchedules, refetch: refetchSchedules } = useQuery({
    queryKey: ['sidebar-schedules'],
    queryFn: getUpcomingSchedules,
  });

  // Listen to DB changes for real-time refetching
  useEffect(() => {
    const handleDbChange = () => {
      refetchTrending();
      refetchReviews();
      refetchTop5();
      refetchSchedules();
    };
    window.addEventListener('tolly_db_change', handleDbChange);
    return () => window.removeEventListener('tolly_db_change', handleDbChange);
  }, [refetchTrending, refetchReviews, refetchTop5, refetchSchedules]);

  const popularTags = ['Tollywood', 'Box Office', 'Reviews', 'Interviews', 'Gossips', 'OTT'];

  const getDaysRemainingText = (dateStr, status) => {
    if (status === 'TBA' || !dateStr) return 'TBA';
    const release = new Date(dateStr);
    if (isNaN(release.getTime())) return status || '2026';
    const now = new Date();
    
    // Clear time parts
    release.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    const diffTime = release - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays < 0) return 'Released';
    return `${diffDays} Days`;
  };

  const getVerdictColorClass = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'blockbuster': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
      case 'hit': return 'text-green-500 border-green-500/20 bg-green-500/10';
      case 'flop': return 'text-red-500 border-red-500/20 bg-red-500/10';
      default: return 'text-gray-400 border-gray-700 bg-gray-800/50';
    }
  };

  return (
    <aside className="w-full space-y-8 pb-4">
      {/* Trending Posts */}
      {trendingArticles && trendingArticles.length > 0 && (
        <div className="sw">
          <div className="sw-hdr">
            <div className="live-dot"></div>
            <div className="sw-title">Trending Now</div>
          </div>
          {trendingArticles.map((article, idx) => (
            <Link to={`/movie-news/${article.slug}`} key={article.id} className="pop-item">
              <div className="pop-num">{idx + 1}</div>
              <div>
                <div className="pop-text">{article.title}</div>
                <div className="pop-meta">{new Date(article.date).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Upcoming Schedules (Admin Controlled) */}
      {upcomingSchedules && upcomingSchedules.length > 0 && (
        <div className="sw">
          <div className="sw-hdr">
            <div className="sw-title">Upcoming Releases</div>
          </div>
          {upcomingSchedules.slice(0, 4).map((schedule, idx) => {
            const identifier = schedule.slug || schedule.id;
            return (
              <Link 
                to={identifier ? `/upcoming/${identifier}` : '#'}
                key={schedule.id || idx}
                className="pop-item"
              >
                <div className="pop-num">{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div className="pop-text">{schedule.movieName}</div>
                  <div className="pop-meta">
                    {schedule.language} • {schedule.releaseDate ? new Date(schedule.releaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] uppercase font-bold text-brand-red border border-brand-red/20 px-1.5 py-0.5 rounded bg-brand-red/5">
                    {getDaysRemainingText(schedule.releaseDate, schedule.status)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Popular Tags */}
      <div className="sw">
        <div className="sw-hdr">
          <div className="sw-title">Popular Tags</div>
        </div>
        <div className="tag-cloud">
          {popularTags.map(tag => (
            <Link
              key={tag}
              to={`/movie-news?category=${tag}`}
              className="tag"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
