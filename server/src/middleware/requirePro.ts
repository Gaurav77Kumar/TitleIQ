import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './authenticate';

export const requirePro = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Temporarily allow all authenticated users to use all features
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }
  next();
};
