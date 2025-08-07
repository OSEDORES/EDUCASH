import { Router } from 'express';
import {
  getIngresos,
  getGastos,
  createIngreso,
  createGasto,
  updateIngreso,
  deleteIngreso,
  updateGasto,
  deleteGasto
} from '../controllers/transacciones.controller.js';

const router = Router();

// Rutas de Ingresos
router.get('/ingresos/:idUsuario', getIngresos);
router.post('/ingresos', createIngreso);
router.put('/ingresos/:idIngreso', updateIngreso);
router.delete('/ingresos/:idIngreso', deleteIngreso);

// Rutas para Gastos
router.get('/gastos/:idUsuario', getGastos);
router.post('/gastos', createGasto);
router.put('/gastos/:idGasto', updateGasto);
router.delete('/gastos/:idGasto', deleteGasto);

export default router;