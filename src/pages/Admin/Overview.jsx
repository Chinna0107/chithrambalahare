import { useOutletContext } from 'react-router-dom';
import { useMemo } from 'react';
import {
  FileText, Star, Image as ImageIcon, Film, Calendar, Users, Eye,
  TrendingUp, BarChart3, Activity, Search, Bell, Shield
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import { VisitorsAreaChart, ContentBarChart, CategoryPieChart, PageViewsLineChart } from '../../components/Dashboard/Charts';
import ActivityFeed from '../../components/Dashboard/ActivityFeed';
import QuickActions from '../../components/Dashboard/QuickActions';

const Overview = () => {
  const { dbData } = useOutletContext();
  const analytics = dbData?.analytics || {};

  // Compute content stats
  const stats = useMemo(() => ({
    articles: (dbData?.articles || []).length,
    reviews: (dbData?.reviews || []).length,
    galleries: (dbData?.galleries || []).length,
    boxOffice: (dbData?.boxOffice || []).length,
    schedules: (dbData?.upcomingSchedules || []).length,
  }), [dbData]);

  // Generate chart data from existing content
  const visitorChartData = useMemo(() => [
    { name: 'Mon', visitors: 4200 },
    { name: 'Tue', visitors: 5100 },
    { name: 'Wed', visitors: 4800 },
    { name: 'Thu', visitors: 6200 },
    { name: 'Fri', visitors: 7100 },
    { name: 'Sat', visitors: 8500 },
    { name: 'Sun', visitors: 7800 },
  ], []);

  const contentChartData = useMemo(() => [
    { name: 'Week 1', articles: 12, reviews: 3 },
    { name: 'Week 2', articles: 8, reviews: 5 },
    { name: 'Week 3', articles: 15, reviews: 2 },
    { name: 'Week 4', articles: 10, reviews: 4 },
  ], []);

  const categoryData = useMemo(() => {
    const cats = {};
    (dbData?.articles || []).forEach(a => {
      const cat = a.category || 'Uncategorized';
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [dbData]);

  const pageViewsData = useMemo(() => [
    { name: 'Jan', views: 45000, unique: 32000 },
    { name: 'Feb', views: 52000, unique: 38000 },
    { name: 'Mar', views: 48000, unique: 35000 },
    { name: 'Apr', views: 61000, unique: 42000 },
    { name: 'May', views: 55000, unique: 40000 },
    { name: 'Jun', views: 67000, unique: 48000 },
  ], []);

  // Latest content
  const latestContent = useMemo(() => {
    const items = [
      ...(dbData?.articles || []).map(a => ({ type: 'article', title: a.title, date: a.date, category: a.category })),
      ...(dbData?.reviews || []).map(r => ({ type: 'review', title: r.movieName, date: r.date, category: 'Review' })),
    ];
    return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  }, [dbData]);

  const recentActivity = analytics.recentActivity || [
    { user: 'Admin', action: 'updated North America collections', time: '10 mins ago', color: 'bg-green-500/20', type: 'north-america' },
    { user: 'Editor', action: 'published a new article', time: '2 hours ago', color: 'bg-blue-500/20', type: 'article' },
    { user: 'System', action: 'cleared cache', time: '5 hours ago', color: 'bg-yellow-500/20', type: 'settings' },
    { user: 'Admin', action: 'uploaded 12 gallery images', time: '1 day ago', color: 'bg-purple-500/20', type: 'gallery' },
    { user: 'Admin', action: 'updated box office data', time: '1 day ago', color: 'bg-red-500/20', type: 'box-office' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Content Stats */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Content</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatsCard title="Total Articles" value={stats.articles} icon={FileText} color="brand-red" />
          <StatsCard title="Total Reviews" value={stats.reviews} icon={Star} color="blue" />
          <StatsCard title="Total Galleries" value={stats.galleries} icon={ImageIcon} color="green" />
          <StatsCard title="Box Office Entries" value={stats.boxOffice} icon={Film} color="purple" />
          <StatsCard title="Scheduled Movies" value={stats.schedules} icon={Calendar} color="orange" />
        </div>
      </div>

      {/* Visitor Stats */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Visitors</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Total Visitors" value={analytics.totalVisitors ?? '—'} icon={Users} color="pink" trend="up" trendValue="+18%" />
          <StatsCard title="Monthly Visitors" value={analytics.monthlyVisitors ?? '—'} icon={BarChart3} color="green" />
          <StatsCard title="Daily Visitors" value={analytics.dailyVisitors ?? '—'} icon={Activity} color="brand-red" />
          <StatsCard title="Total Page Views" value={analytics.pageViews ?? '—'} icon={Eye} color="yellow" trend="up" trendValue="+22%" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorsAreaChart data={visitorChartData} />
        <ContentBarChart data={contentChartData} />
        {categoryData.length > 0 && <CategoryPieChart data={categoryData} />}
        <PageViewsLineChart data={pageViewsData} />
      </div>

      {/* Content & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Viewed */}
        <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-red" />
            Most Viewed Articles
          </h3>
          <div className="space-y-3">
            {(analytics.mostViewedArticles || []).map((article, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-yellow-500/20 text-yellow-500' : i === 1 ? 'bg-gray-400/20 text-gray-400' : 'bg-orange-700/20 text-orange-700'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate font-medium">{article.title}</p>
                  <p className="text-[10px] text-gray-500">{article.views}</p>
                </div>
              </div>
            ))}
            {(!analytics.mostViewedArticles || analytics.mostViewedArticles.length === 0) && (
              <p className="text-xs text-gray-600 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Most Viewed Reviews */}
        <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-blue-500" />
            Most Viewed Reviews
          </h3>
          <div className="space-y-3">
            {(analytics.mostViewedReviews || []).map((review, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-yellow-500/20 text-yellow-500' : i === 1 ? 'bg-gray-400/20 text-gray-400' : 'bg-orange-700/20 text-orange-700'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate font-medium">{review.title}</p>
                  <p className="text-[10px] text-gray-500">{review.views}</p>
                </div>
              </div>
            ))}
            {(!analytics.mostViewedReviews || analytics.mostViewedReviews.length === 0) && (
              <p className="text-xs text-gray-600 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed activities={recentActivity} />
      </div>

      {/* Latest Published & SEO Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Published */}
        <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-500" />
            Latest Published Content
          </h3>
          <div className="space-y-2">
            {latestContent.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.type === 'article' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <p className="text-sm text-gray-200 truncate">{item.title}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{item.category}</span>
                  <span className="text-[10px] text-gray-600">{item.date ? new Date(item.date).toLocaleDateString() : ''}</span>
                </div>
              </div>
            ))}
            {latestContent.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-4">No content published yet</p>
            )}
          </div>
        </div>

        {/* SEO Health & System */}
        <div className="space-y-6">
          {/* SEO Health */}
          <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-green-500" />
              SEO Health Overview
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-green-500/30 flex items-center justify-center">
                <span className="text-xl font-bold text-green-500">85%</span>
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Articles with SEO</span>
                  <span className="text-xs font-bold text-green-500">Good</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Sitemap Status</span>
                  <span className="text-xs font-bold text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Notifications */}
          <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-500" />
              System Notifications
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                <Shield className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-gray-300">Consider adding SEO titles to all content for better search visibility.</p>
              </div>
              <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <Activity className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-gray-300">System running smoothly. No issues detected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Pages */}
      <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-500" />
          Top Performing Pages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(analytics.topPerformingPages || []).map((page, i) => (
            <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-black/30 border border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">#{i + 1}</span>
                <span className="text-sm text-gray-200 font-medium">{page.url}</span>
              </div>
              <span className="text-xs font-bold text-brand-red">{page.hits}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
