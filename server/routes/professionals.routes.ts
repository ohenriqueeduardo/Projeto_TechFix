import { Router } from 'express';
import {
  getProfessionals,
  getProfessionalById,
  registerProfessional,
  updateProfessional,
  deleteProfessional,
  addPortfolioItem,
  deletePortfolioItem
} from '../controllers/professionals.controller.js';

const router = Router();

router.get('/', getProfessionals);
router.get('/:id', getProfessionalById);
router.post('/', registerProfessional);
router.put('/:id', updateProfessional);
router.delete('/:id', deleteProfessional);
router.post('/:id/portfolio', addPortfolioItem);
router.delete('/:id/portfolio/:portfolioId', deletePortfolioItem);

export default router;
