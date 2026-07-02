import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tags } from 'lucide-react';

const Taxonomy = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Taxonomy - Admin</title></Helmet>
      
      <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-poppins font-bold text-white flex items-center gap-2 mb-4">
          <Tags className="w-5 h-5 text-brand-red" />
          Taxonomy Management
        </h2>
        <p className="text-gray-400">Manage categories, tags, and their SEO settings here. (Module under development)</p>
      </div>
    </div>
  );
};

export default Taxonomy;
