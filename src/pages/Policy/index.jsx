import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, Lock, Cookie } from 'lucide-react';

const Policy = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-4 h-4 mr-2" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: 'cookies', label: 'Cookie Policy', icon: <Cookie className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="wrap pt-28 pb-12">
      <Helmet>
        <title>Legal & Policies | CHITRAMBHALARE</title>
        <meta name="description" content="Privacy Policy, Terms of Service, and Cookie Policy for CHITRAMBHALARE." />
      </Helmet>

      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-brand-red/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-brand-red" />
          </div>
          <h1 className="text-4xl md:text-5xl font-poppins font-black text-gray-100 mb-4">
            Legal & <span className="text-brand-red">Policies</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We are committed to protecting your personal information and your right to privacy.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="glass-card rounded-2xl p-2 sticky top-24 border border-brand-red/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-brand-red text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow glass-card rounded-3xl p-8 md:p-12 border border-brand-red/10 min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="prose prose-invert prose-red max-w-none"
              >
                <h2 className="text-3xl font-poppins font-bold mb-6 text-gray-100">Privacy Policy</h2>
                <p className="text-gray-400 mb-4">Last updated: July 12, 2026</p>
                
                <h3 className="text-xl font-semibold text-gray-200 mt-8 mb-4">1. Information We Collect</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>Names and Contact Data</li>
                  <li>Credentials (Passwords and security information)</li>
                  <li>Payment Data (processed securely by our partners)</li>
                  <li>Social Media Login Data</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-200 mt-8 mb-4">2. How We Use Your Information</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                </p>
                
                <div className="bg-brand-dark/50 p-6 rounded-xl border border-white/5 my-6">
                  <h4 className="font-bold text-gray-200 mb-2">Note to our users:</h4>
                  <p className="text-gray-400 text-sm">
                    CHITRAMBHALARE will never sell your personal data to third-party data brokers. Your trust is our top priority.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="prose prose-invert prose-red max-w-none"
              >
                <h2 className="text-3xl font-poppins font-bold mb-6 text-gray-100">Terms of Service</h2>
                <p className="text-gray-400 mb-4">Last updated: July 12, 2026</p>
                
                <h3 className="text-xl font-semibold text-gray-200 mt-8 mb-4">1. Agreement to Terms</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and CHITRAMBHALARE, concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                </p>

                <h3 className="text-xl font-semibold text-gray-200 mt-8 mb-4">2. Intellectual Property Rights</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
                </p>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                </p>
              </motion.div>
            )}

            {activeTab === 'cookies' && (
              <motion.div
                key="cookies"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="prose prose-invert prose-red max-w-none"
              >
                <h2 className="text-3xl font-poppins font-bold mb-6 text-gray-100">Cookie Policy</h2>
                <p className="text-gray-400 mb-4">Last updated: July 12, 2026</p>
                
                <h3 className="text-xl font-semibold text-gray-200 mt-8 mb-4">1. What are cookies?</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>

                <h3 className="text-xl font-semibold text-gray-200 mt-8 mb-4">2. Why do we use cookies?</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We use first and third party cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Policy;
