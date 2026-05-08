"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = require("../controllers/notifications.controller");
const router = (0, express_1.Router)();
router.post('/subscribe', notifications_controller_1.subscribeToNotifications);
// Note: This route should ideally be protected by admin middleware
router.post('/broadcast', notifications_controller_1.broadcastNotification);
exports.default = router;
//# sourceMappingURL=notifications.routes.js.map