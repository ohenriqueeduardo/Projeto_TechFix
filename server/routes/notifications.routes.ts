import { Router } from 'express';
import {
  getUserNotifications,
  createNotification,
  markAsRead,
  deleteNotification
} from '../controllers/notifications.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Protected endpoints
router.get('/:userId', authenticateJWT, getUserNotifications);
router.post('/', authenticateJWT, createNotification);
router.put('/:id/read', authenticateJWT, markAsRead);
router.delete('/:id', authenticateJWT, deleteNotification);

export default router;
