import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'brand-red', subtitle }) => {
  const colorMap = {
    'brand-red': { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', shadow: 'shadow-red-500/5' },
    'blue': { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', shadow: 'shadow-blue-500/5' },
    'green': { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', shadow: 'shadow-green-500/5' },
    'purple': { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', shadow: 'shadow-purple-500/5' },
    'orange': { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', shadow: 'shadow-orange-500/5' },
    'cyan': { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20', shadow: 'shadow-cyan-500/5' },
    'pink': { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/20', shadow: 'shadow-pink-500/5' },
    'yellow': { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', shadow: 'shadow-yellow-500/5' },
  };

  const c = colorMap[color] || colorMap['brand-red'];

  return (
    <div className={`bg-[#18181B] rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-all duration-300 hover:shadow-xl ${c.shadow} group`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-500/10 text-green-500' :
            trend === 'down' ? 'bg-red-500/10 text-red-500' :
            'bg-gray-500/10 text-gray-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-poppins font-bold text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{title}</p>
      {subtitle && <p className="text-[10px] text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatsCard;
