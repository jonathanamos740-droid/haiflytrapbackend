import { Router } from 'express';
import {
  getHandlers,
  createHandler,
  updateHandler,
  deleteHandler,
  getHandlerOrders,
} from '../controllers/handlers.controller';
import { authMiddleware } from '../middleware/auth';
import { adminGuard } from '../middleware/adminGuard';

const router = Router();

// Handlers viewing their own orders (assuming role check allows handlers)
router.get('/:id/orders', authMiddleware, getHandlerOrders);

// Admin-only routes
router.get('/', authMiddleware, adminGuard, getHandlers);
router.post('/', authMiddleware, adminGuard, createHandler);
router.patch('/:id', authMiddleware, adminGuard, updateHandler);
router.delete('/:id', authMiddleware, adminGuard, deleteHandler);

export default router;
