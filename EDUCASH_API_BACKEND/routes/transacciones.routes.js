import { Router } from 'express';
import {
  getIngresos,
  getGastos,
  createIngreso,
  createGasto,
  updateIngreso,
  deleteIngreso,
  updateGasto,
  deleteGasto,
  getIngresoDetalle,
  getGastoDetalle
} from '../controllers/transacciones.controller.js';

const router = Router();

// Rutas de Ingresos
router.get('/ingresos/:idUsuario', getIngresos);
router.post('/ingresos', createIngreso);
router.put('/ingresos/:idIngreso', updateIngreso);
router.delete('/ingresos/:idIngreso', deleteIngreso);
router.get('/ingresos/detalle/:id', getIngresoDetalle);

// Rutas para Gastos
router.get('/gastos/:idUsuario', getGastos);
router.post('/gastos', createGasto);
router.put('/gastos/:idGasto', updateGasto);
router.delete('/gastos/:idGasto', deleteGasto);
router.get('/gastos/detalle/:id', getGastoDetalle);

export default router;
