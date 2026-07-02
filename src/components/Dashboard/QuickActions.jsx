import { useNavigate } from 'react-router-dom';
import { PenLine, Star, Image as ImageIcon, Film, Calendar, Globe, Upload, BarChart3 } from 'lucide-react';

const actions = [
  { label: 'New Article', icon: PenLine, path: '/admin/articles', color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
  { label: 'New Review', icon: Star, path: '/admin/reviews', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
  { label: 'Upload Gallery', icon: ImageIcon, path: '/admin/galleries', color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
  { label: 'Box Office', icon: Film, path: '/admin/box-office', color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' },
  { label: 'Schedule', icon: Calendar, path: '/admin/schedules', color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' },
  { label: 'NA Collections', icon: Globe, path: '/admin/north-america', color: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20' },
  { label: 'Media Library', icon: Upload, path: '/admin/media', color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20' },
  { label: 'SEO Settings', icon: BarChart3, path: '/admin/settings', color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
      <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent ${action.color} transition-all duration-300 hover:scale-105 hover:border-gray-700`}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
