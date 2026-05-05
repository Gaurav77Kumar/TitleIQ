import React from 'react';
import { CheckCircle2, Smartphone, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import type { ThumbnailScoreResult } from '@titleiq/shared';
import { clsx } from 'clsx';

interface ThumbnailResultsProps {
  result: ThumbnailScoreResult;
  thumbnailBase64?: string;
  thumbnailMimeType?: string;
}

export const ThumbnailResults: React.FC<ThumbnailResultsProps> = ({
  result,
  thumbnailBase64,
  thumbnailMimeType,
}) => {
  const imageUrl = thumbnailBase64 ? `data:${thumbnailMimeType};base64,${thumbnailBase64}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* Hero Score Section */}
      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row items-center gap-12">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="16"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
              strokeDasharray={628}
              strokeDashoffset={628 - (628 * result.overall_score) / 100}
              strokeLinecap="round"
              className={clsx(
                "transition-all duration-[1500ms] ease-out",
                result.overall_score >= 80 ? "text-emerald-500" : 
                result.overall_score >= 50 ? "text-amber-500" : "text-rose-500"
              )}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-7xl font-black text-slate-900 tracking-tighter"
            >
              {result.overall_score}
            </motion.span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Rating</span>
          </div>
        </div>

        <div className="flex-1 space-y-8 w-full">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Analysis Complete</h2>
            <p className="text-slate-500 font-medium">AI has evaluated your visual strategy.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScoreCard label="Text Readability" score={result.sub_scores.text_readability} />
            <ScoreCard label="Face Impact" score={result.sub_scores.face_impact} />
            <ScoreCard label="Color Contrast" score={result.sub_scores.color_contrast} />
            <ScoreCard label="Clutter Score" score={result.sub_scores.clutter_score} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Mobile Preview Simulator */}
        <div className="bg-slate-950 rounded-[2rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Smartphone className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-black tracking-tight">Mobile Simulation</h3>
            </div>
            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-300">
              Real-size
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-50" />
              <div className="relative p-2.5 bg-slate-900 rounded-xl shadow-2xl border border-white/10 ring-1 ring-white/5">
                <div 
                  className="overflow-hidden rounded-md bg-slate-800"
                  style={{ width: '120px', height: '68px' }}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="Mobile preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-[8px] px-1 font-bold rounded-sm border border-white/10">14:02</div>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs text-center leading-relaxed max-w-[240px]">
              This is the exact size of a thumbnail in the YouTube mobile feed. 
              <span className="text-indigo-300 block mt-1 font-semibold">If your text is unreadable here, you're losing clicks.</span>
            </p>
          </div>
        </div>

        {/* Actionable Tips */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-10 text-white space-y-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black tracking-tight">AI Strategy Fixes</h3>
          </div>

          <div className="space-y-4">
            {result.improvements.map((tip, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                className="flex gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="w-6 h-6 bg-emerald-400/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-white/90 text-sm leading-relaxed font-semibold">{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ScoreCard = ({ label, score }: { label: string; score: number }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group">
    <div className="flex justify-between items-end mb-3">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={clsx(
        "text-sm font-black",
        score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-rose-600"
      )}>{score}%</span>
    </div>
    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          "h-full rounded-full",
          score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
        )}
      />
    </div>
  </div>
);
