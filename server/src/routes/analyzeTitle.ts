import { Router, type Request, type Response } from 'express';
import { analyzeTitle } from '../services/llm.js';
import { sql } from '../db/index.js';
import type {
  AnalyzeTitleRequest,
  AnalyzeTitleResponse,
  ApiError,
} from '@titleiq/shared';
import { rateLimiter } from '../middleware/rateLimiter.js';
import type { AuthenticatedRequest } from '../middleware/authenticate.js';

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

function validateBody(body: unknown): AnalyzeTitleRequest {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Request body must be a JSON object.');
  }
  const { title, niche } = body as Record<string, unknown>;

  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new ValidationError('`title` is required and must be a non-empty string.');
  }
  if (title.trim().length > 200) {
    throw new ValidationError('`title` must be 200 characters or fewer.');
  }
  if (niche !== undefined && typeof niche !== 'string') {
    throw new ValidationError('`niche` must be a string if provided.');
  }

  return {
    title: title.trim(),
    niche: typeof niche === 'string' ? niche.trim() || undefined : undefined,
  };
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ─── POST /api/analyze-title ──────────────────────────────────────────────────

router.post('/', rateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const ip = getClientIp(req);

  // 1. Validate request body
  let input: AnalyzeTitleRequest;
  try {
    input = validateBody(req.body);
  } catch (err) {
    if (err instanceof ValidationError) {
      const error: ApiError = { success: false, error: err.message, code: 'VALIDATION_ERROR' };
      res.status(400).json(error);
      return;
    }
    throw err;
  }

  // 2. Call Claude
  let scoreResult;
  try {
    scoreResult = await analyzeTitle(input.title, input.niche);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed.';
    const error: ApiError = { success: false, error: message, code: 'LLM_ERROR' };
    res.status(502).json(error);
    return;
  }

  // 3. Persist analysis + log usage (fire-and-forget — don't block the response)
  let analysisId: string = crypto.randomUUID();

  if (process.env.DATABASE_URL) {
    try {
      const [row] = await sql`
        INSERT INTO analyses (user_id, title_input, thumbnail_url, score_json)
        VALUES (${req.user?.id || null}, ${input.title}, NULL, ${JSON.stringify(scoreResult)}::jsonb)
        RETURNING id
      `;
      if (row?.id) analysisId = row.id as string;

      // Log usage (non-blocking)
      sql`
        INSERT INTO usage_logs (ip_address, user_id)
        VALUES (${ip}, ${req.user?.id || null})
      `.catch((e: unknown) => console.warn('usage_logs insert failed:', e));
    } catch (err) {
      // DB failure should not kill the response — log and continue
      console.warn('⚠️  DB insert failed (returning result anyway):', err);
    }
  } else {
    console.warn('⚠️  DATABASE_URL not set — skipping DB persistence.');
  }

  // 4. Return result
  const response: AnalyzeTitleResponse = {
    success: true,
    data: scoreResult,
    analysisId,
  };

  res.status(200).json(response);
});

export default router;
