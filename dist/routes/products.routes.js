"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("../controllers/products.controller");
const auth_1 = require("../middleware/auth");
const adminGuard_1 = require("../middleware/adminGuard");
const router = (0, express_1.Router)();
// Public routes
router.get('/', products_controller_1.getProducts);
router.get('/:id', products_controller_1.getProductById);
// Admin-only routes
router.post('/', auth_1.authMiddleware, adminGuard_1.adminGuard, products_controller_1.createProduct);
router.patch('/:id', auth_1.authMiddleware, adminGuard_1.adminGuard, products_controller_1.updateProduct);
router.delete('/:id', auth_1.authMiddleware, adminGuard_1.adminGuard, products_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.routes.js.map