import { useState } from 'react';
import { api } from '../lib/api';
import type { 
  AnalyzeThumbnailResponse, 
  ThumbnailScoreResult 
} from '@titleiq/shared';

interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: ThumbnailScoreResult | null;
  analysisId: string | null;
  error: string | null;
}

export function useAnalyzeThumbnail() {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    analysisId: null,
    error: null,
  });

  const analyze = async (imageBase64: string, mimeType: string) => {
    setState({ status: 'loading', data: null, analysisId: null, error: null });

    try {
      const res = await api.post<AnalyzeThumbnailResponse>('/analyze-thumbnail', {
        imageBase64,
        mimeType,
      });

      if (!res.success) {
        // Handle ApiError shape from shared types
        throw new Error((res as any).error || 'Thumbnail analysis failed');
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
