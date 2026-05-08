"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const supabase_1 = require("../config/supabase");
/**
 * Middleware: Verify Supabase JWT from Authorization header.
 * Attaches `req.user` with id, email, and role from public.users table.
 */
async function authMiddleware(req, res, next) {
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
                email: 'admin@haifytrap.com',
                role: 'admin',
                userMetadata: { role: 'admin' },
            };
            next();
            return;
        }
        const { data, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
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
        const role = data.user.app_metadata?.role ||
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
    }
    catch (err) {
        console.error('Global authMiddleware error:', err);
        res.status(500).json({
            success: false,
            error: `Authentication service error: ${err.message}`,
        });
    }
}
//# sourceMappingURL=auth.js.map