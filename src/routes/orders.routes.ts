import { Router } from 'express';
import {
  createOrder,
  trackOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderLogistics,
  getMyOrders,
  cleanupStaleOrders,
} from '../controllers/orders.controller';
import { authMiddleware } from '../middleware/auth';
import { adminGuard } from '../middleware/adminGuard';

const router = Router();

// Public routes (no auth)
router.get('/track/:trackingNumber', trackOrder);

// Protected routes — must be logged in
router.post('/', authMiddleware, createOrder);  // Order creation requires auth
router.get('/my-orders', authMiddleware, getMyOrders);

// Protected routes (Admin / Handler)
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.patch('/:id/logistics', authMiddleware, updateOrderLogistics);

// Admin-only cleanup endpoint
router.delete('/cleanup/stale', authMiddleware, adminGuard, cleanupStaleOrders);

export default router;

