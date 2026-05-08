"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogs_controller_1 = require("../controllers/blogs.controller");
const auth_1 = require("../middleware/auth");
const adminGuard_1 = require("../middleware/adminGuard");
const router = (0, express_1.Router)();
// Public routes
router.get('/', blogs_controller_1.getBlogs);
router.get('/:id', blogs_controller_1.getBlogById);
// Admin only routes
router.post('/', auth_1.authMiddleware, adminGuard_1.adminGuard, blogs_controller_1.createBlog);
router.put('/:id', auth_1.authMiddleware, adminGuard_1.adminGuard, blogs_controller_1.updateBlog);
router.delete('/:id', auth_1.authMiddleware, adminGuard_1.adminGuard, blogs_controller_1.deleteBlog);
exports.default = router;
//# sourceMappingURL=blogs.routes.js.map