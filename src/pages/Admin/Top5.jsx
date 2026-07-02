import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { Save, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const verdictOptions = ['Hit', 'Super Hit', 'Blockbuster', 'Average', 'Flop', 'Disaster'];
const trendOptions = ['up', 'down', 'stable'];

const Top5 = () => {
  const { dbData, setDbData, triggerNotification } = useOutletContext();

  const defaultTop5 = Array.from({ length: 5 }, (_, i) => ({
    rank: i + 1,
    movieName: '',
    gross: '',
    verdict: 'Hit',
    trend: 'stable',
    ...(dbData.boxOfficeTop5?.[i] || {}),
  }));

  const [list, setList] = useState(defaultTop5);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (rank, field, value) => {
    setList(l => l.map(item => item.rank === rank ? { ...item, [field]: value } : item));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post('/api/box-office-top5', list);
      setDbData(d => ({ ...d, boxOfficeTop5: list }));
      window.dispatchEvent(new Event('tolly_db_change'));
      triggerNotification('Box Office Top 5 saved!');
    } catch {
      triggerNotification('Failed to save.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-poppins font-bold text-white mb-1">Box Office Top 5</h2>
        <p className="text-gray-500 text-sm">Weekly top 5 box office rankings</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {list.map(item => (
          <div key={item.rank} className="bg-[#18181B] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {item.rank}
              </div>
              <TrendIcon trend={item.trend} />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Rank #{item.rank}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Movie Name</label>
                <input
                  type="text"
                  value={item.movieName ?? ''}
                  onChange={e => handleChange(item.rank, 'movieName', e.target.value)}
                  placeholder="e.g. Pushpa 2"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gross Collection</label>
                <input
                  type="text"
                  value={item.gross ?? ''}
                  onChange={e => handleChange(item.rank, 'gross', e.target.value)}
                  placeholder="e.g. ₹12.5 Cr"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Verdict</label>
                <select
                  value={item.verdict ?? 'Hit'}
                  onChange={e => handleChange(item.rank, 'verdict', e.target.value)}
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                >
                  {verdictOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Trend</label>
                <select
                  value={item.trend ?? 'stable'}
                  onChange={e => handleChange(item.rank, 'trend', e.target.value)}
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                >
                  {['up', 'down', 'stable'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Opening Collection</label>
                <input
                  type="text"
                  value={item.openingCollection ?? ''}
                  onChange={e => handleChange(item.rank, 'openingCollection', e.target.value)}
                  placeholder="e.g. ₹5 Cr"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Weekend Collection</label>
                <input
                  type="text"
                  value={item.weekendCollection ?? ''}
                  onChange={e => handleChange(item.rank, 'weekendCollection', e.target.value)}
                  placeholder="e.g. ₹15 Cr"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Collection</label>
                <input
                  type="text"
                  value={item.totalCollection ?? ''}
                  onChange={e => handleChange(item.rank, 'totalCollection', e.target.value)}
                  placeholder="e.g. ₹25 Cr"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Territory</label>
                <input
                  type="text"
                  value={item.territory ?? ''}
                  onChange={e => handleChange(item.rank, 'territory', e.target.value)}
                  placeholder="e.g. Worldwide"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Last Updated</label>
                <input
                  type="text"
                  value={item.lastUpdated ?? ''}
                  onChange={e => handleChange(item.rank, 'lastUpdated', e.target.value)}
                  placeholder="e.g. 10 Mins ago"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-brand-red/20"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Top 5
        </button>
      </form>
    </div>
  );
};

export default Top5;
