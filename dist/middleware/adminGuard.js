"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGuard = adminGuard;
/**
 * Middleware: Ensure the authenticated user has an admin role.
 * Must be used AFTER authMiddleware.
 */
function adminGuard(req, res, next) {
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
//# sourceMappingURL=adminGuard.js.map