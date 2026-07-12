import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, BarChart, MonitorPlay, Smartphone } from 'lucide-react';

const Advertise = () => {
  const stats = [
    { icon: <Users className="w-8 h-8 text-brand-red" />, value: '2M+', label: 'Monthly Visitors' },
    { icon: <MonitorPlay className="w-8 h-8 text-brand-red" />, value: '15M+', label: 'Page Views/Month' },
    { icon: <Smartphone className="w-8 h-8 text-brand-red" />, value: '85%', label: 'Mobile Traffic' },
    { icon: <Target className="w-8 h-8 text-brand-red" />, value: '18-35', label: 'Core Demographic' },
  ];

  const adOptions = [
    {
      title: 'Premium Display Ads',
      description: 'High-visibility banner placements on our homepage, article pages, and box office sections.',
      features: ['Leaderboard (728x90)', 'Medium Rectangle (300x250)', 'Sticky Sidebars'],
    },
    {
      title: 'Sponsored Content',
      description: 'Native editorial integration for your brand, reaching our audience organically.',
      features: ['Dedicated Articles', 'Social Media Amplification', 'SEO Optimized'],
    },
    {
      title: 'Site Takeovers',
      description: 'Maximum impact with full-site background skins and interstitial ads for major launches.',
      features: ['100% Share of Voice', 'High Engagement', 'Custom Integrations'],
    },
  ];

  return (
    <div className="wrap pt-28 pb-12">
      <Helmet>
        <title>Advertise With Us | CHITRAMBHALARE</title>
        <meta name="description" content="Reach millions of Tollywood movie fans. Advertise with CHITRAMBHALARE." />
      </Helmet>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-black text-gray-100 mb-6 drop-shadow-lg">
            Connect Your Brand With <br className="hidden md:block" />
            <span className="text-brand-red">Millions of Movie Fans</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-medium">
            CHITRAMBHALARE is the fastest-growing digital destination for Tollywood news, reviews, and box office analytics.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-card rounded-2xl p-6 text-center border border-brand-red/10 hover:border-brand-red/30 transition-colors"
          >
            <div className="flex justify-center mb-4">{stat.icon}</div>
            <div className="text-3xl md:text-4xl font-poppins font-bold text-gray-100 mb-1">{stat.value}</div>
            <div className="text-xs md:text-sm text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Ad Options */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-bold text-gray-100 mb-4">Advertising Solutions</h2>
          <div className="w-16 h-1 bg-brand-red mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adOptions.map((option, idx) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-8 border border-brand-red/10 hover:shadow-[0_10px_30px_rgba(212,43,43,0.15)] hover:border-brand-red/30 transition-all duration-300 group"
            >
              <h3 className="text-2xl font-poppins font-bold text-gray-100 mb-4 group-hover:text-brand-red transition-colors">
                {option.title}
              </h3>
              <p className="text-gray-400 mb-6 line-clamp-3">
                {option.description}
              </p>
              <ul className="space-y-3">
                {option.features.map(feature => (
                  <li key={feature} className="flex items-center text-sm text-gray-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 md:p-12 text-center border-2 border-brand-red/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/5 via-transparent to-brand-red/5"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-100 mb-6">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Our team will work with you to create a custom campaign that hits your marketing goals.
          </p>
          <a href="mailto:sales@chitrambhalare.com" className="inline-block bg-brand-red text-gray-100 font-bold px-8 py-4 rounded-full hover:bg-brand-red/80 transition-all shadow-[0_0_20px_rgba(212,43,43,0.4)] hover:shadow-[0_0_30px_rgba(212,43,43,0.6)] hover:-translate-y-1">
            Contact Sales Team
          </a>
        </div>
      </motion.div>

    </div>
  );
};

export default Advertise;
