"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handlers_controller_1 = require("../controllers/handlers.controller");
const auth_1 = require("../middleware/auth");
const adminGuard_1 = require("../middleware/adminGuard");
const router = (0, express_1.Router)();
// Handlers viewing their own orders (assuming role check allows handlers)
router.get('/:id/orders', auth_1.authMiddleware, handlers_controller_1.getHandlerOrders);
// Admin-only routes
router.get('/', auth_1.authMiddleware, adminGuard_1.adminGuard, handlers_controller_1.getHandlers);
router.post('/', auth_1.authMiddleware, adminGuard_1.adminGuard, handlers_controller_1.createHandler);
router.patch('/:id', auth_1.authMiddleware, adminGuard_1.adminGuard, handlers_controller_1.updateHandler);
router.delete('/:id', auth_1.authMiddleware, adminGuard_1.adminGuard, handlers_controller_1.deleteHandler);
exports.default = router;
//# sourceMappingURL=handlers.routes.js.map