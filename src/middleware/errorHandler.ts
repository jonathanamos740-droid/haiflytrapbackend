import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Global error handler — catches all unhandled errors.
 * Returns a consistent ApiResponse shape.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  console.error('─── Unhandled Error ───');
  console.error(err.stack || err.message);

  // Multer file size error
  if (err.message === 'File too large') {
    res.status(413).json({
      success: false,
      error: 'File too large. Maximum size is 5MB.',
    });
    return;
  }

  // CORS error
  if (err.message.startsWith('CORS policy:')) {
    res.status(403).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Multer file filter error
  if (err.message.includes('images are allowed')) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
    return;
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
}
