import { Link } from 'react-router-dom';
import { TrendingUp, Globe, MapPin, IndianRupee, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

const BoxOfficeCard = ({ boxOffice, compact = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl hover:shadow-[0_10px_30px_rgba(255,0,0,0.3)] transition-all duration-300 overflow-hidden flex flex-row items-center p-3 group border border-brand-red/10 h-full"
    >
      <Link to={`/box-office/${boxOffice.slug}`} className="w-20 h-28 rounded-lg relative overflow-hidden shrink-0 shadow-md">
        <img 
          src={boxOffice.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'} 
          alt={boxOffice.movieName} 
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-sm border ${
          boxOffice.verdict === 'Blockbuster' ? 'bg-red-600/90 border-red-400' : 'bg-green-600/90 border-green-400'
        }`}>
          {boxOffice.verdict}
        </div>
      </Link>

      <div className="ml-4 flex flex-col justify-center flex-grow text-left">
        <Link to={`/box-office/${boxOffice.slug}`}>
          <h3 className="text-base font-poppins font-bold text-gray-100 group-hover:text-brand-red transition-colors mb-1 line-clamp-2">
            {boxOffice.movieName}
          </h3>
        </Link>
        
        <div className="mt-2">
          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Total Gross</div>
          <div className="text-lg font-poppins font-black text-brand-red">
            {boxOffice.worldwideGross || '—'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BoxOfficeCard;


