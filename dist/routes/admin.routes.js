"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const adminGuard_1 = require("../middleware/adminGuard");
const uploadImage_1 = require("../middleware/uploadImage");
const router = (0, express_1.Router)();
// Apply auth + admin guard to all routes in this file
router.use(auth_1.authMiddleware, adminGuard_1.adminGuard);
// Requires a multipart form field named "image"
router.post('/upload', uploadImage_1.upload.single('image'), admin_controller_1.uploadImage);
router.post('/upload/delete', admin_controller_1.deleteImage); // Body: { publicId: string }
router.get('/stats', admin_controller_1.getDashboardStats);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map