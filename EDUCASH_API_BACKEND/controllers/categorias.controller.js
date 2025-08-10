import { getConnection } from '../database/connection.js';

// Categorías de Gastos
export const getCategoriasGastos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GET_CategoriasGastos');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategoriaGasto = async (req, res) => {
  try {
    const { Nombre, Descripcion } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input('Nombre', Nombre)
      .input('Descripcion', Descripcion)
      .execute('POST_CategoriaGasto');
    res.status(201).json({ message: 'Categoría de gasto creada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategoriaGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input('IdCategoriaGasto', id)
      .input('Nombre', Nombre)
      .input('Descripcion', Descripcion)
      .execute('PUT_CategoriaGasto');
    res.json({ message: 'Categoría de gasto actualizada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategoriaGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    await pool.request()
      .input('IdCategoriaGasto', id)
      .execute('DELETE_CategoriaGasto');
    res.json({ message: 'Categoría de gasto eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Categorías de Ingresos
export const getCategoriasIngresos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GET_CategoriasIngresos');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategoriaIngreso = async (req, res) => {
  try {
    const { Nombre, Descripcion } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input('Nombre', Nombre)
      .input('Descripcion', Descripcion)
      .execute('POST_CategoriaIngreso');
    res.status(201).json({ message: 'Categoría de ingreso creada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategoriaIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input('IdCategoriaIngreso', id)
      .input('Nombre', Nombre)
      .input('Descripcion', Descripcion)
      .execute('PUT_CategoriaIngreso');
    res.json({ message: 'Categoría de ingreso actualizada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategoriaIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    await pool.request()
      .input('IdCategoriaIngreso', id)
      .execute('DELETE_CategoriaIngreso');
    res.json({ message: 'Categoría de ingreso eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
