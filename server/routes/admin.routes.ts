import { Router } from 'express';
import { 
  getDashboardMetrics, 
  getAllUsers, 
  verifyProfessional, 
  rejectProfessional, 
  deleteUser, 
  getWithdrawals, 
  approveWithdrawal 
} from '../controllers/admin.controller.js';

export const adminRoutes = Router();

adminRoutes.get('/dashboard', getDashboardMetrics);
adminRoutes.get('/users', getAllUsers);
adminRoutes.post('/users/:id/verify', verifyProfessional);
adminRoutes.post('/users/:id/reject', rejectProfessional);
adminRoutes.delete('/users/:id', deleteUser);
adminRoutes.get('/withdrawals', getWithdrawals);
adminRoutes.post('/withdrawals/:id/approve', approveWithdrawal);

export default adminRoutes;
