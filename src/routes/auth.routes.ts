import { Router } from 'express';
import { register, login, logout, adminLogin, adminRegister, handlerLogin, deleteAccount, getMe, syncUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.post('/sync', authMiddleware, syncUser);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/me', authMiddleware, deleteAccount);

// Admin specific routes
router.post('/admin-login', adminLogin);
router.post('/admin-register', adminRegister);

// Handler specific routes
router.post('/handler-login', handlerLogin);

export default router;
