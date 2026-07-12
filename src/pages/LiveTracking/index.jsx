import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const LiveTracking = () => {
  return (
    <div className="wrap flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative overflow-hidden">
      <Helmet>
        <title>Live Box Office Tracking | CHITRAMBHALARE</title>
        <meta name="description" content="Real-time worldwide & AP/TS collections for all running Telugu, Tamil & Hindi films. Coming Soon." />
      </Helmet>

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none animate-pulse delay-700"></div>

      <div className="relative z-10 max-w-2xl mx-auto glass-card rounded-3xl p-12 md:p-16 border border-brand-red/20 shadow-[0_20px_60px_rgba(229,9,20,0.15)] backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-red/10 flex items-center justify-center border border-brand-red/30 shadow-[0_0_30px_rgba(229,9,20,0.2)]">
            <span className="text-4xl">🎬</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-poppins font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4 tracking-tight">
          Live Tracking
        </h1>
        
        <div className="inline-block mb-8 px-6 py-2 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red font-bold tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(229,9,20,0.3)] animate-pulse">
          Coming Soon
        </div>
        
        <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-lg mx-auto">
          We are building the ultimate real-time box office tracking portal. Get ready for live collections, area-wise breakdowns, and trend analysis like never before.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/box-office" 
            className="px-8 py-4 rounded-xl bg-brand-red text-white font-bold hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] hover:-translate-y-1 w-full sm:w-auto"
          >
            Read Box Office News
          </Link>
          <Link 
            to="/main" 
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all w-full sm:w-auto"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
