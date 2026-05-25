import { Router } from 'express';
import {
  getMessages,
  getChatHistory,
  getContacts,
  sendMessage
} from '../controllers/messages.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all chat messaging endpoints
router.use(authenticateJWT);

router.get('/', getMessages);
router.get('/contacts/:userId', getContacts);
router.get('/:userId/:contactId', getChatHistory);
router.post('/', sendMessage);

export default router;
