import { Router } from 'express';
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blogs.controller';
import { authMiddleware } from '../middleware/auth';
import { adminGuard } from '../middleware/adminGuard';

const router = Router();

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin only routes
router.post('/', authMiddleware, adminGuard, createBlog);
router.put('/:id', authMiddleware, adminGuard, updateBlog);
router.delete('/:id', authMiddleware, adminGuard, deleteBlog);

export default router;
