import { Router } from 'express';
import { createPaymentIntent } from '../controllers/payments.controller.js';

const router = Router();

router.post('/create-intent', createPaymentIntent);

export const paymentsRoutes = router;
