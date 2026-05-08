"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controller_1 = require("../controllers/orders.controller");
const auth_1 = require("../middleware/auth");
const adminGuard_1 = require("../middleware/adminGuard");
const router = (0, express_1.Router)();
// Public routes (no auth)
router.get('/track/:trackingNumber', orders_controller_1.trackOrder);
// Protected routes — must be logged in
router.post('/', auth_1.authMiddleware, orders_controller_1.createOrder); // Order creation requires auth
router.get('/my-orders', auth_1.authMiddleware, orders_controller_1.getMyOrders);
// Protected routes (Admin / Handler)
router.get('/', auth_1.authMiddleware, orders_controller_1.getOrders);
router.get('/:id', auth_1.authMiddleware, orders_controller_1.getOrderById);
router.patch('/:id/status', auth_1.authMiddleware, orders_controller_1.updateOrderStatus);
router.patch('/:id/logistics', auth_1.authMiddleware, orders_controller_1.updateOrderLogistics);
// Admin-only cleanup endpoint
router.delete('/cleanup/stale', auth_1.authMiddleware, adminGuard_1.adminGuard, orders_controller_1.cleanupStaleOrders);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map