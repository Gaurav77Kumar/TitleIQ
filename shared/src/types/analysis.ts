// =====================================================
// ScoreResult — matches the Claude API JSON response
// (snake_case to stay consistent with Claude output)
// =====================================================

export interface SubScores {
  curiosity_gap: number;
  keyword_strength: number;
  emotional_pull: number;
  length_score: number;
}

export interface ScoreResult {
  overall_score: number;
  sub_scores: SubScores;
  strengths: string[];
  improvements: string[];
  alternative_titles: string[];
  score_reasoning?: string;
}

// =====================================================
// ThumbnailScoreResult — matches the Claude Vision JSON
// =====================================================

export interface ThumbnailSubScores {
  text_readability: number;
  face_impact: number;
  color_contrast: number;
  clutter_score: number;
}

export interface ThumbnailScoreResult {
  overall_score: number;
  sub_scores: ThumbnailSubScores;
  improvements: string[];
}

// =====================================================
// Analysis — stored in the `analyses` DB table
// =====================================================

export interface Analysis {
  id: string;
  userId: string | null;
  titleInput: string;
  niche: string | null;
  thumbnailUrl: string | null;
  scoreJson: ScoreResult | ThumbnailScoreResult;
  keywordData?: KeywordResult;
  createdAt: string;
}

export interface MissingKeyword {
  keyword: string;
  monthly_searches: number;
  difficulty: 'low' | 'medium' | 'high';
  reason: string;
}

export interface KeywordResult {
  missing_keywords: MissingKeyword[];
  rewritten_title: string;
  rewritten_score_estimate: number;
  score_delta: number;
}

export interface TitleRanking {
  title: string;
  is_user_title: boolean;
  estimated_ctr: number;
  rank: number;
  win_factors: string[];
  loss_factors: string[];
}

export interface SimulationResult {
  rankings: TitleRanking[];
  user_title_rank: number;
  user_wins_on: string[];
  user_loses_on: string[];
  one_fix: string;
}
