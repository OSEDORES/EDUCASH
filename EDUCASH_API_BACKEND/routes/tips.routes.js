import { Router } from 'express';
import { getTips, getTipById } from '../controllers/tips.controller.js';

const router = Router();

router.get('/', getTips);        
router.get('/:idTip', getTipById); 

export default router;