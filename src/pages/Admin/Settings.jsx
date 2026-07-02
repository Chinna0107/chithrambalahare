import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Settings - Admin</title></Helmet>
      
      <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-poppins font-bold text-white flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-brand-red" />
          Global Settings
        </h2>
        <p className="text-gray-400">Manage site identity, social links, and maintenance mode here. (Module under development)</p>
      </div>
    </div>
  );
};

export default SettingsPage;
