import { Router } from 'express';
import { createPreference, processTransparentPayment } from '../controllers/payments.controller.js';

const router = Router();

router.post('/create-intent', createPreference);
router.post('/process-transparent', processTransparentPayment);

export const paymentsRoutes = router;
