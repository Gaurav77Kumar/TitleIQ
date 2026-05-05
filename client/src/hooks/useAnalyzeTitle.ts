import { useState } from 'react';
import { api } from '../lib/api';
import type { AnalyzeTitleResponse, ScoreResult } from '@titleiq/shared';

interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: ScoreResult | null;
  analysisId: string | null;
  error: string | null;
}

export function useAnalyzeTitle() {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    analysisId: null,
    error: null,
  });

  const analyze = async (title: string, niche?: string) => {
    setState({ status: 'loading', data: null, analysisId: null, error: null });

    try {
      const res = await api.post<AnalyzeTitleResponse>('/analyze-title', {
        title,
        niche: niche || undefined,
      });

      if (!res.success) {
        const errorObj = (res as any).error;
        const message = typeof errorObj === 'string'
          ? errorObj
          : errorObj?.issues?.join(', ') || 'An unknown error occurred';
        throw new Error(message);
      }

      setState({
        status: 'success',
        data: res.data,
        analysisId: res.analysisId,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setState({ status: 'error', data: null, analysisId: null, error: message });
    }
  };

  const reset = () =>
    setState({ status: 'idle', data: null, analysisId: null, error: null });

  return { ...state, analyze, reset };
}
