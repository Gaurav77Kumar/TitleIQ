import React from 'react';
import { AlertTriangle, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface RateLimitBannerProps {
  onSignInClick: () => void;
  onClose: () => void;
}

export const RateLimitBanner: React.FC<RateLimitBannerProps> = ({ 
  onSignInClick,
  onClose
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-indigo-600 text-white p-5 rounded-[1.5rem] shadow-2xl shadow-indigo-200/40 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-white/10"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none" />
      
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
          <AlertTriangle className="w-7 h-7 text-white" />
        </div>
        <div className="text-center md:text-left">
          <p className="font-black text-xl leading-none uppercase tracking-tighter mb-1">Daily Limit Reached</p>
          <p className="text-indigo-100 text-sm font-semibold max-w-sm">
            {isAuthenticated 
              ? "You've used your 3 free daily analyses. Go Pro for unlimited analyses and full strategy history."
              : "You've used your 3 free analyses today. Sign in to get more tomorrow, or go Pro for unlimited now."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto z-10">
        {!isAuthenticated && (
          <button 
            onClick={onSignInClick}
            className="flex-1 md:flex-none bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
          >
            Sign In
          </button>
        )}
        <Link 
          to="/upgrade"
          className="flex-1 md:flex-none bg-indigo-500/50 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400/50 transition-all active:scale-95 flex items-center justify-center gap-2 group text-center"
        >
          <Sparkles className="w-4 h-4 group-hover:animate-pulse" /> Go Pro
        </Link>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:relative md:top-0 md:right-0 p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
