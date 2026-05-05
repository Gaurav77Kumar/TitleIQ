import React, { useState } from 'react';
import { TitleForm } from '../components/TitleForm';
import { ScoreResults } from '../components/ScoreResults';
import { LimitModal } from '../components/LimitModal';
import { Hero } from '../components/landing/Hero';
import { FeaturesChess } from '../components/landing/FeaturesChess';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import type { ScoreResult } from '@titleiq/shared';
import { motion, AnimatePresence } from 'motion/react';

type AppState = 'idle' | 'loading' | 'result' | 'limit_reached';

export const Home: React.FC = () => {
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [title, setTitle] = useState('');
  const [analysisId, setAnalysisId] = useState('');
  const [niche, setNiche] = useState('');
  const [remainingToday, setRemainingToday] = useState(3);

  const handleResult = (scoreResult: ScoreResult, inputTitle: string, inputNiche: string) => {
    setResult(scoreResult);
    setTitle(inputTitle);
    setNiche(inputNiche);
    setAnalysisId(crypto.randomUUID()); // In real app, from backend
    setRemainingToday(prev => Math.max(0, prev - 1));
    setState('result');
    
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setTitle('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full">
      <Hero />
      
      <div id="analyzer" className="py-24 px-6 lg:px-16 w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading italic text-white tracking-tight leading-[0.9] mb-6">
            Score Your <br /> <span className="text-white/20">YouTube Title.</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base font-light max-w-lg mx-auto">
            Get an instant CTR score, detailed psychological sub-scores, and 5 data-backed alternative title ideas.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {state === 'idle' || state === 'loading' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TitleForm 
                onResult={handleResult} 
                onLimitReached={() => setState('limit_reached')} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              id="results-section"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="pt-12"
            >
              {result && (
                <ScoreResults 
                  result={result} 
                  title={title}
                  niche={niche}
                  analysisId={analysisId}
                  remainingToday={remainingToday}
                  onReset={handleReset}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FeaturesChess />
      <FeaturesGrid />

      {state === 'limit_reached' && (
        <LimitModal onClose={() => setState('idle')} />
      )}
    </div>
  );
};
