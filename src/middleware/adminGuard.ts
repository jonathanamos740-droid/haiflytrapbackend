import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Middleware: Ensure the authenticated user has an admin role.
 * Must be used AFTER authMiddleware.
 */
export function adminGuard(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin access required. Your role: ' + req.user.role,
    });
    return;
  }

  next();
}
