import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller';
import { authMiddleware } from '../middleware/auth';
import { adminGuard } from '../middleware/adminGuard';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', authMiddleware, adminGuard, createProduct);
router.patch('/:id', authMiddleware, adminGuard, updateProduct);
router.delete('/:id', authMiddleware, adminGuard, deleteProduct);

export default router;
