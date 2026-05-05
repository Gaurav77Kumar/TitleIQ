import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  AlertCircle, 
  ChevronRight, 
  Share2, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Copy,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { SimulationResult, TitleRanking } from '@titleiq/shared';

export const Simulator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPro = user?.tier === 'pro';

  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [niche, setNiche] = useState(searchParams.get('niche') || '');
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(searchParams.get('shared'));

  const niches = [
    'Gaming', 'Finance', 'Fitness', 'Cooking', 'Tech', 'Education', 'Lifestyle',
    'Travel', 'Beauty', 'Business', 'Music', 'Sports', 'Entertainment', 'Health', 'Other'
  ];

  useEffect(() => {
    if (sharedId) {
      fetchSharedSimulation(sharedId);
    }
  }, [sharedId]);

  const fetchSharedSimulation = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get<{ success: true, data: SimulationResult }>(`/analyze/simulate/${id}`);
      if (res.success) {
        setSimulation(res.data);
      }
    } catch (err) {
      setError('Shared simulation not found.');
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    if (!isPro) {
      navigate('/upgrade');
      return;
    }
    if (title.length < 5 || !niche) {
      setError('Please provide a title and select a niche.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ success: true, data: SimulationResult, simulationId: string }>('/analyze/simulate', {
        title,
        niche
      });
      if (res.success) {
        setSimulation(res.data);
        // Update URL without reload to allow sharing
        window.history.pushState({}, '', `/simulator?shared=${res.simulationId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const getNicheEmoji = (n: string) => {
    const map: Record<string, string> = {
      Gaming: '🎮', Finance: '💰', Fitness: '💪', Cooking: '🍳', Tech: '💻',
      Education: '📚', Lifestyle: '✨', Travel: '✈️', Beauty: '💄', Business: '💼',
      Music: '🎵', Sports: '🏆', Entertainment: '🎬', Health: '🏥', Other: '🌐'
    };
    return map[n] || '🌐';
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-heading italic text-white mb-6">CTR Simulator</h1>
        <p className="text-white/40 text-sm font-black uppercase tracking-[0.4em]">Battle Top Competitors in Your Niche</p>
      </div>

      <AnimatePresence mode="wait">
        {!simulation ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto space-y-10"
          >
            <div className="space-y-4">
               <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Your Title</label>
               <input 
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="Enter title to test..."
                 className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
               />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Market Niche</label>
              <div className="flex flex-wrap gap-2">
                {niches.map(n => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={cn(
                      "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      niche === n ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-4 h-4 fill-black" />}
              {loading ? "Simulating Market..." : "Run CTR Simulation"}
            </button>

            {!isPro && (
               <div className="text-center">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-4 py-2 rounded-full">
                    Pro Feature Required
                  </span>
               </div>
            )}
            
            {error && <p className="text-red-400 text-center text-xs font-bold uppercase">{error}</p>}
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-20"
          >
            {/* Simulation Feed */}
            <div className="grid md:grid-cols-2 gap-8">
              {simulation.rankings.sort((a,b) => a.rank - b.rank).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative flex flex-col liquid-glass rounded-3xl overflow-hidden border-2 transition-all",
                    item.is_user_title 
                      ? (item.rank === 1 ? "border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.15)]" : item.rank <= 3 ? "border-amber-500/50" : "border-red-500/50")
                      : "border-white/5"
                  )}
                >
                  {item.is_user_title && (
                    <div className={cn(
                      "absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest z-10",
                      item.rank === 1 ? "bg-green-500 text-black" : item.rank <= 3 ? "bg-amber-500 text-black" : "bg-red-500 text-white"
                    )}>
                      {item.rank === 1 ? "🏆 Would Win" : "Your Title"}
                    </div>
                  )}

                  <div className="aspect-video bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative">
                    <span className="text-6xl grayscale opacity-20">{getNicheEmoji(niche)}</span>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-white">
                      #{item.rank}
                    </div>
                    <div className="absolute top-4 right-4 bg-indigo-600 px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
                      {item.estimated_ctr}% CTR
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                      <div className="space-y-2 flex-1">
                        <h4 className="text-white font-bold leading-tight line-clamp-2 italic">"{item.title}"</h4>
                        <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                          {niche} Mastery · 245K views · 2 days ago
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Analysis Dashboard */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="liquid-glass rounded-3xl p-8 border border-green-500/10">
                <h4 className="text-[10px] font-black text-green-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> You Win On
                </h4>
                <ul className="space-y-4">
                  {simulation.user_wins_on.map((win, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-center gap-3 font-medium">
                      <span className="text-green-500">•</span> {win}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="liquid-glass rounded-3xl p-8 border border-red-500/10">
                <h4 className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> You Lose On
                </h4>
                <ul className="space-y-4">
                  {simulation.user_loses_on.map((lose, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-center gap-3 font-medium">
                      <span className="text-red-500">•</span> {lose}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="liquid-glass-strong rounded-3xl p-8 border border-indigo-500/20 shadow-2xl">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8">One Fix to Move Up</h4>
                <p className="text-xl font-heading italic text-white leading-snug mb-8">"{simulation.one_fix}"</p>
                <button 
                  onClick={() => {
                    setSimulation(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Apply Fix & Re-Simulate
                </button>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => setSimulation(null)}
                className="flex items-center gap-3 text-white/20 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.4em]"
              >
                <ChevronLeft className="w-4 h-4" /> Start New Simulation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
