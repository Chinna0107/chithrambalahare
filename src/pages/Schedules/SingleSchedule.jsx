import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Calendar, Globe, Tag, Users, Video, Info, ChevronLeft } from 'lucide-react';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const fetchSingleSchedule = async (slug) => {
  const { data } = await axios.get(`/api/schedules/${slug}`);
  return data;
};

const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match && match[1] ? match[1] : null;
};

const SingleSchedule = () => {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['schedule', slug],
    queryFn: () => fetchSingleSchedule(slug),
  });

  if (isLoading) return <LoadingSkeleton type="single" />;
  
  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Upcoming Release Not Found</h1>
        <p className="text-gray-400 mb-8">The release data you're looking for doesn't exist.</p>
        <Link to="/" className="text-brand-red hover:text-white transition-colors">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const trailerId = extractYouTubeId(movie.trailerLink);

  return (
    <article className="max-w-5xl mx-auto px-4 py-8">
      <Helmet>
        <title>{movie.movieName} - Upcoming Telugu Movies | Tollywood</title>
        <meta name="description" content={`Upcoming release details for ${movie.movieName}. Release Date: ${movie.releaseDate}`} />
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-poppins">
        <Link to="/" className="hover:text-brand-red transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" /> Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span>Upcoming Releases</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-red">{movie.movieName}</span>
      </nav>

      {/* Hero Section */}
      <div className="glass-card rounded-2xl overflow-hidden border border-brand-red/20 mb-8 relative">
        {movie.banner && (
          <div className="w-full h-64 md:h-96 relative">
            <img 
              src={movie.banner} 
              alt={movie.movieName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131A2B] via-[#131A2B]/80 to-transparent" />
          </div>
        )}
        
        {/* Main Info (Overlay if banner exists, or standard block if not) */}
        <div className={`p-6 md:p-8 relative z-10 ${movie.banner ? 'mt-[-120px]' : 'bg-[#131A2B]/90 backdrop-blur-xl'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 border border-brand-red/30 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">{movie.status}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-poppins font-black text-white mb-6 leading-tight drop-shadow-xl">
            {movie.movieName}
          </h1>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-black/40 backdrop-blur-md rounded-xl p-6 border border-gray-800/50">
            {movie.releaseDate && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]"><Calendar className="w-3 h-3" /> Release Date</div>
                <div className="text-white font-medium text-lg font-poppins">{movie.releaseDate}</div>
              </div>
            )}
            {movie.language && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]"><Globe className="w-3 h-3" /> Language</div>
                <div className="text-white font-medium text-lg font-poppins">{movie.language}</div>
              </div>
            )}
            {movie.genre && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]"><Tag className="w-3 h-3" /> Genre</div>
                <div className="text-white font-medium text-lg font-poppins">{movie.genre}</div>
              </div>
            )}
            {movie.director && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]"><Video className="w-3 h-3" /> Director</div>
                <div className="text-white font-medium text-lg font-poppins">{movie.director}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8">
          {movie.castList && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-poppins font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-red" /> Cast & Crew
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">{movie.castList}</p>
            </div>
          )}

          {trailerId && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-poppins font-bold text-white mb-6 flex items-center gap-2">
                <Video className="w-5 h-5 text-brand-red" /> Official Trailer
              </h2>
              <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black border border-gray-800">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailerId}`}
                  title={`${movie.movieName} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Notes */}
        <div className="space-y-6">
          {movie.notes && (
            <div className="glass-card rounded-2xl p-6 border border-brand-red/20 bg-brand-red/5">
              <h3 className="text-sm font-bold text-brand-red uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Notes
              </h3>
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

export default SingleSchedule;
