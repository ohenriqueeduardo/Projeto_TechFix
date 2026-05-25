import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/services.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Public endpoints (clients can browse and search)
router.get('/', getServices);
router.get('/:id', getServiceById);

// Protected endpoints (must be authenticated to create, update or delete services)
router.post('/', authenticateJWT, createService);
router.put('/:id', authenticateJWT, updateService);
router.delete('/:id', authenticateJWT, deleteService);

export default router;
