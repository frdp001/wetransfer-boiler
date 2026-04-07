import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-8 text-zinc-400">
          <FileQuestion size={40} />
        </div>
        <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">404 - Page Not Found</h1>
        <p className="text-zinc-600 mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
};
