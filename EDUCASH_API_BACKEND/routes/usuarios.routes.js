import { Router } from 'express';
import { 
  getUsuarios,
  getUsuarioById,
  registerUsuario,
  authenticateUsuario,
  updateUsuario,
  deleteUsuario
} from '../controllers/usuarios.controller.js';

const router = Router();

// Rutas públicas
router.post('/', registerUsuario);
router.post('/auth', authenticateUsuario);

// Rutas que requieren autenticación
router.get('/', getUsuarios);
router.get('/:idUsuario', getUsuarioById);
router.put('/:idUsuario', updateUsuario);
router.delete('/:idUsuario', deleteUsuario);

export default router;