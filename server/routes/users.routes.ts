import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users.controller.js';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// All user routes require a valid JWT session
router.use(authenticateJWT);

// Admin-only actions
router.get('/', requireRole(['admin']), getUsers);
router.post('/', requireRole(['admin']), createUser);

// User-specific or admin actions
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
