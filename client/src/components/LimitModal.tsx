import React from 'react';
import { Lock, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LimitModalProps {
  onClose: () => void;
}

export const LimitModal: React.FC<LimitModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative liquid-glass-strong rounded-[3rem] p-12 max-w-lg w-full border border-white/10 shadow-3xl text-center animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/20 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-600/20">
          <Lock className="w-8 h-8 text-indigo-400" />
        </div>

        <h2 className="text-4xl font-heading italic text-white mb-4">Daily limit reached</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-10">
          You've reached your free daily limit for title analyses. Upgrade to TitleIQ Pro for unlimited scores, advanced thumbnail analysis, and more.
        </p>

        <div className="space-y-4">
          <Link
            to="/upgrade"
            className="block w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Unlock Pro Access</span>
          </Link>
          <button
            onClick={onClose}
            className="block w-full py-4 text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
