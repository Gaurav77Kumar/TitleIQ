import { Router } from 'express';
import { sql } from '../db/index.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/authenticate.js';
import type { HistoryResponse, ApiError } from '@titleiq/shared';

const router = Router();

/**
 * GET /api/history
 * Returns the last 20 analyses for the authenticated user.
 */
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const rows = await sql`
      SELECT id, user_id, title_input, thumbnail_url, score_json, created_at
      FROM analyses
      WHERE user_id = ${req.user!.id}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    const response: HistoryResponse = {
      success: true,
      data: rows.map(row => ({
        id: row.id as string,
        userId: row.user_id as string,
        titleInput: row.title_input as string,
        niche: null, // Niche not currently persisted in schema
        thumbnailUrl: row.thumbnail_url as string,
        scoreJson: row.score_json as any,
        createdAt: row.created_at instanceof Date 
          ? row.created_at.toISOString() 
          : new Date(row.created_at as string).toISOString(),
      })),
    };
    
    res.status(200).json(response);
  } catch (err: any) {
    console.error('History fetch error detail:', err);
    const error: ApiError = { success: false, error: err.message || 'Failed to retrieve analysis history.' };
    res.status(500).json(error);
  }
});

export default router;
