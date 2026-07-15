import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search as SearchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '../../services/api';
import axios from 'axios';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(q);
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const { data: movieData, isLoading: isLoadingMovies } = useQuery({
    queryKey: ['articles', { search: q }],
    queryFn: () => getArticles({ search: q, limit: 20 }),
    enabled: !!q,
  });

  const { data: teluguData, isLoading: isLoadingTelugu } = useQuery({
    queryKey: ['telugu-news', { search: q }],
    queryFn: async () => {
      const res = await axios.get('/api/telugu-news', { params: { search: q, limit: 20 } });
      return res.data;
    },
    enabled: !!q,
  });

  const isLoading = isLoadingMovies || isLoadingTelugu;
  const movieResults = movieData?.data || [];
  const teluguResults = (Array.isArray(teluguData) ? teluguData : teluguData?.data || []).filter(n => !n.status || n.status === 'published');
  
  const allResults = [...movieResults, ...teluguResults].sort((a, b) => new Date(b.date) - new Date(a.date));


  return (
    <div className="wrap py-20 flex flex-col items-center min-h-[60vh]">
      <Helmet>
        <title>Search | CHITRAMBHALARE</title>
      </Helmet>
      
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-poppins font-bold text-gray-100 mb-6">Search CHITRAMBHALARE</h1>
        <p className="text-gray-100/60 mb-8 font-inter">Find the latest news, reviews, and box office updates.</p>
        
        <form onSubmit={handleSearch} className="relative w-full shadow-lg rounded-full overflow-hidden flex mb-12">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-100/70 w-6 h-6" />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 text-lg border-2 border-brand-red/20 bg-[#18181B] focus:border-brand-red focus:ring-4 focus:ring-brand-red/30 focus:shadow-[0_0_25px_rgba(255,0,0,0.4)] text-gray-100 font-inter outline-none transition-all duration-300 rounded-full"
              autoFocus={!q}
            />
          </div>
          <button 
            type="submit" 
            className="bg-brand-red text-gray-100 px-8 py-4 font-bold text-lg hover:bg-brand-red/80 transition-colors"
          >
            Search
          </button>
        </form>

        {q && (
          <div className="text-left w-full mt-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 border-b border-gray-800 pb-2">
              Results for "{q}"
            </h2>
            {isLoading ? (
              <div className="text-gray-100/60 py-8 text-center">Searching...</div>
            ) : allResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {allResults.map((item) => {
                  const isTelugu = !item.slug && item.id || window.location.pathname.includes('telugu') || (item.category && item.category.toLowerCase().includes('telugu'));
                  // We can infer source by some heuristic or just map to respective slugs
                  // Let's assume items from movieData have a specific structure and teluguData another, but they both have slugs or IDs.
                  // For simplicity, we just use /movie-news/slug unless it's clearly telugu.
                  const isTeluguNews = teluguResults.some(t => t.id === item.id);
                  const link = isTeluguNews ? `/telugu-news/${item.slug || item.id}` : `/movie-news/${item.slug || item.id}`;
                  return (
                    <Link to={link} key={item.id} className="bg-[#18181B] rounded-xl overflow-hidden hover:ring-2 hover:ring-brand-red transition-all shadow-md group text-left flex flex-col">
                      <div className="w-full aspect-video bg-gray-900 overflow-hidden relative">
                        <img 
                          src={item.thumbnail || item.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-brand-red text-xs font-bold px-2 py-1 rounded text-white uppercase">
                          {isTeluguNews ? 'Telugu News' : (item.category || 'Movie News')}
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-bold text-gray-100 text-lg mb-2 line-clamp-2">{item.title}</h3>
                        <div className="mt-auto text-xs text-gray-100/50">
                          {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-100/60 py-8 text-center bg-[#18181B] rounded-xl border border-gray-800">
                No results found for "{q}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;


