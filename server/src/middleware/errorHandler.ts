import type { Request, Response, NextFunction } from 'express';
import type { ApiError } from '@titleiq/shared';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('❌ Unhandled error:', err.message);
  console.error(err.stack);

  const response: ApiError = {
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  };

  res.status(500).json(response);
}
