import { Router } from 'express';
import crypto from 'crypto';
import { sql } from '../db/index.js';
import type { AdminStatsResponse, ApiError } from '@titleiq/shared';

const router = Router();

/**
 * GET /api/admin/stats
 * Returns aggregate platform statistics.
 * Protected by X-Admin-Secret header.
 */
router.get('/stats', async (req, res) => {
  const providedSecret = req.headers['x-admin-secret'];
  const actualSecret = process.env.ADMIN_SECRET;

  if (!actualSecret || !providedSecret) {
    return res.status(401).json({ success: false, error: 'Unauthorized admin access.' });
  }

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(providedSecret as string),
      Buffer.from(actualSecret)
    );

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Unauthorized admin access.' });
    }
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Unauthorized admin access.' });
  }

  try {
    const [usersResult] = await sql`SELECT COUNT(*)::int as count FROM users`;
    const [analysesResult] = await sql`SELECT COUNT(*)::int as count FROM analyses`;
    const [proUsersResult] = await sql`SELECT COUNT(*)::int as count FROM users WHERE tier = 'pro'`;

    const response: AdminStatsResponse = {
      success: true,
      stats: {
        totalUsers: usersResult.count,
        totalAnalyses: analysesResult.count,
        proUsers: proUsersResult.count,
      },
    };
    
    res.status(200).json(response);
  } catch (err) {
    console.error('Admin stats error:', err);
    const error: ApiError = { success: false, error: 'Failed to fetch admin statistics.' };
    res.status(500).json(error);
  }
});

export default router;
