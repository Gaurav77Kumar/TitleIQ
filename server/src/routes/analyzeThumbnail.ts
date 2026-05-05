import { Router, type Request, type Response } from 'express';
import { analyzeThumbnail } from '../services/llm.js';
import { sql } from '../db/index.js';
import type {
  AnalyzeThumbnailRequest,
  AnalyzeThumbnailResponse,
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

function validateBody(body: unknown): AnalyzeThumbnailRequest {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Request body must be a JSON object.');
  }
  const { imageBase64, mimeType } = body as Record<string, unknown>;

  if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
    throw new Error('`imageBase64` is required and must be a non-empty string.');
  }
  
  if (typeof mimeType !== 'string' || !['image/jpeg', 'image/png'].includes(mimeType)) {
    throw new Error('`mimeType` must be "image/jpeg" or "image/png".');
  }

  return {
    imageBase64,
    mimeType,
  };
}

// ─── POST /api/analyze-thumbnail ──────────────────────────────────────────────

router.post('/', rateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const ip = getClientIp(req);

  // 1. Validate request body
  let input: AnalyzeThumbnailRequest;
  try {
    input = validateBody(req.body);
  } catch (err) {
    const error: ApiError = { 
      success: false, 
      error: err instanceof Error ? err.message : 'Validation failed', 
      code: 'VALIDATION_ERROR' 
    };
    res.status(400).json(error);
    return;
  }

  // 2. Call Claude Vision
  let scoreResult;
  try {
    scoreResult = await analyzeThumbnail(input.imageBase64, input.mimeType);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Thumbnail analysis failed.';
    const error: ApiError = { success: false, error: message, code: 'LLM_ERROR' };
    res.status(502).json(error);
    return;
  }

  // 3. Persist analysis + log usage
  let analysisId: string = crypto.randomUUID();

  if (process.env.DATABASE_URL) {
    try {
      const [row] = await sql`
        INSERT INTO analyses (user_id, title_input, thumbnail_url, score_json)
        VALUES (${req.user?.id || null}, '[Thumbnail Only]', NULL, ${JSON.stringify(scoreResult)}::jsonb)
        RETURNING id
      `;
      if (row?.id) analysisId = row.id as string;

      // Log usage (non-blocking)
      sql`
        INSERT INTO usage_logs (ip_address, user_id)
        VALUES (${ip}, ${req.user?.id || null})
      `.catch((e: unknown) => console.warn('usage_logs insert failed:', e));
    } catch (err) {
      console.warn('⚠️  DB insert failed:', err);
    }
  }

  // 4. Return result
  const response: AnalyzeThumbnailResponse = {
    success: true,
    data: scoreResult,
    analysisId,
  };

  res.status(200).json(response);
});

export default router;
