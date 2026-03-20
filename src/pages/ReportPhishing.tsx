import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Send, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import { useSecurity } from '../components/SecurityProvider';

export const ReportPhishingPage: React.FC = () => {
  const { reportPhishing } = useSecurity();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    url: '',
    email: '',
    description: '',
    screenshot: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await reportPhishing(formData);
      setStatus('success');
      setFormData({ url: '', email: '', description: '', screenshot: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6">
          <ShieldAlert className="text-red-500" size={32} />
        </div>
        <h2 className="text-4xl font-bold mb-4">Report Phishing</h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Help us protect our community. If you've encountered a suspicious link, email, or website pretending to be us, please report it below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">Suspicious URL</label>
                <input
                  required
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://suspicious-site.com/..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">Your Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">Description of the threat</label>
                <textarea
                  required
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us what happened..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={20} />
                    Submit Security Report
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle2 size={20} />
                  Report submitted. Thank you for helping us stay secure.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle size={20} />
                  Failed to submit report. Please try again later.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info size={18} className="text-emerald-400" />
              Security Tips
            </h3>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">•</span>
                Always check the URL in your browser's address bar.
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">•</span>
                We will never ask for your password via email.
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">•</span>
                Look for the lock icon next to the URL.
              </li>
            </ul>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-2 text-emerald-400">Anti-Bot Active</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This application is protected by advanced behavioral analysis to prevent automated attacks and ensure a safe experience for real users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
