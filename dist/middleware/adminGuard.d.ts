import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
/**
 * Middleware: Ensure the authenticated user has an admin role.
 * Must be used AFTER authMiddleware.
 */
export declare function adminGuard(req: Request, res: Response<ApiResponse>, next: NextFunction): void;
//# sourceMappingURL=adminGuard.d.ts.map