import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Calendar, Globe, DollarSign, Tag, TrendingUp, ChevronLeft } from 'lucide-react';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const fetchSingleNorthAmerica = async (slug) => {
  const { data } = await axios.get(`/api/north-america/${slug}`);
  return data;
};

const SingleNorthAmerica = () => {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['northAmerica', slug],
    queryFn: () => fetchSingleNorthAmerica(slug),
  });

  if (isLoading) return <LoadingSkeleton type="single" />;
  
  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Collection Not Found</h1>
        <p className="text-gray-400 mb-8">The box office data you're looking for doesn't exist.</p>
        <Link to="/" className="text-brand-red hover:text-white transition-colors">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  let dailyBreakdown = movie.dailyBreakdown || [];
  if (typeof dailyBreakdown === 'string') {
    try {
      dailyBreakdown = JSON.parse(dailyBreakdown);
    } catch (e) {
      dailyBreakdown = [];
    }
  }

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>{movie.movieName} - North America Box Office | Tollywood</title>
        <meta name="description" content={`North America Box Office collections for ${movie.movieName}. Total Gross: ${movie.totalGross}`} />
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-poppins">
        <Link to="/" className="hover:text-brand-red transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" /> Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span>North America</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-red">{movie.movieName}</span>
      </nav>

      {/* Hero Section */}
      <div className="glass-card rounded-2xl overflow-hidden border border-brand-red/20 mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Poster */}
          {movie.poster && (
            <div className="md:w-1/3 shrink-0 relative">
              <img 
                src={movie.poster} 
                alt={movie.movieName} 
                className="w-full h-full object-cover md:absolute inset-0 aspect-[2/3] md:aspect-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:hidden" />
            </div>
          )}
          
          {/* Main Info */}
          <div className="p-6 md:p-8 flex-1 bg-[#131A2B]/90 backdrop-blur-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 border border-brand-red/30 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">{movie.status}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-poppins font-black text-white mb-2 leading-tight">
              {movie.movieName}
            </h1>
            
            <p className="text-sm text-gray-400 mb-8 flex items-center gap-1">
              Last Updated: <span className="text-white font-medium">{movie.lastUpdated}</span>
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Gross</div>
                <div className="text-2xl font-black text-brand-red font-poppins">{movie.totalGross || 'N/A'}</div>
              </div>
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Hourly Gross</div>
                <div className="text-2xl font-black text-yellow-500 font-poppins">{movie.hourlyGross || 'N/A'}</div>
              </div>
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Premiere</div>
                <div className="text-2xl font-black text-white font-poppins">{movie.premierGross || movie.premiereCollections || 'N/A'}</div>
              </div>
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Screens</div>
                <div className="text-2xl font-black text-white font-poppins">{movie.screens || 'N/A'}</div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-black/20 rounded-xl p-4 border border-gray-800/50">
              {movie.releaseDate && (
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /> <span className="text-gray-400">Release:</span> <span className="text-white font-medium">{movie.releaseDate}</span></div>
              )}
              {movie.language && (
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-gray-500" /> <span className="text-gray-400">Language:</span> <span className="text-white font-medium">{movie.language}</span></div>
              )}
              {movie.genre && (
                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-gray-500" /> <span className="text-gray-400">Genre:</span> <span className="text-white font-medium">{movie.genre}</span></div>
              )}
              {movie.budget && (
                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-500" /> <span className="text-gray-400">Budget:</span> <span className="text-white font-medium">{movie.budget}</span></div>
              )}
              {movie.distributor && (
                <div className="col-span-full flex items-start gap-2 pt-2 border-t border-gray-800">
                  <span className="text-gray-400 font-medium whitespace-nowrap">Distributor:</span> 
                  <span className="text-white">{movie.distributor}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Daily Trends */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-poppins font-bold text-white mb-6 border-b border-gray-800 pb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-red" /> Daily Box Office Trend
            </h2>
            
            {dailyBreakdown.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Collection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyBreakdown.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-sm font-medium text-gray-300">{item.day}</td>
                        <td className="py-4 px-4 text-sm font-poppins font-bold text-green-400 text-right">{item.collection}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No daily collection data available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Other Milestones & Notes */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-gray-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Milestones</h3>
            <ul className="space-y-4">
              {movie.openingDayPreview && (
                <li className="flex justify-between items-center border-b border-gray-800/50 pb-2">
                  <span className="text-xs text-gray-400">Opening Previews</span>
                  <span className="text-sm font-bold text-white">{movie.openingDayPreview}</span>
                </li>
              )}
              {movie.advanceBookings && (
                <li className="flex justify-between items-center border-b border-gray-800/50 pb-2">
                  <span className="text-xs text-gray-400">Advance Bookings</span>
                  <span className="text-sm font-bold text-white">{movie.advanceBookings}</span>
                </li>
              )}
              {movie.weekendCollections && (
                <li className="flex justify-between items-center border-b border-gray-800/50 pb-2">
                  <span className="text-xs text-gray-400">Weekend Total</span>
                  <span className="text-sm font-bold text-brand-red">{movie.weekendCollections}</span>
                </li>
              )}
              {movie.weeklyCollections && (
                <li className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Weekly Total</span>
                  <span className="text-sm font-bold text-brand-red">{movie.weeklyCollections}</span>
                </li>
              )}
            </ul>
          </div>

          {movie.notes && (
            <div className="glass-card rounded-2xl p-6 border border-brand-red/20 bg-brand-red/5">
              <h3 className="text-sm font-bold text-brand-red uppercase tracking-wider mb-3">Notes & Observations</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{movie.notes}</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .glass-card {
          background: rgba(19, 26, 43, 0.6);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </article>
  );
};

export default SingleNorthAmerica;
