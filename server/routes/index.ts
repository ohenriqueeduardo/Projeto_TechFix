import { Router } from 'express';
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import professionalsRoutes from './professionals.routes.js';
import servicesRoutes from './services.routes.js';
import ordersRoutes from './orders.routes.js';
import reviewsRoutes from './reviews.routes.js';
import messagesRoutes from './messages.routes.js';
import transactionsRoutes from './transactions.routes.js';
import { paymentsRoutes } from './payments.routes.js';

export const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/users', usersRoutes);
apiRoutes.use('/professionals', professionalsRoutes);
apiRoutes.use('/services', servicesRoutes);
apiRoutes.use('/orders', ordersRoutes);
apiRoutes.use('/reviews', reviewsRoutes);
apiRoutes.use('/messages', messagesRoutes);
apiRoutes.use('/transactions', transactionsRoutes);
apiRoutes.use('/payments', paymentsRoutes);
