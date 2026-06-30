import { useOutletContext } from 'react-router-dom';
import { TrendingUp, Calendar, Globe, Tv, Settings } from 'lucide-react';

const Overview = () => {
  const { dbData } = useOutletContext();

  const stats = [
    { label: 'North America Entries', value: (dbData.northAmericaCollections || []).length, icon: <Globe className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Upcoming Schedules', value: (dbData.upcomingSchedules || []).length, icon: <Calendar className="w-5 h-5" />, color: 'text-green-400' },
    { label: 'Box Office Top 5', value: (dbData.boxOfficeTop5 || []).length, icon: <TrendingUp className="w-5 h-5" />, color: 'text-yellow-400' },
    { label: 'Galleries', value: (dbData.galleries || []).length, icon: <Settings className="w-5 h-5" />, color: 'text-purple-400' },
    { label: 'Articles', value: (dbData.articles || []).length, icon: <Tv className="w-5 h-5" />, color: 'text-pink-400' },
    { label: 'Reviews', value: (dbData.reviews || []).length, icon: <Settings className="w-5 h-5" />, color: 'text-orange-400' },
    { label: 'Box Office Reports', value: (dbData.boxOffice || []).length, icon: <Globe className="w-5 h-5" />, color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-poppins font-bold text-white mb-1">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Quick overview of all database entries</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-[#18181B] rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${stat.color}`}>{stat.icon}</div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-3xl font-poppins font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#18181B] rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-poppins font-bold text-white mb-2">Popup Ad Status</h3>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dbData.popupAd?.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm text-gray-300">{dbData.popupAd?.active ? 'Active' : 'Inactive'}</span>
          {dbData.popupAd?.title && <span className="text-sm text-gray-500 ml-2">— {dbData.popupAd.title}</span>}
        </div>
      </div>
    </div>
  );
};

export default Overview;
