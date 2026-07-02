import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Settings, Tv, Globe, Calendar, TrendingUp, RotateCcw, AlertTriangle, Loader2, X, Check, Image as ImageIcon,
  Tags, LayoutTemplate, DollarSign, MessageSquare
} from 'lucide-react';

const AdminLayout = () => {
  const [dbData, setDbData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const loadDb = useCallback(async () => {
    const response = await axios.get('/api/db');
    if (typeof response.data === 'string') {
      throw new Error('Invalid backend response');
    }
    return response.data;
  }, []);

  // Run auth check ONCE on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedCode = sessionStorage.getItem('tolly_admin_passcode');
      if (!storedCode) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      try {
        const data = await loadDb();
        setDbData(data);
        setIsAuthenticated(true);
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem('tolly_admin_passcode');
        }
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [loadDb]);

  // Redirect to /admin/overview after authentication
  useEffect(() => {
    if (isAuthenticated && dbData && (location.pathname === '/admin' || location.pathname === '/admin/')) {
      navigate('/admin/overview', { replace: true });
    }
  }, [isAuthenticated, dbData, location.pathname, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setIsSubmitting(true);
    setAuthError('');
    sessionStorage.setItem('tolly_admin_passcode', passcode);
    try {
      const data = await loadDb();
      setDbData(data);
      setIsAuthenticated(true);
      navigate('/admin/overview', { replace: true });
    } catch (err) {
      setAuthError('Invalid passcode. Access Denied.');
      sessionStorage.removeItem('tolly_admin_passcode');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('tolly_admin_passcode');
    setIsAuthenticated(false);
    setDbData(null);
    setPasscode('');
    navigate('/admin', { replace: true });
  };

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetDatabase = async () => {
    if (window.confirm('CRITICAL WARNING: This will WIPE the current database and reset it to default empty state! Are you absolutely sure?')) {
      if (window.prompt('Type "RESET" to confirm') === 'RESET') {
        try {
          await axios.post('/api/db/reset');
          const data = await loadDb();
          setDbData(data);
          window.dispatchEvent(new Event('tolly_db_change'));
          triggerNotification('Database has been factory reset.', 'warning');
        } catch (err) {
          triggerNotification('Failed to reset database.', 'error');
        }
      }
    }
  };

  // Loading spinner while checking auth
  if (isLoading) {
    return <div className="min-h-screen bg-brand-bg flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <Helmet><title>Admin Login - Tolly</title></Helmet>
        <div className="max-w-md w-full bg-[#18181B] rounded-2xl border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-orange-500 to-brand-red"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-poppins font-bold text-white tracking-tight mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Enter your passcode to access the database management dashboard.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            
            {authError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-red/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!dbData) return <div className="min-h-screen bg-brand-bg flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>;

  const tabs = [
    { id: 'overview', icon: <TrendingUp className="w-5 h-5" />, label: 'Dashboard Overview' },
    { id: 'north-america', icon: <Globe className="w-5 h-5" />, label: 'North America' },
    { id: 'schedules', icon: <Calendar className="w-5 h-5" />, label: 'Schedules' },
    { id: 'top5', icon: <TrendingUp className="w-5 h-5" />, label: 'Box Office Top 5' },
    { id: 'box-office', icon: <Globe className="w-5 h-5" />, label: 'Box Office Detail' },
    { id: 'articles', icon: <Tv className="w-5 h-5" />, label: 'Articles' },
    { id: 'reviews', icon: <Settings className="w-5 h-5" />, label: 'Reviews' },
    { id: 'galleries', icon: <ImageIcon className="w-5 h-5" />, label: 'Galleries' },
    // { id: 'media', icon: <ImageIcon className="w-5 h-5" />, label: 'Media Library' },
    // { id: 'taxonomy', icon: <Tags className="w-5 h-5" />, label: 'Categories & Tags' },
    // { id: 'landing-page', icon: <LayoutTemplate className="w-5 h-5" />, label: 'Landing Page' },
    { id: 'monetization', icon: <DollarSign className="w-5 h-5" />, label: 'Ad & Monetization' },
    { id: 'popup', icon: <Globe className="w-5 h-5" />, label: 'Popup Ad Settings' },
    // { id: 'comments', icon: <MessageSquare className="w-5 h-5" />, label: 'Comments' },
    // { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Global Settings' }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200">
      <Helmet><title>Admin Dashboard - Tolly</title></Helmet>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-brand-red/20">
              T
            </div>
            <h1 className="text-xl font-poppins font-bold text-white tracking-tight">Admin Dashboard</h1>
            <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-2">
              Live
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 border-r border-gray-800 bg-[#121214] flex-shrink-0">
          <nav className="p-4 space-y-2 mt-4">
            {tabs.map(tab => (
              <NavLink
                key={tab.id}
                to={`/admin/${tab.id}`}
                className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-poppins font-bold text-sm transition-all duration-300 border border-transparent ${
                  isActive ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'bg-brand-gray text-gray-400 hover:bg-brand-surface hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </NavLink>
            ))}
          </nav>

          {/* <div className="p-4 mt-auto border-t bo
          rder-gray-800">
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <h4 className="text-red-500 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Danger Zone
              </h4>
              <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                Factory reset will wipe all current database values.
              </p>
              <button
                onClick={handleResetDatabase}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Database
              </button>
            </div>
          </div> */}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 lg:p-10 lg:pl-12 max-w-7xl relative">
          <Outlet context={{ dbData, setDbData, triggerNotification, loadDb }} />
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-[#18181B] border border-gray-800 shadow-2xl rounded-xl p-4 pr-12 animate-slide-up z-50 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            notification.type === 'success' ? 'bg-green-500/20 text-green-500' :
            notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-bold text-gray-200">{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
