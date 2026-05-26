import { Router } from 'express';
import {
  getTransactions,
  getTransactionsForProfessional,
  createTransaction
} from '../controllers/transactions.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all transactions endpoints
router.use(authenticateJWT);

router.get('/', getTransactions);
router.get('/:professionalId', getTransactionsForProfessional);
router.get('/professional/:professionalId', getTransactionsForProfessional);
router.post('/', createTransaction);

export default router;
