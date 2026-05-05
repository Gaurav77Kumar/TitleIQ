import type { ScoreResult, ThumbnailScoreResult, Analysis } from './analysis';
import type { User } from './user';

// --- Analyze Endpoint ---

export interface AnalyzeTitleRequest {
  title: string;
  niche?: string;
}

export interface AnalyzeTitleResponse {
  success: true;
  data: ScoreResult;
  analysisId: string;
}

// --- Analyze Thumbnail ---

export interface AnalyzeThumbnailRequest {
  imageBase64: string;
  mimeType: string;
}

export interface AnalyzeThumbnailResponse {
  success: true;
  data: ThumbnailScoreResult;
  analysisId: string;
}

// --- Generic Error ---

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export interface RateLimitError extends ApiError {
  code: 'RATE_LIMIT_EXCEEDED';
  limitReached: true;
}

// --- Auth ---

export interface AuthSendOtpRequest {
  email: string;
}

export interface AuthVerifyOtpRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  success: true;
  user: User;
  token: string;
}

// --- Health Check ---

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

// --- History ---

export interface HistoryResponse {
  success: true;
  data: Analysis[];
}

// --- Billing ---

export interface CreateOrderResponse {
  success: true;
  order_id: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// --- Admin ---

export interface AdminStatsResponse {
  success: true;
  stats: {
    totalUsers: number;
    totalAnalyses: number;
    proUsers: number;
  };
}

// Union helpers
export type ApiResponse<T> = T | ApiError;
