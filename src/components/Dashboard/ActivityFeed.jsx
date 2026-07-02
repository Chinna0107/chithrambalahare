import { Clock, FileText, Star, Image as ImageIcon, Film, Globe, Settings, User } from 'lucide-react';

const iconMap = {
  article: FileText,
  review: Star,
  gallery: ImageIcon,
  'box-office': Film,
  'north-america': Globe,
  settings: Settings,
  default: Clock,
};

const colorMap = {
  published: 'bg-green-500',
  updated: 'bg-blue-500',
  deleted: 'bg-red-500',
  created: 'bg-purple-500',
  default: 'bg-gray-500',
};

const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-brand-red" />
        Recent Activity
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity, i) => {
            const Icon = iconMap[activity.type] || iconMap.default;
            const dotColor = colorMap[activity.action] || colorMap.default;
            return (
              <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="relative mt-0.5">
                  <div className={`w-8 h-8 rounded-lg ${activity.color || 'bg-gray-800'} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${dotColor} border-2 border-[#18181B]`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200">
                    <span className="font-bold text-white">{activity.user || 'Admin'}</span>{' '}
                    {activity.action || 'performed an action'}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{activity.time || 'Just now'}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
