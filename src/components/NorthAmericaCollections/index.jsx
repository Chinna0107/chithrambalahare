import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Globe, RefreshCw, Star, TrendingUp } from 'lucide-react';
import { getNorthAmericaCollections } from '../../services/api';

const NorthAmericaCollections = ({ hideHeader = false, compact = false }) => {
  const { data: collections, isLoading, refetch } = useQuery({
    queryKey: ['northAmericaCollections'],
    queryFn: getNorthAmericaCollections,
  });

  // Listen to database changes for real-time updates
  useEffect(() => {
    const handleDbChange = () => {
      refetch();
    };
    window.addEventListener('tolly_db_change', handleDbChange);
    return () => window.removeEventListener('tolly_db_change', handleDbChange);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 border border-brand-red/10 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-800 rounded"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) return null;

  return (
    <section className={hideHeader ? "" : "mb-12"}>
      {!hideHeader && (
        <div className="flex justify-between items-center mb-6 border-b-2 border-brand-red/10 pb-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-poppins font-bold text-gray-100 border-b-2 border-brand-red -mb-[10px] pb-2 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-brand-red animate-spin-slow" />
              North America Collections
            </h2>
            <span className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center mt-1 animate-pulse shadow-[0_0_10px_rgba(212,43,43,0.2)]">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full mr-1"></span>
              LIVE TRACKING
            </span>
          </div>
          <button 
            onClick={() => refetch()} 
            className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      )}

      <div className={compact ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "grid grid-cols-2 md:grid-cols-3 gap-6"}>
        {collections.map((movie) => {
          const identifier = movie.slug || movie.id;
          
          const CardContent = (
            <div className="p-3 flex flex-row items-center h-full">
              <div className="w-20 h-28 relative rounded-lg overflow-hidden border border-gray-800 bg-brand-dark shadow-md group-hover:border-brand-red/40 transition-colors shrink-0">
                <img 
                  src={movie.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'} 
                  alt={movie.movieName} 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {movie.status && (
                  <div className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded text-white bg-green-600/90 border border-green-400 shadow-sm uppercase tracking-wider">
                    {movie.status}
                  </div>
                )}
              </div>
              <div className="ml-4 flex flex-col flex-grow justify-center text-left">
                <h3 className="text-base font-poppins font-bold text-gray-200 group-hover:text-brand-red transition-colors leading-tight mb-1 line-clamp-2">
                  {movie.movieName}
                </h3>
                <div className="mt-2">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Total Gross</div>
                  <div className="text-lg font-poppins font-black text-brand-red">
                    {movie.totalGross || '—'}
                  </div>
                </div>
              </div>
            </div>
          );

        return (
          <Link 
            to={`/north-america/${identifier}`} 
            key={movie.id}
            className="glass-card group relative rounded-xl border border-brand-red/10 overflow-hidden hover:border-brand-red/30 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(212,43,43,0.15)] flex flex-col justify-between block"
          >
            {CardContent}
          </Link>
        );
      })}
      </div>

      <style>{`
        .glass-card {
          background: rgba(19, 26, 43, 0.6);
          backdrop-filter: blur(10px);
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default NorthAmericaCollections;
