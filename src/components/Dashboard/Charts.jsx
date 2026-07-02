import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#D42B2B', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#18181B] border border-gray-800 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export const VisitorsAreaChart = ({ data }) => (
  <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
    <h3 className="text-sm font-bold text-white mb-4">Visitor Traffic</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D42B2B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D42B2B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="visitors" stroke="#D42B2B" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const ContentBarChart = ({ data }) => (
  <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
    <h3 className="text-sm font-bold text-white mb-4">Content Published</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="articles" fill="#D42B2B" radius={[4, 4, 0, 0]} name="Articles" />
          <Bar dataKey="reviews" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Reviews" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const CategoryPieChart = ({ data }) => (
  <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
    <h3 className="text-sm font-bold text-white mb-4">Content Distribution</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const PageViewsLineChart = ({ data }) => (
  <div className="bg-[#18181B] rounded-2xl border border-gray-800 p-6">
    <h3 className="text-sm font-bold text-white mb-4">Page Views Trend</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="unique" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 3 }} activeDot={{ r: 5 }} />
          <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);
