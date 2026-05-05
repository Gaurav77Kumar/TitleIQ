import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { HistoryResponse, Analysis } from '@titleiq/shared';
import { ProGate } from '../components/auth/ProGate';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeftRight, Search, X, CheckCircle2 } from 'lucide-react';

export const ComparePage = () => {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [left, setLeft] = useState<Analysis | null>(null);
  const [right, setRight] = useState<Analysis | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get<HistoryResponse>('/history').then(res => {
      if (res.success) setHistory(res.data);
    });
  }, []);

  const filtered = history.filter(h =>
    h.titleInput.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProGate
      title="A/B Strategic Comparison"
      description="Unlock the ability to compare multiple variants side-by-side to find your winning combination."
    >
      <div className="pt-32 pb-24 px-6 lg:px-16 max-w-[1200px] mx-auto">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-heading italic text-white tracking-tighter leading-none mb-4">
              A/B <span className="text-white/20">Compare.</span>
            </h1>
            <p className="text-white/50 font-body font-light text-lg">Cross-examine two analyses to identify patterns and performance peaks.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search your archive..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Comparison Dashboard */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-full border-4 border-black text-white shadow-2xl">
            <ArrowLeftRight className="w-6 h-6" />
          </div>

          <CompareSlot
            analysis={left}
            label="Variant A"
            onClear={() => setLeft(null)}
          />
          <CompareSlot
            analysis={right}
            label="Variant B"
            onClear={() => setRight(null)}
            highlight={left && right ? (right.scoreJson as any).overallScore > (left.scoreJson as any).overallScore : undefined}
          />
        </div>

        {/* Selection Interface */}
        <div className="liquid-glass rounded-[2.5rem] p-10 border border-white/5 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-white/10" /> Select Analyses
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => {
              const isSelected = item.id === left?.id || item.id === right?.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!left) setLeft(item);
                    else if (!right && item.id !== left.id) setRight(item);
                  }}
                  disabled={isSelected}
                  className={clsx(
                    "relative p-5 rounded-2xl text-left transition-all border group overflow-hidden",
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500/40 opacity-50 cursor-default"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:translate-y-[-2px] active:scale-[0.98]"
                  )}
                >
                  <p className="text-white font-bold text-sm truncate pr-6 group-hover:text-indigo-300 transition-colors">
                    {item.titleInput === '[Thumbnail Only]' ? 'Thumbnail Strategy' : item.titleInput}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                      Score: {(item.scoreJson as any).overallScore || (item.scoreJson as any).overallThumbnailScore}
                    </span>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ProGate>
  );
};

const CompareSlot = ({ analysis, label, onClear, highlight = false }: { analysis: Analysis | null, label: string, onClear: () => void, highlight?: boolean }) => {
  return (
    <div className={clsx(
      "liquid-glass rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[400px] border relative transition-all duration-500",
      analysis ? "border-white/10" : "border-dashed border-white/10",
      highlight && "ring-4 ring-indigo-500/20 border-indigo-500/40 bg-indigo-500/[0.03]"
    )}>
      {analysis ? (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{label}</span>
            <button onClick={onClear} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-4 h-4 text-white/40" />
            </button>
          </div>

          <div className="mb-10 text-center">
            <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Overall Quality</div>
            <div className="text-8xl font-heading italic text-white leading-none tracking-tighter mb-4">
              {(analysis.scoreJson as any).overallScore || (analysis.scoreJson as any).overallThumbnailScore}
            </div>
            <p className="text-white font-bold text-xl line-clamp-2 max-w-sm mx-auto h-14">
              {analysis.titleInput === '[Thumbnail Only]' ? 'Thumbnail Strategy' : `"${analysis.titleInput}"`}
            </p>
          </div>

          <div className="space-y-6 flex-1">
            {(analysis.scoreJson as any).subScores ? (
              Object.entries((analysis.scoreJson as any).subScores).map(([key, val]: any) => (
                <div key={key}>
                  <div className="flex justify-between text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">
                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white">{val}/100</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-6">
                {['readability', 'faceImpact', 'colorContrast', 'clutter'].map(key => {
                  const val = (analysis.scoreJson as any)[key + 'Score'];
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">
                        <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-white">{val}/100</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/5">
            <span className="text-3xl font-heading italic text-white/10">{label.includes('A') ? 'A' : 'B'}</span>
          </div>
          <p className="text-white/40 font-black uppercase tracking-[0.2em] text-xs">Select a Variant</p>
          <p className="text-white/20 text-[10px] mt-2 max-w-[160px]">Choose an analysis from your history below to populate this slot.</p>
        </div>
      )}
    </div>
  );
};

const clsx = (...args: any[]) => args.filter(Boolean).join(' ');
