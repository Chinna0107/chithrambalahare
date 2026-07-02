import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MessageSquare } from 'lucide-react';

const Comments = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Comments - Admin</title></Helmet>
      
      <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-poppins font-bold text-white flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-brand-red" />
          Comments & Moderation
        </h2>
        <p className="text-gray-400">Approve, reject, or mark comments as spam. (Module under development)</p>
      </div>
    </div>
  );
};

export default Comments;
