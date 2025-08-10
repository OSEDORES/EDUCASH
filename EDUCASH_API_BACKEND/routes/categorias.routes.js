import { Router } from 'express';
import {
  getCategoriasGastos,
  createCategoriaGasto,
  updateCategoriaGasto,
  deleteCategoriaGasto,
  getCategoriasIngresos,
  createCategoriaIngreso,
  updateCategoriaIngreso,
  deleteCategoriaIngreso
} from '../controllers/categorias.controller.js';

const router = Router();

// Rutas de Categorías de Gastos
router.get('/categorias/gastos', getCategoriasGastos);
router.post('/categorias/gastos', createCategoriaGasto);
router.put('/categorias/gastos/:id', updateCategoriaGasto);
router.delete('/categorias/gastos/:id', deleteCategoriaGasto);

// Rutas de Categorías de Ingresos
router.get('/categorias/ingresos', getCategoriasIngresos);
router.post('/categorias/ingresos', createCategoriaIngreso);
router.put('/categorias/ingresos/:id', updateCategoriaIngreso);
router.delete('/categorias/ingresos/:id', deleteCategoriaIngreso);

export default router;
