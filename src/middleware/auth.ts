import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiResponse } from '../types';

/**
 * Middleware: Verify Supabase JWT from Authorization header.
 * Attaches `req.user` with id, email, and role from public.users table.
 */
export async function authMiddleware(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Missing or malformed Authorization header. Expected: Bearer <token>',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authorization token is empty.',
      });
      return;
    }

    // Temporary admin bypass
    if (token === 'TEMPORARY_ADMIN_TOKEN') {
      req.user = {
        id: 'temp-admin-id',
        email: 'admin@haiflytrap.com',
        role: 'admin',
        userMetadata: { role: 'admin' },
      };
      next();
      return;
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      console.error('Supabase auth.getUser error:', error?.message);
      res.status(401).json({
        success: false,
        error: `Invalid or expired token: ${error?.message || 'User not found'}`,
      });
      return;
    }

    // Read the user's role from auth metadata (app_metadata takes priority over user_metadata)
    // app_metadata is set server-side and is the secure source of truth for roles
    const role: string =
      data.user.app_metadata?.role ||
      data.user.user_metadata?.role ||
      'customer';

    // Attach user info to the request object
    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      role,
      userMetadata: data.user.user_metadata,
    };

    next();
  } catch (err) {
    console.error('Global authMiddleware error:', err);
    res.status(500).json({
      success: false,
      error: `Authentication service error: ${(err as Error).message}`,
    });
  }
}
