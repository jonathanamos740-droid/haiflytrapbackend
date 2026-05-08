import { Router } from 'express';
import { uploadImage, deleteImage, getDashboardStats } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth';
import { adminGuard } from '../middleware/adminGuard';
import { upload } from '../middleware/uploadImage';

const router = Router();

// Apply auth + admin guard to all routes in this file
router.use(authMiddleware, adminGuard);

// Requires a multipart form field named "image"
router.post('/upload', upload.single('image'), uploadImage);
router.post('/upload/delete', deleteImage); // Body: { publicId: string }
router.get('/stats', getDashboardStats);

export default router;
