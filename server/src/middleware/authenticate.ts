import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.js';
import { sql } from '../db/index.js';
import type { User } from '@titleiq/shared';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Optional authentication middleware.
 * If a valid JWT is present, attaches the user to req.user.
 */
export async function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.titleiq_token;
  
  let token: string | null = null;
  
  if (cookieToken) {
    token = cookieToken;
  } else if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  const payload = verifyToken(token);

  if (payload) {
    try {
      const [user] = await sql`SELECT * FROM users WHERE id = ${payload.sub}`;
      if (user) {
        req.user = {
          id: user.id as string,
          email: user.email as string,
          tier: user.tier as any,
          createdAt: (user.created_at as Date).toISOString(),
        };
      }
    } catch (err) {
      console.warn('Authentication DB lookup failed:', err);
    }
  }

  next();
}

/**
 * Strict authentication middleware.
 * Requires req.user to be present (from the authenticate middleware).
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  next();
}
