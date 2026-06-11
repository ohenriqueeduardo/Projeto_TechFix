import { Router } from 'express';
import { createPreference } from '../controllers/payments.controller.js';

const router = Router();

router.post('/create-intent', createPreference);

export const paymentsRoutes = router;
