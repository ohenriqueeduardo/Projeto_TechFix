import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  confirmPayment,
  negotiateOrder,
  acceptOffer,
  rejectOffer
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
router.post('/:id/confirm-payment', confirmPayment);
router.post('/:id/negotiate', negotiateOrder);
router.post('/:id/accept-offer', acceptOffer);
router.post('/:id/reject-offer', rejectOffer);

export default router;
