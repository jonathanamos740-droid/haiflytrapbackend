import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
/**
 * Middleware: Verify Supabase JWT from Authorization header.
 * Attaches `req.user` with id, email, and role from public.users table.
 */
export declare function authMiddleware(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map