import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HeroSlider from '../../components/HeroSlider';
import NewsCard from '../../components/NewsCard';
import ReviewCard from '../../components/ReviewCard';
import BoxOfficeCard from '../../components/BoxOfficeCard';
import Sidebar from '../../components/Sidebar';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import GalleryGrid from '../../components/GalleryGrid';
import NorthAmericaCollections from '../../components/NorthAmericaCollections';
import { getArticles, getReviews, getBoxOffice, getActiveLiveUpdate } from '../../services/api';

const Home = () => {
  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles', { limit: 15 }],
    queryFn: () => getArticles({ limit: 15 }),
  });

  const { data: ottData } = useQuery({
    queryKey: ['articles', { limit: 7, category: 'ott' }],
    queryFn: () => getArticles({ limit: 7, category: 'ott' }),
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', { limit: 4 }],
    queryFn: () => getReviews(),
    select: (data) => data.slice(0, 4),
  });

  const { data: boxOfficeDataObj, isLoading: boxOfficeLoading } = useQuery({
    queryKey: ['articles', { limit: 6, category: 'Box Office' }],
    queryFn: () => getArticles({ limit: 6, category: 'Box Office' }),
  });

  const { data: activeLiveUpdate } = useQuery({
    queryKey: ['activeLiveUpdate'],
    queryFn: () => getActiveLiveUpdate(),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const articles = articlesData?.data || [];
  const latestNews = articles.slice(5, 12); // After 5 slider items, fetch 7 to fill grid
  const ottNews = ottData?.data || [];
  const boxOfficeData = boxOfficeDataObj?.data || [];

  if (articlesLoading) {
    return <LoadingSkeleton type="page" />;
  }

  return (
    <div className="wrap pt-28 pb-12">
      <Helmet>
        <title>CHITRAMBHALARE | Latest Movie News & Reviews</title>
        <meta name="description" content="Get the latest Tollywood movie news, unbiased reviews, box office collections, and exclusive celebrity interviews on CHITRAMBHALARE." />
      </Helmet>

      <div className="desktop-grid">
        {/* Main Content Area */}
        <div className="space-y-12 min-w-0">
          
          {/* Live Now Banner */}
          {activeLiveUpdate && (
            <Link to={`/live-tracking/${activeLiveUpdate.slug}`} className="block relative group overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-brand-red to-red-900 border border-brand-red/30 shadow-[0_0_20px_rgba(229,9,20,0.2)]">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
              <div className="flex items-center justify-between p-4 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <span className="text-white font-bold tracking-wider uppercase text-sm whitespace-nowrap">Live Now:</span>
                  <span className="text-white font-semibold text-sm md:text-base truncate max-w-[200px] md:max-w-md lg:max-w-lg">{activeLiveUpdate.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}

          {/* Hero Section */}
          <HeroSlider articles={articles} />
          
          {/* Latest Movie News Grid */}
          {latestNews.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-6 border-b-2 border-brand-red/10 pb-2">
                <h2 className="text-2xl font-poppins font-bold text-gray-100 border-b-2 border-brand-red -mb-[10px] pb-2">
                  Latest Movie News
                </h2>
                <Link to="/movie-news" className="text-sm font-semibold text-gray-100 hover:text-gray-300 flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {latestNews.map((article, idx) => (
                  <NewsCard key={article.id} article={article} isFeatured={idx === 0} compact={idx !== 0} />
                ))}
              </div>
            </section>
          )}

          {/* OTT Updates */}
          {ottNews.length > 0 && (
            <section>
            <div className="flex justify-between items-center mb-6 border-b-2 border-brand-red/10 pb-2">
                <h2 className="text-2xl font-poppins font-bold text-gray-100 border-b-2 border-brand-red -mb-[10px] pb-2">
                  OTT Updates
                </h2>
                <Link to="/movie-news?category=OTT" className="text-sm font-semibold text-gray-100 hover:text-gray-300 flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {ottNews.map((article, idx) => (
                  <NewsCard key={article.id} article={article} isFeatured={idx === 0} compact={idx !== 0} />
                ))}
              </div>
            </section>
          )}

          {/* Combined Collections Section */}
          <section>
            <div className="flex justify-between items-center mb-6 border-b-2 border-brand-red/10 pb-2">
              <h2 className="text-2xl font-poppins font-bold text-gray-100 border-b-2 border-brand-red -mb-[10px] pb-2">
                Box Office Collections
              </h2>
              <Link to="/box-office" className="text-sm font-semibold text-gray-100 hover:text-gray-300 flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {boxOfficeLoading ? (
              <LoadingSkeleton type="card" />
            ) : (
              boxOfficeData && boxOfficeData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {boxOfficeData.map(bo => (
                    <NewsCard key={bo.id} article={bo} compact={true} />
                  ))}
                </div>
              )
            )}
          </section>

          {/* Photo Galleries Section */}
          <GalleryGrid />

          {/* Latest Reviews */}
          {reviewsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><LoadingSkeleton type="card"/><LoadingSkeleton type="card"/></div>
          ) : (
            reviewsData && reviewsData.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6 border-b-2 border-brand-red/10 pb-2">
                  <h2 className="text-2xl font-poppins font-bold text-gray-100 border-b-2 border-brand-red -mb-[10px] pb-2">
                    Latest Reviews
                  </h2>
                  <Link to="/reviews" className="text-sm font-semibold text-gray-100 hover:text-gray-300 flex items-center">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {reviewsData.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            )
          )}

        </div>

        {/* Sidebar */}
        <div className="sidebar-desktop">
          <Sidebar />
        </div>
      </div>
      
      {/* Mobile Sidebar (Shows below content on mobile) */}
      <div className="mobile-sidebar mt-12">
        <Sidebar />
      </div>
    </div>
  );
};

export default Home;


