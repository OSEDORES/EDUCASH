import { Router } from 'express';
import {
  getRecordatorios,
  getRecordatorioById,
  createRecordatorio,
  updateRecordatorio,
  deleteRecordatorio
} from '../controllers/recordatorios.controller.js';

const router = Router();

// Rutas de Recordatorios
router.get('/recordatorios', getRecordatorios);
router.get('/recordatorios/:id', getRecordatorioById);
router.post('/recordatorios', createRecordatorio);
router.put('/recordatorios/:id', updateRecordatorio);
router.delete('/recordatorios/:id', deleteRecordatorio);

export default router;
