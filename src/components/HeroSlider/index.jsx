import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

const HeroSlider = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  const featured = articles.slice(0, 5);

  return (
    <div className="relative w-full h-[45vh] md:h-[55vh] rounded-2xl overflow-hidden mb-12 group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        speed={600}
        className="w-full h-full"
      >
        {featured.map((article) => (
          <SwiperSlide key={article.id}>
            <div className="relative w-full h-full">
              <img
                src={article.featuredImage || article.thumbnail || FALLBACK}
                alt={article.title}
                onError={(e) => { e.target.src = FALLBACK; }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-dark to-transparent z-10" />

              <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 md:w-[85%] lg:w-[80%] z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-brand-red text-gray-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center shadow-[0_0_15px_rgba(255,0,0,0.6)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>
                      {article.category || 'News'}
                    </span>
                  </div>

                  <Link to={`/movie-news/${article.slug}`}>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-poppins font-bold text-gray-100 leading-tight mb-3 hover:text-brand-red/90 transition-colors drop-shadow-lg tracking-tight">
                      {article.title}
                    </h2>
                  </Link>

                  <p className="text-gray-300 text-xs md:text-sm mb-6 line-clamp-2 max-w-xl">
                    {article.excerpt}
                  </p>

                  {/* <Link
                    to={`/movie-news/${article.slug}`}
                    className="inline-flex items-center bg-brand-red text-gray-100 font-bold px-8 py-4 rounded-full hover:bg-brand-red/80 transition-all shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] hover:-translate-y-1"
                  >
                    Read Full Story <ChevronRight className="ml-2 w-5 h-5" />
                  </Link> */}
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom nav arrows */}
      <button className="hero-prev absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-brand-red text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/10">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button className="hero-next absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-brand-red text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/10">
        <ChevronRight className="w-5 h-5" />
      </button>

      <style>{`
        .swiper-pagination-bullet {
          background-color: white !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background-color: #D42B2B !important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
