import type { Response, NextFunction, Request } from 'express';
import { sql } from '../db/index.js';
import type { AuthenticatedRequest } from './authenticate.js';
import type { RateLimitError } from '@titleiq/shared';

export async function rateLimiter(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ip = req.ip || 'unknown';
  const userId = req.user?.id;

  // Pro users bypass the rate limit
  if (req.user?.tier === 'pro') {
    return next();
  }

  let count = 0;

  try {
    if (userId) {
      // Check usage by user_id for authenticated free users
      const [row] = await sql`
        SELECT COUNT(*)::int as count FROM usage_logs
        WHERE user_id = ${userId}
        AND created_at > now() - interval '24 hours'
      `;
      count = row.count;
    } else {
      // Check usage by IP for anonymous users
      const [row] = await sql`
        SELECT COUNT(*)::int as count FROM usage_logs
        WHERE ip_address = ${ip}
        AND user_id IS NULL
        AND created_at > now() - interval '24 hours'
      `;
      count = row.count;
    }
  } catch (err) {
    console.warn('Rate limiter DB check failed:', err);
    // On DB failure, we fail-safe and allow the request
    return next();
  }

  if (count >= 10) {
    const error: RateLimitError = {
      success: false,
      error: "Daily limit reached. Sign in or upgrade for more.",
      code: 'RATE_LIMIT_EXCEEDED',
      limitReached: true
    };
    return res.status(429).json(error);
  }

  next();
}
