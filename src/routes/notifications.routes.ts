import { Router } from 'express';
import { subscribeToNotifications, broadcastNotification } from '../controllers/notifications.controller';

const router = Router();

router.post('/subscribe', subscribeToNotifications);

// Note: This route should ideally be protected by admin middleware
router.post('/broadcast', broadcastNotification);

export default router;
