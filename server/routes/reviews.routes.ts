import { Router } from 'express';
import {
  getReviews,
  getReviewById,
  getReviewsForService,
  getReviewsForProfessional,
  createReview,
  deleteReview
} from '../controllers/reviews.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Publicly viewable reviews
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.get('/service/:serviceId', getReviewsForService);
router.get('/professional/:professionalId', getReviewsForProfessional);

// Protected reviews endpoints
router.post('/', authenticateJWT, createReview);
router.delete('/:id', authenticateJWT, deleteReview);

export default router;
