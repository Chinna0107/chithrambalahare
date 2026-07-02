import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LayoutTemplate } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Landing Page - Admin</title></Helmet>
      
      <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-poppins font-bold text-white flex items-center gap-2 mb-4">
          <LayoutTemplate className="w-5 h-5 text-brand-red" />
          Landing Page Management
        </h2>
        <p className="text-gray-400">Configure the homepage landing banner and CTA here. (Module under development)</p>
      </div>
    </div>
  );
};

export default LandingPage;
