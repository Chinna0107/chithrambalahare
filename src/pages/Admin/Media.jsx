import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Image } from 'lucide-react';

const Media = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Media Library - Admin</title></Helmet>
      
      <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-poppins font-bold text-white flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-brand-red" />
          Media Library
        </h2>
        <p className="text-gray-400">Manage uploaded images, compressions, and WebP generation here. (Module under development)</p>
      </div>
    </div>
  );
};

export default Media;
