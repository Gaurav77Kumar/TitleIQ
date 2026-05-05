import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { HistoryResponse, Analysis } from '@titleiq/shared';
import { ScoreResults } from '../components/ScoreResults';
import { ThumbnailResults } from '../components/landing/ThumbnailResults';
import { motion } from 'motion/react';
import { Calendar, Eye, ChevronLeft } from 'lucide-react';

export const HistoryPage = () => {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    api.get<HistoryResponse>('/history')
      .then(res => {
        if (res.success) setHistory(res.data);
      })
      .catch(err => console.error('History load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (selectedAnalysis) {
    const isThumbnail = selectedAnalysis.titleInput === '[Thumbnail Only]' || !!selectedAnalysis.thumbnailUrl;

    return (
      <div className="pt-32 pb-24 px-6 lg:px-16 max-w-[1000px] mx-auto">
        <button 
          onClick={() => setSelectedAnalysis(null)}
          className="flex items-center gap-2 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] mb-12 transition-all hover:translate-x-[-4px]"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Analysis History
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isThumbnail ? (
             <ThumbnailResults 
              result={selectedAnalysis.scoreJson as any} 
              // Note: base64 won't be available for historical records unless stored/fetched
             />
          ) : (
             <ScoreResults 
              result={selectedAnalysis.scoreJson as any} 
              title={selectedAnalysis.titleInput}
              niche={selectedAnalysis.niche || 'Other'}
              analysisId={selectedAnalysis.id}
              remainingToday={5}
              onReset={() => setSelectedAnalysis(null)}
             />
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-16 max-w-[1000px] mx-auto">
      <div className="mb-16 text-center md:text-left">
        <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6 border border-white/10">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Personal Archive</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-heading italic text-white tracking-tighter leading-[0.85] mb-6">
          Your Growth <br /> <span className="text-white/20">Timeline.</span>
        </h1>
        <p className="text-white/50 font-body font-light text-lg max-w-xl">
          Review your strategic decisions and performance scores from your last 20 analyses.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-16 h-16 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Accessing Database</p>
        </div>
      ) : history.length === 0 ? (
        <div className="liquid-glass rounded-[2.5rem] p-24 text-center border border-white/5 shadow-2xl">
          <p className="text-white/20 font-black uppercase tracking-[0.2em] text-sm">No analysis history found yet.</p>
          <p className="text-white/40 mt-2 font-medium">Start analyzing titles or thumbnails to build your archive.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id}
              onClick={() => setSelectedAnalysis(item)}
              className="liquid-glass rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/[0.07] transition-all cursor-pointer border border-white/5 shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-[1.25rem] flex flex-col items-center justify-center shrink-0 border border-white/10 shadow-inner group-hover:border-indigo-500/30 transition-colors">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter leading-none mb-1">Score</span>
                  <span className="text-3xl font-heading italic text-white leading-none">
                    {(item.scoreJson as any).overallScore || (item.scoreJson as any).overallThumbnailScore}
                  </span>
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-white font-bold text-xl md:text-2xl truncate leading-tight group-hover:text-indigo-300 transition-colors">
                    {item.titleInput === '[Thumbnail Only]' ? 'Visual Strategy Scan' : item.titleInput}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className={clsx(
                      "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                      item.titleInput === '[Thumbnail Only]' ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : "text-indigo-400 border-indigo-400/20 bg-indigo-400/5"
                    )}>
                      {item.titleInput === '[Thumbnail Only]' ? 'Thumbnail' : 'Title IQ'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <button className="flex-1 md:flex-none bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 group-hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
                  <Eye className="w-4 h-4" /> View Insights
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const clsx = (...args: any[]) => args.filter(Boolean).join(' ');
