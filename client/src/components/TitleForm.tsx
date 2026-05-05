import React, { useState, useEffect } from 'react';
import type { ScoreResult, ApiError } from '@titleiq/shared';
import { api } from '../lib/api';
import { Loader2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface TitleFormProps {
  onResult: (result: ScoreResult, title: string, niche: string) => void;
  onLimitReached: () => void;
}

export const TitleForm: React.FC<TitleFormProps> = ({ onResult, onLimitReached }) => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [niches, setNiches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch niches from backend
    api.get<{ niches: string[] }>('/analyze/niches')
      .then(res => setNiches(res.niches))
      .catch(err => console.error('Failed to fetch niches:', err));
  }, []);

  const charCount = title.length;
  const isAmber = charCount >= 120 && charCount < 145;
  const isRed = charCount >= 145;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 10) {
      setError('Title must be at least 10 characters.');
      return;
    }
    if (!niche) {
      setError('Please select a niche.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post<any>('/analyze/title', { title, niche });
      if (res.success) {
        onResult(res.data, title, niche);
      } else {
        if (res.code === 'RATE_LIMIT_EXCEEDED') {
          onLimitReached();
        } else {
          setError(res.error || 'Something went wrong.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze title. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Video Title</label>
          <span className={cn(
            "text-[10px] font-bold tracking-widest",
            isRed ? "text-red-500" : isAmber ? "text-amber-500" : "text-white/20"
          )}>
            {charCount} / 150
          </span>
        </div>
        <div className="relative group">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Paste your YouTube title here…"
            maxLength={150}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-lg text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all min-h-[120px] resize-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Select Niche</label>
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth">
          {niches.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setNiche(n);
                if (error?.includes('niche')) setError(null);
              }}
              className={cn(
                "whitespace-nowrap px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border",
                niche === n 
                  ? "bg-white text-black border-white shadow-xl shadow-white/10" 
                  : "bg-white/[0.03] text-white/40 border-white/5 hover:border-white/20 hover:bg-white/[0.06]"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all active:scale-[0.98] shadow-2xl shadow-white/5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing…</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-black" />
              <span>Analyze my title</span>
            </>
          )}
        </button>

        {error && (
          <p className="text-center text-red-400 text-xs font-bold uppercase tracking-wider animate-in fade-in zoom-in-95 duration-200">
            {error}
          </p>
        )}
      </div>
    </form>
  );
};
