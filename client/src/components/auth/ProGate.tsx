import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface ProGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const ProGate: React.FC<ProGateProps> = ({ 
  children, 
  title = "Exclusive Pro Feature",
  description = "Experience the next level of YouTube strategy with our advanced toolset."
}) => {
  const { user, isAuthenticated } = useAuth();
  const isPro = user?.tier === 'pro';

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[600px] overflow-hidden">
      {/* Blurred Content Background */}
      <div className="filter blur-[30px] brightness-50 pointer-events-none select-none opacity-40">
        {children}
      </div>
      
      {/* Upgrade Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="liquid-glass p-12 rounded-[3rem] max-w-lg w-full text-center border-2 border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-500/40 relative">
             <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] animate-pulse" />
             <Lock className="w-10 h-10 text-white relative z-10" />
          </div>

          <h2 className="text-4xl md:text-5xl font-heading italic text-white tracking-tighter leading-none mb-6">
            Unlock <br /> <span className="text-white/30">Strategic Edge.</span>
          </h2>
          
          <p className="text-white/60 font-body text-lg mb-12 max-w-sm mx-auto leading-relaxed font-light">
            {description}
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/upgrade"
              className="block w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl shadow-indigo-500/10 flex items-center justify-center gap-3"
            >
              Get Pro Access <Sparkles className="w-4 h-4 text-indigo-600" />
            </Link>
            
            {!isAuthenticated && (
               <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Assuming Auth triggers at top or via modal
                className="w-full text-[10px] text-white/30 font-black uppercase tracking-[0.2em] hover:text-white transition-colors py-4"
               >
                 Already Pro? <span className="text-indigo-400">Sign in to restore</span>
               </button>
            )}
          </div>

          <div className="mt-12 flex justify-center gap-8 opacity-20 grayscale scale-75">
            <div className="flex flex-col items-center">
               <span className="text-white font-black text-xs uppercase tracking-tighter">Unlimited</span>
               <span className="text-[8px] text-white/60 uppercase">Analyses</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/20 pl-8">
               <span className="text-white font-black text-xs uppercase tracking-tighter">History</span>
               <span className="text-[8px] text-white/60 uppercase">Archive</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
