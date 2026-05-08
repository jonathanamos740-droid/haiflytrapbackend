"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marketers_controller_1 = require("../controllers/marketers.controller");
const auth_1 = require("../middleware/auth");
const adminGuard_1 = require("../middleware/adminGuard");
const router = (0, express_1.Router)();
// Public route for coupon validation
router.get('/validate/:code', marketers_controller_1.validateCoupon);
// Admin-only routes
router.get('/', auth_1.authMiddleware, adminGuard_1.adminGuard, marketers_controller_1.getMarketers);
router.post('/', auth_1.authMiddleware, adminGuard_1.adminGuard, marketers_controller_1.createMarketer);
router.patch('/:id', auth_1.authMiddleware, adminGuard_1.adminGuard, marketers_controller_1.updateMarketer);
router.delete('/:id', auth_1.authMiddleware, adminGuard_1.adminGuard, marketers_controller_1.deleteMarketer);
exports.default = router;
//# sourceMappingURL=marketers.routes.js.map