"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/me', auth_1.authMiddleware, auth_controller_1.getMe);
router.post('/sync', auth_1.authMiddleware, auth_controller_1.syncUser);
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.delete('/me', auth_1.authMiddleware, auth_controller_1.deleteAccount);
// Admin specific routes
router.post('/admin-login', auth_controller_1.adminLogin);
router.post('/admin-register', auth_controller_1.adminRegister);
// Handler specific routes
router.post('/handler-login', auth_controller_1.handlerLogin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map