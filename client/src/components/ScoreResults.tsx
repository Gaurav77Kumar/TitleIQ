import React, { useState, useEffect } from 'react';
import type { ScoreResult } from '@titleiq/shared';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowUpCircle, Lock, Copy, Sparkles, RefreshCcw, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { KeywordPanel } from './KeywordPanel';

interface ScoreResultsProps {
  result: ScoreResult;
  title: string;
  analysisId: string;
  remainingToday: number;
  onReset: () => void;
  niche: string;
}

export const ScoreResults: React.FC<ScoreResultsProps> = ({ 
  result, 
  title, 
  analysisId, 
  remainingToday,
  onReset,
  niche
}) => {
  const { user } = useAuth();
  const isPro = user?.tier === 'pro';
  const [copied, setCopied] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // For comparison view after rewrite analysis
  const [comparison, setComparison] = useState<{ 
    originalScore: number;
    newResult: ScoreResult;
    newTitle: string;
  } | null>(null);

  const handleRewriteAnalyzed = (newResult: ScoreResult, newTitle: string) => {
    setComparison({
      originalScore: result.overall_score,
      newResult,
      newTitle
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let start = 0;
    const end = result.overall_score;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * end);
      
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [result.overall_score]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = animatedScore >= 70 ? 'text-green-500' : animatedScore >= 40 ? 'text-amber-500' : 'text-red-500';
  const strokeColor = animatedScore >= 70 ? '#22c55e' : animatedScore >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* ─── A) OVERALL SCORE CIRCLE ─── */}
      <div className="flex flex-col items-center text-center pt-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={strokeColor}
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 553" }}
              animate={{ strokeDasharray: `${(animatedScore / 100) * 553} 553` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={cn("text-7xl font-heading italic font-black leading-none", scoreColor)}>
              {animatedScore}
            </span>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Score</span>
          </div>
        </div>
        <p className="mt-8 text-white/40 text-sm font-light italic max-w-md mx-auto leading-relaxed">
          "{result.score_reasoning}"
        </p>

        {comparison && (
          <div className="mt-10 flex items-center gap-6 animate-in zoom-in duration-500">
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Original</span>
               <span className="text-2xl font-bold text-white/40 line-through">{comparison.originalScore}</span>
            </div>
            <div className="text-indigo-500 text-3xl font-light">→</div>
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Improved</span>
               <span className="text-4xl font-black text-green-400">+{result.overall_score - comparison.originalScore} pts</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 pt-8">
        
        {/* Left Column: Sub-scores & Details */}
        <div className="space-y-12">
          {/* ─── B) SUB-SCORE BARS ─── */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-8">Performance Metrics</h3>
            <SubScoreBar label="Curiosity Gap" score={result.sub_scores.curiosity_gap} index={0} />
            <SubScoreBar label="Keyword Strength" score={result.sub_scores.keyword_strength} index={1} />
            <SubScoreBar label="Emotional Pull" score={result.sub_scores.emotional_pull} index={2} />
            <SubScoreBar label="Title Length" score={result.sub_scores.length_score} index={3} />
          </div>

          {/* ─── C) STRENGTHS ─── */}
          <div className="liquid-glass rounded-3xl p-8 border border-green-500/10">
            <h3 className="text-[10px] font-black text-green-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4" /> What's working
            </h3>
            <div className="space-y-6">
              {result.strengths.slice(0, 2).map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Improvements & Alternatives */}
        <div className="space-y-12">
          {/* ─── D) IMPROVEMENTS ─── */}
          <div className="liquid-glass rounded-3xl p-8 border border-amber-500/10">
            <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <ArrowUpCircle className="w-4 h-4" /> What to fix
            </h3>
            <div className="space-y-6">
              {result.improvements.slice(0, 3).map((imp, i) => {
                const words = imp.split(' ');
                const firstWord = words[0];
                const rest = words.slice(1).join(' ');
                return (
                  <div key={i} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowUpCircle className="w-3 h-3 text-amber-500" />
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      <strong className="text-white font-black uppercase text-[10px] tracking-widest bg-amber-500/20 px-1.5 py-0.5 rounded mr-1.5">{firstWord}</strong>
                      <span className="font-medium">{rest}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── E) ALTERNATIVE TITLES ─── */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-8 flex justify-between items-center">
              <span>Better Title Ideas</span>
              {!isPro && <span className="text-indigo-400">Pro Feature</span>}
            </h3>
            
            <div className="space-y-4">
              {/* First Item: Always visible */}
              <div className="liquid-glass-strong rounded-2xl p-5 flex items-center justify-between gap-4 border border-white/5">
                <span className="text-sm text-white font-bold leading-tight italic">"{result.alternative_titles[0]}"</span>
                <button 
                  onClick={() => handleCopy(result.alternative_titles[0])}
                  className="shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  {copied ? <span className="text-[10px] font-black text-green-400 uppercase">Copied</span> : <Copy className="w-4 h-4 text-white/40" />}
                </button>
              </div>

              {/* Other Items: Blurred for free users */}
              <div className="relative">
                <div className={cn("space-y-4 transition-all duration-700", !isPro && "blur-md pointer-events-none select-none")}>
                  {result.alternative_titles.slice(1, 5).map((alt, i) => (
                    <div key={i} className="liquid-glass rounded-xl p-5 border border-white/5 opacity-40">
                      <span className="text-sm text-white/80 italic">"{alt}"</span>
                    </div>
                  ))}
                </div>

                {!isPro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 shadow-2xl">
                      <Lock className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h4 className="text-lg font-heading italic text-white mb-2">Unlock 4 more title ideas</h4>
                    <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.2em] mb-8">Exclusive for TitleIQ Pro</p>
                    <Link 
                      to="/upgrade"
                      className="bg-indigo-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                    >
                      Upgrade to Pro →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── G) KEYWORD GAP PANEL ─── */}
      <KeywordPanel 
        analysisId={analysisId}
        title={title}
        niche={niche}
        currentScore={result.overall_score}
        isPro={isPro}
        onRewriteAnalyzed={handleRewriteAnalyzed}
      />

      {/* ─── F) FOOTER & RESET ─── */}
      <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-8">
        {!isPro && (
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">
            {user ? `You have ${remainingToday} analyses left today` : "Sign in to save this result and get 3 analyses/day"}
          </div>
        )}

        <Link 
          to={`/simulator?title=${encodeURIComponent(title)}&niche=${encodeURIComponent(niche)}`}
          className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all"
        >
          See how this ranks vs competitors <ChevronRight className="w-4 h-4" />
        </Link>

        <button 
          onClick={onReset}
          className="flex items-center gap-3 text-white/40 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.4em]"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Analyze another title
        </button>

        {remainingToday === 0 && !isPro && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 w-full text-center">
            <p className="text-amber-500 text-sm font-bold italic">You've used all your free analyses today. Upgrade to Pro for unlimited scores.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SubScoreBar = ({ label, score, index }: { label: string; score: number; index: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 200 + index * 150);
    return () => clearTimeout(timer);
  }, [score, index]);

  const colorClass = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
  const textColorClass = score >= 70 ? 'text-green-500' : score >= 40 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
        <span className="text-white/60">{label}</span>
        <span className={textColorClass}>{score}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000 ease-out", colorClass)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};
