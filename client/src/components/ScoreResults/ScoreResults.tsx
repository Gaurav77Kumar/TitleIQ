import { useState, useEffect } from 'react';
import type { ScoreResult, UserTier } from '@titleiq/shared';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Sparkles, Lock, CheckCircle2, AlertTriangle, Copy, ArrowRight } from 'lucide-react';

interface ScoreResultsProps {
  result: ScoreResult;
  title: string;
  onReset: () => void;
  userTier?: UserTier;
}

// Helper for color coding
function getScoreColor(score: number) {
  if (score >= 70) return 'text-green-500';
  if (score >= 40) return 'text-amber-500';
  return 'text-red-500';
}

function getBgColor(score: number) {
  if (score >= 70) return 'bg-green-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function SubScoreBar({ label, score }: { label: string; score: number }) {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => setFill(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center text-sm">
        <span className="text-white">{label}</span>
        <span className={cn("font-bold font-body", getScoreColor(score))}>{score}/100</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", getBgColor(score))}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreResults({ result, title, onReset, userTier = 'free' }: ScoreResultsProps) {
  const { overall_score, sub_scores, strengths, improvements, alternative_titles } = result;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Analyzed Title Preview */}
      <div className="liquid-glass rounded-2xl p-6 text-center">
        <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block font-semibold">Analyzed Title</span>
        <p className="text-lg md:text-xl font-medium text-white italic">"{title}"</p>
      </div>

      {/* Top section: Overall Score & Sub-scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <div className="liquid-glass rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs uppercase tracking-wider text-white/50 mb-4 font-semibold">Overall Score</h3>
          <div className={cn("text-7xl font-heading italic font-black leading-none mb-2", getScoreColor(overall_score))}>
            {overall_score}
          </div>
          <div className="text-white/40 text-sm">out of 100</div>
        </div>

        {/* Sub-scores */}
        <div className="liquid-glass rounded-2xl p-6 md:col-span-2 flex flex-col justify-center gap-5">
          <SubScoreBar label="Curiosity Gap" score={sub_scores.curiosity_gap} />
          <SubScoreBar label="Keyword Strength" score={sub_scores.keyword_strength} />
          <SubScoreBar label="Emotional Pull" score={sub_scores.emotional_pull} />
          <SubScoreBar label="Title Length" score={sub_scores.length_score} />
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="liquid-glass rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Strengths
          </h3>
          <ul className="space-y-4">
            {strengths.map((strength, i) => (
              <li key={i} className="text-sm text-white/90 flex items-start gap-3">
                <span className="text-green-500 mt-0.5">•</span>
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="liquid-glass rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Improvements
          </h3>
          <ul className="space-y-4">
            {improvements.map((improvement, i) => (
              <li key={i} className="text-sm text-white/90 flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">•</span>
                <span className="leading-relaxed">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Alternative Titles */}
      <div className="liquid-glass rounded-2xl p-6 relative overflow-hidden">
        <h3 className="text-lg font-medium text-white mb-6">Alternative Titles</h3>
        
        <div className="flex flex-col gap-3">
          {/* First Alternative (Free) */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="text-sm text-white/90">
              {alternative_titles[0]}
            </div>
            <button 
              onClick={() => handleCopy(alternative_titles[0])}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Blurred Alternatives (Pro Only) */}
          {userTier === 'free' && (
            <div className="relative">
              <div className="flex flex-col gap-3 opacity-30 select-none pointer-events-none">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5">
                    <div className="text-sm blur-sm text-white/30">
                      This is a highly optimized pro variation for your video
                    </div>
                    <Lock className="w-4 h-4 text-white/10" />
                  </div>
                ))}
              </div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12">
                <div className="liquid-glass-strong rounded-2xl p-6 flex flex-col items-center text-center max-w-sm mx-auto shadow-2xl border-indigo-500/20">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Unlock 4 more variations</h4>
                  <p className="text-white/50 text-xs mb-6">Our AI generated 4 more hooks for this title. Upgrade to Pro to see all variations and boost your CTR.</p>
                  <Link 
                    to="/upgrade"
                    className="bg-white text-black rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2 active:scale-95"
                  >
                    Upgrade to Pro <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* If Pro, show the rest of the actual titles */}
          {userTier === 'pro' && alternative_titles.slice(1).map((altTitle, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="text-sm text-white/90">
                {altTitle}
              </div>
              <button 
                onClick={() => handleCopy(altTitle)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-4">
        <button 
          onClick={onReset}
          className="liquid-glass rounded-full px-6 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          Analyze Another Title
        </button>
      </div>

    </div>
  );
}
