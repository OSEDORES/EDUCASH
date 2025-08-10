import { Router } from 'express';
import { 
  getPresupuestos, 
  createPresupuesto, 
  updatePresupuesto, 
  deletePresupuesto 
} from '../controllers/presupuestos.controller.js';

const router = Router();

router.get('/:idUsuario', getPresupuestos);
router.post('/', createPresupuesto);
router.put('/:idPresupuesto', updatePresupuesto);
router.delete('/:idPresupuesto', deletePresupuesto);

export default router;