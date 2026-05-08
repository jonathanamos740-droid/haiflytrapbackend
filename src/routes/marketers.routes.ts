import { Router } from 'express';
import {
  getMarketers,
  createMarketer,
  updateMarketer,
  deleteMarketer,
  validateCoupon,
} from '../controllers/marketers.controller';
import { authMiddleware } from '../middleware/auth';
import { adminGuard } from '../middleware/adminGuard';

const router = Router();

// Public route for coupon validation
router.get('/validate/:code', validateCoupon);

// Admin-only routes
router.get('/', authMiddleware, adminGuard, getMarketers);
router.post('/', authMiddleware, adminGuard, createMarketer);
router.patch('/:id', authMiddleware, adminGuard, updateMarketer);
router.delete('/:id', authMiddleware, adminGuard, deleteMarketer);

export default router;
