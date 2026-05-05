import React, { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Lock, 
  Sparkles, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { KeywordResult, MissingKeyword } from '@titleiq/shared';

interface KeywordPanelProps {
  analysisId: string;
  title: string;
  niche: string;
  currentScore: number;
  isPro: boolean;
  onRewriteAnalyzed: (newResult: any, newTitle: string) => void;
}

export const KeywordPanel: React.FC<KeywordPanelProps> = ({ 
  analysisId, 
  title, 
  niche, 
  currentScore, 
  isPro,
  onRewriteAnalyzed
}) => {
  const [state, setState] = useState<'idle' | 'loading' | 'result' | 'error'>('idle');
  const [result, setResult] = useState<KeywordResult | null>(null);
  const [rewrittenTitle, setRewrittenTitle] = useState('');
  const [isAnalyzingRewrite, setIsAnalyzingRewrite] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchKeywords = async () => {
    if (!isPro) return;
    setState('loading');
    try {
      const res = await api.post<{ success: true, data: KeywordResult }>('/analyze/keywords', {
        analysisId,
        title,
        niche,
        currentScore
      });
      if (res.success) {
        setResult(res.data);
        setRewrittenTitle(res.data.rewritten_title);
        setState('result');
      }
    } catch (err) {
      console.error('Failed to fetch keywords:', err);
      setState('error');
    }
  };

  const handleAnalyzeRewrite = async () => {
    setIsAnalyzingRewrite(true);
    try {
      const res = await api.post<any>('/analyze/title', { 
        title: rewrittenTitle, 
        niche 
      });
      if (res.success) {
        onRewriteAnalyzed(res.data, rewrittenTitle);
      }
    } catch (err) {
      console.error('Failed to analyze rewrite:', err);
    } finally {
      setIsAnalyzingRewrite(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenTitle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addKeywordToTitle = (keyword: string) => {
    setRewrittenTitle(prev => {
      const trimmed = prev.trim();
      return trimmed.endsWith('.') || trimmed.endsWith('!') || trimmed.endsWith('?') 
        ? `${trimmed} ${keyword}`
        : `${trimmed} — ${keyword}`;
    });
  };

  // ─── Render: Non-Pro ───
  if (!isPro) {
    return (
      <div className="relative mt-12">
        <div className="liquid-glass rounded-[2.5rem] p-10 border border-white/5 opacity-50 blur-[2px] pointer-events-none select-none">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">Keyword Gap Analysis</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="h-4 w-16 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 flex items-center justify-center mb-8 shadow-2xl">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-2xl font-heading italic text-white mb-3">3 high-volume keywords found</h3>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Optimized for your "{niche}" niche</p>
          <Link 
            to="/upgrade"
            className="bg-amber-500 text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
          >
            Unlock with Pro →
          </Link>
        </div>
      </div>
    );
  }

  // ─── Render: Loading ───
  if (state === 'loading') {
    return (
      <div className="mt-12 liquid-glass rounded-[2.5rem] p-10 border border-indigo-500/10 space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 w-40 bg-white/5 rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Render: Idle ───
  if (state === 'idle') {
    return (
      <div className="mt-12 text-center">
        <button 
          onClick={fetchKeywords}
          className="group flex flex-col items-center gap-6 w-full liquid-glass rounded-[2.5rem] p-12 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-heading italic text-white mb-2">Find missing high-value keywords</h3>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">AI-powered SEO Gap Analysis</p>
          </div>
        </button>
      </div>
    );
  }

  // ─── Render: Result ───
  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="liquid-glass rounded-[2.5rem] p-10 border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-10">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Keyword Gap Fixed</h3>
        </div>

        {/* Keyword Table */}
        <div className="overflow-hidden border border-white/5 rounded-2xl bg-white/[0.02]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Keyword</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Est. Searches</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Difficulty</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {result?.missing_keywords.map((kw, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-6">
                    <div className="font-bold text-white mb-1">{kw.keyword}</div>
                    <div className="text-xs text-white/30 font-medium">{kw.reason}</div>
                  </td>
                  <td className={cn(
                    "px-6 py-6 font-mono font-bold",
                    kw.monthly_searches > 10000 ? "text-green-400" : kw.monthly_searches > 1000 ? "text-amber-400" : "text-white/40"
                  )}>
                    {kw.monthly_searches.toLocaleString()}
                  </td>
                  <td className="px-6 py-6">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded",
                      kw.difficulty === 'low' ? "bg-green-500/20 text-green-400" : 
                      kw.difficulty === 'medium' ? "bg-amber-500/20 text-amber-400" : 
                      "bg-red-500/20 text-red-400"
                    )}>
                      {kw.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <button 
                      onClick={() => addKeywordToTitle(kw.keyword)}
                      className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rewritten Title Section */}
      <div className="liquid-glass-strong rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Suggested Rewrite</label>
          <div className="flex items-center gap-3">
             <span className="text-green-400 text-xs font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full">
               + {result?.score_delta} points
             </span>
             <span className={cn("text-[10px] font-bold tracking-widest", rewrittenTitle.length > 80 ? "text-red-500" : "text-white/20")}>
               {rewrittenTitle.length} / 80
             </span>
          </div>
        </div>

        <div className="relative group mb-8">
          <textarea
            value={rewrittenTitle}
            onChange={(e) => setRewrittenTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg text-white font-heading italic focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all min-h-[100px] resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAnalyzeRewrite}
            disabled={isAnalyzingRewrite || rewrittenTitle.length > 80}
            className="flex-1 bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isAnalyzingRewrite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-black" />}
            Analyze Rewritten Title
          </button>
          <button
            onClick={handleCopy}
            className="px-8 py-5 rounded-2xl border border-white/10 text-white/60 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy Title"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const Zap = ({ className, fill }: { className?: string; fill?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
