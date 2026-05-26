import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus
} from '../controllers/orders.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all order endpoints - authentication required!
router.use(authenticateJWT);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;
