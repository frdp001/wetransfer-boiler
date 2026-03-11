import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Mail, Github } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '#', label: 'Features' },
    { path: '#', label: 'Pricing' },
    { path: '#', label: 'Use cases' },
    { path: '#', label: 'Resources' },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30">
      <nav className="fixed top-0 w-full z-50 p-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="WeTransfer" 
              className="h-11 w-auto"
              onError={(e) => {
                // Fallback if logo.png isn't uploaded yet
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center bg-white/80 backdrop-blur-md rounded-full px-6 py-2 shadow-sm border border-black/5 mr-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-sm font-medium px-4 py-1 text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-px h-4 bg-zinc-300 mx-2" />
              <Link to="#" className="text-sm font-medium px-4 py-1 text-zinc-600 hover:text-zinc-900 transition-colors">
                Log in
              </Link>
            </div>
            <Link 
              to="#" 
              className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative min-h-screen">
        {children}
      </main>

      <footer className="fixed bottom-0 w-full py-6 text-center z-50">
        <p className="text-zinc-400 text-xs font-medium"></p>
      </footer>
    </div>
  );
};
